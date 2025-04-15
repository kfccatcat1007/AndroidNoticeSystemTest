import { defineStore } from 'pinia';
import { notificationsData } from '@/mocks/notifications';

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [...notificationsData], // 使用导入的模拟数据
    totalNotifications: notificationsData.length,
    unreadCount: notificationsData.filter(n => !n.isRead).length
  }),

  getters: {
    // 获取未读通知数量
    getUnreadCount: (state) => state.unreadCount,
    
    // 获取所有通知
    getAllNotifications: (state) => state.notifications,
    
    // 获取重要通知
    getImportantNotifications: (state) => state.notifications.filter(n => 
      n.tags.some(tag => tag.type === 'priority' && tag.name === '重要')
    ),
    
    // 根据类型获取通知
    getNotificationsByType: (state) => (type) => {
      return state.notifications.filter(n => n.type === type);
    },
    
    // 获取未读通知
    getUnreadNotifications: (state) => state.notifications.filter(n => !n.isRead),
    
    // 获取新通知（标记为new但未必未读）
    getNewNotifications: (state) => state.notifications.filter(n => n.isNew)
  },

  actions: {
    // 将通知标记为已读
    markAsRead(id) {
      const notification = this.notifications.find(n => n.id === id);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        notification.isNew = false;
        this.unreadCount = Math.max(0, this.unreadCount - 1);
      }
    },
    
    // 将所有通知标记为已读
    markAllAsRead() {
      this.notifications.forEach(n => {
        n.isRead = true;
        n.isNew = false;
      });
      this.unreadCount = 0;
    },
    
    // 添加新通知
    addNotification(notification) {
      const newId = Math.max(...this.notifications.map(n => n.id), 0) + 1;
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      const newNotification = {
        ...notification,
        id: newId,
        dateGroup: '今日',
        time: timeStr,
        isNew: true,
        isRead: false
      };
      
      this.notifications.unshift(newNotification);
      this.totalNotifications++;
      this.unreadCount++;
      
      return newNotification;
    },

    // 直接从本地数据获取通知列表 (无需API调用)
    getLocalNotifications({ type = 'all', page = 1, pageSize = 10 } = {}) {
      let filteredData = [...this.notifications];
      
      // 按类型筛选
      if (type !== 'all') {
        if (type === 'unread') {
          filteredData = filteredData.filter(item => !item.isRead);
        } else {
          filteredData = filteredData.filter(item => item.type === type);
        }
      }
      
      // 计算分页数据
      const total = filteredData.length;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedData = filteredData.slice(startIndex, endIndex);
      
      return {
        list: paginatedData,
        pagination: {
          total,
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize),
          hasMore: endIndex < total
        }
      };
    },

    // 根据ID获取通知
    getNotificationById(id) {
      // 尝试将id转换为数字以确保类型匹配
      const numId = typeof id === 'string' ? parseInt(id, 10) : id;
      const notification = this.notifications.find(n => n.id === numId);
      
      if (!notification) {
        console.warn(`Notification with ID ${id} not found`);
        return null;
      }
      
      return notification;
    },
    
    // 删除通知
    deleteNotification(id) {
      const index = this.notifications.findIndex(n => n.id === id);
      if (index !== -1) {
        const notification = this.notifications[index];
        this.notifications.splice(index, 1);
        this.totalNotifications--;
        
        if (!notification.isRead) {
          this.unreadCount = Math.max(0, this.unreadCount - 1);
        }
        
        return true;
      }
      return false;
    },
    
    // 批量删除通知
    deleteNotifications(ids) {
      let deletedCount = 0;
      
      ids.forEach(id => {
        const result = this.deleteNotification(id);
        if (result) deletedCount++;
      });
      
      return deletedCount;
    }
  }
}); 