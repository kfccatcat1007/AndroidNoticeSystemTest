<template>
  <view class="flex flex-col h-screen bg-gray-50 font-sans">
    <!-- 状态栏 -->
    <uni-status-bar bgColor="#FFFFFF"></uni-status-bar>
    
    <!-- 顶部导航 -->
    <view class="sticky top-0 z-10 bg-white shadow-sm">
      <view class="px-5 py-4 flex items-center justify-center border-b border-gray-100">
        <text class="text-xl font-semibold text-gray-800">公司通知</text>
      </view>
      <!-- 分类选项卡 - Use scroll-view for horizontal scrolling -->
      <scroll-view scroll-x class="px-2 flex whitespace-nowrap border-b border-gray-100 hide-scrollbar bg-white">
        <button
          v-for="category in categories"
          :key="category.id"
          @tap="switchCategory(category.id)"
          class="px-4 py-3.5 inline-block font-medium text-base rounded-md hover:bg-gray-100 transition-colors duration-150 mx-1"
          :class="activeCategory === category.id ? 'text-blue-600 border-b-2 border-blue-600 rounded-b-none' : 'text-gray-600'"
        >
          {{ category.name }}
        </button>
      </scroll-view>
    </view>

    <!-- 通知列表 - Use scroll-view for vertical scrolling -->
    <scroll-view scroll-y class="flex-1 hide-scrollbar pb-4 bg-gray-50" @scrolltolower="handleScrollToLower">
      <!-- 内容加载中显示加载状态 -->
      <view v-if="isInitialLoad" class="flex flex-col items-center justify-center h-96">
        <view class="text-4xl text-gray-300 mb-4">
          <text class="fas fa-spinner fa-spin"></text>
        </view>
        <text class="text-base text-gray-500">加载中...</text>
      </view>

      <!-- 有通知内容时显示通知列表 -->
      <block v-else-if="filteredNotifications.length > 0">
        <view v-for="group in groupedNotifications" :key="group.date" class="pt-6 px-4">
          <text class="text-base font-semibold text-gray-600 mb-3 block px-1">{{ formatDateGroup(group.date) }}</text>

          <!-- 通知项 -->
          <navigator
            v-for="notification in group.items"
            :key="notification.id"
            :url="'/pages/notification-detail/notification-detail?id=' + notification.id"
            class="block bg-white rounded-lg shadow mb-3.5 overflow-hidden transition-shadow duration-150 card-hover"
            hover-class="bg-gray-50"
          >
            <view class="p-5">
              <view class="flex items-start">
                <view class="flex-shrink-0 mr-4">
                  <view
                    class="w-11 h-11 rounded-lg flex items-center justify-center"
                    :class="getIconBgClass(notification.type)"
                  >
                    <text class="fas text-xl" :class="[getIconClass(notification.type), getIconColorClass(notification.type)]"></text>
                  </view>
                </view>
                <view class="flex-1 min-w-0">
                  <view class="flex justify-between items-center mb-1">
                    <view class="flex items-center">
                      <text class="text-lg font-semibold text-gray-800 truncate pr-2">{{ notification.title }}</text>
                      <view v-if="!notification.isRead" class="w-2 h-2 rounded-full bg-red-500 ml-1"></view>
                    </view>
                    <text class="text-sm text-gray-500 ml-2 whitespace-nowrap flex-shrink-0">{{ notification.time }}</text>
                  </view>
                  <view class="mt-1.5 flex flex-wrap gap-2 mb-2">
                    <text
                      v-for="tag in notification.tags"
                      :key="tag.name"
                      class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                      :class="getTagClass(tag.type)"
                    >
                      {{ tag.name }}
                    </text>
                  </view>
                  <text class="mt-2 text-base text-gray-600 line-clamp-2 block leading-snug">
                    {{ notification.summary }}
                  </text>
                </view>
              </view>
            </view>
          </navigator>
        </view>

        <!-- Loading indicator for pagination -->
        <view v-if="loadingMore" class="py-6 text-center text-gray-500 flex items-center justify-center">
          <text class="fas fa-spinner fa-spin mr-2 text-lg"></text> <text class="text-base">加载中...</text>
        </view>
        <view v-if="!hasMore && filteredNotifications.length > 0" class="py-6 text-center text-gray-400 text-base">
          - 没有更多了 -
        </view>
      </block>

      <!-- 空状态 - 没有通知时显示 -->
      <view v-else class="flex flex-col items-center justify-center py-16 px-6">
        <view class="text-gray-300 text-5xl mb-4">
          <text class="fas fa-inbox"></text>
        </view>
        <text class="text-xl font-medium text-gray-500 mb-2">暂无通知</text>
        <text class="text-sm text-gray-400 text-center mb-6">
          {{ getEmptyStateMessage(activeCategory) }}
        </text>
        <button 
          @tap="refreshNotifications" 
          class="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <text class="fas fa-sync-alt mr-2"></text>
          <text>刷新</text>
        </button>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed, reactive, onMounted, nextTick } from 'vue';
import { onLoad, onShow, onReachBottom, onPullDownRefresh } from '@dcloudio/uni-app';
import { useNotificationStore } from '@/store/notification';

// 定义本地响应式状态
const activeCategory = ref('all');
const loadingMore = ref(false);
const hasMore = ref(true);
const currentPage = ref(1);
const notificationsPerPage = ref(10);
const isInitialLoad = ref(true);
const isRefreshing = ref(false);
const loadError = ref(null);
const scrollerRef = ref(null);

// 定义通知分类
const categories = [
  { id: 'all', name: '全部' },
  { id: 'unread', name: '未读' },
  { id: 'system', name: '系统' },
  { id: 'activity', name: '活动' }
];

// 使用Pinia store
const notificationStore = ref(null);

// 在组件挂载后初始化store
onMounted(() => {
  notificationStore.value = useNotificationStore();
  // 确保DOM元素渲染完成后再初始化
  nextTick(() => {
    console.log('Component mounted, DOM ready');
  });
});

// 生命周期钩子：页面加载时
onLoad(() => {
  console.log('Notifications page loaded');
  // 延迟初始化，确保Pinia和DOM都已准备好
  setTimeout(() => {
    initNotifications();
  }, 100);
});

// 生命周期钩子：页面显示时（如从详情页返回）
onShow(() => {
  console.log('Notifications page shown');
  // 如果不是初始加载，则刷新数据
  if (!isInitialLoad.value && notificationStore.value) {
    refreshNotifications();
  }
});

// 生命周期钩子：下拉刷新
onPullDownRefresh(() => {
  console.log('Pull down refresh triggered');
  refreshNotifications();
});

// 生命周期钩子：触底加载更多
onReachBottom(() => {
  console.log('Reached bottom of the page');
  if (hasMore.value && !loadingMore.value && notificationStore.value) {
    loadMore();
  }
});

// 计算属性：根据当前分类过滤通知列表
const filteredNotifications = computed(() => {
  if (!notificationStore.value) return [];
  
  // 使用本地过滤，根据当前分页获取数据
  const result = notificationStore.value.getLocalNotifications({
    page: 1,
    pageSize: currentPage.value * notificationsPerPage.value,
    type: activeCategory.value
  });
  
  return result.list;
});

// 计算属性：按日期分组并分页的通知
const groupedNotifications = computed(() => {
  if (!notificationStore.value) return [];
  
  const endIndex = currentPage.value * notificationsPerPage.value;
  const paginatedItems = filteredNotifications.value.slice(0, endIndex);
  
  // 按日期分组 - 使用dateGroup属性进行分组
  const grouped = {};
  paginatedItems.forEach(notification => {
    const dateGroup = notification.dateGroup || '未分类';
    
    if (!grouped[dateGroup]) {
      grouped[dateGroup] = {
        date: dateGroup,
        items: []
      };
    }
    
    grouped[dateGroup].items.push(notification);
  });
  
  // 将分组转换为日期顺序排序的数组
  return Object.values(grouped).sort((a, b) => {
    // 优先处理"今日"和"昨日"
    if (a.date === '今日') return -1;
    if (b.date === '今日') return 1;
    if (a.date === '昨日') return -1;
    if (b.date === '昨日') return 1;
    
    // 其他日期按照日期逆序排列（新的在前）
    if (a.date.includes('-') && b.date.includes('-')) {
      return new Date(b.date) - new Date(a.date);
    }
    
    return 0;
  });
});

// 格式化日期分组显示
const formatDateGroup = (dateGroup) => {
  if (dateGroup === '今日' || dateGroup === '昨日') {
    return dateGroup;
  }
  
  if (dateGroup.includes('-')) {
    // 将 YYYY-MM-DD 格式转换为更友好的显示方式
    const date = new Date(dateGroup);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // 如果是当年，只显示月日
    const currentYear = new Date().getFullYear();
    if (year === currentYear) {
      return `${month}月${day}日`;
    }
    
    return `${year}年${month}月${day}日`;
  }
  
  return dateGroup;
};

// 计算属性：未读通知数量
const unreadCount = computed(() => {
  if (!notificationStore.value) return 0;
  return notificationStore.value.unreadCount || 0;
});

// 方法：切换通知分类
const switchCategory = (category) => {
  console.log(`Switching to category: ${category}`);
  if (activeCategory.value === category) return;
  
  activeCategory.value = category;
  // 重置分页
  currentPage.value = 1;
  hasMore.value = true;
  
  // 检查是否需要加载更多数据
  checkAndLoadMore();
};

// 方法：检查并加载更多
const checkAndLoadMore = () => {
  if (filteredNotifications.value.length <= notificationsPerPage.value && hasMore.value && notificationStore.value) {
    loadMore();
  }
};

// 方法：初始化通知列表
const initNotifications = () => {
  if (!notificationStore.value) {
    console.warn('Store not yet initialized, retrying in 100ms');
    setTimeout(initNotifications, 100);
    return;
  }
  
  try {
    isInitialLoad.value = true;
    loadError.value = null;
    
    // 重置状态
    currentPage.value = 1;
    hasMore.value = true;
    
    console.log('Initializing notifications list');
    
    // 直接从本地store获取通知，无需API调用
    const result = notificationStore.value.getLocalNotifications({
      page: 1,
      pageSize: notificationsPerPage.value,
      type: activeCategory.value
    });
    
    // 设置分页状态
    hasMore.value = result.pagination.hasMore;
    
    // 无需更新store，因为数据已经在store中
  } catch (error) {
    console.error('Failed to initialize notifications:', error);
    loadError.value = '加载失败，请下拉刷新重试';
    uni.showToast({
      title: '加载失败，请下拉刷新重试',
      icon: 'none'
    });
  } finally {
    isInitialLoad.value = false;
    uni.stopPullDownRefresh(); // 确保停止下拉刷新动画
  }
};

// 方法：刷新通知列表
const refreshNotifications = () => {
  if (!notificationStore.value) {
    console.warn('Store not yet initialized');
    uni.stopPullDownRefresh();
    return;
  }
  
  try {
    isRefreshing.value = true;
    loadError.value = null;
    
    // 重置分页状态
    currentPage.value = 1;
    hasMore.value = true;
    
    console.log('Refreshing notifications list');
    
    // 直接从本地store获取通知，无需API调用
    const result = notificationStore.value.getLocalNotifications({
      page: 1,
      pageSize: notificationsPerPage.value,
      type: activeCategory.value
    });
    
    // 设置分页状态
    hasMore.value = result.pagination.hasMore;
    
    uni.showToast({
      title: '刷新成功',
      icon: 'success',
      duration: 1500
    });
  } catch (error) {
    console.error('Failed to refresh notifications:', error);
    loadError.value = '刷新失败，请重试';
    uni.showToast({
      title: '刷新失败，请重试',
      icon: 'none'
    });
  } finally {
    isRefreshing.value = false;
    isInitialLoad.value = false;
    uni.stopPullDownRefresh(); // 停止下拉刷新动画
  }
};

// 方法：加载更多通知
const loadMore = () => {
  if (loadingMore.value || !hasMore.value || !notificationStore.value) return;
  
  try {
    loadingMore.value = true;
    console.log(`Loading more notifications, page ${currentPage.value + 1}`);
    
    // 直接从本地store获取更多通知
    const result = notificationStore.value.getLocalNotifications({
      page: currentPage.value + 1,
      pageSize: notificationsPerPage.value,
      type: activeCategory.value
    });
    
    if (result && result.list.length > 0) {
      // 分页+1
      currentPage.value++;
      // 更新是否有更多数据
      hasMore.value = result.pagination.hasMore;
    } else {
      // 没有更多数据
      hasMore.value = false;
    }
    
    loadError.value = null;
  } catch (error) {
    console.error('Failed to load more notifications:', error);
    loadError.value = '加载失败，请重试';
    uni.showToast({
      title: '加载失败，请重试',
      icon: 'none'
    });
  } finally {
    loadingMore.value = false;
  }
};

// 方法：标记所有通知为已读
const markAllNotificationsAsRead = () => {
  if (!notificationStore.value) return;
  
  try {
    console.log('Marking all notifications as read');
    // 直接使用store方法标记所有为已读
    notificationStore.value.markAllAsRead();
    
    uni.showToast({
      title: '已全部标为已读',
      icon: 'success'
    });
  } catch (error) {
    console.error('Failed to mark all as read:', error);
    uni.showToast({
      title: '操作失败，请重试',
      icon: 'none'
    });
  }
};

// 方法：查看通知详情
const viewNotificationDetail = (notification) => {
  if (!notification) return;
  
  console.log(`Viewing notification detail: ${notification.id}`);
  uni.navigateTo({
    url: `/pages/notification-detail/notification-detail?id=${notification.id}`
  });
};

// --- Helper functions for dynamic classes ---

const getIconBgClass = (type) => {
  switch (type) {
    case 'meeting': return 'bg-blue-100';
    case 'activity': return 'bg-green-100';
    case 'department': return 'bg-purple-100';
    case 'announcement': return 'bg-yellow-100';
    default: return 'bg-gray-100';
  }
};

const getIconClass = (type) => {
  switch (type) {
    case 'meeting': return 'fa-bullhorn';
    case 'activity': return 'fa-calendar-alt';
    case 'department': return 'fa-users';
    case 'announcement': return 'fa-file-alt';
    default: return 'fa-info-circle';
  }
};

const getIconColorClass = (type) => {
  switch (type) {
    case 'meeting': return 'text-blue-600';
    case 'activity': return 'text-green-600';
    case 'department': return 'text-purple-600';
    case 'announcement': return 'text-yellow-600';
    default: return 'text-gray-600';
  }
};

const getTagClass = (tagType) => {
  switch (tagType) {
    case 'scope': return 'bg-blue-100 text-blue-800';
    case 'priority': return 'bg-red-100 text-red-800';
    case 'category': return 'bg-green-100 text-green-800'; // Example for category tags
    default: return 'bg-gray-100 text-gray-800';
  }
};

// 根据当前分类获取空状态提示信息
const getEmptyStateMessage = (category) => {
  switch (category) {
    case 'unread': return '您没有未读的通知';
    case 'system': return '暂无系统相关通知';
    case 'activity': return '暂无活动相关通知';
    default: return '您的通知列表是空的，有新消息时会在这里显示';
  }
};

// 处理滚动加载更多
const handleScrollToLower = () => {
  console.log('Reached bottom of scroll-view, triggering load more...');
  loadMore();
};

</script>

<style scoped>
/* Import Tailwind base styles */
@import '@/tailwind.css';
/* Import custom styles */
@import '@/static/css/custom.css';
/* Import FontAwesome from installed package */
@import '@fortawesome/fontawesome-free/css/all.min.css';

/* Scoped styles specific to notifications page */
.hide-scrollbar::-webkit-scrollbar {
  display: none; /* Hide scrollbar for Webkit */
  width: 0 !important;
  height: 0 !important;
  -webkit-appearance: none;
  background: transparent;
  color: transparent;
}
.hide-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

/* Ensure buttons in scroll-view don't wrap and have proper spacing */
scroll-view button {
  flex-shrink: 0;
  margin-right: 0.25rem; /* Add small gap between buttons */
}
scroll-view button:last-child {
    margin-right: 0.5rem; /* Add padding at the end */
}
scroll-view button:first-child {
    margin-left: 0.5rem; /* Add padding at the beginning */
}

/* Add subtle hover effect for cards */
.card-hover:hover {
   box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); /* Tailwind shadow-md */
   /* transform: translateY(-1px); */ /* Optional: slight lift effect */
}

/* Ensure line-clamp works */
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>
