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
    <view v-if="loading" class="flex items-center justify-center h-96">
      <view class="text-4xl text-gray-300 mb-4">
        <text class="fas fa-spinner fa-spin"></text>
      </view>
    </view>

    <block v-else-if="notification">
      <!-- 通知头部信息 -->
      <view class="p-5 bg-white border-b border-gray-100">
        <view class="flex items-start">
          <view class="flex-shrink-0 mr-4">
            <view
              class="w-12 h-12 rounded-xl flex items-center justify-center"
              :class="getIconBgClass(notification.type)"
            >
              <text class="fas text-2xl" :class="[getIconClass(notification.type), getIconColorClass(notification.type)]"></text>
            </view>
          </view>
          <view class="flex-1">
            <view class="flex flex-wrap gap-2 mb-2">
              <text
                v-for="tag in notification.tags"
                :key="tag.name"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="getTagClass(tag.type)"
              >
                {{ tag.name }}
              </text>
            </view>
            <text class="text-2xl font-bold text-gray-800 leading-tight block mb-1">{{ notification.title }}</text>
            <view class="flex items-center text-gray-500 text-sm mt-2">
              <text class="fas fa-clock mr-2"></text>
              <text>{{ notification.time }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 通知正文 -->
      <view class="p-5 bg-white mt-2">
        <rich-text :nodes="notification.content" class="notification-content"></rich-text>
      </view>

      <!-- 附件列表 -->
      <view v-if="notification.attachments && notification.attachments.length > 0" class="p-5 bg-white mt-2">
        <text class="text-lg font-semibold text-gray-800 mb-3 block">附件</text>
        <view class="space-y-2">
          <view
            v-for="attachment in notification.attachments"
            :key="attachment.name"
            class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-150"
            @tap="previewAttachment(attachment)"
          >
            <view class="flex-shrink-0 mr-3">
              <text
                class="fas text-xl"
                :class="getAttachmentIcon(attachment.type)"
              ></text>
            </view>
            <view class="flex-1 min-w-0">
              <text class="text-base text-gray-800 font-medium truncate block">{{ attachment.name }}</text>
              <text class="text-sm text-gray-500">{{ attachment.size }}</text>
            </view>
            <view class="ml-2">
              <text class="fas fa-download text-gray-400"></text>
            </view>
          </view>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view v-if="notification.actions && notification.actions.length > 0" class="p-5">
        <view class="flex gap-3 flex-wrap">
          <button
            v-for="action in notification.actions"
            :key="action.label"
            @tap="handleAction(action)"
            class="flex-1 flex items-center justify-center px-4 py-3 rounded-lg shadow-sm min-w-[120px]"
            :class="getActionButtonClass(action.type)"
          >
            <text
              v-if="action.icon"
              class="fas mr-2"
              :class="action.icon"
            ></text>
            <text>{{ action.label }}</text>
          </button>
        </view>
      </view>
    </block>

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
import { checkH5 } from '@/utils/platform';
import { getNotificationDetail } from '@/api/notification';

// Reactive state
const notificationId = ref(null);
const notification = ref(null);
const loading = ref(true);
const error = ref(null);
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
