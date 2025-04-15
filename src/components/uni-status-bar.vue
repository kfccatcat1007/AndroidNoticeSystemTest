<template>
  <view
    :style="{ height: statusBarHeight + 'px', backgroundColor: bgColor }"
    class="status-bar"
  >
    <slot></slot>
  </view>
</template>

<script>
export default {
  name: 'UniStatusBar',
  props: {
    bgColor: {
      type: String,
      default: 'transparent'
    }
  },
  data() {
    return {
      statusBarHeight: 20
    }
  },
  mounted() {
    this.initStatusBarHeight()
  },
  methods: {
    initStatusBarHeight() {
      // 获取系统状态栏高度
      try {
        const systemInfo = uni.getSystemInfoSync()
        this.statusBarHeight = systemInfo.statusBarHeight || 20
        console.log('Status bar height:', this.statusBarHeight)
      } catch (e) {
        console.error('获取状态栏高度失败', e)
      }
    }
  }
}
</script>

<style scoped>
.status-bar {
  width: 100%;
}
</style> 