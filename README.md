# 企业通知应用

一个优雅简约的企业内部通知管理应用，帮助员工随时掌握公司动态。

## 功能特色

- 🔔 实时通知：接收公司重要通知、活动和会议安排
- 🎯 分类管理：按类型（会议、公告、活动等）分类查看通知
- 🔍 搜索功能：快速查找历史通知
- 📅 日历集成：一键添加会议和活动到日历
- 📎 附件处理：支持通知附件的下载和查看
- 🌙 优雅界面：简约美观的UI设计，提供良好的用户体验

## 技术栈

- 前端框架：Vue 3
- UI框架：Tailwind CSS
- 跨平台支持：uni-app
- 图标：Font Awesome
- 构建工具：HBuilderX

## 安装与使用

1. 克隆项目仓库
```bash
git clone https://github.com/yourusername/company-notification-app.git
```

2. 安装依赖
```bash
npm install
```

3. 开发模式运行
```bash
npm run dev
```

4. 打包Android应用
在HBuilderX中选择"发行"->"原生App-云打包"，选择Android平台。

## 目录结构

```
src/
├── components/        # 可复用组件
├── pages/             # 页面文件
│   ├── login/
│   ├── notifications/
│   └── notification-detail/
├── static/            # 静态资源
└── App.vue            # 应用入口
```

## 测试账号

- 邮箱: test@example.com
- 密码: password123

## 截图展示

![登录页面](screenshots/login.png)
![通知列表](screenshots/notifications.png)
![通知详情](screenshots/detail.png)

## 许可证

MIT 