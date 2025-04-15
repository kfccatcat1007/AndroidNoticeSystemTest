<template>
  <view 
    :class="[
      'overflow-hidden transition-all duration-200',
      elevationClass,
      roundedClass,
      paddingClass,
      { 'border border-gray-200': bordered },
      { 'bg-white': !transparent },
      customClass
    ]"
  >
    <view v-if="$slots.header" :class="['border-b border-gray-100 pb-3 mb-3', headerClass]">
      <slot name="header"></slot>
    </view>
    
    <slot></slot>
    
    <view v-if="$slots.footer" :class="['border-t border-gray-100 pt-3 mt-3', footerClass]">
      <slot name="footer"></slot>
    </view>
  </view>
</template>

<script>
export default {
  name: 'UiCard',
  props: {
    elevation: {
      type: String,
      default: 'md',
      validator: (val) => ['none', 'sm', 'md', 'lg', 'xl'].includes(val)
    },
    rounded: {
      type: String,
      default: 'md',
      validator: (val) => ['none', 'sm', 'md', 'lg', 'xl'].includes(val)
    },
    padding: {
      type: String,
      default: 'md',
      validator: (val) => ['none', 'sm', 'md', 'lg', 'xl'].includes(val)
    },
    bordered: {
      type: Boolean,
      default: false
    },
    transparent: {
      type: Boolean,
      default: false
    },
    headerClass: {
      type: String,
      default: ''
    },
    footerClass: {
      type: String,
      default: ''
    },
    customClass: {
      type: String,
      default: ''
    }
  },
  computed: {
    elevationClass() {
      const elevations = {
        none: '',
        sm: 'shadow-sm',
        md: 'shadow',
        lg: 'shadow-md',
        xl: 'shadow-lg'
      };
      return elevations[this.elevation] || elevations.md;
    },
    roundedClass() {
      const rounded = {
        none: 'rounded-none',
        sm: 'rounded',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl'
      };
      return rounded[this.rounded] || rounded.md;
    },
    paddingClass() {
      const padding = {
        none: 'p-0',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-5',
        xl: 'p-6'
      };
      return padding[this.padding] || padding.md;
    }
  }
};
</script> 