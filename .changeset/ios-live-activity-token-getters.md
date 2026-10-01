---
'@use-voltra/ios-client': minor
---

Live Activity push tokens can now be read at any time with `getPushToStartToken()` and
`getActivityPushTokens()`, instead of only through events. `areActivitiesEnabled()` tells whether the
person allows Live Activities for the app. Apps that subscribe late, such as after a
headless launch or once the user signs in, no longer miss a token that was already emitted.
