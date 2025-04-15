/**
 * 通知模拟数据
 * 包含公司各类通知的结构化数据，用于前端开发和测试
 * 
 * 字段说明：
 * - id: 唯一标识符
 * - dateGroup: 日期分组标签（今日、昨日、具体日期等）
 * - title: 通知标题
 * - time: 时间显示
 * - summary: 通知摘要，用于列表页展示
 * - content: 通知正文（HTML格式）
 * - type: 通知类型（meeting:会议, activity:活动, department:部门, announcement:公告）
 * - isNew: 是否为新通知
 * - isRead: 是否已读
 * - tags: 标签数组 [{name:标签名, type:标签类型}]
 *   - 标签类型: scope(范围), priority(优先级), category(分类)
 * - actions: 可执行操作 [{label:标签, icon:图标, type:类型}]
 * - attachments: 附件 [{name:文件名, size:大小, type:类型}]
 */

// 帮助函数：根据日期创建适当的dateGroup
const formatDateGroup = (dateString) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const date = new Date(dateString);
  date.setHours(0, 0, 0, 0);
  
  if (date.getTime() === today.getTime()) {
    return '今日';
  } else if (date.getTime() === yesterday.getTime()) {
    return '昨日';
  } else {
    return dateString; // 返回原始日期字符串，格式如 "YYYY-MM-DD"
  }
};

// 获取近期日期用于生成模拟数据
const today = new Date();
const getTodayString = () => {
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

const getYesterdayString = () => {
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  return `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
};

const getDateString = (daysAgo) => {
  const date = new Date(today);
  date.setDate(date.getDate() - daysAgo);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export const notificationsData = [
  { 
    id: 1, 
    dateGroup: formatDateGroup(getTodayString()), 
    title: '2024年第二季度工作计划会议通知', 
    time: '10:24', 
    summary: '关于本周五下午3点召开2024年第二季度工作计划会议的通知，请各部门负责人务必准时参加。会议地点：总部大楼3楼会议室，会议时间：2024年6月28日下午3:00-5:00。',
    content: `<p>尊敬的各部门负责人：</p>
    <p>公司定于本周五（2024年6月28日）下午3点在总部大楼3楼会议室召开2024年第二季度工作计划会议。</p>
    <p><strong>会议议程：</strong></p>
    <ol>
      <li>各部门Q1工作总结及Q2计划汇报</li>
      <li>新产品线launch计划讨论</li>
      <li>年中绩效考核方案讨论</li>
      <li>公司六周年庆活动安排</li>
    </ol>
    <p>请各位务必准时参加，如有特殊情况无法出席，请提前告知并指派代表参会。</p>
    <p>此致</p>
    <p>行政部</p>
    <p>2024年6月25日</p>`,
    type: 'meeting', 
    isNew: true,
    isRead: false,
    tags: [{ name: '全公司', type: 'scope' }, { name: '重要', type: 'priority' }],
    actions: [
      { label: '确认参加', icon: 'fa-check', type: 'confirm' },
      { label: '查看详情', icon: 'fa-arrow-right', type: 'view' }
    ],
    attachments: [
      { name: '会议议程.docx', size: '156KB', type: 'document' },
      { name: 'Q1工作总结模板.xlsx', size: '78KB', type: 'spreadsheet' }
    ]
  },
  { 
    id: 2, 
    dateGroup: formatDateGroup(getTodayString()), 
    title: '公司六周年庆典活动安排', 
    time: '08:56', 
    summary: '公司将于本月25日举办六周年庆典活动，现将活动安排通知如下，请各部门协调配合，确保活动顺利进行。', 
    content: `<p>亲爱的同事们：</p>
    <p>值此公司成立六周年之际，公司将举办盛大的周年庆活动，具体安排如下：</p>
    <p><strong>活动时间：</strong>2024年6月25日 下午2:00-晚上8:00</p>
    <p><strong>活动地点：</strong>阳光大酒店宴会厅</p>
    <p><strong>活动议程：</strong></p>
    <ol>
      <li>14:00-14:30 签到入场</li>
      <li>14:30-15:30 创始人致辞与公司发展历程回顾</li>
      <li>15:30-16:30 优秀员工表彰</li>
      <li>16:30-17:30 团队游戏互动</li>
      <li>17:30-20:00 晚宴</li>
    </ol>
    <p>请各部门于6月23日前将参加人员名单报送至行政部邮箱。</p>
    <p>期待与大家共庆公司六周年！</p>
    <p>此致</p>
    <p>行政部</p>`,
    type: 'activity', 
    isNew: true,
    isRead: false,
    tags: [{ name: '全公司', type: 'scope' }, { name: '活动', type: 'category' }],
    actions: [
      { label: '我要参加', icon: 'fa-user-plus', type: 'join' },
      { label: '查看详情', icon: 'fa-arrow-right', type: 'view' }
    ],
    attachments: [
      { name: '活动流程.pdf', size: '2.3MB', type: 'pdf' },
      { name: '酒店位置.png', size: '1.5MB', type: 'image' }
    ]
  },
  { 
    id: 3, 
    dateGroup: formatDateGroup(getYesterdayString()), 
    title: '技术部门新员工入职培训', 
    time: '昨天 15:30', 
    summary: '技术部门近期入职的新员工将于本周三进行集中培训，培训内容包括公司技术架构、开发流程等基础知识，请相关人员准时参加。', 
    content: `<p>技术部全体新入职员工：</p>
    <p>为帮助大家快速融入团队，了解公司技术体系，技术部将于本周三（6月26日）举办新员工入职培训，详情如下：</p>
    <p><strong>培训时间：</strong>2024年6月26日 09:30-17:00</p>
    <p><strong>培训地点：</strong>技术楼2层培训室</p>
    <p><strong>培训内容：</strong></p>
    <ol>
      <li>公司技术架构介绍</li>
      <li>开发流程与规范</li>
      <li>代码版本控制与提交规范</li>
      <li>测试与上线流程</li>
      <li>技术文档撰写规范</li>
    </ol>
    <p>培训采用理论讲解与实战操作相结合的方式，请携带个人电脑参加。</p>
    <p>此致</p>
    <p>技术部</p>`,
    type: 'department', 
    isRead: true,
    tags: [{ name: '技术部', type: 'scope' }],
    actions: [
      { label: '查看详情', icon: 'fa-arrow-right', type: 'view' }
    ],
    attachments: [
      { name: '培训手册.pdf', size: '5.8MB', type: 'pdf' }
    ]
  },
  { 
    id: 4, 
    dateGroup: formatDateGroup(getYesterdayString()), 
    title: '关于调整公司办公时间的通知', 
    time: '昨天 09:15', 
    summary: '为了更好地平衡工作和生活，公司决定从下月起调整办公时间，具体安排如下...', 
    content: `<p>全体员工：</p>
    <p>为促进工作与生活平衡，提升员工工作效率与幸福感，经管理层研究决定，自2024年7月1日起，对公司办公时间做如下调整：</p>
    <p><strong>新办公时间：</strong></p>
    <ul>
      <li>周一至周四：上午9:00-12:00，下午13:30-18:00</li>
      <li>周五：上午9:00-12:00，下午13:30-17:00</li>
    </ul>
    <p><strong>弹性工作制：</strong></p>
    <p>核心工作时间为10:00-16:00，其余时间可灵活安排，但每周工作时长不变。</p>
    <p><strong>远程办公政策：</strong></p>
    <p>每周可有1天申请远程办公，但需提前向部门负责人申请并获得批准。</p>
    <p>以上新政策将从7月1日起正式实施，请各部门做好相应安排。</p>
    <p>此致</p>
    <p>人力资源部</p>`,
    type: 'announcement', 
    isRead: true,
    tags: [{ name: '全公司', type: 'scope' }],
    attachments: []
  },
  { 
    id: 5, 
    dateGroup: getDateString(3), 
    title: '服务器维护通知', 
    time: `${getDateString(3).substr(5, 5).replace('-', '-')} 18:00`, 
    summary: '为提升服务质量，服务器将于今晚进行维护，预计影响时间2小时，期间部分系统可能无法访问，请相关人员提前做好准备。', 
    content: `<p>各位同事：</p>
    <p>为确保系统稳定性及安全性，IT部门将于今晚（6月23日）22:00-次日00:00进行服务器维护，详情如下：</p>
    <p><strong>维护时间：</strong>2024年6月23日 22:00-00:00</p>
    <p><strong>影响范围：</strong></p>
    <ul>
      <li>内部OA系统（完全不可用）</li>
      <li>企业邮箱（可能出现短暂延迟）</li>
      <li>代码仓库（只读模式）</li>
      <li>客户管理系统（完全不可用）</li>
    </ul>
    <p>请各位同事提前做好相关工作安排，避免在维护时间内使用上述系统。如有特殊需求，请提前与IT部门联系。</p>
    <p>此致</p>
    <p>IT运维部</p>`,
    type: 'announcement', 
    isRead: true,
    tags: [{ name: '全公司', type: 'scope' }, { name: '重要', type: 'priority' }],
    attachments: []
  },
  { 
    id: 6, 
    dateGroup: getDateString(4), 
    title: '市场部月度会议纪要', 
    time: `${getDateString(4).substr(5, 5).replace('-', '-')} 11:00`, 
    summary: '本次会议讨论了Q3市场推广计划，新产品发布时间表以及竞品分析报告，现将会议纪要分享给相关人员查阅。', 
    content: `<p>市场部全体成员：</p>
    <p>现将2024年6月20日市场部月度会议纪要整理如下：</p>
    <p><strong>与会人员：</strong>李总监、王经理、张经理及市场部全体成员</p>
    <p><strong>会议内容：</strong></p>
    <ol>
      <li><strong>Q2营销活动效果分析</strong><br>线上活动转化率同比提升15%，但客单价有所下降；线下活动参与度高但成本较高，建议Q3调整预算分配。</li>
      <li><strong>新产品上市计划</strong><br>"智能办公助手Pro"定于8月15日上市，需在7月初启动预热，完成物料设计、媒体预约等工作。</li>
      <li><strong>竞品分析</strong><br>竞争对手在AI功能方面有新突破，建议研发部门加快AI助手迭代，增强竞争力。</li>
      <li><strong>Q3预算调整</strong><br>根据Q2效果，建议将预算重点向线上内容营销、KOL合作方向倾斜。</li>
    </ol>
    <p><strong>后续行动项：</strong></p>
    <ul>
      <li>各组负责人于本周五前提交Q3详细执行计划</li>
      <li>创意组下周一前完成新品发布会视觉方案</li>
      <li>PR组联系媒体资源，确认发布会报道计划</li>
    </ul>
    <p>以上内容请各位查阅并按计划执行。</p>
    <p>此致</p>
    <p>市场部</p>`,
    type: 'department', 
    isRead: false,
    tags: [{ name: '市场部', type: 'scope' }],
    actions: [
      { label: '查看详情', icon: 'fa-arrow-right', type: 'view' }
    ],
    attachments: [
      { name: 'Q2营销报告.pptx', size: '4.2MB', type: 'presentation' },
      { name: '竞品分析.pdf', size: '2.1MB', type: 'pdf' },
      { name: 'Q3预算调整方案.xlsx', size: '1.8MB', type: 'spreadsheet' }
    ]
  },
  { 
    id: 7, 
    dateGroup: getDateString(4), 
    title: '员工体检安排通知', 
    time: `${getDateString(4).substr(5, 5).replace('-', '-')} 09:30`, 
    summary: '公司将于下月组织年度员工体检，请各部门员工根据安排时间前往指定医院进行体检，具体体检时间安排请查看附件。', 
    content: `<p>全体员工：</p>
    <p>为关爱员工健康，公司将组织2024年度员工健康体检，具体安排如下：</p>
    <p><strong>体检时间：</strong>2024年7月10日-7月20日</p>
    <p><strong>体检地点：</strong>仁爱医院体检中心（市中心南路88号）</p>
    <p><strong>体检须知：</strong></p>
    <ul>
      <li>体检前一天晚上8点后请勿进食</li>
      <li>体检当天早晨空腹，可少量饮水</li>
      <li>体检当日请携带身份证</li>
      <li>体检时间约2小时，建议穿着舒适衣物</li>
    </ul>
    <p><strong>部门安排：</strong></p>
    <p>7月10-11日：行政部、人力资源部、财务部</p>
    <p>7月12-13日：技术部</p>
    <p>7月15-16日：产品部、设计部</p>
    <p>7月17-18日：市场部、销售部</p>
    <p>7月19-20日：其他部门及补检</p>
    <p>体检结果将于体检后15个工作日内发放，如有疑问请联系人力资源部。</p>
    <p>此致</p>
    <p>人力资源部</p>`,
    type: 'announcement', 
    isRead: true,
    tags: [{ name: '全公司', type: 'scope' }],
    attachments: [
      { name: '体检项目明细.pdf', size: '1.3MB', type: 'pdf' },
      { name: '医院交通指南.pdf', size: '0.8MB', type: 'pdf' }
    ]
  },
  { 
    id: 8, 
    dateGroup: getDateString(6), 
    title: '产品部周会通知', 
    time: `${getDateString(6).substr(5, 5).replace('-', '-')} 14:15`, 
    summary: '本周产品部周会将于周四下午2点在3楼会议室举行，会议将讨论新产品功能规划和近期用户反馈，请相关人员准时参加。', 
    content: `<p>产品部全体成员：</p>
    <p>产品部本周例会将于本周四（6月27日）下午2:00在3楼会议室举行，议程如下：</p>
    <ol>
      <li>产品迭代进度回顾（15分钟）</li>
      <li>用户反馈分析与处理（20分钟）</li>
      <li>新功能设计讨论（40分钟）</li>
      <li>下周工作安排（15分钟）</li>
    </ol>
    <p>请相关同事做好准备：</p>
    <ul>
      <li>产品设计师：准备新功能原型</li>
      <li>数据分析师：准备近期用户行为数据报告</li>
      <li>产品经理：准备迭代计划进度表</li>
    </ul>
    <p>如有特殊情况无法参加，请提前告知。</p>
    <p>此致</p>
    <p>产品部</p>`,
    type: 'meeting', 
    isRead: true,
    tags: [{ name: '产品部', type: 'scope' }],
    actions: [
      { label: '确认参加', icon: 'fa-check', type: 'confirm' },
      { label: '查看详情', icon: 'fa-arrow-right', type: 'view' }
    ],
    attachments: []
  },
  { 
    id: 9, 
    dateGroup: '2024-06-19', 
    title: '人力资源系统升级通知', 
    time: '06-19 16:40', 
    summary: '公司人力资源系统将于本周末进行升级，升级期间系统将暂停使用，请各位在本周五下班前完成相关审批工作。', 
    content: `<p>全体员工：</p>
    <p>为提升人力资源管理效率，公司将对HR系统进行升级，详情如下：</p>
    <p><strong>系统停用时间：</strong>2024年6月28日18:00至6月30日24:00</p>
    <p><strong>影响范围：</strong></p>
    <ul>
      <li>员工自助系统（休假申请、报销申请等）</li>
      <li>考勤系统</li>
      <li>招聘管理系统</li>
      <li>培训管理系统</li>
    </ul>
    <p><strong>重要提示：</strong></p>
    <p>1. 请于6月28日下班前提交并完成所有待处理的申请审批</p>
    <p>2. 系统升级期间的紧急申请，请通过邮件方式发送至hr@example.com</p>
    <p>3. 系统恢复后，新版本将有操作界面变化，届时将发布使用指南</p>
    <p>感谢您的配合！</p>
    <p>此致</p>
    <p>人力资源部</p>`,
    type: 'announcement', 
    isRead: false,
    tags: [{ name: '全公司', type: 'scope' }],
    attachments: [
      { name: '新系统功能介绍.pdf', size: '2.5MB', type: 'pdf' }
    ]
  },
  { 
    id: 10, 
    dateGroup: '2024-06-18', 
    title: '财务报销截止日期提醒', 
    time: '06-18 11:20', 
    summary: '本月财务报销将于6月25日截止，请各位员工及时提交报销单据，逾期将延至下月处理。', 
    content: `<p>全体员工：</p>
    <p>根据公司财务制度，提醒各位同事6月份报销截止日期为6月25日，相关事项说明如下：</p>
    <p><strong>重要日期：</strong></p>
    <ul>
      <li>报销单据提交截止日期：6月25日17:00</li>
      <li>财务审核日期：6月26日-28日</li>
      <li>报销款项发放日期：6月30日前</li>
    </ul>
    <p><strong>报销须知：</strong></p>
    <ol>
      <li>请确保发票日期在本季度内（4月1日至6月30日）</li>
      <li>报销单需经部门经理审批后方可提交财务</li>
      <li>金额超过5000元的报销需提供详细说明</li>
      <li>差旅报销需附行程单及出行证明</li>
    </ol>
    <p>逾期提交的报销单将顺延至下月处理，请各位同事注意时间安排。</p>
    <p>此致</p>
    <p>财务部</p>`,
    type: 'announcement', 
    isRead: true,
    tags: [{ name: '全公司', type: 'scope' }],
    attachments: [
      { name: '报销流程指南.pdf', size: '1.1MB', type: 'pdf' }
    ]
  },
  { 
    id: 11, 
    dateGroup: '2024-06-17', 
    title: '研发部技术分享会通知', 
    time: '06-17 14:50', 
    summary: '研发部将于本周五举办技术分享会，主题为"微服务架构最佳实践"，欢迎感兴趣的同事参加。', 
    content: `<p>各位同事：</p>
    <p>研发部将于本周五（6月28日）下午15:30-17:30举办技术分享会，详情如下：</p>
    <p><strong>分享主题：</strong>微服务架构最佳实践 - 从理论到落地</p>
    <p><strong>主讲人：</strong>张工程师（架构组）</p>
    <p><strong>分享内容：</strong></p>
    <ol>
      <li>微服务架构基础理论与发展趋势</li>
      <li>微服务拆分原则与实战案例</li>
      <li>服务治理与监控体系构建</li>
      <li>微服务架构下的DevOps实践</li>
      <li>公司微服务架构升级路线图</li>
    </ol>
    <p><strong>时间地点：</strong></p>
    <p>时间：6月28日 15:30-17:30</p>
    <p>地点：科技楼5层会议室</p>
    <p><strong>参与方式：</strong></p>
    <p>1. 现场参与（限额30人）</p>
    <p>2. 线上直播（Teams会议，链接将于当天上午发送）</p>
    <p>请有意参加的同事在OA系统"培训活动"栏目报名。</p>
    <p>此致</p>
    <p>研发部</p>`,
    type: 'department', 
    isRead: false,
    tags: [{ name: '研发部', type: 'scope' }, { name: '培训', type: 'category' }],
    actions: [
      { label: '我要参加', icon: 'fa-user-plus', type: 'join' },
      { label: '查看详情', icon: 'fa-arrow-right', type: 'view' }
    ],
    attachments: [
      { name: '技术分享PPT.pdf', size: '5.7MB', type: 'pdf' }
    ]
  },
  { 
    id: 12, 
    dateGroup: '2024-06-16', 
    title: '公司内部晋升结果公示', 
    time: '06-16 16:30', 
    summary: '第二季度内部晋升评审工作已完成，现将晋升人员名单予以公示，公示期为5个工作日。', 
    content: `<p>全体员工：</p>
    <p>经过部门推荐、360度评估、晋升评审会等环节，现将2024年第二季度内部晋升人员名单公示如下（公示期：6月16日-6月22日）：</p>
    <p><strong>管理序列晋升：</strong></p>
    <ul>
      <li>李明（市场部） - 晋升为市场总监</li>
      <li>张华（研发部） - 晋升为技术经理</li>
      <li>王芳（人力资源部） - 晋升为HR经理</li>
    </ul>
    <p><strong>专业序列晋升：</strong></p>
    <ul>
      <li>刘洋（研发部） - 晋升为高级开发工程师</li>
      <li>赵静（设计部） - 晋升为资深UI设计师</li>
      <li>钱伟（产品部） - 晋升为高级产品经理</li>
      <li>孙莉（测试部） - 晋升为高级测试工程师</li>
      <li>周强（运维部） - 晋升为DevOps专家</li>
    </ul>
    <p>以上人员晋升将于7月1日正式生效。</p>
    <p>公示期间，如对晋升人员有异议，请向人力资源部反馈。</p>
    <p>此致</p>
    <p>人力资源部</p>`,
    type: 'announcement', 
    isRead: true,
    tags: [{ name: '全公司', type: 'scope' }],
    attachments: [
      { name: '晋升评估标准.pdf', size: '1.8MB', type: 'pdf' }
    ]
  }
];

/**
 * 模拟通知服务类型
 * 用于前端开发中模拟通知数据的CRUD操作
 */
export class MockNotificationService {
  /**
   * 获取通知列表
   * @param {Object} params - 查询参数
   * @param {string} params.type - 通知类型
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页条数
   * @returns {Promise<Object>} 包含通知列表和分页信息的Promise
   */
  static async getNotifications(params = {}) {
    const { type = 'all', page = 1, pageSize = 10 } = params;
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let filteredData = [...notificationsData];
    
    // 按类型筛选
    if (type !== 'all') {
      filteredData = filteredData.filter(item => item.type === type);
    }
    
    // 计算分页数据
    const total = filteredData.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const data = filteredData.slice(startIndex, endIndex);
    
    return {
      list: data,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  }
  
  /**
   * 获取通知详情
   * @param {number} id - 通知ID
   * @returns {Promise<Object>} 通知详情
   */
  static async getNotificationDetail(id) {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const notification = notificationsData.find(item => item.id === Number(id));
    
    if (!notification) {
      throw new Error(`通知未找到: ID=${id}`);
    }
    
    return notification;
  }
  
  /**
   * 标记通知为已读
   * @param {number} id - 通知ID
   * @returns {Promise<boolean>} 操作结果
   */
  static async markAsRead(id) {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const notification = notificationsData.find(item => item.id === Number(id));
    
    if (notification) {
      notification.isRead = true;
      notification.isNew = false;
      return true;
    }
    
    return false;
  }
  
  /**
   * 批量标记通知为已读
   * @param {Array<number>} ids - 通知ID数组
   * @returns {Promise<number>} 成功标记数量
   */
  static async markMultipleAsRead(ids) {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let count = 0;
    
    ids.forEach(id => {
      const notification = notificationsData.find(item => item.id === Number(id));
      if (notification && !notification.isRead) {
        notification.isRead = true;
        notification.isNew = false;
        count++;
      }
    });
    
    return count;
  }
  
  /**
   * 创建新通知
   * @param {Object} notificationData - 通知数据
   * @returns {Promise<Object>} 创建的通知
   */
  static async createNotification(notificationData) {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const newId = Math.max(...notificationsData.map(n => n.id)) + 1;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const newNotification = {
      ...notificationData,
      id: newId,
      dateGroup: '今日',
      time: timeStr,
      isNew: true,
      isRead: false
    };
    
    // 添加到列表开头
    notificationsData.unshift(newNotification);
    
    return newNotification;
  }
  
  /**
   * 删除通知
   * @param {number} id - 通知ID
   * @returns {Promise<boolean>} 操作结果
   */
  static async deleteNotification(id) {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = notificationsData.findIndex(item => item.id === Number(id));
    
    if (index !== -1) {
      notificationsData.splice(index, 1);
      return true;
    }
    
    return false;
  }
} 