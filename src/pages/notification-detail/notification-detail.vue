<template>
  <view class="flex flex-col bg-gray-50 min-h-screen font-sans">
    <!-- 状态栏 -->
    <uni-status-bar bgColor="#3B82F6"></uni-status-bar>
    
    <!-- 顶部导航 -->
    <view class="bg-blue-500 text-white">
      <view class="px-4 py-4 flex items-center justify-between">
        <view @tap="goBack" class="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:bg-white/20 transition-colors duration-150">
          <text class="fas fa-arrow-left text-white"></text>
        </view>
        <text class="text-lg font-semibold">通知详情</text>
        <view class="w-10 h-10"></view> <!-- Placeholder for spacing -->
      </view>
    </view>

    <!-- 主要内容区 -->
    <view v-if="loading" class="flex flex-col items-center justify-center h-screen">
      <view class="loading-spinner"></view>
      <text class="mt-3 text-gray-600">加载中...</text>
    </view>

    <view v-else-if="notification" class="notification-detail-container">
      <view class="notification-header px-4 py-3 bg-blue-500 text-white">
        <view class="flex items-center mb-2">
          <text class="text-lg font-bold">{{ notification.title }}</text>
        </view>
        <view class="flex items-center text-sm text-gray-100">
          <text>{{ notification.date }}</text>
        </view>
      </view>
      
      <!-- Replace the existing rich-text with AdaptiveHtmlContent -->
      <AdaptiveHtmlContent 
        :html="notification.content"
        height="auto"
        :dark-mode="false"
        @error="handleContentError"
        @loaded="handleContentLoaded"
      />
      
      <!-- Add metadata section after content -->
      <view v-if="notification.date || notification.author" class="px-4 py-3 text-sm text-gray-500 border-t border-gray-200">
        <view v-if="notification.author" class="mb-1">
          <text class="font-medium">发布者：</text>
          <text>{{ notification.author }}</text>
        </view>
        <view v-if="notification.department" class="mb-1">
          <text class="font-medium">发布部门：</text>
          <text>{{ notification.department }}</text>
        </view>
        <view v-if="notification.date" class="mb-1">
          <text class="font-medium">发布日期：</text>
          <text>{{ notification.date }}</text>
        </view>
      </view>
    </view>

    <!-- 错误状态 -->
    <view v-else-if="error" class="flex flex-col items-center justify-center py-16 px-6">
      <view class="text-red-500 text-5xl mb-4">
        <text class="fas fa-exclamation-circle"></text>
      </view>
      <text class="text-xl font-medium text-gray-700 mb-2">加载失败</text>
      <text class="text-base text-gray-500 text-center mb-6">{{ error }}</text>
      <button 
        @tap="loadNotification" 
        class="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        <text class="fas fa-sync-alt mr-2"></text>
        <text>重试</text>
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed, nextTick } from 'vue';
import { onLoad, onShow, onReady, onHide } from '@dcloudio/uni-app';
import { useNotificationStore } from '@/store/notification';
import { storeToRefs } from 'pinia';
import { checkH5, checkAndroid } from '@/utils/platform'; // Import checkAndroid
import { getNotificationDetail } from '@/api/notification';
import { stripHtmlForAndroidRichText, htmlToPlainText } from '@/utils/htmlUtils'; // Import HTML utils
import AdaptiveHtmlContent from '@/components/AdaptiveHtmlContent.vue';

// Reactive state
const notificationId = ref(null);
const notification = ref(null);
const loading = ref(true);
const error = ref(null);
const renderError = ref(false); // State for rich-text rendering error
const scrollViewElement = ref(null);

// Store initialization - must be deferred until app is ready
let notificationStore = null;

// Lifecycle hooks
onLoad((option) => {
  if (option.id) {
    notificationId.value = option.id;
  }
});

onReady(() => {
  // DOM is ready here
  // Initialize store after component is mounted to ensure Pinia is active
  initializeStore();
});

onShow(() => {
  // If store exists and notification ID is available, fetch data
  if (notificationStore && notificationId.value) {
    initializeAndFetchData();
  }
});

onHide(() => {
  // Reset state when navigating away
  loading.value = true;
  error.value = null;
});

// Initialize Pinia store
function initializeStore() {
  try {
    notificationStore = useNotificationStore();
    
    // If notification ID is already available, fetch data immediately
    if (notificationId.value) {
      initializeAndFetchData();
    }
  } catch (err) {
    console.error('Failed to initialize store:', err);
    error.value = '应用初始化失败，请重新打开应用';
    loading.value = false;
  }
}

// Fetch notification details
async function initializeAndFetchData() {
  if (!notificationId.value || !notificationStore) {
    error.value = '无效的通知ID或存储未初始化';
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    // Get notification from store by ID - fallback to API call if not found
    let result = notificationStore.getNotificationById(notificationId.value);
    
    // If not found in store, use API
    if (!result) {
      // Use imported API function instead of require
      result = await getNotificationDetail(notificationId.value);
      
      if (result) {
        // Update the store with the fetched notification
        notificationStore.markAsRead(notificationId.value);
      }
    } else {
      // Mark as read if found in store and not read yet
      if (result && !result.isRead) {
        notificationStore.markAsRead(notificationId.value);
      }
    }
    
    // Update local state
    notification.value = result;
    loading.value = false;
    
    // Scroll to top after content loads
    await nextTick();
    resetScroll();
  } catch (err) {
    handleError(err);
  }
}

// Safely reset scroll position
function resetScroll() {
  nextTick(() => {
    try {
      // Use uni-app API instead of DOM
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 0
      });
    } catch (err) {
      console.error('Failed to reset scroll position:', err);
    }
  });
}

// Handle errors
function handleError(err) {
  console.error('Error fetching notification:', err);
  error.value = err.message || '获取通知详情失败';
  loading.value = false;
  uni.showToast({
    title: '获取通知详情失败',
    icon: 'none',
    duration: 2000
  });
}

// Navigation
function goBack() {
  try {
    uni.navigateBack();
  } catch (err) {
    console.error('Navigation back failed:', err);
    uni.switchTab({
      url: '/pages/notification/notification'
    });
  }
}

// Download attachment
function downloadAttachment(attachment) {
  if (!attachment || !attachment.url) {
    uni.showToast({
      title: '无效的附件链接',
      icon: 'none',
      duration: 2000
    });
    return;
  }

  const platform = uni.getSystemInfoSync().platform;
  if (platform === 'h5') {
    // For browser environment
    window.open(attachment.url, '_blank');
  } else {
    // For app environment
    uni.showLoading({
      title: '下载中...'
    });
    
    uni.downloadFile({
      url: attachment.url,
      success: (res) => {
        if (res.statusCode === 200) {
          uni.hideLoading();
          uni.showToast({
            title: '下载成功',
            icon: 'success',
            duration: 2000
          });
          
          // Open the file
          uni.openDocument({
            filePath: res.tempFilePath,
            success: () => {
              console.log('File opened successfully');
            },
            fail: (err) => {
              console.error('Failed to open file:', err);
              uni.showToast({
                title: '无法打开文件',
                icon: 'none',
                duration: 2000
              });
            }
          });
        }
      },
      fail: (err) => {
        uni.hideLoading();
        console.error('Download failed:', err);
        uni.showToast({
          title: '下载失败',
          icon: 'none',
          duration: 2000
        });
      }
    });
  }
}

// Computed properties
function getTagClass(type) {
  switch (type) {
    case 'important':
      return 'bg-red-100 text-red-800';
    case 'info':
      return 'bg-blue-100 text-blue-800';
    case 'success':
      return 'bg-green-100 text-green-800';
    case 'warning':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

// Attachment functions
function getAttachmentIcon(type) {
  const typeLower = type?.toLowerCase() || '';
  if (typeLower.includes('pdf')) return 'fa-file-pdf';
  if (typeLower.includes('doc') || typeLower.includes('word')) return 'fa-file-word';
  if (typeLower.includes('xls') || typeLower.includes('excel')) return 'fa-file-excel';
  if (typeLower.includes('ppt') || typeLower.includes('powerpoint')) return 'fa-file-powerpoint';
  if (typeLower.includes('jpg') || typeLower.includes('jpeg') || typeLower.includes('png') || typeLower.includes('gif')) return 'fa-file-image';
  if (typeLower.includes('zip') || typeLower.includes('rar') || typeLower.includes('7z')) return 'fa-file-archive';
  if (typeLower.includes('txt') || typeLower.includes('text')) return 'fa-file-alt';
  return 'fa-file';
}

function getIconBgClass(type) {
  const typeLower = type?.toLowerCase() || '';
  if (typeLower.includes('pdf')) return 'bg-red-100';
  if (typeLower.includes('doc') || typeLower.includes('word')) return 'bg-blue-100';
  if (typeLower.includes('xls') || typeLower.includes('excel')) return 'bg-green-100';
  if (typeLower.includes('ppt') || typeLower.includes('powerpoint')) return 'bg-orange-100';
  if (typeLower.includes('jpg') || typeLower.includes('jpeg') || typeLower.includes('png') || typeLower.includes('gif')) return 'bg-purple-100';
  if (typeLower.includes('zip') || typeLower.includes('rar') || typeLower.includes('7z')) return 'bg-yellow-100';
  if (typeLower.includes('txt') || typeLower.includes('text')) return 'bg-gray-100';
  return 'bg-gray-100';
}

function getIconColorClass(type) {
  const typeLower = type?.toLowerCase() || '';
  if (typeLower.includes('pdf')) return 'text-red-700';
  if (typeLower.includes('doc') || typeLower.includes('word')) return 'text-blue-700';
  if (typeLower.includes('xls') || typeLower.includes('excel')) return 'text-green-700';
  if (typeLower.includes('ppt') || typeLower.includes('powerpoint')) return 'text-orange-700';
  if (typeLower.includes('jpg') || typeLower.includes('jpeg') || typeLower.includes('png') || typeLower.includes('gif')) return 'text-purple-700';
  if (typeLower.includes('zip') || typeLower.includes('rar') || typeLower.includes('7z')) return 'text-yellow-700';
  if (typeLower.includes('txt') || typeLower.includes('text')) return 'text-gray-700';
  return 'text-gray-700';
}

// Computed property for processed content
const processedContent = computed(() => {
  if (!notification.value?.content) return '';
  
  // On Android, strip HTML aggressively; otherwise, use original
  if (checkAndroid()) {
    console.log('Android detected, stripping HTML for rich-text');
    return stripHtmlForAndroidRichText(notification.value.content);
  } else {
    return notification.value.content;
  }
});

// Computed property for plain text fallback
const plainTextContent = computed(() => {
  if (!notification.value?.content) return '';
  return htmlToPlainText(notification.value.content);
});

// Handle rich-text rendering errors
function handleRenderError(e) {
  console.error('Rich-text render error:', e.detail);
  renderError.value = true; // Set flag to switch to plain text view
  uni.showToast({
    title: '内容加载异常，切换至兼容模式',
    icon: 'none',
    duration: 2500
  });
  // Optionally log this error to a remote service
}

// Handle button actions (if any)
function handleAction(action) {
  console.log('Action clicked:', action);
  uni.showToast({
    title: `执行操作: ${action.label}`,
    icon: 'none'
  });
  // Implement actual action logic here based on action.type or action.payload
}

// Preview attachment (placeholder for actual preview logic)
function previewAttachment(attachment) {
  console.log('Preview attachment:', attachment);
  // Attempt to download and open
  downloadAttachment(attachment); 
}

// Reload notification data
function loadNotification() {
  if (notificationId.value) {
    initializeAndFetchData();
  } else {
    uni.showToast({ title: '无法重试：通知ID丢失', icon: 'none' });
  }
}

// Add error handling function
function handleContentError(error) {
  console.error('Notification content error:', error);
  // You can add additional error handling here if needed
}

// Add content loaded handler
function handleContentLoaded() {
  console.log('Notification content loaded successfully');
  // Potentially implement additional logic here,
  // such as analytics tracking or UI adjustments
}

</script>

<style scoped>
/* Import Tailwind base styles */
@import '@/tailwind.css';
/* Import custom styles */
@import '@/static/css/custom.css';
/* Import FontAwesome from node_modules */
@import '@fortawesome/fontawesome-free/css/all.min.css';

/* Scoped styles specific to notification detail page */
.prose {
  /* Enhance prose styling for better readability */
  line-height: 1.75; /* Increased line height */
  color: #374151; /* Equivalent to text-gray-700, ensure consistency */
}
.prose p {
  margin-bottom: 1.25rem; /* Increased paragraph spacing */
}
.prose h3 {
  font-size: 1.25rem; /* Slightly larger headings */
  font-weight: 600;
  margin-top: 2rem; /* More space above headings */
  margin-bottom: 1rem; /* More space below headings */
  padding-bottom: 0.25rem;
  border-bottom: 1px solid #e5e7eb; /* Subtle separator */
  color: #1f2937; /* Darker heading color */
}
.prose ol, .prose ul {
  margin-bottom: 1.25rem;
  padding-left: 1.75rem; /* Deeper indent */
}
.prose li {
   margin-bottom: 0.6rem; /* Slightly more space between list items */
}
.prose strong {
  font-weight: 600; /* Use semibold instead of bold for subtlety */
  color: #111827; /* Slightly darker strong text */
}
.prose a {
    color: #3b82f6; /* text-blue-500 */
    text-decoration: none;
}
.prose a:hover {
    text-decoration: underline;
}
.prose .text-right {
    text-align: right;
}
.prose .mt-6 {
    margin-top: 1.5rem;
}

/* Ensure rich-text content flows correctly */
rich-text {
    display: block;
    word-wrap: break-word; /* Prevent long words from overflowing */
}

/* Improve button effect slightly */
.btn-effect:active {
  opacity: 0.8;
}

/* Hide scrollbar consistently */
.hide-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera*/
}
.hide-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

/* Add safe area padding for bottom */
.safe-bottom {
  padding-bottom: constant(safe-area-inset-bottom); /* iOS < 11.2 */
  padding-bottom: env(safe-area-inset-bottom); /* iOS >= 11.2 */
}
</style>
