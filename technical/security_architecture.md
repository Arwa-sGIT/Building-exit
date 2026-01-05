# SECURITY ARCHITECTURE & VULNERABILITY PLAN

**Version:** 1.0  
**Status:** IMPLEMENTATION READY  
**Last Updated:** January 3, 2026  
**Scope:** Threat modeling, data protection, API security

---

## OVERVIEW

Exit handles sensitive behavioral data (screen time, app usage patterns, intervention history). This document defines our security posture and mitigation strategies.

**Core Principle:** "Local-First Privacy" - Raw usage data never leaves the device.

---

## SECTION 1: THREAT MODEL

### **1.1 Threat Actors**

| Actor | Motivation | Capability | Risk Level |
|-------|------------|------------|------------|
| **Malicious User** | Bypass interventions, inflate stats | App modification, jailbreak | Medium |
| **Third-Party Apps** | Access usage data | File system access (iOS sandboxed) | Low |
| **Network Attacker** | Intercept API calls | MITM, packet sniffing | Low (HTTPS only) |
| **Insider Threat** | Access production database | Firebase admin access | Medium |
| **State Actor** | Surveillance | Device compromise | Low (out of scope) |

---

### **1.2 Attack Vectors**

#### **Vector 1: Time Spoofing**

**Attack:** User changes device time to bypass unlock windows.

**Mitigation:**
```typescript
// src/shared/utils/TimeValidator.ts
import { Platform } from 'react-native';

export class TimeValidator {
  
  // Check if device time is manipulated
  static async isTimeManipulated(): Promise<boolean> {
    try {
      // Call trusted NTP server
      const response = await fetch('https://worldtimeapi.org/api/timezone/Etc/UTC');
      const data = await response.json();
      const serverTime = new Date(data.datetime).getTime();
      const deviceTime = Date.now();
      
      // Allow 5-minute tolerance for network latency
      const diff = Math.abs(serverTime - deviceTime);
      const tolerance = 5 * 60 * 1000; // 5 minutes
      
      return diff > tolerance;
    } catch (error) {
      // If we can't reach server, assume time is valid (fail open)
      console.warn('Time validation failed, assuming valid:', error);
      return false;
    }
  }
  
  // Validate unlock window with time manipulation check
  static async validateUnlockWindow(unlockTimestamp: number): Promise<boolean> {
    // First check if time is manipulated
    const isManipulated = await this.isTimeManipulated();
    
    if (isManipulated) {
      console.warn('Device time appears manipulated, denying unlock');
      return false;
    }
    
    // Standard unlock validation
    const now = Date.now();
    const elapsed = (now - unlockTimestamp) / 1000;
    return elapsed < 60;
  }
}
```

**Fallback:** If user is offline, we fail open (assume time is valid) to avoid breaking legitimate use cases.

---

#### **Vector 2: Sensor Spoofing (Accelerometer)**

**Attack:** User shakes phone to fake squats (Phase 2 feature).

**Mitigation:**
```typescript
// src/features/actions/utils/SquatDetector.ts
export class SquatDetector {
  
  private suspiciousPatterns: number[] = [];
  
  // Detect unrealistic squat patterns
  private isSuspicious(events: AccelerometerEvent[]): boolean {
    // Check for perfect repetition (bot-like)
    const intervals = events.map((e, i) => 
      i > 0 ? e.timestamp - events[i - 1].timestamp : 0
    ).slice(1);
    
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((sum, interval) => 
      sum + Math.pow(interval - avgInterval, 2), 0
    ) / intervals.length;
    
    // Human movement has variance; bot has near-zero variance
    if (variance < 10) {
      console.warn('Suspicious pattern: too uniform');
      return true;
    }
    
    // Check for impossible speed (>10 squats per 10 seconds)
    if (events.length > 10 && events[9].timestamp - events[0].timestamp < 10000) {
      console.warn('Suspicious pattern: too fast');
      return true;
    }
    
    return false;
  }
  
  // Record suspicious attempts
  async detectSquats(events: AccelerometerEvent[]): Promise<number> {
    if (this.isSuspicious(events)) {
      this.suspiciousPatterns.push(Date.now());
      
      // If 3+ suspicious patterns in 1 day, flag account
      if (this.suspiciousPatterns.length >= 3) {
        await this.flagForReview();
      }
      
      // Still count squats, but log suspicious activity
      return this.countSquats(events);
    }
    
    return this.countSquats(events);
  }
  
  private async flagForReview(): Promise<void> {
    // Log to Firebase (anonymized)
    await analytics().logEvent('suspicious_sensor_pattern', {
      count: this.suspiciousPatterns.length,
      timestamp: Date.now(),
    });
  }
}
```

**Philosophy:** We don't block suspected cheating (users might be legitimately fast). We log it for analysis and potential future action.

---

#### **Vector 3: App Binary Modification**

**Attack:** User decompiles APK/IPA and removes shield logic.

**Mitigation:**
```swift
// ios/SecurityValidator.swift
import Foundation

class SecurityValidator {
    
    // Check if app is running in debugger (jailbreak detection)
    static func isDebuggerAttached() -> Bool {
        var info = kinfo_proc()
        var mib: [Int32] = [CTL_KERN, KERN_PROC, KERN_PROC_PID, getpid()]
        var size = MemoryLayout<kinfo_proc>.stride
        
        let result = sysctl(&mib, u_int(mib.count), &info, &size, nil, 0)
        
        return (result == 0) && (info.kp_proc.p_flag & P_TRACED) != 0
    }
    
    // Check if app binary is modified
    static func isAppTampered() -> Bool {
        // Check code signature
        guard let executablePath = Bundle.main.executablePath else {
            return true // Can't verify, assume tampered
        }
        
        let fileManager = FileManager.default
        
        // Check if file exists at expected location
        if !fileManager.fileExists(atPath: executablePath) {
            return true
        }
        
        // iOS automatically verifies code signature; if we're running, it's valid
        // But we can add additional checks for jailbreak
        
        let jailbreakPaths = [
            "/Applications/Cydia.app",
            "/usr/sbin/sshd",
            "/bin/bash",
            "/etc/apt",
        ]
        
        for path in jailbreakPaths {
            if fileManager.fileExists(atPath: path) {
                return true
            }
        }
        
        return false
    }
}
```

**Philosophy:** We detect tampering but don't hard-block jailbroken devices (some users need jailbreak for accessibility). We log it and potentially limit features.

---

#### **Vector 4: API Key Exposure**

**Attack:** Attacker extracts Firebase API keys from app binary.

**Mitigation:**

1. **Environment Variables (Build-Time)**
```bash
# .env (NEVER commit to Git)
FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXX
FIREBASE_AUTH_DOMAIN=exit-app-prod.firebaseapp.com
FIREBASE_PROJECT_ID=exit-app-prod
REVENUECAT_API_KEY=sk_XXXXXXXXXXXXXXXXXXXXXXXX
```

2. **Firebase Security Rules (Server-Side)**
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Stats are write-only by authenticated users
    match /users/{userId}/stats/{date} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId
                   && request.resource.data.keys().hasOnly(['clarity', 'screenTime', 'actions', 'timestamp'])
                   && request.resource.data.clarity >= 0 
                   && request.resource.data.clarity <= 100;
    }
    
    // Block all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. **API Rate Limiting (Cloud Functions)**
```typescript
// functions/src/rateLimiter.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const rateLimit = new Map<string, number[]>();

export const checkRateLimit = (
  userId: string,
  limit: number = 100, // requests
  window: number = 3600000 // 1 hour in ms
): boolean => {
  const now = Date.now();
  
  // Get user's recent requests
  const requests = rateLimit.get(userId) || [];
  
  // Remove requests outside the window
  const recentRequests = requests.filter(timestamp => now - timestamp < window);
  
  // Check if over limit
  if (recentRequests.length >= limit) {
    console.warn(`Rate limit exceeded for user ${userId}`);
    return false;
  }
  
  // Add current request
  recentRequests.push(now);
  rateLimit.set(userId, recentRequests);
  
  return true;
};

// Apply to Cloud Function
export const syncClarityScore = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }
  
  if (!checkRateLimit(context.auth.uid, 100, 3600000)) {
    throw new functions.https.HttpsError('resource-exhausted', 'Rate limit exceeded');
  }
  
  // Process request...
});
```

---

## SECTION 2: DATA PROTECTION

### **2.1 Data Classification**

| Data Type | Sensitivity | Storage | Encryption |
|-----------|-------------|---------|------------|
| **Screen Time (raw)** | CRITICAL | Local only (MMKV) | AES-256 |
| **App Usage (bundle IDs)** | HIGH | Local only | AES-256 |
| **Clarity Score** | MEDIUM | Local + Firebase (aggregated) | HTTPS in transit |
| **Actions Completed** | LOW | Local + Firebase (count only) | HTTPS in transit |
| **User Email** | MEDIUM | Firebase Auth | Firebase managed |
| **Payment Info** | CRITICAL | RevenueCat (never touched) | PCI-DSS compliant |

---

### **2.2 Local Storage Encryption**
```typescript
// src/shared/utils/SecureStorage.ts
import { MMKV } from 'react-native-mmkv';
import CryptoJS from 'crypto-js';

export class SecureStorage {
  
  private static storage = new MMKV({
    id: 'exit-secure-storage',
    encryptionKey: this.getEncryptionKey(),
  });
  
  // Derive encryption key from device-specific data
  private static getEncryptionKey(): string {
    // In production, use iOS Keychain to store a random key
    // For now, use a combination of device ID and app identifier
    const deviceId = require('react-native-device-info').getUniqueId();
    const appId = 'com.exit.app';
    
    // Generate deterministic key
    return CryptoJS.SHA256(deviceId + appId).toString();
  }
  
  // Store sensitive screen time data
  static setScreenTime(bundleId: string, minutes: number): void {
    const key = `screen_time_${bundleId}`;
    const encrypted = this.encrypt(minutes.toString());
    this.storage.set(key, encrypted);
  }
  
  static getScreenTime(bundleId: string): number {
    const key = `screen_time_${bundleId}`;
    const encrypted = this.storage.getString(key);
    
    if (!encrypted) return 0;
    
    const decrypted = this.decrypt(encrypted);
    return parseInt(decrypted, 10);
  }
  
  private static encrypt(plaintext: string): string {
    const key = this.getEncryptionKey();
    return CryptoJS.AES.encrypt(plaintext, key).toString();
  }
  
  private static decrypt(ciphertext: string): string {
    const key = this.getEncryptionKey();
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
```

---

### **2.3 Data Retention Policy**
```typescript
// src/shared/utils/DataRetention.ts
export class DataRetention {
  
  // Delete data older than 90 days
  static async pruneOldData(): Promise<void> {
    const cutoff = Date.now() - (90 * 24 * 60 * 60 * 1000); // 90 days
    
    // Get all stored dates
    const keys = storage.getAllKeys();
    const dateKeys = keys.filter(k => k.startsWith('daily_log_'));
    
    for (const key of dateKeys) {
      const date = key.replace('daily_log_', '');
      const timestamp = new Date(date).getTime();
      
      if (timestamp < cutoff) {
        storage.delete(key);
        console.log(`Deleted old data: ${key}`);
      }
    }
  }
  
  // User-initiated data deletion
  static async deleteAllUserData(): Promise<void> {
    // Clear local storage
    storage.clearAll();
    
    // Delete Firebase data (if synced)
    if (auth().currentUser) {
      const userId = auth().currentUser.uid;
      
      // Delete user document
      await firestore().collection('users').doc(userId).delete();
      
      // Delete stats collection
      const stats = await firestore()
        .collection('users')
        .doc(userId)
        .collection('stats')
        .get();
      
      const batch = firestore().batch();
      stats.docs.forEach(doc => batch.delete(doc.ref));
      await batch.commit();
      
      console.log('All user data deleted from Firebase');
    }
    
    console.log('All local data deleted');
  }
}
```

---

## SECTION 3: API SECURITY

### **3.1 Firebase Security Rules (Complete)**
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function isValidClarity() {
      return request.resource.data.clarity is int
             && request.resource.data.clarity >= 0
             && request.resource.data.clarity <= 100;
    }
    
    function isValidScreenTime() {
      return request.resource.data.screenTime is int
             && request.resource.data.screenTime >= 0
             && request.resource.data.screenTime < 1440; // Max 24 hours
    }
    
    // User profile (read/write own only)
    match /users/{userId} {
      allow read: if isOwner(userId);
      allow write: if isOwner(userId)
                   && request.resource.data.keys().hasOnly([
                     'email', 'level', 'streak', 'createdAt', 'lastActive'
                   ]);
    }
    
    // Daily stats (write with validation)
    match /users/{userId}/stats/{date} {
      allow read: if isOwner(userId);
      allow create: if isOwner(userId)
                    && isValidClarity()
                    && isValidScreenTime()
                    && request.resource.data.timestamp == request.time;
      allow update: if isOwner(userId)
                    && isValidClarity()
                    && isValidScreenTime();
    }
    
    // Clarity Circle (social features - Phase 2)
    match /circles/{circleId} {
      allow read: if isAuthenticated()
                  && request.auth.uid in resource.data.members;
      allow write: if isAuthenticated()
                   && request.auth.uid == resource.data.owner;
    }
    
    // Block everything else
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### **3.2 Rate Limiting (Cloud Functions)**
```typescript
// functions/src/index.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

// Rate limit configuration
const RATE_LIMITS = {
  syncClarity: { requests: 100, window: 3600000 }, // 100/hour
  updateStreak: { requests: 10, window: 86400000 }, // 10/day
  reportAbuse: { requests: 5, window: 86400000 }, // 5/day
};

// Sync clarity score to Firebase
export const syncClarityScore = functions.https.onCall(async (data, context) => {
  // Auth check
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }
  
  // Rate limit check
  if (!checkRateLimit(context.auth.uid, RATE_LIMITS.syncClarity)) {
    throw new functions.https.HttpsError('resource-exhausted', 'Rate limit exceeded');
  }
  
  // Validate input
  const { clarity, screenTime, date } = data;
  
  if (typeof clarity !== 'number' || clarity < 0 || clarity > 100) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid clarity score');
  }
  
  if (typeof screenTime !== 'number' || screenTime < 0 || screenTime > 1440) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid screen time');
  }
  
  // Write to Firestore
  await admin.firestore()
    .collection('users')
    .doc(context.auth.uid)
    .collection('stats')
    .doc(date)
    .set({
      clarity,
      screenTime,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
  
  return { success: true };
});
```

---

## SECTION 4: VULNERABILITY CHECKLIST

### **4.1 Pre-Launch Security Audit**

**Code Review:**
- [ ] No API keys committed to Git
- [ ] All secrets in `.env` (gitignored)
- [ ] Firebase Security Rules deployed
- [ ] Rate limiting on all Cloud Functions
- [ ] Input validation on all API endpoints
- [ ] Encryption enabled for sensitive local data
- [ ] Time manipulation detection implemented
- [ ] Sensor spoofing detection implemented

**Infrastructure:**
- [ ] Firebase project in production mode
- [ ] RevenueCat webhook secrets configured
- [ ] GitHub Actions secrets encrypted
- [ ] TestFlight beta restricted to internal team

**Third-Party:**
- [ ] Firebase SDK up to date
- [ ] RevenueCat SDK up to date
- [ ] All npm packages audited (`npm audit`)
- [ ] No critical/high vulnerabilities

**Testing:**
- [ ] Attempted time spoofing (blocked)
- [ ] Attempted API calls without auth (rejected)
- [ ] Attempted SQL injection on inputs (N/A, no SQL)
- [ ] Attempted XSS on text inputs (sanitized)
- [ ] Attempted excessive API calls (rate limited)

---

### **4.2 Post-Launch Monitoring**
```typescript
// src/shared/utils/SecurityMonitoring.ts
import analytics from '@react-native-firebase/analytics';

export class SecurityMonitoring {
  
  // Log suspicious activity
  static async logSuspiciousActivity(
    type: 'time_spoofing' | 'sensor_spoofing' | 'excessive_api_calls',
    details: Record<string, any>
  ): Promise<void> {
    
    await analytics().logEvent('security_alert', {
      alert_type: type,
      timestamp: Date.now(),
      ...details,
    });
    
    // If critical, send to monitoring service
    if (type === 'time_spoofing') {
      console.error('[SECURITY] Detected time spoofing:', details);
    }
  }
  
  // Track failed interventions
  static async logInterventionBypass(
    method: 'dismissal_limit' | 'time_manipulation' | 'unknown'
  ): Promise<void> {
    await analytics().logEvent('intervention_bypass_attempt', {
      method,
      timestamp: Date.now(),
    });
  }
}
```

**Monitoring Dashboard (Firebase Console):**
- Track `security_alert` events
- Set up alerts for spikes in `intervention_bypass_attempt`
- Monitor Cloud Functions error rates
- Check Firestore denied requests

---

## SECTION 5: INCIDENT RESPONSE PLAN

### **5.1 Severity Levels**

| Level | Description | Response Time | Escalation |
|-------|-------------|---------------|------------|
| **P0 - Critical** | Data breach, API keys exposed | Immediate | CEO, Lead Engineer |
| **P1 - High** | Widespread app crashes, auth bypass | 1 hour | Lead Engineer |
| **P2 - Medium** | Feature broken, degraded performance | 4 hours | On-call Engineer |
| **P3 - Low** | Minor bug, cosmetic issue | 24 hours | Product Team |

---

### **5.2 Response Procedures**

**If API Key is Compromised:**
1. Immediately rotate Firebase API keys (Firebase Console)
2. Invalidate all user sessions (`auth().signOut()`)
3. Deploy hotfix with new keys
4. Audit Firebase logs for unauthorized access
5. Notify users via email (if data accessed)

**If User Data is Accessed:**
1. Identify scope (how many users, what data)
2. Contain breach (revoke compromised credentials)
3. Notify affected users within 72 hours (GDPR compliance)
4. File incident report with authorities if required
5. Post-mortem and security improvements

---

## SECTION 6: COMPLIANCE

### **6.1 Privacy Laws**

**GDPR (Europe):**
- ✅ Right to access: User can export all data
- ✅ Right to deletion: User can delete all data
- ✅ Right to portability: Data exported as JSON
- ✅ Consent: Clear privacy policy, opt-in required
- ✅ Data minimization: Only collect what's necessary

**CCPA (California):**
- ✅ Right to know: User can see what data is collected
- ✅ Right to delete: User can delete all data
- ✅ Right to opt-out: User can disable analytics

### **6.2 App Store Requirements**

**Apple Privacy Nutrition Labels:**
```
Data Used to Track You: NONE
Data Linked to You:
  - Contact Info: Email (for account only)
  - Usage Data: Aggregated clarity scores (optional)
Data Not Linked to You:
  - Diagnostics: Crash logs (anonymous)
```

**Privacy Policy URL:**
`https://exit.app/privacy`

**Key Points:**
- Screen time data never leaves device
- No third-party tracking
- No advertising
- Optional cloud sync (can use app entirely offline)

---

## APPENDIX: SECURITY TOOLING

### **Recommended Tools**

| Tool | Purpose | Cost |
|------|---------|------|
| **Snyk** | npm dependency scanning | Free tier |
| **SonarCloud** | Code quality & security | Free for open source |
| **Firebase Security Rules Emulator** | Test rules locally | Free |
| **Postman** | API testing | Free |
| **Charles Proxy** | MITM testing | $50 (one-time) |

---

**Document Status:** IMPLEMENTATION READY  
**Next Review:** Post-Launch (Week 20)  
**Owner:** Lead Security Engineer

---
