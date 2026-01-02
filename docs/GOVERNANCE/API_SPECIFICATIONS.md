# API SPECIFICATIONS

**Status:** TECHNICAL REFERENCE  
**Version:** 1.0  
**Last Updated:** January 2, 2026  
**Scope:** Inter-Process Communication (Main App ↔ Extensions)

---

## OVERVIEW

Exit uses iOS App Extensions to implement the Somatic Shield. These extensions run in sandboxed environments and communicate with the main app via **App Groups** (shared UserDefaults/File System).

**Key Constraint:** Extensions CANNOT directly call main app code. All communication is asynchronous via shared storage.

---

## SECTION 1: APP GROUP CONFIGURATION

### 1.1 App Group Identifier
```
group.com.exit.app
```

**Entitlements Required:**
- Main App Target
- DeviceActivityMonitor Extension
- ShieldConfiguration Extension
- ShieldAction Extension

### 1.2 Shared Storage Access
```swift
// Swift - Accessing shared storage
let appGroup = "group.com.exit.app"
let defaults = UserDefaults(suiteName: appGroup)

// Write
defaults?.set(value, forKey: "key_name")
defaults?.synchronize()

// Read
let value = defaults?.integer(forKey: "key_name")
```
```typescript
// React Native (Main App) - Via native module bridge
import { NativeModules } from 'react-native';
const { AppGroupStorage } = NativeModules;

// Write
await AppGroupStorage.setInt('key_name', 42);

// Read
const value = await AppGroupStorage.getInt('key_name');
```

---

## SECTION 2: DATA CONTRACT (SHARED KEYS)

### 2.1 Key Registry

All shared keys must be documented here to prevent collisions.

| Key | Type | Read By | Written By | Description |
|-----|------|---------|------------|-------------|
| `clarity_score` | Int (0-100) | Main App, ShieldConfig | Main App | Current clarity percentage |
| `screen_time_today` | Int (minutes) | Main App | Main App | Today's total screen time |
| `monitored_apps` | String (JSON array) | Main App, ShieldConfig | Main App | List of bundle IDs to monitor |
| `unlock_timestamp` | Double (Unix) | ShieldConfig | Main App | When intervention was completed |
| `intervention_requested` | Bool | Main App | ShieldAction | Shield button tapped, main app should open |
| `blocked_app` | String | Main App | ShieldAction | Which app triggered the shield |
| `last_intervention_count` | Int | Main App | Main App | Today's completed interventions |
| `user_level` | String | Main App, ShieldConfig | Main App | Current level (npc/glitch/hacker/main_character/oracle) |
| `daily_reset_flag` | Bool | Main App | Main App | Signals midnight rollover occurred |

### 2.2 Data Types Supported

**UserDefaults (App Group) supports:**
- `Int`
- `Double`
- `String`
- `Bool`
- `Data` (for complex objects, serialize to JSON)

**NOT supported:**
- Custom Swift/Objective-C objects
- Direct function calls
- Callbacks

---

## SECTION 3: COMMUNICATION PATTERNS

### 3.1 Main App → Shield Extension

**Use Case:** Update clarity score so shield can display it
```swift
// Main App (after calculating new clarity)
let appGroup = UserDefaults(suiteName: "group.com.exit.app")
appGroup?.set(clarityScore, forKey: "clarity_score")
appGroup?.synchronize()

// Shield Extension (reads on next trigger)
override func configuration(shielding application: Application) -> ShieldConfiguration {
    let appGroup = UserDefaults(suiteName: "group.com.exit.app")
    let clarity = appGroup?.integer(forKey: "clarity_score") ?? 100
    
    // Use clarity to determine shield appearance
}
```

### 3.2 Shield Extension → Main App

**Use Case:** User tapped "Begin Breathing" button, main app should open
```swift
// ShieldAction Extension (button handler)
override func handle(action: ShieldAction, 
                     for application: ApplicationToken, 
                     completionHandler: @escaping (ShieldActionResponse) -> Void) {
    
    let appGroup = UserDefaults(suiteName: "group.com.exit.app")
    appGroup?.set(true, forKey: "intervention_requested")
    appGroup?.set(application.bundleIdentifier, forKey: "blocked_app")
    appGroup?.synchronize()
    
    completionHandler(.none)
}
```
```typescript
// Main App (React Native) - Polling loop
useEffect(() => {
  const pollInterval = setInterval(async () => {
    const requested = await AppGroupStorage.getBool('intervention_requested');
    
    if (requested) {
      const blockedApp = await AppGroupStorage.getString('blocked_app');
      
      // Clear flag
      await AppGroupStorage.setBool('intervention_requested', false);
      
      // Navigate to intervention screen
      router.push(`/intervention?app=${blockedApp}`);
    }
  }, 1000); // Poll every second
  
  return () => clearInterval(pollInterval);
}, []);
```

### 3.3 Main App → Shield Extension (Unlock)

**Use Case:** User completed breathing, allow 60s access
```swift
// Main App (after breathing complete)
let appGroup = UserDefaults(suiteName: "group.com.exit.app")
let now = Date().timeIntervalSince1970
appGroup?.set(now, forKey: "unlock_timestamp")
appGroup?.synchronize()

// Shield Extension (checks timestamp)
override func configuration(shielding application: Application) -> ShieldConfiguration {
    let appGroup = UserDefaults(suiteName: "group.com.exit.app")
    let unlockTime = appGroup?.double(forKey: "unlock_timestamp") ?? 0
    let now = Date().timeIntervalSince1970
    
    if now - unlockTime < 60 {
        let remaining = Int(60 - (now - unlockTime))
        
        return ShieldConfiguration(
            title: ShieldConfiguration.Label(text: "Access Granted"),
            subtitle: ShieldConfiguration.Label(text: "\(remaining)s remaining")
        )
    }
    
    // Return locked configuration
    return lockedConfiguration()
}
```

---

## SECTION 4: NATIVE MODULE BRIDGE (REACT NATIVE)

### 4.1 Native Module Interface
```swift
// ios/AppGroupStorage.swift
import Foundation
import React

@objc(AppGroupStorage)
class AppGroupStorage: NSObject {
    
    private let appGroup = "group.com.exit.app"
    private var defaults: UserDefaults? {
        return UserDefaults(suiteName: appGroup)
    }
    
    @objc
    func setInt(_ key: String, value: NSNumber) {
        defaults?.set(value.intValue, forKey: key)
        defaults?.synchronize()
    }
    
    @objc
    func getInt(_ key: String, 
                resolver: @escaping RCTPromiseResolveBlock,
                rejecter: @escaping RCTPromiseRejectBlock) {
        let value = defaults?.integer(forKey: key) ?? 0
        resolver(NSNumber(value: value))
    }
    
    @objc
    func setBool(_ key: String, value: Bool) {
        defaults?.set(value, forKey: key)
        defaults?.synchronize()
    }
    
    @objc
    func getBool(_ key: String,
                 resolver: @escaping RCTPromiseResolveBlock,
                 rejecter: @escaping RCTPromiseRejectBlock) {
        let value = defaults?.bool(forKey: key)
        resolver(value)
    }
    
    @objc
    func setString(_ key: String, value: String) {
        defaults?.set(value, forKey: key)
        defaults?.synchronize()
    }
    
    @objc
    func getString(_ key: String,
                   resolver: @escaping RCTPromiseResolveBlock,
                   rejecter: @escaping RCTPromiseRejectBlock) {
        let value = defaults?.string(forKey: key) ?? ""
        resolver(value)
    }
    
    @objc
    static func requiresMainQueueSetup() -> Bool {
        return false
    }
}
```
```objc
// ios/AppGroupStorage.m
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(AppGroupStorage, NSObject)

RCT_EXTERN_METHOD(setInt:(NSString *)key value:(nonnull NSNumber *)value)
RCT_EXTERN_METHOD(getInt:(NSString *)key 
                  resolver:(RCTPromiseResolveBlock)resolve 
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setBool:(NSString *)key value:(BOOL)value)
RCT_EXTERN_METHOD(getBool:(NSString *)key
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(setString:(NSString *)key value:(NSString *)value)
RCT_EXTERN_METHOD(getString:(NSString *)key
                   resolver:(RCTPromiseResolveBlock)resolve
                   rejecter:(RCTPromiseRejectBlock)reject)

@end
```

### 4.2 TypeScript Wrapper
```typescript
// src/utils/AppGroupStorage.ts
import { NativeModules } from 'react-native';

interface AppGroupStorageModule {
  setInt(key: string, value: number): void;
  getInt(key: string): Promise<number>;
  setBool(key: string, value: boolean): void;
  getBool(key: string): Promise<boolean>;
  setString(key: string, value: string): void;
  getString(key: string): Promise<string>;
}

const { AppGroupStorage } = NativeModules as { AppGroupStorage: AppGroupStorageModule };

export class SharedStorage {
  static async setClarity(score: number): Promise<void> {
    AppGroupStorage.setInt('clarity_score', score);
  }
  
  static async getClarity(): Promise<number> {
    return await AppGroupStorage.getInt('clarity_score');
  }
  
  static async setUnlockTimestamp(timestamp: number): Promise<void> {
    AppGroupStorage.setInt('unlock_timestamp', Math.floor(timestamp / 1000));
  }
  
  static async getUnlockTimestamp(): Promise<number> {
    const unix = await AppGroupStorage.getInt('unlock_timestamp');
    return unix * 1000; // Convert to JS timestamp
  }
  
  static async isInterventionRequested(): Promise<boolean> {
    return await AppGroupStorage.getBool('intervention_requested');
  }
  
  static async clearInterventionRequest(): Promise<void> {
    AppGroupStorage.setBool('intervention_requested', false);
  }
  
  static async getBlockedApp(): Promise<string> {
    return await AppGroupStorage.getString('blocked_app');
  }
  
  static async setMonitoredApps(bundleIds: string[]): Promise<void> {
    const json = JSON.stringify(bundleIds);
    AppGroupStorage.setString('monitored_apps', json);
  }
  
  static async getMonitoredApps(): Promise<string[]> {
    const json = await AppGroupStorage.getString('monitored_apps');
    if (!json) return [];
    return JSON.parse(json);
  }
}
```

---

## SECTION 5: SCREEN TIME API INTEGRATION

### 5.1 FamilyControls Authorization
```swift
// ios/ScreenTimeManager.swift
import FamilyControls
import ManagedSettings
import DeviceActivity

@objc(ScreenTimeManager)
class ScreenTimeManager: NSObject {
    
    @objc
    func requestAuthorization(_ resolve: @escaping RCTPromiseResolveBlock,
                             rejecter reject: @escaping RCTPromiseRejectBlock) {
        Task {
            do {
                try await AuthorizationCenter.shared.requestAuthorization(for: .individual)
                resolve(true)
            } catch {
                reject("AUTH_ERROR", error.localizedDescription, error)
            }
        }
    }
    
    @objc
    func isAuthorized(_ resolve: @escaping RCTPromiseResolveBlock,
                     rejecter reject: @escaping RCTPromiseRejectBlock) {
        let status = AuthorizationCenter.shared.authorizationStatus
        resolve(status == .approved)
    }
}
```

### 5.2 App Selection Interface
```swift
// ios/AppSelectionManager.swift
import FamilyControls
import SwiftUI

@objc(AppSelectionManager)
class AppSelectionManager: NSObject {
    
    private var presentingController: UIViewController?
    
    @objc
    func presentAppSelection(_ resolve: @escaping RCTPromiseResolveBlock,
                            rejecter reject: @escaping RCTPromiseRejectBlock) {
        
        DispatchQueue.main.async {
            let selectionView = AppSelectionView { selectedApps in
                // Save selected apps to App Group
                self.saveSelectedApps(selectedApps)
                resolve(true)
            }
            
            let hostingController = UIHostingController(rootView: selectionView)
            
            if let rootVC = UIApplication.shared.windows.first?.rootViewController {
                rootVC.present(hostingController, animated: true)
            }
        }
    }
    
    private func saveSelectedApps(_ tokens: Set<ApplicationToken>) {
        let bundleIds = tokens.compactMap { $0.bundleIdentifier }
        let json = try? JSONEncoder().encode(bundleIds)
        
        let appGroup = UserDefaults(suiteName: "group.com.exit.app")
        appGroup?.set(json, forKey: "monitored_apps")
        appGroup?.synchronize()
    }
}

struct AppSelectionView: View {
    @State private var selection = FamilyActivitySelection()
    let onComplete: (Set<ApplicationToken>) -> Void
    
    var body: some View {
        VStack {
            Text("Select Apps to Monitor")
                .font(.title)
            
            FamilyActivityPicker(selection: $selection)
            
            Button("Done") {
                if let apps = selection.applicationTokens {
                    onComplete(apps)
                }
            }
            .padding()
        }
    }
}
```

### 5.3 DeviceActivityMonitor Implementation
```swift
// DeviceActivityMonitorExtension/ExitMonitor.swift
import DeviceActivity
import ManagedSettings

class ExitDeviceActivityMonitor: DeviceActivityMonitor {
    
    let appGroup = "group.com.exit.app"
    
    override func intervalDidStart(for activity: DeviceActivityName) {
        super.intervalDidStart(for: activity)
        
        // Log activity start (optional)
        let defaults = UserDefaults(suiteName: appGroup)
        let now = Date().timeIntervalSince1970
        defaults?.set(now, forKey: "last_activity_start")
        defaults?.synchronize()
    }
    
    override func intervalDidEnd(for activity: DeviceActivityName) {
        super.intervalDidEnd(for: activity)
        
        // Calculate screen time for this interval
        let defaults = UserDefaults(suiteName: appGroup)
        let start = defaults?.double(forKey: "last_activity_start") ?? 0
        let now = Date().timeIntervalSince1970
        let duration = Int((now - start) / 60) // Convert to minutes
        
        // Add to daily total
        let currentTotal = defaults?.integer(forKey: "screen_time_today") ?? 0
        defaults?.set(currentTotal + duration, forKey: "screen_time_today")
        defaults?.synchronize()
    }
    
    override func eventDidReachThreshold(_ event: DeviceActivityEvent.Name,
                                        activity: DeviceActivityName) {
        super.eventDidReachThreshold(event, activity: activity)
        
        // Threshold reached (e.g., 30 min on TikTok)
        let defaults = UserDefaults(suiteName: appGroup)
        
        // Increment entropy
        let currentEntropy = defaults?.integer(forKey: "entropy_accumulated") ?? 0
        defaults?.set(currentEntropy + 15, forKey: "entropy_accumulated")
        
        // Trigger shield for next app open
        defaults?.set(true, forKey: "high_entropy_flag")
        defaults?.synchronize()
    }
}
```

---

## SECTION 6: ERROR HANDLING

### 6.1 Extension Crash Recovery

**Problem:** If extension crashes, main app won't be notified.

**Solution:** Heartbeat mechanism
```swift
// Extension (periodic)
let defaults = UserDefaults(suiteName: "group.com.exit.app")
defaults?.set(Date().timeIntervalSince1970, forKey: "extension_heartbeat")
defaults?.synchronize()

// Main App (check)
let lastHeartbeat = defaults?.double(forKey: "extension_heartbeat") ?? 0
let now = Date().timeIntervalSince1970

if now - lastHeartbeat > 300 { // 5 minutes
    // Extension may be crashed, reinitialize
    reinitializeExtensions()
}
```

### 6.2 Storage Synchronization Failures
```typescript
// Retry logic for critical writes
async function writeWithRetry(
  key: string,
  value: any,
  maxRetries: number = 3
): Promise<void> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await AppGroupStorage.setInt(key, value);
      return;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 100 * (i + 1)));
    }
  }
}
```

### 6.3 Race Conditions

**Problem:** Main app and extension write to same key simultaneously.

**Solution:** Timestamp-based precedence
```swift
// Write with timestamp
let data: [String: Any] = [
    "value": clarityScore,
    "timestamp": Date().timeIntervalSince1970
]
let json = try? JSONSerialization.data(withJSONObject: data)
defaults?.set(json, forKey: "clarity_score_stamped")

// Read with validation
if let json = defaults?.data(forKey: "clarity_score_stamped"),
   let data = try? JSONSerialization.jsonObject(with: json) as? [String: Any],
   let value = data["value"] as? Int,
   let timestamp = data["timestamp"] as? Double {
    
    // Check if data is fresh (< 1 hour old)
    let now = Date().timeIntervalSince1970
    if now - timestamp < 3600 {
        return value
    }
}
```

---

## SECTION 7: PERFORMANCE CONSIDERATIONS

### 7.1 Polling Frequency

**Main App polling for intervention requests:**
```typescript
// Aggressive polling when app is active
useEffect(() => {
  const interval = setInterval(checkForInterventions, 1000); // 1 second
  return () => clearInterval(interval);
}, []);

// Reduced polling when app is backgrounded
useEffect(() => {
  const subscription = AppState.addEventListener('change', (nextState) => {
    if (nextState === 'background') {
      // Increase polling interval to 5 seconds
      setPollingInterval(5000);
    } else if (nextState === 'active') {
      // Reset to 1 second
      setPollingInterval(1000);
    }
  });
  
  return () => subscription.remove();
}, []);
```

### 7.2 Batch Updates
```typescript
// Instead of multiple individual writes
await AppGroupStorage.setInt('clarity_score', 75);
await AppGroupStorage.setInt('screen_time_today', 120);
await AppGroupStorage.setBool('high_entropy_flag', true);

// Batch into single JSON write
const batchData = {
  clarity_score: 75,
  screen_time_today: 120,
  high_entropy_flag: true,
  timestamp: Date.now()
};

await AppGroupStorage.setString('batch_update', JSON.stringify(batchData));
```

### 7.3 Memory Limits

**App Group shared container is limited to ~100MB.**

**Best Practices:**
- Store only essential data in App Group
- Use local MMKV storage for historical data
- Prune old data regularly
```swift
// Check storage size
if let containerURL = FileManager.default.containerURL(
    forSecurityApplicationGroupIdentifier: "group.com.exit.app"
) {
    let size = try? FileManager.default.sizeOfDirectory(at: containerURL)
    if let size = size, size > 50_000_000 { // 50MB
        // Trigger cleanup
        cleanupOldData()
    }
}
```

---

## SECTION 8: TESTING STRATEGIES

### 8.1 Manual Testing Checklist

- [ ] Main app writes clarity score, shield extension reads it correctly
- [ ] Shield button tap sets flag, main app detects within 2 seconds
- [ ] Unlock timestamp grants 60-second access window
- [ ] Midnight rollover doesn't corrupt shared data
- [ ] Force quit main app during intervention doesn't break state
- [ ] Extension crash doesn't prevent main app from recovering

### 8.2 Debug Logging
```swift
// Enable in extensions during development
#if DEBUG
func logToAppGroup(_ message: String) {
    let defaults = UserDefaults(suiteName: "group.com.exit.app")
    var logs = defaults?.stringArray(forKey: "debug_logs") ?? []
    logs.append("[\(Date())] \(message)")
    
    // Keep only last 50 logs
    if logs.count > 50 {
        logs = Array(logs.suffix(50))
    }
    
    defaults?.set(logs, forKey: "debug_logs")
    defaults?.synchronize()
}
#endif

// Read from main app
let logs = await AppGroupStorage.getString('debug_logs');
console.log('Extension logs:', logs);
```

---

## APPENDIX A: COMPLETE KEY REFERENCE
```typescript
// TypeScript type definitions for all shared keys

interface SharedStorage {
  // Core State
  clarity_score: number;              // 0-100
  screen_time_today: number;          // Minutes
  entropy_accumulated: number;        // Points
  
  // App Configuration
  monitored_apps: string;             // JSON array of bundle IDs
  user_level: string;                 // 'npc' | 'glitch' | 'hacker' | 'main_character' | 'oracle'
  
  // Intervention Flow
  intervention_requested: boolean;    // Shield button tapped
  blocked_app: string;                // Bundle ID that triggered shield
  unlock_timestamp: number;           // Unix timestamp (seconds)
  
  // Daily Tracking
  last_intervention_count: number;    // Completed today
  conscious_day_flag: boolean;        // Today qualifies
  daily_reset_flag: boolean;          // Midnight occurred
  
  // System
  extension_heartbeat: number;        // Unix timestamp (seconds)
  debug_logs: string;                 // JSON array of log messages (DEBUG only)
}
```

---

## APPENDIX B: TROUBLESHOOTING

### Common Issues

**Issue:** Shield doesn't appear when app is opened  
**Fix:** Check `monitored_apps` key is properly set, verify FamilyControls authorization

**Issue:** Main app doesn't detect intervention request  
**Fix:** Verify polling loop is running, check `intervention_requested` flag is being set

**Issue:** Unlock window doesn't work  
**Fix:** Ensure `unlock_timestamp` is written in Unix seconds (not milliseconds)

**Issue:** Data doesn't persist after app restart  
**Fix:** Call `defaults?.synchronize()` after every write

---

**Document Status:** IMPLEMENTATION READY  
**Dependencies:** iOS 16.0+, FamilyControls framework  
**Next Review:** Post-MVP (Week 8)

---
