<template>
  <view class="flex flex-col h-screen bg-gray-100 font-sans">
    <!-- 状态栏 -->
    <uni-status-bar bgColor="#4F46E5"></uni-status-bar>
    
    <!-- 顶部区域 -->
    <view class="px-6 pb-8 bg-gradient-to-r from-blue-500 to-indigo-600 safe-top">
      <view class="mb-8">
        <view class="bg-white/15 w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-inner">
          <!-- Use text for FontAwesome icon -->
          <text class="fas fa-building text-white text-4xl opacity-90"></text>
        </view>
        <view class="text-4xl font-bold text-white mb-1">公司通知</view>
        <view class="text-blue-100 text-base">随时获取最新公司动态</view>
      </view>
    </view>

    <!-- 登录表单 -->
    <view class="flex-1 px-6 py-10 -mt-8 bg-white rounded-t-3xl shadow-lg">
      <view class="text-3xl font-semibold text-gray-800 mb-8">欢迎回来</view>

      <!-- 使用普通view替代form标签，避免表单提交问题 -->
      <view class="space-y-6">
        <view>
          <label for="email" class="block text-base font-medium text-gray-700 mb-1.5">邮箱</label>
          <view class="relative">
            <view class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <!-- Use text for FontAwesome icon -->
              <text class="fas fa-envelope text-gray-400 text-lg"></text>
            </view>
            <!-- Use v-model for data binding -->
            <input
              type="text"
              id="email"
              name="email"
              v-model="formData.email"
              placeholder="请输入公司邮箱"
              class="pl-12 w-full px-4 py-3.5 text-base bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-150"
            />
          </view>
        </view>

        <view>
          <label for="password" class="block text-base font-medium text-gray-700 mb-1.5">密码</label>
          <view class="relative">
            <view class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <!-- Use text for FontAwesome icon -->
              <text class="fas fa-lock text-gray-400 text-lg"></text>
            </view>
            <!-- Use v-model for data binding -->
            <input
              type="password"
              id="password"
              name="password"
              v-model="formData.password"
              placeholder="请输入密码"
              class="pl-12 w-full px-4 py-3.5 text-base bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-150"
            />
          </view>
        </view>

        <view class="flex items-center pt-1">
          <!-- UniApp checkbox group or individual checkbox -->
           <checkbox-group @change="rememberMeChanged">
               <label class="flex items-center cursor-pointer">
                   <checkbox :value="true" :checked="formData.rememberMe" class="h-5 w-5 text-blue-600 border-gray-300 rounded mr-0.5" style="transform: scale(0.9);" />
                   <text class="ml-2 block text-base text-gray-700">记住我</text>
               </label>
           </checkbox-group>
        </view>

        <view class="pt-4">
          <!-- 直接添加点击事件 -->
          <button
            type="button"
            @tap="handleLogin"
            class="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-base py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 btn-effect"
            :disabled="loading"
          >
            <view v-if="loading" class="flex items-center justify-center">
              <text class="fas fa-spinner fa-spin mr-2"></text>
              <text>登录中...</text>
            </view>
            <text v-else>登录</text>
          </button>
        </view>
      </view>

      <view class="mt-10 text-center">
        <view class="text-base text-gray-600 mb-5">请使用公司分配的账号登录系统</view>
        <!-- Test Account Info -->
        <view class="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg inline-block">
          <view class="font-medium mb-1">测试账号:</view>
          <view>邮箱: <text class="text-gray-700">test@example.com</text></view>
          <view>密码: <text class="text-gray-700">password123</text></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { onShow } from '@dcloudio/uni-app';

// Test Credentials
const testCredentials = {
  email: 'test@example.com',
  password: 'password123',
};

// Reactive form data
const formData = reactive({
  email: '',
  password: '',
  rememberMe: false,
});

const loading = ref(false);

// 检查是否有保存的登录状态
onMounted(() => {
  try {
    // 尝试从本地存储获取用户信息
    const savedUser = uni.getStorageSync('userInfo');
    if (savedUser) {
      formData.email = savedUser.email || '';
      formData.rememberMe = true;
    }
    
    // 预设测试账号
    if (!formData.email) {
      formData.email = testCredentials.email;
      formData.password = testCredentials.password;
    }
  } catch (e) {
    console.error('Failed to load saved user info:', e);
  }
});

// 处理登录点击事件
const handleLogin = () => {
  console.log('Login button clicked');
  login();
};

// Handle remember me change
const rememberMeChanged = (e) => {
  formData.rememberMe = e.detail.value.length > 0;
};

// Login function
const login = async () => {
  console.log('Login attempt with:', formData);
  
  // 防止重复点击
  if (loading.value) return;
  
  loading.value = true;

  // Basic validation (can be enhanced)
  if (!formData.email || !formData.password) {
    uni.showToast({
      title: '请输入邮箱和密码',
      icon: 'none',
    });
    loading.value = false;
    return;
  }

  // Simulate API call / Check Credentials
  try {
    // 设置登录超时保护
    const loginTimeout = setTimeout(() => {
      if (loading.value) {
        loading.value = false;
        uni.showToast({
          title: '登录超时，请重试',
          icon: 'none',
        });
      }
    }, 5000); // 5秒超时保护
    
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    
    // 清除超时保护
    clearTimeout(loginTimeout);
    
    // 如果已经不在加载状态，说明已经被超时处理了
    if (!loading.value) return;

    if (formData.email === testCredentials.email && formData.password === testCredentials.password) {
      // Credentials Correct
      console.log('Login successful');
      
      // 保存登录状态
      if (formData.rememberMe) {
        uni.setStorageSync('userInfo', { 
          email: formData.email,
          lastLogin: new Date().toISOString()
        });
      } else {
        uni.removeStorageSync('userInfo');
      }
      
      // 设置登录状态
      uni.setStorageSync('isLoggedIn', true);
      
      uni.showToast({
        title: '登录成功',
        icon: 'success',
        duration: 1500
      });

      // Navigate to notifications page on success
      // Using reLaunch to clear navigation stack and prevent back button to login
      setTimeout(() => {
        uni.reLaunch({
          url: '/pages/notifications/notifications' // Ensure this path is correct in pages.json
        });
      }, 1500);

    } else {
      // Credentials Incorrect
      console.log('Login failed: Incorrect credentials');
      uni.showToast({
        title: '邮箱或密码错误',
        icon: 'none',
      });
      loading.value = false;
    }
  } catch (error) {
      // Handle potential errors during the simulated check
      console.error('Login process error:', error);
      uni.showToast({
          title: '登录过程中发生错误',
          icon: 'none',
      });
      loading.value = false;
  }
};
</script>

<style scoped>
/* Import Tailwind base styles */
@import '@/tailwind.css';
/* Import custom styles */
@import '@/static/css/custom.css';
/* Import FontAwesome from installed package */
@import '@fortawesome/fontawesome-free/css/all.min.css';

/* Scoped styles specific to login page if necessary */
/* 调整顶部安全区域 */
.safe-top {
  padding-top: 12px;
}

/* 调整按钮的点击效果 */
.btn-effect:active {
  opacity: 0.9;
  transform: scale(0.98);
}

/* 输入框聚焦效果 */
input:focus {
  outline: none;
}
</style>
