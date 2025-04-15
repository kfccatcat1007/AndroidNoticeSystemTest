export default function uniAppPlugin({ addComponents, addUtilities, theme, config }) {
  // 通用组件映射
  const componentMap = {
    // 输入类组件
    'input': '.uni-input, .uni-easyinput__content, uni-input, .uni-input-wrapper input',
    'textarea': '.uni-textarea, uni-textarea, .uni-textarea-wrapper textarea',
    'checkbox': '.uni-checkbox, uni-checkbox, .uni-checkbox-wrapper, .uni-checkbox-input, checkbox, .checkbox',
    'radio': '.uni-radio, uni-radio, .uni-radio-wrapper, .uni-radio-input, radio, .radio',
    'switch': '.uni-switch, uni-switch, .uni-switch-wrapper',
    
    // 按钮类组件
    'button': '.uni-button, uni-button, .uni-btn, button[type="button"], button[type="submit"], button[type="reset"]',
    
    // 列表类组件
    'list': '.uni-list, uni-list, .uni-list-wrapper',
    'list-item': '.uni-list-item, uni-list-item, .uni-list-item-wrapper',
    
    // 表单类组件
    'form': '.uni-forms, uni-forms, .uni-form, form',
    'form-item': '.uni-forms-item, .uni-form-item, .uni-field',
    
    // 导航类组件
    'nav': '.uni-navbar, uni-navbar, .uni-nav',
    'tab': '.uni-tab, uni-tab, .uni-tabs-item',
    'tabbar': '.uni-tabbar, uni-tabbar, .uni-tab-bar',
    
    // 其他常用组件
    'card': '.uni-card, uni-card, .uni-card-wrapper',
    'popup': '.uni-popup, uni-popup, .uni-popup-wrapper',
    'modal': '.uni-modal, uni-modal, .uni-modal-wrapper',
    'select': '.uni-select, uni-select, .uni-select-wrapper, uni-data-select',
    'picker': '.uni-picker, uni-picker, .uni-picker-wrapper, uni-datetime-picker',
    'image': '.uni-image, uni-image, image',
    'icon': '.uni-icon, uni-icon, .uniui-icon',
    'badge': '.uni-badge, uni-badge',
    'tag': '.uni-tag, uni-tag',
  };
  
  // 定义各组件样式
  const components = {};
  
  // 为每个组件添加样式桥接
  Object.entries(componentMap).forEach(([baseComponent, uniSelectors]) => {
    // 获取Tailwind相关的基础样式
    const baseStyles = getBaseStylesForComponent(baseComponent, theme);
    
    // 为uni-app选择器添加这些样式
    uniSelectors.split(',').forEach(selector => {
      const trimmedSelector = selector.trim();
      components[trimmedSelector] = {
        ...baseStyles,
        // 添加组件特定样式覆盖
        ...getComponentSpecificStyles(baseComponent, theme)
      };
    });
  });
  
  // 添加特定的checkbox和radio元素样式
  components['checkbox::before'] = {
    content: '""',
    display: 'block',
    width: '100%',
    height: '100%',
    borderRadius: theme('borderRadius.sm', '0.125rem'),
    backgroundColor: 'transparent',
    position: 'absolute',
    left: '0',
    top: '0',
    zIndex: '1'
  };
  
  components['checkbox[checked]::before'] = {
    backgroundColor: theme('colors.blue.500', '#3b82f6') + ' !important',
    backgroundImage: `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e") !important`,
    backgroundSize: 'cover !important',
    backgroundPosition: 'center !important',
    backgroundRepeat: 'no-repeat !important',
    borderColor: theme('colors.blue.500', '#3b82f6') + ' !important'
  };
  
  components['radio::before'] = {
    content: '""',
    display: 'block',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    backgroundColor: 'transparent',
    position: 'absolute',
    left: '0',
    top: '0',
    zIndex: '1'
  };
  
  components['radio[checked]::before'] = {
    backgroundColor: theme('colors.blue.500', '#3b82f6') + ' !important',
    backgroundImage: `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='4'/%3e%3c/svg%3e") !important`,
    backgroundSize: 'cover !important',
    backgroundPosition: 'center !important',
    backgroundRepeat: 'no-repeat !important',
    borderColor: theme('colors.blue.500', '#3b82f6') + ' !important'
  };
  
  // 添加所有组件样式
  addComponents(components);
  
  // 添加直接覆盖样式
  addComponents({
    'checkbox, radio': {
      position: 'relative !important',
      appearance: 'none !important',
      width: '16px !important',
      height: '16px !important',
      borderWidth: '1px !important',
      borderStyle: 'solid !important',
      borderColor: theme('colors.gray.300', '#d1d5db') + ' !important',
      backgroundColor: theme('colors.white', 'white') + ' !important',
      cursor: 'pointer !important',
      display: 'inline-flex !important',
      alignItems: 'center !important',
      justifyContent: 'center !important',
      '&:focus': {
        outline: 'none !important',
        boxShadow: `0 0 0 2px ${theme('colors.blue.100', 'rgba(59, 130, 246, 0.3)')} !important`
      }
    },
    'checkbox': {
      borderRadius: theme('borderRadius.sm', '0.125rem') + ' !important',
    },
    'radio': {
      borderRadius: '50% !important',
    },
    'checkbox[checked], radio[checked]': {
      borderColor: theme('colors.blue.500', '#3b82f6') + ' !important',
      backgroundColor: theme('colors.blue.500', '#3b82f6') + ' !important',
    }
  });

  // 添加UniApp组件基本样式
  const uniComponents = {
    'uni-view': {
      display: 'block',
    },
    'uni-text': {
      display: 'inline',
    },
    'uni-button': {
      appearance: 'none',
      'text-align': 'center',
      'border-radius': '4px',
      padding: '0.5rem 1rem',
      'line-height': '1.5',
    },
    'uni-navigator': {
      display: 'block',
      'text-decoration': 'none',
    },
    'uni-scroll-view': {
      display: 'block',
      overflow: 'auto',
    }
  };

  // 添加特定功能修复
  const uniUtilities = {
    // 修复border-b-2等边框样式
    '.border-b-2': {
      'border-bottom-width': '2px',
      'border-bottom-style': 'solid',
    },
    '.border-b': {
      'border-bottom-width': '1px',
      'border-bottom-style': 'solid',
    },
    '.border-t-2': {
      'border-top-width': '2px',
      'border-top-style': 'solid',
    },
    '.border-t': {
      'border-top-width': '1px',
      'border-top-style': 'solid',
    },
    
    // 修复间距问题
    '.space-x-6 > * + *': {
      'margin-left': '1.5rem',
    },
    '.mr-6': {
      'margin-right': '1.5rem',
    },
    
    // 修复点击效果
    '.cursor-pointer': {
      cursor: 'pointer',
    },
    
    // 修复滚动条隐藏
    '.hide-scrollbar': {
      '-ms-overflow-style': 'none',
      'scrollbar-width': 'none',
    },
    '.hide-scrollbar::-webkit-scrollbar': {
      display: 'none',
    },
  };

  addComponents(uniComponents);
  addUtilities(uniUtilities);
}

// 根据组件类型获取基础样式
function getBaseStylesForComponent(component, theme) {
  const styles = {
    // 通用样式
    transition: 'all 0.2s ease',
  };
  
  // 组件特定基础样式
  switch(component) {
    case 'input':
    case 'textarea':
      return {
        ...styles,
        backgroundColor: theme('colors.white', 'white'),
        borderRadius: theme('borderRadius.md', '0.375rem'),
        borderWidth: '1px',
        borderColor: theme('colors.gray.200', '#e5e7eb'),
        padding: `${theme('spacing.2', '0.5rem')} ${theme('spacing.3', '0.75rem')}`,
        width: '100%',
        outline: 'none',
        '&:focus': {
          borderColor: theme('colors.blue.500', '#3b82f6'),
          boxShadow: `0 0 0 2px ${theme('colors.blue.100', 'rgba(59, 130, 246, 0.3)')}`
        }
      };
    case 'button':
      return {
        ...styles,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: theme('borderRadius.md', '0.375rem'),
        fontWeight: theme('fontWeight.medium', '500'),
        padding: `${theme('spacing.2', '0.5rem')} ${theme('spacing.4', '1rem')}`,
        '&:active': {
          opacity: '0.9'
        }
      };
    case 'checkbox':
    case 'radio':
      return {
        ...styles,
        position: 'relative',
        appearance: 'none',
        width: theme('spacing.4', '1rem'),
        height: theme('spacing.4', '1rem'),
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: theme('colors.gray.300', '#d1d5db'),
        backgroundColor: theme('colors.white', 'white'),
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&:checked': {
          borderColor: theme('colors.blue.500', '#3b82f6'),
          backgroundColor: theme('colors.blue.500', '#3b82f6'),
        },
        '&:focus': {
          outline: 'none',
          boxShadow: `0 0 0 2px ${theme('colors.blue.100', 'rgba(59, 130, 246, 0.3)')}`
        }
      };
    case 'switch':
      return {
        ...styles,
        position: 'relative',
        display: 'inline-block',
        width: '2.5rem',
        height: '1.5rem',
        verticalAlign: 'middle',
        backgroundColor: theme('colors.gray.300', '#d1d5db'),
        borderRadius: '9999px',
        transition: 'background-color 0.2s',
        cursor: 'pointer',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '0.125rem',
          left: '0.125rem',
          width: '1.25rem',
          height: '1.25rem',
          borderRadius: '50%',
          backgroundColor: theme('colors.white', 'white'),
          transition: 'transform 0.2s',
        },
        '&:checked': {
          backgroundColor: theme('colors.blue.500', '#3b82f6'),
          '&::after': {
            transform: 'translateX(1rem)',
          }
        }
      };
    case 'select':
      return {
        ...styles,
        backgroundColor: theme('colors.white', 'white'),
        borderRadius: theme('borderRadius.md', '0.375rem'),
        borderWidth: '1px',
        borderColor: theme('colors.gray.200', '#e5e7eb'),
        padding: `${theme('spacing.2', '0.5rem')} ${theme('spacing.3', '0.75rem')}`,
        paddingRight: theme('spacing.8', '2rem'),
        width: '100%',
        outline: 'none',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
        backgroundPosition: `right ${theme('spacing.2', '0.5rem')} center`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '1.5em 1.5em',
        '&:focus': {
          borderColor: theme('colors.blue.500', '#3b82f6'),
          boxShadow: `0 0 0 2px ${theme('colors.blue.100', 'rgba(59, 130, 246, 0.3)')}`
        }
      };
    case 'card':
      return {
        ...styles,
        backgroundColor: theme('colors.white', 'white'),
        borderRadius: theme('borderRadius.lg', '0.5rem'),
        boxShadow: theme('boxShadow.md', '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'),
        overflow: 'hidden',
      };
    case 'tag':
      return {
        ...styles,
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: theme('borderRadius.full', '9999px'),
        fontSize: theme('fontSize.xs', '0.75rem'),
        lineHeight: theme('lineHeight.4', '1rem'),
        padding: `${theme('spacing.0.5', '0.125rem')} ${theme('spacing.2', '0.5rem')}`,
        fontWeight: theme('fontWeight.medium', '500'),
      };
    case 'badge':
      return {
        ...styles,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: theme('borderRadius.full', '9999px'),
        fontSize: theme('fontSize.xs', '0.75rem'),
        lineHeight: theme('lineHeight.4', '1rem'),
        minWidth: theme('spacing.5', '1.25rem'),
        height: theme('spacing.5', '1.25rem'),
        padding: `0 ${theme('spacing.1.5', '0.375rem')}`,
        fontWeight: theme('fontWeight.medium', '500'),
      };
    // 添加更多组件样式...
    default:
      return styles;
  }
}

// 组件特定样式覆盖
function getComponentSpecificStyles(component, theme) {
  switch(component) {
    case 'input':
      return {
        // 输入框特定样式
        fontSize: theme('fontSize.sm', '0.875rem'),
      };
    case 'button':
      return {
        // 按钮特定样式
        cursor: 'pointer',
        textAlign: 'center',
        lineHeight: '1.25rem',
      };
    case 'checkbox':
      return {
        // 复选框特定样式
        position: 'relative',
        borderRadius: theme('borderRadius.sm', '0.125rem'),
        '&:checked': {
          backgroundImage: `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        },
      };
    case 'radio':
      return {
        // 单选框特定样式
        position: 'relative',
        borderRadius: '50%',
        '&:checked': {
          backgroundImage: `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='4'/%3e%3c/svg%3e")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        },
      };
    case 'tag':
      return {
        // 标签特定样式 
        backgroundColor: theme('colors.gray.100', '#f3f4f6'),
        color: theme('colors.gray.700', '#374151'),
      };
    case 'badge': 
      return {
        // 徽章特定样式
        backgroundColor: theme('colors.red.500', '#ef4444'),
        color: theme('colors.white', 'white'),
      };
    // 其他组件特定样式...
    default:
      return {};
  }
} 