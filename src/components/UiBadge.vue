<template>
  <view 
    :class="[
      'inline-flex items-center justify-center',
      sizeClass,
      variantClass,
      { 'rounded-full': rounded, 'rounded': !rounded },
      { 'animate-pulse': pulsing },
      customClass
    ]"
  >
    <text v-if="$slots.default" :class="textClass">
      <slot></slot>
    </text>
    <text v-else-if="icon" :class="['fas', `fa-${icon}`, iconClass]"></text>
    <text v-else-if="dot" class="block w-1.5 h-1.5 rounded-full"></text>
  </view>
</template>

<script>
export default {
  name: 'UiBadge',
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: (val) => ['primary', 'secondary', 'success', 'danger', 'warning', 'info'].includes(val)
    },
    size: {
      type: String,
      default: 'md',
      validator: (val) => ['xs', 'sm', 'md', 'lg'].includes(val)
    },
    rounded: {
      type: Boolean,
      default: true
    },
    icon: {
      type: String,
      default: ''
    },
    dot: {
      type: Boolean,
      default: false
    },
    pulsing: {
      type: Boolean,
      default: false
    },
    customClass: {
      type: String,
      default: ''
    }
  },
  computed: {
    variantClass() {
      const variants = {
        primary: 'bg-blue-500 text-white',
        secondary: 'bg-gray-200 text-gray-800',
        success: 'bg-green-500 text-white', 
        danger: 'bg-red-500 text-white',
        warning: 'bg-amber-500 text-white',
        info: 'bg-sky-500 text-white'
      };
      return variants[this.variant] || variants.primary;
    },
    sizeClass() {
      if (this.dot) return 'w-2 h-2';
      
      const sizes = {
        xs: 'px-1 py-0.5 text-xs',
        sm: 'px-1.5 py-0.5 text-xs',
        md: 'px-2 py-1 text-xs',
        lg: 'px-2.5 py-1 text-sm'
      };
      return sizes[this.size] || sizes.md;
    },
    textClass() {
      const sizes = {
        xs: 'text-xs',
        sm: 'text-xs',
        md: 'text-xs',
        lg: 'text-sm'
      };
      return sizes[this.size] || sizes.md;
    },
    iconClass() {
      const sizes = {
        xs: 'text-xs',
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base'
      };
      return sizes[this.size] || sizes.md;
    }
  }
};
</script> 