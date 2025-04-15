<template>
  <view class="container">
    <!-- Header -->
    <view class="header bg-blue-600 px-4 py-8">
      <view class="flex items-center">
        <view class="avatar bg-white rounded-full p-1">
          <view class="rounded-full bg-gray-200 flex items-center justify-center" style="width: 70px; height: 70px;">
            <text class="fas fa-user text-gray-400" style="font-size: 32px;"></text>
          </view>
        </view>
        <view class="ml-4">
          <view class="text-white text-xl font-medium">{{ userEmail }}</view>
          <view class="text-blue-100 text-sm mt-1">江淮汽车员工</view>
        </view>
      </view>
    </view>

    <!-- Menu Items -->
    <view class="menu-container mt-4 bg-white rounded-lg mx-4 overflow-hidden shadow-sm">
      <view 
        v-for="(item, index) in menuItems" 
        :key="index"
        class="menu-item px-4 py-3 flex items-center border-b border-gray-100"
        :class="{'border-b-0': index === menuItems.length - 1}"
        @tap="handleMenuAction(item.action)"
      >
        <text :class="['fas', item.icon, 'text-gray-500 w-6']"></text>
        <text class="ml-3 flex-1 text-gray-800">{{ item.title }}</text>
        <text class="fas fa-chevron-right text-gray-400"></text>
      </view>
    </view>

    <!-- Logout Button -->
    <view class="mx-4 mt-6">
      <button @tap="logout" class="w-full py-3 bg-white rounded-lg flex items-center justify-center border border-gray-200">
        <text class="fas fa-sign-out-alt text-red-500 mr-2"></text>
        <text class="text-red-500 font-medium">退出登录</text>
      </button>
    </view>

    <!-- App Info -->
    <view class="app-info mt-8 text-center">
      <view class="text-gray-400 text-xs">江淮汽车通知应用</view>
      <view class="text-gray-400 text-xs mt-1">版本 1.0.0</view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '@/store';

const userStore = useUserStore();

// 用户邮箱
const userEmail = computed(() => userStore.userEmail || '未登录');

// 菜单项
const menuItems = ref([
  {
    title: '个人信息',
    icon: 'fa-address-card',
    action: 'profile'
  },
  {
    title: '消息设置',
    icon: 'fa-bell',
    action: 'notification-settings'
  },
  {
    title: '修改密码',
    icon: 'fa-lock',
    action: 'change-password'
  },
  {
    title: '帮助与反馈',
    icon: 'fa-question-circle',
    action: 'help'
  }
]);

// 菜单操作处理
const handleMenuAction = (action) => {
  uni.showToast({
    title: '此功能即将上线',
    icon: 'none'
  });
};

// 退出登录
const logout = () => {
  uni.showModal({
    title: '确认退出',
    content: '您确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        userStore.logout();
      }
    }
  });
};
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #F8FAFC;
}

.header {
  padding-top: env(safe-area-inset-top);
}

.avatar {
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.4);
}

.menu-item {
  transition: background-color 0.2s;
}

.menu-item:active {
  background-color: #F9FAFB;
}

/* 暗黑模式支持 */
@media (prefers-color-scheme: dark) {
  .container {
    background-color: #0F172A;
  }
  
  .menu-container {
    background-color: #1E293B;
  }
  
  .menu-item {
    border-color: rgba(255, 255, 255, 0.05);
  }
  
  .menu-item text {
    color: #E2E8F0;
  }
  
  .menu-item .fas {
    color: #94A3B8;
  }
  
  .menu-item:active {
    background-color: #2D3748;
  }
  
  button {
    background-color: #1E293B;
    border-color: rgba(255, 255, 255, 0.1);
  }
}
</style> 