<template>
<view class="bg-gray-50 font-sans">
    <view class="app-container">
        <view class="flex flex-col h-full">
            <!-- 顶部区域 -->
            <view class="pt-12 px-6 pb-6 bg-gradient-to-r from-blue-500 to-indigo-600">
                <view class="mb-6">
                    <view class="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                        <i class="fas fa-building text-white text-3xl"></i>
                    </view>
                    <h1 class="text-3xl font-bold text-white">公司通知</h1>
                    <p class="text-blue-100 mt-1">随时获取最新公司动态</p>
                </view>
            </view>
            
            <!-- 登录表单 -->
            <view class="flex-1 px-6 py-8 -mt-6 bg-white rounded-t-3xl">
                <h2 class="text-2xl font-bold text-gray-800 mb-6">欢迎回来</h2>
                
                <form action="notifications.html" class="space-y-5">
                    <view>
                        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                        <view class="relative">
                            <view class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <i class="fas fa-envelope text-gray-400"></i>
                            </view>
                            <input type="email" id="email" name="email" placeholder="请输入公司邮箱" 
                                class="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500">
                        </view>
                    </view>
                    
                    <view>
                        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">密码</label>
                        <view class="relative">
                            <view class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <i class="fas fa-lock text-gray-400"></i>
                            </view>
                            <input type="password" id="password" name="password" placeholder="请输入密码" 
                                class="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500">
                        </view>
                    </view>
                    
                    <view class="flex items-center">
                        <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 text-blue-600 border-gray-300 rounded">
                        <label for="remember-me" class="ml-2 block text-sm text-gray-700">记住我</label>
                    </view>
                    
                    <view>
                        <button type="submit" class="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            登录
                        </button>
                    </view>
                </form>
                
                <view class="mt-8 text-center">
                    <p class="text-sm text-gray-600">请使用公司分配的账号登录系统</p>
                </view>
            </view>
        </view>
    </view>
</view>
</template>

<script>
import TailwindAdapter from '@/components/TailwindAdapter.vue';

export default {
  components: {
    TailwindAdapter
  },
  data() {
    return {
      activeTab: '全部',
      tabs: ['全部', '重要', '部门', '活动', '会议']
    };
  },
  methods: {
    switchTab(tab) {
      this.activeTab = tab;
    }
  }
};
</script>

<style>
/* 移除直接引入 */
/* @import '/node_modules/tailwindcss/dist/tailwind.min.css'; */

/* 公司通知APP - 全局样式 */

/* 移动设备容器 */
.app-container {
    max-width: 375px;
    height: 812px;
    margin: 0 auto;
    position: relative;
    overflow: hidden;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    border-radius: 30px;
    background-color: #ffffff;
}

/* 隐藏滚动条但保留滚动功能 */
.hide-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}

.hide-scrollbar::-webkit-scrollbar {
    display: none;  /* Chrome, Safari, Opera */
}

/* 文本截断控制 */
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* 容器高度控制 */
.h-full {
    height: 100%;
}

/* 渐变背景增强 */
.bg-gradient-enhanced {
    background-image: linear-gradient(135deg, #4f46e5, #3b82f6);
}

/* 卡片悬浮效果 */
.card-hover {
    transition: transform 0.2s, box-shadow 0.2s;
}

.card-hover:active {
    transform: translateY(1px);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* 按钮点击效果 */
.btn-effect {
    transition: transform 0.1s, opacity 0.1s;
}

.btn-effect:active {
    transform: scale(0.97);
    opacity: 0.9;
}

/* 输入框焦点样式增强 */
input:focus, select:focus {
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
    outline: none;
}

/* 底部安全区域（适配iPhone X及以上机型） */
.safe-bottom {
    padding-bottom: env(safe-area-inset-bottom, 0);
}

/* iOS风格的滑动组件 */
.ios-switch {
    position: relative;
    display: inline-block;
    width: 51px;
    height: 31px;
}

.ios-switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.ios-switch .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 34px;
}

.ios-switch .slider:before {
    position: absolute;
    content: "";
    height: 27px;
    width: 27px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.ios-switch input:checked + .slider {
    background-color: #3b82f6;
}

.ios-switch input:checked + .slider:before {
    transform: translateX(20px);
}

/* 适配不同屏幕尺寸 */
@media screen and (max-height: 700px) {
    .app-container {
        height: 100vh;
        border-radius: 0;
        max-width: 100%;
    }
}

/* 动画效果 */
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.fade-in {
    animation: fadeIn 0.3s ease-in-out;
}

@keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

.slide-up {
    animation: slideUp 0.3s ease-out;
}

/* iOS风格的分割线 */
.ios-viewider {
    height: 1px;
    background-color: rgba(229, 231, 235, 1);
    margin: 8px 0;
}

/* 添加分类选项卡样式修复 */
.tab-active {
  color: #3b82f6; /* text-blue-600 */
  border-bottom: 2px solid #3b82f6; /* border-b-2 border-blue-600 */
}

.tab-normal {
  color: #6b7280; /* text-gray-500 */
}
</style>
    