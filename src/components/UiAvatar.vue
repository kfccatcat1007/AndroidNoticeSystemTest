<template>
  <view 
    :class="[
      'flex items-center justify-center overflow-hidden',
      sizeClass,
      roundedClass,
      { 'border-2': bordered },
      borderColorClass,
      { 'shadow': shadow },
      statusPositionClass,
      customClass
    ]"
    :style="backgroundColor ? `background-color: ${backgroundColor}` : ''"
  >
    <!-- Image Avatar -->
    <image 
      v-if="src" 
      :src="src" 
      mode="aspectFill"
      class="w-full h-full object-cover"
    />
    
    <!-- Text Avatar -->
    <text 
      v-else-if="text" 
      :class="[
        'font-semibold text-center',
        textSizeClass,
        textColorClass
      ]"
    >
      {{ initials }}
    </text>
    
    <!-- Icon Avatar -->
    <text 
      v-else-if="icon"
      :class="[
        'fas', 
        `fa-${icon}`,
        iconSizeClass,
        iconColorClass
      ]"
    ></text>

    <!-- Status indicator -->
    <view
      v-if="status"
      :class="[
        'absolute rounded-full border-2 border-white',
        statusSizeClass,
        statusClass
      ]"
    ></view>
  </view>
</template>

<script>
export default {
  name: 'UiAvatar',
  props: {
    src: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'md',
      validator: (val) => ['xs', 'sm', 'md', 'lg', 'xl', '2xl'].includes(val)
    },
    rounded: {
      type: String,
      default: 'full',
      validator: (val) => ['none', 'sm', 'md', 'lg', 'xl', 'full'].includes(val)
    },
    bordered: {
      type: Boolean,
      default: false
    },
    borderColor: {
      type: String,
      default: 'white'
    },
    textColor: {
      type: String,
      default: 'white'
    },
    iconColor: {
      type: String,
      default: 'white'
    },
    backgroundColor: {
      type: String,
      default: ''
    },
    shadow: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      default: '',
      validator: (val) => ['', 'online', 'offline', 'busy', 'away'].includes(val)
    },
    statusPosition: {
      type: String,
      default: 'bottom-right',
      validator: (val) => ['top-right', 'top-left', 'bottom-right', 'bottom-left'].includes(val)
    },
    customClass: {
      type: String,
      default: ''
    }
  },
  computed: {
    sizeClass() {
      const sizes = {
        xs: 'w-6 h-6',
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16',
        '2xl': 'w-20 h-20'
      };
      return sizes[this.size] || sizes.md;
    },
    textSizeClass() {
      const sizes = {
        xs: 'text-xs',
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
        '2xl': 'text-2xl'
      };
      return sizes[this.size] || sizes.md;
    },
    iconSizeClass() {
      const sizes = {
        xs: 'text-xs',
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
        '2xl': 'text-2xl'
      };
      return sizes[this.size] || sizes.md;
    },
    roundedClass() {
      const rounded = {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full'
      };
      return rounded[this.rounded] || rounded.full;
    },
    borderColorClass() {
      const colors = {
        white: 'border-white',
        gray: 'border-gray-200',
        primary: 'border-blue-500'
      };
      return this.bordered ? (colors[this.borderColor] || colors.white) : '';
    },
    textColorClass() {
      const colors = {
        white: 'text-white',
        gray: 'text-gray-700',
        primary: 'text-blue-500'
      };
      return colors[this.textColor] || colors.white;
    },
    iconColorClass() {
      const colors = {
        white: 'text-white',
        gray: 'text-gray-700',
        primary: 'text-blue-500'
      };
      return colors[this.iconColor] || colors.white;
    },
    statusClass() {
      const statusColors = {
        online: 'bg-green-500',
        offline: 'bg-gray-400',
        busy: 'bg-red-500',
        away: 'bg-yellow-500'
      };
      return statusColors[this.status] || '';
    },
    statusSizeClass() {
      const sizes = {
        xs: 'w-1.5 h-1.5',
        sm: 'w-2 h-2',
        md: 'w-2.5 h-2.5',
        lg: 'w-3 h-3',
        xl: 'w-3.5 h-3.5',
        '2xl': 'w-4 h-4'
      };
      return sizes[this.size] || sizes.md;
    },
    statusPositionClass() {
      const positions = {
        'top-right': 'relative before:absolute before:top-0 before:right-0',
        'top-left': 'relative before:absolute before:top-0 before:left-0',
        'bottom-right': 'relative before:absolute before:bottom-0 before:right-0',
        'bottom-left': 'relative before:absolute before:bottom-0 before:left-0'
      };
      return this.status ? positions[this.statusPosition] || positions['bottom-right'] : '';
    },
    initials() {
      if (!this.text) return '';
      
      return this.text
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
  }
};
</script> 