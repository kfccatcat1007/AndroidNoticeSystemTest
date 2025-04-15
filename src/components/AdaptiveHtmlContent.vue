<!-- AdaptiveHtmlContent.vue - Smart component that automatically selects best rendering strategy -->
<template>
  <view class="adaptive-html-container">
    <!-- WebView strategy for complex content on Android -->
    <WebViewRenderer 
      v-if="renderStrategy.strategy === 'webview'"
      :html="renderStrategy.content"
      :height="contentHeight"
      :dark-mode="darkMode"
      @error="handleRenderError"
      @loaded="handleContentLoaded"
    />
    
    <!-- Rich-text strategy for simpler content -->
    <rich-text 
      v-else-if="renderStrategy.strategy === 'richtext'"
      :nodes="renderStrategy.content" 
      class="richtext-content"
      @error="handleRenderError"
    />
    
    <!-- Fallback plain text display if all else fails -->
    <view 
      v-else-if="renderError || renderStrategy.strategy === 'fallback'"
      class="plaintext-content p-4 text-gray-800 whitespace-pre-wrap"
    >
      {{ plainTextContent }}
    </view>
    
    <!-- Empty state -->
    <view 
      v-else-if="renderStrategy.strategy === 'empty'"
      class="p-4 text-gray-500 italic"
    >
      无内容
    </view>

    <!-- Debug info for development -->
    <view v-if="showDebug" class="debug-info p-2 text-xs bg-gray-100 border-t border-gray-200">
      <text>Strategy: {{ renderStrategy.strategy }}</text>
      <text v-if="contentLength" class="ml-2">| Content: {{ contentLength }} chars</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import WebViewRenderer from './WebViewRenderer.vue';
import { getBestRenderingStrategy, htmlToPlainText } from '@/utils/htmlUtils';
import { isAndroid } from '@/utils/platform';

const props = defineProps({
  /**
   * HTML content to display
   */
  html: {
    type: String,
    default: ''
  },
  /**
   * Height of the container
   */
  height: {
    type: String,
    default: 'auto'
  },
  /**
   * Enable dark mode
   */
  darkMode: {
    type: Boolean,
    default: false
  },
  /**
   * Show debug information (in development)
   */
  showDebug: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['error', 'loaded']);
const renderError = ref(false);
const forceStrategy = ref(null);
const contentHeight = ref('60vh'); // Default height, will be adjusted

// Calculate appropriate content length for debugging
const contentLength = computed(() => props.html?.length || 0);

// Determine the best rendering strategy based on platform and content
const renderStrategy = computed(() => {
  // If we've forced a specific strategy due to errors, use that
  if (forceStrategy.value === 'fallback') {
    return { strategy: 'fallback' };
  }
  
  // Otherwise, get the best strategy based on content and platform
  const strategy = getBestRenderingStrategy(props.html);
  
  // Log strategy in development
  console.log(`Rendering strategy: ${strategy.strategy} (isAndroid: ${isAndroid()})`);
  
  return strategy;
});

// Extract plain text content for fallback display
const plainTextContent = computed(() => {
  return htmlToPlainText(props.html);
});

// Handle render errors from any of the rendering strategies
function handleRenderError(error) {
  console.error('Content render error:', error);
  renderError.value = true;
  forceStrategy.value = 'fallback';
  
  // Notify parent component
  emit('error', {
    message: 'Content rendering failed, switched to fallback mode',
    originalError: error
  });
  
  // Show user feedback
  uni.showToast({
    title: '内容渲染异常，已切换至纯文本模式',
    icon: 'none',
    duration: 2500
  });
}

// Content loaded handler
function handleContentLoaded() {
  emit('loaded');
}

// Calculate content height based on content and device
function calculateContentHeight() {
  try {
    const system = uni.getSystemInfoSync();
    const windowHeight = system.windowHeight;
    const contentSize = props.html?.length || 0;
    
    // Base height on content length - longer content gets more height
    // but capped at reasonable maximums
    if (contentSize > 10000) {
      contentHeight.value = '70vh';
    } else if (contentSize > 5000) {
      contentHeight.value = '60vh';
    } else if (contentSize > 1000) {
      contentHeight.value = '50vh';
    } else {
      contentHeight.value = '40vh';
    }
    
    // On small screens, limit maximum height
    if (windowHeight < 700) {
      const maxHeight = Math.min(parseInt(contentHeight.value), windowHeight * 0.6);
      contentHeight.value = `${maxHeight}px`;
    }
    
    console.log(`Content height set to: ${contentHeight.value}`);
  } catch (e) {
    console.error('Error calculating content height:', e);
    contentHeight.value = '50vh'; // Fallback height
  }
}

// Reset error state when content changes
watch(() => props.html, () => {
  renderError.value = false;
  calculateContentHeight();
  // Keep forceStrategy as is - if we've fallen back to text mode,
  // we'll stay there for this component instance
});

onMounted(() => {
  calculateContentHeight();
});
</script>

<style>
.adaptive-html-container {
  width: 100%;
  min-height: 200px;
}

.richtext-content {
  padding: 16px;
  width: 100%;
  overflow-x: auto;
}

.plaintext-content {
  font-size: 28rpx;
  line-height: 1.6;
  padding: 20px;
  white-space: pre-wrap;
  word-break: break-word;
}

.debug-info {
  font-family: monospace;
  color: #666;
}
</style> 