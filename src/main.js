import { createSSRApp } from "vue";
import App from "./App.vue";
import './tailwind.css';

// 导入FontAwesome
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';

// 导入Pinia
import { createPinia } from 'pinia';

// Uni-app组件样式覆盖
import './uni-override.css';

export function createApp() {
  const app = createSSRApp(App);
  
  // 创建Pinia实例
  const pinia = createPinia();
  
  // 将Pinia安装到应用
  app.use(pinia);
  
  // 在 H5 环境下应用 Tailwind 类
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    // 页面加载完成后应用类
    window.addEventListener('load', () => {
      // 监听DOM变化以应用类到动态添加的元素
    });
  }
  
  return {
    app,
  };
}