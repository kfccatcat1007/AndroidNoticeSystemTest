/**
 * 通知相关的API服务
 * 提供通知数据的CRUD操作
 */

import { mockApi } from '@/mocks/api';
import { useNotificationStore } from '@/store/notification';

/**
 * 获取通知列表
 * @param {Object} params - 查询参数
 * @param {string} params.type - 通知类型，默认为"all"
 * @param {number} params.page - 页码，默认为1
 * @param {number} params.pageSize - 每页条数，默认为10
 * @returns {Promise<Object>} 包含通知列表和分页信息的Promise
 */
export const getNotifications = async (params = {}) => {
  try {
    // 使用模拟API获取通知列表
    const response = await mockApi.notifications.getList(params);
    return response.data;
  } catch (error) {
    console.error('获取通知列表失败:', error);
    throw error;
  }
};

/**
 * 获取通知详情
 * @param {number} id - 通知ID
 * @returns {Promise<Object>} 通知详情对象
 */
export const getNotificationDetail = async (id) => {
  try {
    // 尝试从Store获取通知
    const notificationStore = useNotificationStore();
    const cachedNotification = notificationStore.getNotificationById(id);
    
    if (cachedNotification) {
      // 如果在Store中找到通知，标记为已读
      if (!cachedNotification.isRead) {
        notificationStore.markAsRead(id);
      }
      return cachedNotification;
    }
    
    // 如果Store中没有，使用模拟API获取
    const response = await mockApi.notifications.getDetail(id);
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || '通知未找到');
  } catch (error) {
    console.error(`获取通知详情失败，ID: ${id}`, error);
    throw error;
  }
};

/**
 * 标记通知为已读
 * @param {number} id - 通知ID
 * @returns {Promise<boolean>} 标记结果
 */
export const markNotificationAsRead = async (id) => {
  try {
    // 使用Store直接标记
    const notificationStore = useNotificationStore();
    notificationStore.markAsRead(id);
    
    // 同时通过API标记，确保跨设备同步
    const response = await mockApi.notifications.markAsRead(id);
    return response.success;
  } catch (error) {
    console.error(`标记通知为已读失败，ID: ${id}`, error);
    throw error;
  }
};

/**
 * 批量标记通知为已读
 * @param {Array<number>} ids - 通知ID数组
 * @returns {Promise<Object>} 操作结果
 */
export const markMultipleAsRead = async (ids) => {
  try {
    // 使用Store直接批量标记
    const notificationStore = useNotificationStore();
    ids.forEach(id => notificationStore.markAsRead(id));
    
    // 同时通过API标记，确保跨设备同步
    const response = await mockApi.notifications.markMultipleAsRead(ids);
    return response.data;
  } catch (error) {
    console.error('批量标记通知为已读失败:', error);
    throw error;
  }
};

/**
 * 标记所有通知为已读
 * @returns {Promise<boolean>} 操作结果
 */
export const markAllAsRead = async () => {
  try {
    // 获取所有未读通知ID
    const notificationStore = useNotificationStore();
    const unreadNotifications = notificationStore.getUnreadNotifications;
    const unreadIds = unreadNotifications.map(notification => notification.id);
    
    if (unreadIds.length === 0) {
      return true; // 没有未读通知，直接返回成功
    }
    
    // 使用Store标记所有为已读
    notificationStore.markAllAsRead();
    
    // 同时通过API批量标记，确保跨设备同步
    const response = await mockApi.notifications.markMultipleAsRead(unreadIds);
    return response.success;
  } catch (error) {
    console.error('标记所有通知为已读失败:', error);
    throw error;
  }
};

/**
 * 删除通知
 * @param {number} id - 通知ID
 * @returns {Promise<boolean>} 操作结果
 */
export const deleteNotification = async (id) => {
  try {
    // 通过API删除通知
    const response = await mockApi.notifications.delete(id);
    
    if (response.success) {
      // 如果API删除成功，同步更新Store
      const notificationStore = useNotificationStore();
      notificationStore.deleteNotification(id);
    }
    
    return response.success;
  } catch (error) {
    console.error(`删除通知失败，ID: ${id}`, error);
    throw error;
  }
}; 