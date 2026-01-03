# DEPLOYMENT GUIDE

**Status:** OPERATIONS MANUAL  
**Version:** 1.0  
**Last Updated:** January 2, 2026  
**Audience:** DevOps, Lead Engineer

---

## OVERVIEW

This guide covers the complete deployment pipeline from local development to App Store production. Exit is iOS-first, so this document focuses on Apple's ecosystem.

**Deployment Stages:**
1. **Local Development** → Developer machines
2. **Internal Testing** → Ad-hoc builds for team
3. **Closed Beta** → TestFlight (50 users)
4. **Open Beta** → TestFlight (10,000 users)
5. **Production** → App Store

---

## SECTION 1: DEVELOPMENT ENVIRONMENT SETUP

### 1.1 Prerequisites

**Required Software:**

| Tool | Version | Purpose |
|------|---------|---------|
| macOS | Ventura 13.0+ | Development OS |
| Xcode | 15.0+ | iOS development |
| Node.js | 18.x LTS | JavaScript runtime |
| Ruby | 3.0+ | Fastlane/CocoaPods |
| CocoaPods | 1.12+ | iOS dependency manager |
| Fastlane | 2.217+ | Deployment automation |

**Installation:**
```bash
# Install Homebrew (if not already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js via nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Install Ruby via rbenv
brew install rbenv
rbenv install 3.0.0
rbenv global 3.0.0

# Install CocoaPods
sudo gem install cocoapods

# Install Fastlane
sudo gem install fastlane -NV

# Verify installations
node --version
ruby --version
pod --version
fastlane --version
```

### 1.2 Project Setup
```bash
# Clone repository
git clone https://github.com/yourorg/exit-app-core.git
cd exit-app-core

# Install JavaScript dependencies
npm install

# Install iOS dependencies
cd ios
pod install
cd ..

# Create environment files
cp .env.example .env.development
cp .env.example .env.staging
cp .env.example .env.production
```

### 1.3 Environment Configuration
```bash
# .env.development
ENV=development
API_URL=http://localhost:3000
FIREBASE_CONFIG={"apiKey":"dev-key-here",...}
SENTRY_DSN=
ENABLE_FLIPPER=true

# .env.staging
ENV=staging
API_URL=https://staging-api.exit.app
FIREBASE_CONFIG={"apiKey":"staging-key-here",...}
SENTRY_DSN=https://staging-sentry-dsn
ENABLE_FLIPPER=false

# .env.production
ENV=production
API_URL=https://api.exit.app
FIREBASE_CONFIG={"apiKey":"prod-key-here",...}
SENTRY_DSN=https://prod-sentry-dsn
ENABLE_FLIPPER=false
```

**Security Note:** Never commit `.env` files. Add to `.gitignore`.

---

## SECTION 2: IOS CERTIFICATES & PROVISIONING

### 2.1 Apple Developer Account Setup

**Required Accounts:**
1. **Apple Developer Program** ($99/year)
   - URL: https://developer.apple.com
   - Account Type: Individual or Organization
   
2. **App Store Connect**
   - URL: https://appstoreconnect.apple.com
   - Linked to Developer account

### 2.2 App ID Registration
```bash
# Via Xcode:
# 1. Open ios/Exit.xcworkspace
# 2. Select project in navigator
# 3. Signing & Capabilities tab
# 4. Bundle Identifier: com.exit.app
# 5. Enable capabilities:
#    - FamilyControls
#    - App Groups (group.com.exit.app)
#    - Push Notifications

# Via Apple Developer Portal (manual):
# 1. Go to https://developer.apple.com/account/resources/identifiers
# 2. Create new App ID: com.exit.app
# 3. Enable required capabilities
```

**App Extensions Bundle IDs:**
- Main App: `com.exit.app`
- DeviceActivityMonitor: `com.exit.app.DeviceActivityMonitor`
- ShieldConfiguration: `com.exit.app.ShieldConfiguration`
- ShieldAction: `com.exit.app.ShieldAction`

### 2.3 Certificate Management

**Certificate Types Needed:**

| Certificate | Purpose | Renewable |
|-------------|---------|-----------|
| **iOS Development** | Local testing | Yearly |
| **iOS Distribution** | App Store / TestFlight | Yearly |
| **Push Notification** | Remote notifications | Yearly |

**Generate Certificates:**
```bash
# Using Fastlane Match (recommended for teams)
cd ios

# Initialize match
fastlane match init
# Follow prompts, choose git storage

# Generate development certificates
fastlane match development

# Generate distribution certificates
fastlane match appstore

# Store credentials in encrypted git repo
# Team members can then sync certificates
```

**Manual Certificate Generation (alternative):**

1. Open Xcode
2. Preferences → Accounts
3. Select Apple ID → Manage Certificates
4. Click "+" → iOS Distribution
5. Download certificate

### 2.4 Provisioning Profiles

**Profile Types:**

| Profile | Use Case |
|---------|----------|
| **Development** | Local device testing |
| **Ad Hoc** | Internal team testing (up to 100 devices) |
| **App Store** | TestFlight and production |

**Generate via Fastlane:**
```ruby
# ios/fastlane/Fastfile

lane :sync_certificates do
  match(
    type: "development",
    app_identifier: [
      "com.exit.app",
      "com.exit.app.DeviceActivityMonitor",
      "com.exit.app.ShieldConfiguration",
      "com.exit.app.ShieldAction"
    ]
  )
  
  match(
    type: "appstore",
    app_identifier: [
      "com.exit.app",
      "com.exit.app.DeviceActivityMonitor",
      "com.exit.app.ShieldConfiguration",
      "com.exit.app.ShieldAction"
    ]
  )
end
```

---

## SECTION 3: BUILD CONFIGURATION

### 3.1 Xcode Schemes

Create three schemes for different environments:

**Schemes:**
- `Exit (Development)` → Debug configuration
- `Exit (Staging)` → Release configuration, staging backend
- `Exit (Production)` → Release configuration, production backend

**Configuration:**
```
Target: Exit
├── Debug
│   ├── Preprocessor Macros: DEBUG=1
│   ├── Swift Optimization: -Onone
│   └── Code Signing: Development
│
├── Release (Staging)
│   ├── Preprocessor Macros: STAGING=1
│   ├── Swift Optimization: -O
│   └── Code Signing: App Store
│
└── Release (Production)
    ├── Preprocessor Macros: PRODUCTION=1
    ├── Swift Optimization: -O
    └── Code Signing: App Store
```

### 3.2 Build Numbers & Versioning

**Versioning Strategy:**
```
Version: MAJOR.MINOR.PATCH (1.0.0)
Build: Incremental integer (1, 2, 3, ...)

Examples:
- v1.0.0 (Build 1) → Initial MVP release
- v1.0.1 (Build 2) → Bug fix
- v1.1.0 (Build 3) → New features (Phase 2)
- v2.0.0 (Build 4) → Major redesign
```

**Automated Version Bumping:**
```ruby
# ios/fastlane/Fastfile

lane :bump_build do
  increment_build_number(
    xcodeproj: "Exit.xcodeproj"
  )
end

lane :bump_patch do
  increment_version_number(
    bump_type: "patch",
    xcodeproj: "Exit.xcodeproj"
  )
end

lane :bump_minor do
  increment_version_number(
    bump_type: "minor",
    xcodeproj: "Exit.xcodeproj"
  )
end
```

### 3.3 Build Variants

**Development Build:**
```bash
npm run ios
# Or manually:
npx react-native run-ios --scheme "Exit (Development)"
```

**Staging Build:**
```bash
npx react-native run-ios --scheme "Exit (Staging)" --configuration Release
```

**Production Build:**
```bash
# Via Fastlane (recommended)
cd ios
fastlane build_production

# Manual
xcodebuild -workspace Exit.xcworkspace \
  -scheme "Exit (Production)" \
  -configuration Release \
  -archivePath Exit.xcarchive \
  archive
```

---

## SECTION 4: TESTFLIGHT DEPLOYMENT

### 4.1 Initial App Store Connect Setup

**One-Time Configuration:**

1. **Create App Record:**
   - Go to https://appstoreconnect.apple.com
   - My Apps → "+" → New App
   - Platform: iOS
   - Name: Exit
   - Bundle ID: com.exit.app
   - SKU: exit-app-001
   - User Access: Full Access

2. **App Information:**
   - Privacy Policy URL: https://exit.app/privacy
   - Category: Health & Fitness (Primary), Productivity (Secondary)
   - Content Rights: No (no third-party content)

3. **Age Rating:**
   - 4+ (No objectionable content)

4. **App Privacy:**
   - Data Collected: None (all data on-device)
   - Data Linked to User: None
   - Data Used to Track User: None

### 4.2 TestFlight Build Upload

**Fastlane Configuration:**
```ruby
# ios/fastlane/Fastfile

default_platform(:ios)

platform :ios do
  
  desc "Upload to TestFlight"
  lane :beta do
    # Ensure clean git state
    ensure_git_status_clean
    
    # Sync certificates
    sync_certificates
    
    # Increment build number
    increment_build_number(xcodeproj: "Exit.xcodeproj")
    
    # Build app
    build_app(
      workspace: "Exit.xcworkspace",
      scheme: "Exit (Production)",
      export_method: "app-store",
      export_options: {
        provisioningProfiles: {
          "com.exit.app" => "match AppStore com.exit.app",
          "com.exit.app.DeviceActivityMonitor" => "match AppStore com.exit.app.DeviceActivityMonitor",
          "com.exit.app.ShieldConfiguration" => "match AppStore com.exit.app.ShieldConfiguration",
          "com.exit.app.ShieldAction" => "match AppStore com.exit.app.ShieldAction"
        }
      }
    )
    
    # Upload to TestFlight
    upload_to_testflight(
      skip_waiting_for_build_processing: true,
      skip_submission: true,
      distribute_external: false # Internal testing first
    )
    
    # Commit version bump
    commit_version_bump(
      message: "Bump build for TestFlight",
      xcodeproj: "Exit.xcodeproj"
    )
    
    # Add git tag
    add_git_tag(
      tag: "testflight/#{get_version_number}/#{get_build_number}"
    )
    
    # Push to remote
    push_to_git_remote
  end
  
  desc "Promote TestFlight build to external testing"
  lane :promote_to_external do
    pilot(
      distribute_external: true,
      groups: ["Beta Testers"],
      changelog: "Bug fixes and improvements"
    )
  end
end
```

**Upload Command:**
```bash
cd ios
fastlane beta
```

**Expected Output:**
```
[✔] Building Exit.xcarchive
[✔] Exporting IPA
[✔] Uploading to App Store Connect
[✔] Build processing (10-15 minutes)
[✔] Build available for internal testing
```

### 4.3 TestFlight Configuration

**Internal Testing Group:**
- Automatically includes App Store Connect users
- No App Review required
- Max 100 internal testers

**External Testing Group:**
- Requires App Review (first build only)
- Can add up to 10,000 external testers
- Use public link or email invites

**Beta App Information (Required for External):**
```
What to Test:
Please focus on:
1. Shield intervention flow (open TikTok → breathing exercise → unlock)
2. Clarity score accuracy
3. Action completion tracking
4. Any crashes or performance issues

Feedback Email: beta@exit.app
Marketing URL: https://exit.app
Privacy Policy URL: https://exit.app/privacy
```

### 4.4 Tester Management

**Add Internal Testers:**
1. App Store Connect → TestFlight → Internal Testing
2. Add user emails (must have App Store Connect accounts)
3. Testers automatically get new builds

**Add External Testers:**
1. TestFlight → External Testing → Create Group
2. Add emails individually or import CSV
3. Send invites
4. Or generate public link: `https://testflight.apple.com/join/XXXXXX`

**Beta Tester Onboarding Email:**
```
Subject: Exit Beta - You're In! 

Hi [Name],

Welcome to Exit's closed beta! Here's how to get started:

1. Download TestFlight from App Store (if you don't have it)
2. Open this invite link on your iPhone: [LINK]
3. Install Exit
4. Grant Screen Time permission when prompted
5. Select 2-3 apps to monitor (start with TikTok or Instagram)

What to test:
- Try to open a monitored app → complete the breathing exercise
- Check if your Clarity Score updates throughout the day
- Complete 1-2 actions from the Actions tab

Send feedback:
- Tap "Send Beta Feedback" in TestFlight
- Or email us at beta@exit.app

Thanks for helping us build this!
- Exit Team
```

---

## SECTION 5: APP STORE SUBMISSION

### 5.1 Pre-Submission Checklist

**Technical Requirements:**

- [ ] App builds without warnings
- [ ] All app extensions work correctly
- [ ] No crashes in 7-day testing period
- [ ] App size < 200 MB (exit should be ~50 MB)
- [ ] Launch time < 3 seconds on iPhone 12
- [ ] Supports iOS 16.0+ minimum
- [ ] Supports iPhone only (iPad optional Phase 2)

**Content Requirements:**

- [ ] App icon (1024×1024 PNG)
- [ ] 6.5" screenshots (iPhone 14 Pro Max) - 3 required
- [ ] 5.5" screenshots (iPhone 8 Plus) - 3 required
- [ ] App preview video (optional, 30 seconds max)
- [ ] Privacy policy live at public URL
- [ ] Support URL live

**Legal Requirements:**

- [ ] Age rating questionnaire completed
- [ ] Export compliance documentation (if applicable)
- [ ] Content rights ownership verified
- [ ] No trademark violations

### 5.2 App Store Metadata

**App Name:**
```
Exit: Digital Awareness
```
**Subtitle (30 chars max):**
```
Train Your Awareness
```

**Keywords (100 chars max):**
```
screen time,digital wellbeing,focus,mindfulness,dopamine,attention,phone addiction,productivity
```

**Promotional Text (170 chars, updatable without review):**
```
Interrupt autopilot phone use with physiological interventions. Build awareness through breathing exercises and offline actions.
```

**Description (4000 chars max):**
```
Exit isn't a phone blocker—it's a nervous system trainer.

THE PROBLEM
Every minute of mindless scrolling adds "static"—cognitive noise that makes it harder to think clearly, make decisions, or be present.

THE SOLUTION
Exit visualizes this static in real-time and gives you tools to restore clarity through physiological interventions: breathing, movement, and offline actions.

HOW IT WORKS
1. Scrolling adds static (your dashboard becomes harder to read)
2. When you try to open distracting apps, Exit prompts a breathing exercise
3. Complete the exercise → app unlocks for 60 seconds
4. Restore clarity through actions: walks, journaling, stretching
5. Watch your Clarity Score improve as you build new patterns

FEATURES
- Somatic Shield: Complete breathing exercises before accessing apps
- Real-Time Clarity Score: See the impact of screen time instantly
- Actions Library: 20+ offline micro-actions to clear mental noise
- Progress Tracking: Conscious Days, streaks, and weekly insights
- Native iOS Design: Feels like an Apple app

FREE vs PRO
Free: Box breathing, hydration reminders (clears 5-10% static)
Pro: All actions including movement, cold exposure (clears up to 30% static)

Subscription: $9.99/month or $59.99/year

PRIVACY
Your screen time data never leaves your device. Only anonymous statistics (like Clarity Score) are synced to cloud. No tracking, no ads, no data harvesting.

REQUIREMENTS
- iOS 16.0 or later
- Screen Time permission (used for interventions, not surveillance)

Exit is maintenance, not debt. It's clarity, not guilt.

---
Built by Arwa. Open-source research at exit.app/research
```

**What's New (Version 1.0):**
```
Initial release of Exit!

- Somatic Shield with breathing exercises
- Real-time Clarity Score tracking
- 20 offline micro-actions
- Progress tracking and Conscious Days
- Native iOS design

We'd love your feedback! Email us at hello@exit.app
```

### 5.3 Screenshots Requirements

**6.5" Display (iPhone 14 Pro Max - 1290 × 2796 px):**

1. **Screenshot 1: Dashboard (Hero)**
   - Show Clarity Score at 75%
   - Subtle static overlay visible
   - Caption: "See the impact of screen time instantly"

2. **Screenshot 2: Shield Intervention**
   - Shield blocking TikTok
   - "Begin Breathing" button
   - Caption: "Complete breathing exercises to unlock apps"

3. **Screenshot 3: Actions Library**
   - List of micro-actions
   - Caption: "20+ actions to restore mental clarity"

4. **Screenshot 4: Progress (Optional)**
   - Conscious Days streak
   - Weekly stats
   - Caption: "Track your journey to intentional presence"

**5.5" Display (iPhone 8 Plus - 1242 × 2208 px):**
- Same 3-4 screenshots, resized

**Design Guidelines:**
- Use actual app screenshots (no mockups)
- Add subtle text overlays for captions
- Keep UI clean, no cluttered backgrounds
- Show realistic data (no "9999 days" streaks)

### 5.4 App Preview Video (Optional but Recommended)

**Script (30 seconds):**
```
[0-5s] Opening shot: Dashboard with 0% static (crystal clear)
       Text: "Your mind is a signal processor"

[5-10s] User scrolls phone → static accumulates visually
        Text: "Scrolling adds noise"

[10-15s] User tries to open TikTok → Shield appears
         Text: "Exit interrupts autopilot"

[15-20s] Breathing exercise screen (circle animation)
         Text: "Complete breathing → unlock app"

[20-25s] Dashboard clears, static fades away
         Text: "Restore clarity through action"

[25-30s] Exit app icon + "Download now"
```

**Technical Specs:**
- Format: MP4 or MOV
- Resolution: 1920×1080 minimum
- Duration: 15-30 seconds
- File size: < 500 MB
- Portrait orientation

### 5.5 App Review Preparation

**App Review Information:**
```
Demo Account (if needed):
Username: N/A (no login required)
Password: N/A

Notes for Reviewer:
To test the core feature (Somatic Shield):

1. Grant Screen Time permission when prompted
2. Select "TikTok" as a monitored app
3. Try to open TikTok from home screen
4. Shield will appear with breathing exercise
5. Complete 5 cycles of box breathing (2 minutes)
6. App unlocks for 60 seconds

Key Files to Check:
- Privacy Policy: https://exit.app/privacy
- Support: https://exit.app/support

Special Permissions Used:
- FamilyControls: To display custom shield on monitored apps
- App Groups: For extension communication
- Screen Time API: To calculate Clarity Score (data stays on-device)

Contact: hello@exit.app
Phone: +1-XXX-XXX-XXXX
```

**FamilyControls Justification Document:**

(Attach the justification document from PRD Appendix as a PDF)

### 5.6 Submission via Fastlane
```ruby
# ios/fastlane/Fastfile

lane :submit_for_review do
  # Ensure build is already uploaded to TestFlight
  latest_build = latest_testflight_build_number
  
  puts "Submitting build #{latest_build} for App Review"
  
  deliver(
    submit_for_review: true,
    automatic_release: false, # Manual release after approval
    submission_information: {
      add_id_info_uses_idfa: false,
      export_compliance_uses_encryption: false
    },
    app_version: get_version_number
  )
  
  puts "✅ App submitted for review!"
  puts "⏱️ Typical review time: 24-48 hours"
end
```

**Submission Command:**
```bash
cd ios
fastlane submit_for_review
```

### 5.7 Post-Submission

**App Review Status Monitoring:**

| Status | Meaning | Typical Duration |
|--------|---------|------------------|
| **Waiting for Review** | In queue | 1-2 days |
| **In Review** | Active review | 4-24 hours |
| **Pending Developer Release** | Approved, awaiting manual release | Manual trigger |
| **Ready for Sale** | Live on App Store | Immediate |

**If Rejected:**

1. Read rejection reason carefully in App Store Connect
2. Address specific issues cited
3. Respond via Resolution Center if clarification needed
4. Resubmit once fixed

**Common Rejection Reasons:**
- FamilyControls entitlement not approved → Submit justification
- Crash on launch → Fix bug, upload new build
- Privacy policy missing → Add URL
- Misleading metadata → Revise description

---

## SECTION 6: CI/CD PIPELINE (GITHUB ACTIONS)

### 6.1 Automated Build & Test
```yaml
# .github/workflows/ios-ci.yml

name: iOS CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: macos-13
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install CocoaPods
        run: cd ios && pod install
      
      - name: Build iOS app
        run: |
          xcodebuild -workspace ios/Exit.xcworkspace \
            -scheme "Exit (Development)" \
            -sdk iphonesimulator \
            -destination 'platform=iOS Simulator,name=iPhone 14,OS=17.0' \
            build
      
      - name: Run tests
        run: |
          xcodebuild test \
            -workspace ios/Exit.xcworkspace \
            -scheme "Exit (Development)" \
            -sdk iphonesimulator \
            -destination 'platform=iOS Simulator,name=iPhone 14,OS=17.0'
```

### 6.2 Automated TestFlight Deployment
```yaml
# .github/workflows/testflight-deploy.yml

name: Deploy to TestFlight

on:
  push:
    tags:
      - 'v*'

jobs:
  deploy:
    runs-on: macos-13
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: 3.0
          bundler-cache: true
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: |
          npm ci
          cd ios && pod install
      
      - name: Setup Fastlane Match
        env:
          MATCH_PASSWORD: ${{ secrets.MATCH_PASSWORD }}
          MATCH_GIT_BASIC_AUTHORIZATION: ${{ secrets.MATCH_GIT_TOKEN }}
        run: |
          cd ios
          bundle exec fastlane sync_certificates
      
      - name: Build and upload to TestFlight
        env:
          FASTLANE_USER: ${{ secrets.APPLE_ID }}
          FASTLANE_PASSWORD: ${{ secrets.APPLE_APP_SPECIFIC_PASSWORD }}
          FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD: ${{ secrets.APPLE_APP_SPECIFIC_PASSWORD }}
        run: |
          cd ios
          bundle exec fastlane beta
      
      - name: Notify team
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'New TestFlight build deployed! 🚀'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### 6.3 GitHub Secrets Configuration

**Required Secrets (Settings → Secrets → Actions):**

| Secret | Purpose | How to Get |
|--------|---------|------------|
| `APPLE_ID` | App Store Connect email | Your Apple ID |
| `APPLE_APP_SPECIFIC_PASSWORD` | App-specific password | apple.com → Account → Security → App-Specific Passwords |
| `MATCH_PASSWORD` | Fastlane Match encryption | Set when running `fastlane match init` |
| `MATCH_GIT_TOKEN` | Git repo access | GitHub → Settings → Developer Settings → Personal Access Tokens |
| `SLACK_WEBHOOK` | Notifications | Slack workspace settings |

---

## SECTION 7: RELEASE PROCESS

### 7.1 Release Workflow

**MVP Release (v1.0.0):**
```bash
# Week 8: Finalize MVP

# 1. Create release branch
git checkout -b release/1.0.0

# 2. Bump version
cd ios
fastlane bump_minor # 0.9.0 → 1.0.0
fastlane bump_build # Build 1

# 3. Update CHANGELOG.md
echo "## [1.0.0] - 2026-01-XX

### Added
- Initial MVP release
- Somatic Shield with breathing exercises
- Clarity Score tracking
- 20 offline micro-actions
- Progress tracking

" >> CHANGELOG.md

# 4. Commit and tag
git add .
git commit -m "Release v1.0.0"
git tag -a v1.0.0 -m "Version 1.0.0 - MVP Release"

# 5. Push to remote
git push origin release/1.0.0
git push origin v1.0.0

# 6. Build and upload
fastlane beta

# 7. Wait for App Review approval (1-2 days)

# 8. Release to App Store
fastlane release_to_app_store

# 9. Merge to main
git checkout main
git merge release/1.0.0
git push origin main
```

### 7.2 Hotfix Process

**Critical Bug (v1.0.1):**
```bash
# Hotfix workflow (fast-track)

# 1. Branch from production tag
git checkout -b hotfix/1.0.1 v1.0.0

# 2. Fix bug
# (make code changes)

# 3. Bump patch version
cd ios
fastlane bump_patch # 1.0.0 → 1.0.1
fastlane bump_build # Build 2

# 4. Test fix
npm run ios
# Verify bug is fixed

# 5. Commit and tag
git commit -am "Hotfix: [description]"
git tag -a v1.0.1 -m "Hotfix v1.0.1"

# 6. Deploy immediately
fastlane beta

# 7. Expedited review request
# In App Store Connect, check "Expedited Review" and explain urgency

# 8. Merge to main and develop
git checkout main
git merge hotfix/1.0.1
git checkout develop
git merge hotfix/1.0.1
git push --all
git push --tags
```

### 7.3 Phased Release Strategy

**Rollout Plan for v1.0.0:**
```
Day 0: Submit to App Store
Day 1-2: App Review
Day 3: Approved → Release to 10% of users (phased rollout)
Day 4: Monitor for crashes → Increase to 25%
Day 5: No critical issues → Increase to 50%
Day 6: Stable → Release to 100%
```

**Phased Release Configuration:**

In App Store Connect:
1. Version → Phased Release
2. Check "Release this version over a 7-day period"
3. Monitor daily active users and crash rates

**Pause Criteria:**

| Metric | Threshold | Action |
|--------|-----------|--------|
| Crash rate | >2% | Pause rollout, investigate |
| 1-star reviews | >20% | Pause rollout, address feedback |
| Critical bug reports | >10 similar reports | Pause rollout, prepare hotfix |

---

## SECTION 8: MONITORING & ANALYTICS

### 8.1 Firebase Crashlytics Setup
```bash
# Install Firebase SDK
npm install @react-native-firebase/app @react-native-firebase/crashlytics

# iOS setup
cd ios
pod install
```
```typescript
// src/services/CrashReporting.ts
import crashlytics from '@react-native-firebase/crashlytics';

export class CrashReporter {
  
  static initialize(): void {
    // Enable crash reporting
    crashlytics().setCrashlyticsCollectionEnabled(true);
    
    // Set user identifier (hashed)
    const userId = StorageManager.getUserProfile()?.id;
    if (userId) {
      crashlytics().setUserId(hashUserId(userId));
    }
  }
  
  static logError(error: Error, context?: Record<string, any>): void {
    crashlytics().recordError(error);
    
    if (context) {
      Object.keys(context).forEach(key => {
        crashlytics().setAttribute(key, String(context[key]));
      });
    }
  }
  
  static log(message: string): void {
    crashlytics().log(message);
  }
}
```

### 8.2 Key Metrics Dashboard

**Track in Firebase Analytics:**

| Metric | Event Name | Properties |
|--------|-----------|------------|
| App Opens | `app_open` | `source` (push, icon, deeplink) |
| Onboarding Complete | `onboarding_complete` | `time_to_complete_seconds` |
| Shield Triggered | `shield_triggered` | `app_bundle_id`, `clarity_score` |
| Intervention Completed | `intervention_completed` | `action_type`, `duration_seconds` |
| Action Completed | `action_completed` | `action_id`, `clarity_gained` |
| Conscious Day Achieved | `conscious_day` | `streak_length` |
| Level Up | `level_up` | `old_level`, `new_level` |

### 8.3 App Store Connect Metrics

**Weekly Review:**

1. **Crashes:** Crashes → Crash Rate (should be <1%)
2. **Performance:** App Store → App Analytics → Performance
   - App Units: Total downloads
   - Retention: Day 1, 7, 30 retention rates
   - Conversion: Free → Pro subscription rate

3. **Ratings & Reviews:**
   - Monitor 1-star reviews for critical issues
   - Respond to reviews (especially negative ones)

4. **Sales & Trends:**
   - Track Pro subscription conversions
   - Revenue per user

---

## SECTION 9: TROUBLESHOOTING

### 9.1 Common Build Errors

**Error: "No profiles for ... were found"**
```bash
# Solution: Sync provisioning profiles
cd ios
fastlane sync_certificates
```

**Error: "FamilyControls entitlement not allowed"**
```
Solution: Request entitlement approval from Apple
1. Go to https://developer.apple.com/contact/request/family-controls
2. Submit justification document (see PRD Appendix)
3. Wait 3-5 business days for approval
4. Rebuild app after approval
```

**Error: "Pod install fails"**
```bash
# Solution: Clear CocoaPods cache
cd ios
rm -rf Pods
rm Podfile.lock
pod install --repo-update
```

**Error: "Build hangs at 'Running script'"**
```bash
# Solution: Increase Node memory
# Add to package.json scripts:
"ios": "NODE_OPTIONS=--max_old_space_size=4096 react-native run-ios"
```

### 9.2 TestFlight Issues

**Issue: Build stuck in "Processing"**
```
Typical processing time: 10-15 minutes
If stuck >1 hour:
1. Check App Store Connect status page
2. Wait 24 hours
3. If still stuck, upload new build
```

**Issue: "Missing Compliance" warning**
```
Solution: Answer export compliance question
1. App Store Connect → TestFlight → Build
2. Provide Export Compliance Information
3. Select "No" for encryption (app uses standard iOS encryption only)
```

### 9.3 App Review Rejections

**Rejection: "Guideline 5.1.1 - Data Collection and Storage"**
```
Reason: Privacy policy not accessible
Solution: Ensure https://exit.app/privacy loads correctly
```

**Rejection: "Guideline 2.5.13 - FamilyControls Misuse"**
```
Reason: Insufficient justification for FamilyControls
Solution: Update justification document with clearer use case
Re-submit with detailed video demonstration
```

---

## SECTION 10: POST-LAUNCH OPERATIONS

### 10.1 First Week Monitoring

**Daily Checklist:**

- [ ] Check crash rate in Crashlytics (target: <1%)
- [ ] Monitor App Store ratings (respond to 1-2 star reviews)
- [ ] Review Firebase Analytics (retention, engagement)
- [ ] Check support email for critical bugs
- [ ] Monitor TestFlight feedback

### 10.2 Update Cadence

**Recommended Schedule:**

| Update Type | Frequency | Example |
|-------------|-----------|---------|
| **Hotfix** | As needed | Critical crash fix |
| **Minor** | Every 2 weeks | Bug fixes, small improvements |
| **Major** | Every 2-3 months | New features (Phase 2, 3) |

### 10.3 Rollback Plan

**If critical issue discovered post-release:**

1. **Stop Phased Release:** App Store Connect → Pause Release
2. **Prepare Hotfix:** Fast-track bug fix build
3. **Expedited Review:** Request expedited App Review
4. **Notify Users:** In-app message or push notification
5. **Communication:** Update social media, support page

---

## APPENDIX A: FASTLANE COMPLETE CONFIGURATION
```ruby
# ios/fastlane/Fastfile

default_platform(:ios)

platform :ios do
  
  # ===== SETUP =====
  
  before_all do
    setup_circle_ci if ENV['CI']
  end
  
  # ===== CERTIFICATES =====
  
  desc "Sync code signing certificates"
  lane :sync_certificates do
    match(
      type: "development",
      app_identifier: [
        "com.exit.app",
        "com.exit.app.DeviceActivityMonitor",
        "com.exit.app.ShieldConfiguration",
        "com.exit.app.ShieldAction"
      ],
      readonly: is_ci
    )
    
    match(
      type: "appstore",
      app_identifier: [
        "com.exit.app",
        "com.exit.app.DeviceActivityMonitor",
        "com.exit.app.ShieldConfiguration",
        "com.exit.app.ShieldAction"
      ],
      readonly: is_ci
    )
  end
  
  # ===== BUILD =====
  
  desc "Build development app"
  lane :build_dev do
    gym(
      workspace: "Exit.xcworkspace",
      scheme: "Exit (Development)",
      export_method: "development"
    )
  end
  
  desc "Build production app"
  lane :build_production do
    sync_certificates
    
    gym(
      workspace: "Exit.xcworkspace",
      scheme: "Exit (Production)",
      export_method: "app-store",
      export_options: {
        provisioningProfiles: {
          "com.exit.app" => "match AppStore com.exit.app",
          "com.exit.app.DeviceActivityMonitor" => "match AppStore com.exit.app.DeviceActivityMonitor",
          "com.exit.app.ShieldConfiguration" => "match AppStore com.exit.app.ShieldConfiguration",
          "com.exit.app.ShieldAction" => "match AppStore com.exit.app.ShieldAction"
        }
      }
    )
  end
  
  # ===== TESTFLIGHT =====
  
  desc "Upload to TestFlight"
  lane :beta do
    ensure_git_status_clean
    sync_certificates
    
    increment_build_number(xcodeproj: "Exit.xcodeproj")
    
    build_production
    
    upload_to_testflight(
      skip_waiting_for_build_processing: true,
      distribute_external: false
    )
    
    commit_version_bump(
      message: "Bump build for TestFlight",
      xcodeproj: "Exit.xcodeproj"
    )
    
    push_to_git_remote
  end
  
  # ===== APP STORE =====
  
  desc "Submit for App Review"
  lane :submit_for_review do
    deliver(
      submit_for_review: true,
      automatic_release: false,
      force: true,
      submission_information: {
        add_id_info_uses_idfa: false,
        export_compliance_uses_encryption: false
      }
    )
  end
  
  desc "Release approved build to App Store"
  lane :release do
    deliver(
      submit_for_review: false,
      automatic_release: true,
      force: true
    )
  end
  
  # ===== VERSIONING =====
  
  desc "Bump patch version"
  lane :bump_patch do
    increment_version_number(
      bump_type: "patch",
      xcodeproj: "Exit.xcodeproj"
    )
  end
  
  desc "Bump minor version"
  lane :bump_minor do
    increment_version_number(
      bump_type: "minor",
      xcodeproj: "Exit.xcodeproj"
    )
  end
  
  desc "Bump major version"
  lane :bump_major do
    increment_version_number(
      bump_type: "major",
      xcodeproj: "Exit.xcodeproj"
    )
  end
  
  # ===== UTILITY =====
  
  desc "Run tests"
  lane :test do
    run_tests(
      workspace: "Exit.xcworkspace",
      scheme: "Exit (Development)",
      devices: ["iPhone 14"]
    )
  end
  
  desc "Generate screenshots"
  lane :screenshots do
    snapshot
  end
  
  # ===== ERROR HANDLING =====
  
  error do |lane, exception|
    slack(
      message: "❌ Lane #{lane} failed: #{exception}",
      success: false
    ) if ENV['SLACK_WEBHOOK']
  end
end
```

---

**Document Status:** DEPLOYMENT READY  
**Last Verified:** January 2, 2026  
**Next Update:** After MVP launch (Week 10)

---
