/**
 * API服务入口文件
 * 统一导出所有API服务，方便集中管理
 */

// 导入模拟API工具
import { mockApi, mockRequest, mockUniRequest } from '@/mocks/api';

// 导入各模块API
import * as notificationApi from './notification';

// 创建统一的API对象
const api = {
  // 通知相关API
  notification: notificationApi,
  
  // 可以添加其他模块的API
  // user: userApi,
  // ...
};

// 导出统一的API对象
export default api;

// 导出模拟请求方法，可用于模拟网络请求
export { mockRequest, mockUniRequest };

// 导出各模块API，方便按需导入
export * from './notification'; 