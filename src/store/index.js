import { createPinia } from 'pinia';
import { useNotificationStore } from './notification';
import { useUserStore } from './user';

// 创建Pinia实例
const pinia = createPinia();

// 导出存储实例，方便直接使用
export { useNotificationStore, useUserStore };

// 导出pinia实例
export default pinia; 