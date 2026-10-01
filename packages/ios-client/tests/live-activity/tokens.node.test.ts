import { Platform } from 'react-native'

import { getNativeVoltra, type Spec } from '../../src/VoltraModule.js'
import { areActivitiesEnabled, getActivityPushTokens, getPushToStartToken } from '../../src/live-activity/api.js'

jest.mock('react-native', () => ({
  Platform: { OS: 'ios' },
}))

jest.mock('../../src/VoltraModule.js', () => ({ getNativeVoltra: jest.fn() }))

const mockedGetNativeVoltra = jest.mocked(getNativeVoltra)
const mockedPlatform = Platform as { OS: string }

describe('Live Activity token getters', () => {
  afterEach(() => {
    mockedPlatform.OS = 'ios'
    jest.clearAllMocks()
  })

  it('reads the push-to-start token from the native module', async () => {
    const getPushToStartTokenNative = jest.fn<Promise<string | null>, []>().mockResolvedValue('abc123')
    mockedGetNativeVoltra.mockReturnValue({ getPushToStartToken: getPushToStartTokenNative } as unknown as Spec)

    await expect(getPushToStartToken()).resolves.toBe('abc123')
    expect(getPushToStartTokenNative).toHaveBeenCalledTimes(1)
  })

  it('reads the update tokens of running activities from the native module', async () => {
    const tokens = [{ activityName: 'order-123', pushToken: 'def456' }]
    const getActivityPushTokensNative = jest.fn<Promise<typeof tokens>, []>().mockResolvedValue(tokens)
    mockedGetNativeVoltra.mockReturnValue({ getActivityPushTokens: getActivityPushTokensNative } as unknown as Spec)

    await expect(getActivityPushTokens()).resolves.toEqual(tokens)
  })

  it('reads whether Live Activities are enabled from the native module', () => {
    const areActivitiesEnabledNative = jest.fn<boolean, []>().mockReturnValue(true)
    mockedGetNativeVoltra.mockReturnValue({ areActivitiesEnabled: areActivitiesEnabledNative } as unknown as Spec)

    expect(areActivitiesEnabled()).toBe(true)
    expect(areActivitiesEnabledNative).toHaveBeenCalledTimes(1)
  })

  it('returns empty values without touching the native module off Apple platforms', async () => {
    mockedPlatform.OS = 'android'

    await expect(getPushToStartToken()).resolves.toBeNull()
    await expect(getActivityPushTokens()).resolves.toEqual([])
    expect(areActivitiesEnabled()).toBe(false)
    expect(mockedGetNativeVoltra).not.toHaveBeenCalled()
  })
})
