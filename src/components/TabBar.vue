<template>
  <view v-if="showTabBar && userStore.getLoginStatus()" class="tabbar-container safe-bottom">
    <view class="tabbar">
      <view
        v-for="(item, index) in tabItems"
        :key="index"
        class="tabbar-item"
        :class="{ active: currentPath === item.pagePath }"
        @tap="switchTab(item.pagePath)"
      >
        <view class="tabbar-icon">
          <text
            class="fas"
            :class="currentPath === item.pagePath ? item.selectedIconClass : item.iconClass"
          />
        </view>
        <text class="tabbar-label">{{ item.text }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, onBeforeMount, watch } from 'vue';
import { useUserStore } from '@/store';

// 获取用户状态
const userStore = useUserStore();
const showTabBar = ref(false);

const tabItems = ref([
  {
    pagePath: '/pages/index/index',
    iconClass: 'fa-home',
    selectedIconClass: 'fa-home',
    text: '首页'
  },
  {
    pagePath: '/pages/notifications/notifications',
    iconClass: 'fa-bell',
    selectedIconClass: 'fa-bell',
    text: '通知'
  },
  {
    pagePath: '/pages/profile/profile',
    iconClass: 'fa-user',
    selectedIconClass: 'fa-user',
    text: '我的'
  }
]);

const currentPath = ref('');

// 检查当前路径
const checkCurrentPath = () => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  if (currentPage) {
    const route = '/' + currentPage.route;
    currentPath.value = route;
  }
};

// 切换标签页
const switchTab = (path) => {
  if (currentPath.value === path) return;
  
  // 检查登录状态，未登录只允许切换到首页和登录页
  if (!userStore.getLoginStatus() && path !== '/pages/index/index' && path !== '/pages/login/login') {
    uni.showToast({
      title: '请先登录',
      icon: 'none',
      duration: 2000
    });
    
    // 如果未登录，跳转到登录页
    setTimeout(() => {
      uni.switchTab({
        url: '/pages/login/login'
      });
    }, 500);
    return;
  }
  
  uni.switchTab({
    url: path
  });
};

// 监听用户登录状态变化
watch(
  () => userStore.getTabBarVisibility(),
  (newValue) => {
    showTabBar.value = newValue;
  },
  { immediate: true }
);

// 监听路由变化
uni.$on('page-show', checkCurrentPath);

onBeforeMount(() => {
  // 初始检查登录状态
  showTabBar.value = userStore.getTabBarVisibility();
});

onMounted(() => {
  // 获取当前路径
  checkCurrentPath();
});
</script>

<style scoped>
.tabbar-container {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  height: 56px;
  background-color: #fff;
  box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.05);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.tabbar {
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.tabbar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  transition: all 0.2s ease;
  position: relative;
}

.tabbar-icon {
  font-size: 18px;
  line-height: 1;
  margin-bottom: 3px;
  color: #94A3B8;
}

.tabbar-label {
  font-size: 11px;
  line-height: 1;
  color: #94A3B8;
  font-weight: 500;
}

.active .tabbar-icon,
.active .tabbar-label {
  color: #3B82F6;
}

.active:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 16px;
  height: 2px;
  background-color: #3B82F6;
  border-radius: 1px;
}

/* 适配安全区域 */
.safe-bottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

/* 暗黑模式支持 */
@media (prefers-color-scheme: dark) {
  .tabbar-container {
    background-color: #1E293B;
    box-shadow: none;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }

  .tabbar-icon,
  .tabbar-label {
    color: #94A3B8;
  }

  .active .tabbar-icon,
  .active .tabbar-label {
    color: #60A5FA;
  }
  
  .active:after {
    background-color: #60A5FA;
  }
}

/* 较大的设备使用更舒适的间距 */
@media screen and (min-width: 768px) {
  .tabbar-container {
    max-width: 640px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 12px 12px 0 0;
  }
}
</style> 