import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    userToken: null,
    userEmail: '',
    userProfile: null,
    showTabBar: false,
  }),
  
  getters: {
    // 获取登录状态
    getLoginStatus() {
      return this.isLoggedIn;
    },
    
    // 是否显示TabBar
    getTabBarVisibility() {
      return this.showTabBar;
    }
  },
  
  actions: {
    // 登录成功处理
    loginSuccess(token, email) {
      this.isLoggedIn = true;
      this.userToken = token;
      this.userEmail = email;
      this.showTabBar = true;
      
      // 保存到本地存储
      try {
        uni.setStorageSync('userToken', token);
        uni.setStorageSync('userEmail', email);
      } catch (e) {
        console.error('Storage error:', e);
      }
    },
    
    // 登出处理
    logout() {
      this.isLoggedIn = false;
      this.userToken = null;
      this.userEmail = '';
      this.userProfile = null;
      this.showTabBar = false;
      
      // 清除本地存储
      try {
        uni.removeStorageSync('userToken');
        uni.removeStorageSync('userEmail');
      } catch (e) {
        console.error('Storage error:', e);
      }
      
      // 跳转到登录页
      uni.reLaunch({
        url: '/pages/login/login'
      });
    },
    
    // 检查登录状态
    checkLoginStatus() {
      try {
        const token = uni.getStorageSync('userToken');
        const email = uni.getStorageSync('userEmail');
        
        if (token) {
          this.isLoggedIn = true;
          this.userToken = token;
          this.userEmail = email;
          this.showTabBar = true;
          return true;
        } else {
          this.isLoggedIn = false;
          this.showTabBar = false;
          return false;
        }
      } catch (e) {
        console.error('Storage error:', e);
        return false;
      }
    },
    
    // 切换TabBar可见性
    setTabBarVisibility(visible) {
      this.showTabBar = visible;
    }
  }
}); 