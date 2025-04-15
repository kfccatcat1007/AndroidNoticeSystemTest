// 公司通知APP - 交互脚本

document.addEventListener('DOMContentLoaded', function() {
    // 初始化页面加载动画
    initPageAnimations();
    
    // 初始化交互效果
    initInteractions();
    
    // 模拟数据加载
    simulateLoading();
});

// 页面加载动画
function initPageAnimations() {
    // 给主要内容添加进入动画
    const mainContent = document.querySelector('.flex-1');
    if (mainContent) {
        mainContent.classList.add('fade-in');
    }
    
    // 给列表项添加进入动画
    const listItems = document.querySelectorAll('.block.bg-white');
    if (listItems.length > 0) {
        listItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('slide-up');
            }, 100 * index);
        });
    }
}

// 初始化交互效果
function initInteractions() {
    // 添加卡片点击效果
    const cards = document.querySelectorAll('.block.bg-white');
    if (cards.length > 0) {
        cards.forEach(card => {
            card.classList.add('card-hover');
        });
    }
    
    // 添加按钮点击效果
    const buttons = document.querySelectorAll('button');
    if (buttons.length > 0) {
        buttons.forEach(button => {
            button.classList.add('btn-effect');
        });
    }
    
    // 导航栏选项卡切换
    const tabButtons = document.querySelectorAll('.px-4.flex.space-x-6 button');
    if (tabButtons.length > 0) {
        tabButtons.forEach(tab => {
            tab.addEventListener('click', function() {
                // 移除所有选中状态
                tabButtons.forEach(t => {
                    t.classList.remove('text-blue-600', 'border-b-2', 'border-blue-600');
                    t.classList.add('text-gray-500');
                });
                
                // 添加当前选中状态
                this.classList.remove('text-gray-500');
                this.classList.add('text-blue-600', 'border-b-2', 'border-blue-600');
            });
        });
    }
    
    // 表单提交事件
    const forms = document.querySelectorAll('form');
    if (forms.length > 0) {
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // 简单的表单验证
                const inputs = this.querySelectorAll('input[required]');
                let isValid = true;
                
                inputs.forEach(input => {
                    if (!input.value.trim()) {
                        isValid = false;
                        input.classList.add('border-red-500');
                    } else {
                        input.classList.remove('border-red-500');
                    }
                });
                
                if (isValid) {
                    // 模拟表单提交
                    const submitButton = this.querySelector('button[type="submit"]');
                    if (submitButton) {
                        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> 处理中...';
                        submitButton.disabled = true;
                        
                        // 模拟提交后跳转
                        setTimeout(() => {
                            window.location.href = this.getAttribute('action');
                        }, 1500);
                    }
                }
            });
        });
    }
    
    // 详情页面底部操作按钮
    const markReadBtn = document.querySelector('.fixed.bottom-0 button.flex-1');
    if (markReadBtn) {
        markReadBtn.addEventListener('click', function() {
            this.innerHTML = '<i class="fas fa-check mr-2"></i> 已读';
            this.classList.remove('bg-blue-600');
            this.classList.add('bg-green-600');
        });
    }
}

// 模拟数据加载
function simulateLoading() {
    // 在某些特定页面模拟加载更多内容
    const notificationList = document.querySelector('.flex-1.overflow-y-auto');
    if (notificationList) {
        // 监听滚动事件，到达底部时加载更多
        notificationList.addEventListener('scroll', function() {
            if (this.scrollHeight - this.scrollTop < this.clientHeight + 100) {
                // 检查是否已经有加载指示器
                if (!document.querySelector('.loading-indicator')) {
                    loadMoreNotifications();
                }
            }
        });
    }
}

// 加载更多通知
function loadMoreNotifications() {
    const notificationList = document.querySelector('.flex-1.overflow-y-auto');
    if (!notificationList) return;
    
    // 创建加载指示器
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator p-4 text-center text-gray-500';
    loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> 加载更多...';
    notificationList.appendChild(loadingIndicator);
    
    // 模拟延迟后添加更多内容
    setTimeout(() => {
        // 移除加载指示器
        loadingIndicator.remove();
        
        // 在某个特定日期分组下添加更多通知（模拟数据）
        const lastDateGroup = notificationList.querySelectorAll('.pt-4.px-4')[notificationList.querySelectorAll('.pt-4.px-4').length - 1];
        if (lastDateGroup) {
            // 这里可以通过克隆现有的通知项来创建新的通知
            const existingNotifications = document.querySelectorAll('.block.bg-white');
            if (existingNotifications.length > 0) {
                const clone = existingNotifications[Math.floor(Math.random() * existingNotifications.length)].cloneNode(true);
                
                // 修改克隆的通知以区别于原通知
                const title = clone.querySelector('h3');
                if (title) {
                    title.textContent = '新增：' + title.textContent;
                }
                
                lastDateGroup.appendChild(clone);
                
                // 添加动画效果
                setTimeout(() => {
                    clone.classList.add('slide-up');
                }, 100);
            }
        }
    }, 1500);
} 