<template>
  <view class="page-container" :class="{'has-navbar': hasNavbar, 'has-tabbar': hasTabBar}">
    <!-- 导航栏 -->
    <view v-if="hasNavbar" class="navbar" :class="{'with-status': withStatus}">
      <view class="navbar-content">
        <!-- 返回按钮 -->
        <view v-if="showBack" class="navbar-back" @tap="goBack">
          <text class="fas fa-chevron-left"></text>
        </view>
        
        <!-- 标题 -->
        <text class="navbar-title">{{ title }}</text>
        
        <!-- 右侧操作区域插槽 -->
        <view class="navbar-actions">
          <slot name="navbar-actions"></slot>
        </view>
      </view>
    </view>
    
    <!-- 内容区 -->
    <view class="page-content" :style="contentStyle">
      <!-- 主要内容插槽 -->
      <slot></slot>
    </view>
    
    <!-- 底部固定内容插槽 -->
    <view v-if="$slots['bottom']" class="page-bottom safe-bottom">
      <slot name="bottom"></slot>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useUserStore } from '@/store';

const props = defineProps({
  // 页面标题
  title: {
    type: String,
    default: ''
  },
  // 是否显示导航栏
  hasNavbar: {
    type: Boolean,
    default: true
  },
  // 是否显示返回按钮
  showBack: {
    type: Boolean,
    default: true
  },
  // 是否考虑状态栏高度
  withStatus: {
    type: Boolean,
    default: true
  },
  // 是否有底部TabBar
  hasTabBar: {
    type: Boolean,
    default: false,
  },
  // 内容区域额外样式
  contentPadding: {
    type: String,
    default: '16px'
  }
});

// 获取用户状态
const userStore = useUserStore();

// 导航栏高度
const navbarHeight = ref('44px');
const statusBarHeight = ref('20px');
const safeAreaBottom = ref('0px');

// 计算内容样式
const contentStyle = computed(() => {
  let style = {};
  if (props.hasNavbar) {
    style.paddingTop = `calc(${navbarHeight.value} ${props.withStatus ? '+ ' + statusBarHeight.value : ''})`;
  }
  if (props.hasTabBar) {
    style.paddingBottom = `calc(50px + ${safeAreaBottom.value})`;
  }
  style.padding = props.contentPadding;
  return style;
});

// 获取设备信息以适配不同设备
onMounted(() => {
  // 获取系统信息
  uni.getSystemInfo({
    success: (res) => {
      // 设置状态栏高度
      statusBarHeight.value = res.statusBarHeight + 'px';
      // 设置底部安全区域
      safeAreaBottom.value = res.safeAreaInsets?.bottom ? res.safeAreaInsets.bottom + 'px' : '0px';
    }
  });
});

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background-color: #F9FAFB;
  width: 100%;
}

/* 导航栏样式 */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 44px;
  background-color: #3B82F6;
  color: white;
  z-index: 100;
  display: flex;
  align-items: center;
}

.navbar.with-status {
  padding-top: var(--status-bar-height, 20px);
}

.navbar-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 16px;
}

.navbar-back {
  font-size: 18px;
  padding: 8px;
  margin-left: -8px;
}

.navbar-title {
  flex: 1;
  text-align: center;
  font-size: 18px;
  font-weight: 500;
}

.navbar-actions {
  display: flex;
  align-items: center;
}

/* 内容区域样式 */
.page-content {
  flex: 1;
}

/* 底部区域样式 */
.page-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99;
}

/* 适配底部安全区域 */
.safe-bottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

/* 响应式调整 */
@media screen and (min-width: 768px) {
  .page-container {
    max-width: 768px;
    margin: 0 auto;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  }
}

/* 暗黑模式支持 */
@media (prefers-color-scheme: dark) {
  .page-container {
    background-color: #1F2937;
    color: #F3F4F6;
  }
  
  .navbar {
    background-color: #2563EB;
  }
}
</style> 