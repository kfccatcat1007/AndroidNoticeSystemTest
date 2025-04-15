/**
 * UniApp API Utilities
 * Common wrappers and helpers around uni-app APIs to simplify usage
 */

/**
 * Show a toast message
 * @param {string} message - Message to display
 * @param {number} duration - Duration in milliseconds
 * @param {string} icon - Icon type: 'none', 'success', 'loading', 'error'
 * @returns {Promise} Promise that resolves when toast is shown
 */
export function Toast(message, duration = 1500, icon = 'none') {
  return new Promise((resolve) => {
    uni.showToast({
      title: message,
      icon,
      duration,
      success: resolve,
      fail: resolve // Resolve even on fail to avoid hanging promises
    });
  });
}

/**
 * Show a loading indicator
 * @param {string} title - Loading text
 * @returns {Promise} Promise that resolves when loading is shown
 */
export function showLoading(title = '加载中...') {
  return new Promise((resolve) => {
    uni.showLoading({
      title,
      mask: true,
      success: resolve,
      fail: resolve
    });
  });
}

/**
 * Hide loading indicator
 */
export function hideLoading() {
  uni.hideLoading();
}

/**
 * Show a modal dialog
 * @param {Object} options - Dialog options
 * @param {string} options.title - Dialog title
 * @param {string} options.content - Dialog content
 * @param {string} options.confirmText - Confirm button text
 * @param {string} options.cancelText - Cancel button text
 * @param {boolean} options.showCancel - Whether to show cancel button
 * @returns {Promise<boolean>} Promise resolving to true if confirmed, false if cancelled
 */
export function showModal({
  title = '提示',
  content = '',
  confirmText = '确定',
  cancelText = '取消',
  showCancel = true
} = {}) {
  return new Promise((resolve) => {
    uni.showModal({
      title,
      content,
      confirmText,
      cancelText,
      showCancel,
      success: (res) => {
        resolve(res.confirm);
      },
      fail: () => {
        resolve(false);
      }
    });
  });
}

/**
 * Navigate to a page
 * @param {string} url - Page URL
 * @param {Object} params - Parameters to pass
 * @returns {Promise} Promise that resolves when navigation completes
 */
export function navigateTo(url, params = {}) {
  // Add query params if any
  if (Object.keys(params).length > 0) {
    const query = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    url = url.includes('?') ? `${url}&${query}` : `${url}?${query}`;
  }

  return new Promise((resolve, reject) => {
    uni.navigateTo({
      url,
      success: resolve,
      fail: reject
    });
  });
}

/**
 * Navigate back
 * @param {number} delta - Number of pages to go back
 * @returns {Promise} Promise that resolves when navigation completes
 */
export function navigateBack(delta = 1) {
  return new Promise((resolve) => {
    uni.navigateBack({
      delta,
      success: resolve,
      fail: resolve
    });
  });
}

/**
 * Switch to a tab
 * @param {string} url - Tab URL
 * @returns {Promise} Promise that resolves when tab switch completes
 */
export function switchTab(url) {
  return new Promise((resolve, reject) => {
    uni.switchTab({
      url,
      success: resolve,
      fail: reject
    });
  });
}

/**
 * Get system info
 * @returns {Promise<Object>} System info
 */
export function getSystemInfo() {
  return new Promise((resolve, reject) => {
    uni.getSystemInfo({
      success: resolve,
      fail: reject
    });
  });
}

/**
 * Check if running on H5 platform
 * @returns {boolean} True if running on H5
 */
export function isH5() {
  // #ifdef H5
  return true;
  // #endif
  
  // #ifndef H5
  return false;
  // #endif
}

/**
 * Check if running on specific platform
 * @param {string} platform - Platform to check ('app-plus', 'h5', 'mp-weixin', etc.)
 * @returns {boolean} True if running on specified platform
 */
export function isPlatform(platform) {
  const systemInfo = uni.getSystemInfoSync();
  return systemInfo.platform === platform;
}

/**
 * Set clipboard data
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Promise resolving to success state
 */
export function setClipboardData(text) {
  return new Promise((resolve) => {
    uni.setClipboardData({
      data: text,
      success: () => resolve(true),
      fail: () => resolve(false)
    });
  });
}

/**
 * Get clipboard data
 * @returns {Promise<string>} Promise resolving to clipboard content
 */
export function getClipboardData() {
  return new Promise((resolve, reject) => {
    uni.getClipboardData({
      success: (res) => resolve(res.data),
      fail: reject
    });
  });
}

/**
 * Download file
 * @param {string} url - File URL
 * @param {Object} options - Download options
 * @returns {Promise<Object>} Promise resolving to download result
 */
export function downloadFile(url, options = {}) {
  return new Promise((resolve, reject) => {
    uni.downloadFile({
      url,
      ...options,
      success: resolve,
      fail: reject
    });
  });
}

/**
 * Open document
 * @param {string} filePath - File path
 * @returns {Promise<boolean>} Promise resolving to success state
 */
export function openDocument(filePath) {
  return new Promise((resolve) => {
    uni.openDocument({
      filePath,
      success: () => resolve(true),
      fail: () => resolve(false)
    });
  });
} 