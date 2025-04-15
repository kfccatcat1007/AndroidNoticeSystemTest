<template>
  <view :class="classes">
    <slot></slot>
  </view>
</template>

<script>
export default {
  name: 'TailwindAdapter',
  props: {
    classes: {
      type: String,
      default: ''
    }
  }
};
</script> 