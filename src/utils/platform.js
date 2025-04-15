/**
 * Platform utilities for handling platform-specific code
 * and detecting platform conditions
 */

/**
 * Check if running on H5 platform
 * @returns {boolean} True if running on H5
 */
export function checkH5() {
  // #ifdef H5
  return true;
  // #endif
  
  // #ifndef H5
  return false;
  // #endif
}

/**
 * Check if running on App platform
 * @returns {boolean} True if running on App
 */
export function checkApp() {
  // #ifdef APP-PLUS
  return true;
  // #endif
  
  // #ifndef APP-PLUS
  return false;
  // #endif
}

/**
 * Check if running on iOS platform
 * @returns {boolean} True if running on iOS
 */
export function checkIOS() {
  // Can only check on app or h5
  if (checkH5() || checkApp()) {
    const system = uni.getSystemInfoSync();
    return system.platform === 'ios';
  }
  return false;
}

/**
 * Check if running on Android platform
 * @returns {boolean} True if running on Android
 */
export function checkAndroid() {
  // Can only check on app or h5
  if (checkH5() || checkApp()) {
    const system = uni.getSystemInfoSync();
    return system.platform === 'android';
  }
  return false;
}

/**
 * Check if running on WeChat Mini Program
 * @returns {boolean} True if running on WeChat MP
 */
export function checkWechat() {
  // #ifdef MP-WEIXIN
  return true;
  // #endif
  
  // #ifndef MP-WEIXIN
  return false;
  // #endif
}

/**
 * Execute platform-specific code based on platform
 * @param {Object} options - Platform-specific code objects
 * @param {Function} options.h5 - Code to run on H5
 * @param {Function} options.app - Code to run on App
 * @param {Function} options.wechat - Code to run on WeChat Mini Program
 * @param {Function} options.default - Default code to run
 * @returns {any} Result of platform-specific function execution
 */
export function runByPlatform({ h5, app, wechat, default: defaultFn } = {}) {
  if (checkH5() && typeof h5 === 'function') {
    return h5();
  }
  
  if (checkApp() && typeof app === 'function') {
    return app();
  }
  
  if (checkWechat() && typeof wechat === 'function') {
    return wechat();
  }
  
  if (typeof defaultFn === 'function') {
    return defaultFn();
  }
  
  return null;
}

/**
 * Call a JavaScript handler function in the native context
 * @param {string} name - Handler name
 * @param {Object} data - Data to pass to the handler
 * @param {Function} callback - Callback function
 */
export function callJSHandler(name, data, callback) {
  if (!checkApp()) {
    console.warn(`JSBridge.${name} is only available in App environment`);
    if (typeof callback === 'function') {
      callback({ success: false, message: '只在App环境可用' });
    }
    return;
  }
  
  // #ifdef APP-PLUS
  try {
    if (plus.os.name === 'iOS') {
      if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers[name]) {
        window.webkit.messageHandlers[name].postMessage(data);
      } else {
        console.warn(`iOS bridge ${name} not found`);
        if (typeof callback === 'function') {
          callback({ success: false, message: '未找到原生方法' });
        }
      }
    } else if (plus.os.name === 'Android') {
      if (window.android && typeof window.android[name] === 'function') {
        window.android[name](JSON.stringify(data));
      } else {
        console.warn(`Android bridge ${name} not found`);
        if (typeof callback === 'function') {
          callback({ success: false, message: '未找到原生方法' });
        }
      }
    }
  } catch (error) {
    console.error(`Error calling native bridge: ${error.message}`);
    if (typeof callback === 'function') {
      callback({ success: false, message: error.message });
    }
  }
  // #endif
  
  // Fallback for non-app environments
  // #ifndef APP-PLUS
  console.warn(`JSBridge.${name} is only available in App environment`);
  if (typeof callback === 'function') {
    callback({ success: false, message: '只在App环境可用' });
  }
  // #endif
}

/**
 * Get safe area insets
 * @returns {Object} Safe area insets
 */
export function getSafeAreaInsets() {
  try {
    const system = uni.getSystemInfoSync();
    return {
      top: system.safeAreaInsets?.top || 0,
      right: system.safeAreaInsets?.right || 0,
      bottom: system.safeAreaInsets?.bottom || 0,
      left: system.safeAreaInsets?.left || 0
    };
  } catch (error) {
    console.error('Failed to get safe area insets:', error);
    return { top: 0, right: 0, bottom: 0, left: 0 };
  }
}

/**
 * Get device information
 * @returns {Object} Device information
 */
export function getDeviceInfo() {
  try {
    const system = uni.getSystemInfoSync();
    return {
      brand: system.brand,
      model: system.model,
      platform: system.platform,
      system: system.system,
      screenWidth: system.screenWidth,
      screenHeight: system.screenHeight,
      windowWidth: system.windowWidth,
      windowHeight: system.windowHeight,
      statusBarHeight: system.statusBarHeight,
      language: system.language,
      version: system.version,
      SDKVersion: system.SDKVersion
    };
  } catch (error) {
    console.error('Failed to get device info:', error);
    return {};
  }
} 