/**
 * 模拟API服务
 * 用于前端开发和测试，模拟后端API请求响应
 * 所有方法返回Promise，模拟真实API调用
 */

import { MockNotificationService } from './notifications';

/**
 * 统一响应格式
 * @param {*} data - 响应数据
 * @param {boolean} success - 是否成功
 * @param {string} message - 消息
 * @returns {Object} 标准响应格式
 */
const createResponse = (data, success = true, message = '') => ({
  success,
  message,
  data,
  timestamp: new Date().toISOString()
});

/**
 * 模拟API服务
 */
export const mockApi = {
  /**
   * 通知相关API
   */
  notifications: {
    /**
     * 获取通知列表
     * @param {Object} params - 查询参数
     * @returns {Promise<Object>} 响应对象
     */
    getList: async (params = {}) => {
      try {
        const result = await MockNotificationService.getNotifications(params);
        return createResponse(result);
      } catch (error) {
        console.error('获取通知列表失败:', error);
        return createResponse(null, false, error.message || '获取通知列表失败');
      }
    },

    /**
     * 获取通知详情
     * @param {number} id - 通知ID
     * @returns {Promise<Object>} 响应对象
     */
    getDetail: async (id) => {
      try {
        const notification = await MockNotificationService.getNotificationDetail(id);
        return createResponse(notification);
      } catch (error) {
        console.error(`获取通知详情失败，ID: ${id}`, error);
        return createResponse(null, false, error.message || '获取通知详情失败');
      }
    },

    /**
     * 标记通知为已读
     * @param {number} id - 通知ID
     * @returns {Promise<Object>} 响应对象
     */
    markAsRead: async (id) => {
      try {
        const success = await MockNotificationService.markAsRead(id);
        return createResponse({ success }, success, success ? '标记成功' : '标记失败，未找到该通知');
      } catch (error) {
        console.error(`标记通知已读失败，ID: ${id}`, error);
        return createResponse(null, false, error.message || '标记已读失败');
      }
    },

    /**
     * 批量标记通知为已读
     * @param {Array<number>} ids - 通知ID数组
     * @returns {Promise<Object>} 响应对象
     */
    markMultipleAsRead: async (ids) => {
      try {
        const count = await MockNotificationService.markMultipleAsRead(ids);
        return createResponse({ count, success: count > 0 }, true, `成功标记 ${count} 条通知为已读`);
      } catch (error) {
        console.error('批量标记通知已读失败:', error);
        return createResponse(null, false, error.message || '批量标记已读失败');
      }
    },

    /**
     * 创建新通知
     * @param {Object} notificationData - 通知数据
     * @returns {Promise<Object>} 响应对象
     */
    create: async (notificationData) => {
      try {
        const newNotification = await MockNotificationService.createNotification(notificationData);
        return createResponse(newNotification, true, '创建通知成功');
      } catch (error) {
        console.error('创建通知失败:', error);
        return createResponse(null, false, error.message || '创建通知失败');
      }
    },

    /**
     * 删除通知
     * @param {number} id - 通知ID
     * @returns {Promise<Object>} 响应对象
     */
    delete: async (id) => {
      try {
        const success = await MockNotificationService.deleteNotification(id);
        return createResponse({ success }, success, success ? '删除成功' : '删除失败，未找到该通知');
      } catch (error) {
        console.error(`删除通知失败，ID: ${id}`, error);
        return createResponse(null, false, error.message || '删除通知失败');
      }
    }
  },

  /**
   * 用户相关API
   * 可以根据需要扩展其他模块的API
   */
  user: {
    // 在这里添加用户相关的API方法
  }
};

/**
 * 模拟网络请求
 * @param {string} url - 请求URL
 * @param {Object} options - 请求选项
 * @returns {Promise<Object>} 响应对象
 */
export const mockRequest = async (url, options = {}) => {
  const { method = 'GET', data = {}, params = {} } = options;
  
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 300));
  
  // 实现路由分发逻辑
  if (url.startsWith('/api/notifications')) {
    // 通知相关API
    if (url === '/api/notifications' && method === 'GET') {
      return mockApi.notifications.getList(params);
    } else if (url.match(/^\/api\/notifications\/\d+$/) && method === 'GET') {
      const id = parseInt(url.split('/').pop(), 10);
      return mockApi.notifications.getDetail(id);
    } else if (url.match(/^\/api\/notifications\/\d+\/read$/) && method === 'PUT') {
      const id = parseInt(url.split('/')[3], 10);
      return mockApi.notifications.markAsRead(id);
    } else if (url === '/api/notifications/read/batch' && method === 'PUT') {
      return mockApi.notifications.markMultipleAsRead(data.ids);
    } else if (url === '/api/notifications' && method === 'POST') {
      return mockApi.notifications.create(data);
    } else if (url.match(/^\/api\/notifications\/\d+$/) && method === 'DELETE') {
      const id = parseInt(url.split('/').pop(), 10);
      return mockApi.notifications.delete(id);
    }
  }
  
  // 未匹配的路由返回404错误
  return createResponse(null, false, '接口不存在', 404);
};

/**
 * 模拟请求方法，类似于uni.request
 * @param {Object} options - 请求选项
 * @returns {Promise<Object>} 响应对象
 */
export const mockUniRequest = (options) => {
  const { url, method, data, header } = options;
  
  return new Promise((resolve, reject) => {
    mockRequest(url, { method, data })
      .then(response => {
        if (options.success && typeof options.success === 'function') {
          options.success(response);
        }
        resolve(response);
      })
      .catch(error => {
        if (options.fail && typeof options.fail === 'function') {
          options.fail(error);
        }
        reject(error);
      })
      .finally(() => {
        if (options.complete && typeof options.complete === 'function') {
          options.complete();
        }
      });
  });
};

export default {
  request: mockUniRequest,
  api: mockApi
}; 