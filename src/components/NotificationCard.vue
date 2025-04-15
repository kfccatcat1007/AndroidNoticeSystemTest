<template>
  <view
    @tap="handleNotificationClick"
    class="block hover-class"
    hover-class="bg-gray-50"
  >
    <view class="p-4 responsive-padding">
      <view class="flex items-start">
        <!-- Icon -->
        <view class="flex-shrink-0 mr-4">
          <view
            class="icon-container rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm"
            :class="getIconBgClass"
          >
            <text class="fas icon-size" :class="[getIconClass, getIconColorClass]"></text>
          </view>
        </view>

        <!-- Content -->
        <view class="flex-1 min-w-0">
          <!-- Header -->
          <view class="flex justify-between items-center mb-1.5">
            <text class="notification-title font-semibold text-gray-800 truncate pr-2">{{ notification.title }}</text>
            <view class="flex items-center">
              <ui-badge v-if="notification.isNew" dot variant="primary" pulsing class="mr-2" />
              <text class="timestamp text-gray-500 whitespace-nowrap flex-shrink-0">{{ notification.time }}</text>
            </view>
          </view>

          <!-- Tags -->
          <view v-if="notification.tags && notification.tags.length" class="mt-1 flex flex-wrap gap-1.5 mb-2">
            <ui-badge
              v-for="tag in notification.tags"
              :key="tag.name"
              :variant="getTagVariant(tag.type)"
              size="sm"
            >
              {{ tag.name }}
            </ui-badge>
          </view>

          <!-- Summary -->
          <text class="mt-2 summary-text text-gray-600 line-clamp-2 block leading-relaxed">
            {{ notification.summary }}
          </text>

          <!-- Actions -->
          <view v-if="notification.actions" class="mt-3 pt-2 border-t border-gray-100 flex flex-wrap gap-2">
            <ui-button
              v-for="action in notification.actions"
              :key="action.label"
              @click.stop.prevent="$emit('action', { type: action.type, id: notification.id })"
              :icon="action.icon.replace('fa-', '')"
              size="sm"
              :variant="getActionVariant(action.type)"
              rounded="full"
            >
              {{ action.label }}
            </ui-button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import UiBadge from './UiBadge.vue';
import UiButton from './UiButton.vue';
import { useUserStore } from '@/store';

const props = defineProps({
  notification: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['action']);

// 获取用户状态
const userStore = useUserStore();

// 处理通知点击事件，检查登录状态
const handleNotificationClick = () => {
  console.log('Notification clicked:', props.notification.id);
  
  if (!userStore.getLoginStatus()) {
    // 未登录，跳转到登录页面
    uni.showToast({
      title: '请先登录',
      icon: 'none',
      duration: 2000
    });
    setTimeout(() => {
      uni.navigateTo({
        url: '/pages/login/login'
      });
    }, 1000);
  } else {
    // 已登录，跳转到通知详情页
    uni.navigateTo({
      url: `/pages/notification-detail/notification-detail?id=${props.notification.id}`,
      success: () => {
        console.log('Successfully navigated to detail page');
      },
      fail: (err) => {
        console.error('Navigation failed:', err);
        // 如果导航失败，尝试使用reLaunch
        uni.showToast({
          title: '正在跳转...',
          icon: 'none',
          duration: 1000
        });
        setTimeout(() => {
          uni.reLaunch({
            url: `/pages/notification-detail/notification-detail?id=${props.notification.id}`
          });
        }, 1000);
      }
    });
  }
};

// 获取图标背景样式
const getIconBgClass = () => {
  const bgMap = {
    important: 'bg-orange-100',
    announcement: 'bg-blue-100',
    activity: 'bg-purple-100',
    department: 'bg-green-100',
    meeting: 'bg-red-100',
    default: 'bg-gray-100',
  };
  return bgMap[props.notification.type] || bgMap.default;
};

// 获取图标样式
const getIconClass = () => {
  const iconMap = {
    important: 'fa-star',
    announcement: 'fa-bullhorn',
    activity: 'fa-calendar-alt',
    department: 'fa-users',
    meeting: 'fa-video',
    default: 'fa-bell',
  };
  return iconMap[props.notification.type] || iconMap.default;
};

// 获取图标颜色
const getIconColorClass = () => {
  const colorMap = {
    important: 'text-orange-500',
    announcement: 'text-blue-500',
    activity: 'text-purple-500',
    department: 'text-green-500',
    meeting: 'text-red-500',
    default: 'text-gray-500',
  };
  return colorMap[props.notification.type] || colorMap.default;
};

// 获取标签颜色
const getTagVariant = (type) => {
  const variantMap = {
    scope: 'light',
    category: 'outline',
    status: 'primary',
    default: 'light',
  };
  return variantMap[type] || variantMap.default;
};

// 获取动作按钮样式
const getActionVariant = (type) => {
  const variantMap = {
    join: 'primary',
    view: 'outline',
    download: 'secondary',
    default: 'outline',
  };
  return variantMap[type] || variantMap.default;
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hover-class {
  transition: background-color 0.15s ease-in-out;
}

/* 响应式样式 */
.responsive-padding {
  padding: 16px;
}

.icon-container {
  width: 48px;
  height: 48px;
}

.icon-size {
  font-size: 1.125rem;
}

.notification-title {
  font-size: 1rem;
}

.timestamp {
  font-size: 0.875rem;
}

.summary-text {
  font-size: 0.875rem;
}

/* 小屏幕设备 */
@media screen and (max-width: 320px) {
  .responsive-padding {
    padding: 12px;
  }
  
  .icon-container {
    width: 40px;
    height: 40px;
  }
  
  .icon-size {
    font-size: 1rem;
  }
  
  .notification-title {
    font-size: 0.9375rem;
  }
  
  .timestamp {
    font-size: 0.75rem;
  }
  
  .summary-text {
    font-size: 0.8125rem;
  }
}

/* 大屏幕设备 */
@media screen and (min-width: 640px) {
  .responsive-padding {
    padding: 20px;
  }
  
  .icon-container {
    width: 56px;
    height: 56px;
  }
  
  .icon-size {
    font-size: 1.25rem;
  }
  
  .notification-title {
    font-size: 1.125rem;
  }
  
  .summary-text {
    font-size: 0.9375rem;
  }
}
</style> 