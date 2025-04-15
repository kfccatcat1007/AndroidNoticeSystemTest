<template>
  <button 
    :class="[
      'flex items-center justify-center transition-all duration-200 font-medium',
      sizeClasses, 
      variantClasses, 
      roundedClasses,
      { 'opacity-60 cursor-not-allowed': disabled },
      customClass
    ]"
    :disabled="disabled || loading"
    @click="$emit('click')"
  >
    <text v-if="loading" class="fas fa-spinner fa-spin mr-2" />
    <text v-else-if="icon" :class="`fas fa-${icon} ${iconPosition === 'left' ? 'mr-2' : 'ml-2 order-1'}`" />
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'UiButton',
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: (val) => ['primary', 'secondary', 'outline', 'text', 'success', 'danger', 'warning'].includes(val)
    },
    size: {
      type: String,
      default: 'md',
      validator: (val) => ['sm', 'md', 'lg'].includes(val)
    },
    rounded: {
      type: String,
      default: 'md',
      validator: (val) => ['none', 'sm', 'md', 'lg', 'full'].includes(val)
    },
    icon: {
      type: String,
      default: ''
    },
    iconPosition: {
      type: String,
      default: 'left',
      validator: (val) => ['left', 'right'].includes(val)
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    customClass: {
      type: String,
      default: ''
    }
  },
  computed: {
    sizeClasses() {
      const sizes = {
        sm: 'py-1.5 px-3 text-sm',
        md: 'py-2.5 px-4 text-base',
        lg: 'py-3 px-5 text-lg'
      };
      return sizes[this.size] || sizes.md;
    },
    variantClasses() {
      const variants = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow',
        secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
        outline: 'bg-transparent border border-gray-300 hover:bg-gray-50 text-gray-700',
        text: 'bg-transparent hover:bg-gray-100 text-blue-600 hover:text-blue-700',
        success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow',
        danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow',
        warning: 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm hover:shadow'
      };
      return variants[this.variant] || variants.primary;
    },
    roundedClasses() {
      const rounded = {
        none: 'rounded-none',
        sm: 'rounded',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full'
      };
      return rounded[this.rounded] || rounded.md;
    }
  }
};
</script> 