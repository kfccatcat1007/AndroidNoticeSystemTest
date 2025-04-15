<!-- WebViewRenderer.vue - Component for rendering HTML content in a WebView -->
<template>
  <view class="web-view-container" :style="{ height }">
    <web-view
      :webview-styles="webviewStyles"
      :src="webviewSrc"
      @message="handleMessage"
      @onPostMessage="handleMessage"
      @error="handleError"
    ></web-view>
    <view v-if="loading" class="loading-overlay flex items-center justify-center">
      <view class="loading-spinner"></view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { createWebViewHtml } from '@/utils/htmlUtils';

const props = defineProps({
  /**
   * HTML content to render
   */
  html: {
    type: String,
    default: ''
  },
  /**
   * Height of the WebView container
   */
  height: {
    type: String,
    default: '50vh' // Changed from 100vh to 50vh as default
  },
  /**
   * Enable dark mode
   */
  darkMode: {
    type: Boolean,
    default: false
  },
  /**
   * Additional styles to apply to the WebView
   */
  webviewStyles: {
    type: Object,
    default: () => ({
      progress: { color: '#3B82F6' }
    })
  }
});

const emit = defineEmits(['loaded', 'error']);
const loading = ref(true);
const htmlError = ref(false);
const hasContent = computed(() => props.html && props.html.trim().length > 0);

// Generate a base64 data URI for the WebView
const webviewSrc = computed(() => {
  if (!hasContent.value) {
    console.warn('WebViewRenderer: No content provided');
    return 'data:text/html,<html><body><p style="padding:16px;color:#666;font-family:system-ui;">No content available</p></body></html>';
  }

  try {
    // Add script to notify when content is loaded
    const scriptTag = `
      <script>
        document.addEventListener('DOMContentLoaded', function() {
          // Try to notify parent (works in some environments)
          try {
            window.parent.postMessage({type: 'contentLoaded'}, '*');
          } catch(e) {
            console.error('Failed to notify parent:', e);
          }
          
          // For Android, adjust document height to fit content
          document.body.style.minHeight = '100vh';
          document.documentElement.style.height = 'auto';
        });
      </` + `script>
    `;
    
    // Create full HTML document with the script and content
    const fullHtml = createWebViewHtml(props.html + scriptTag, props.darkMode);
    
    // Convert to base64
    try {
      const base64Html = uni.arrayBufferToBase64(new TextEncoder().encode(fullHtml));
      return 'data:text/html;base64,' + base64Html;
    } catch (encodeError) {
      // Fallback if base64 encoding fails
      console.error('Base64 encoding failed:', encodeError);
      return 'data:text/html;charset=utf-8,' + encodeURIComponent(fullHtml);
    }
  } catch (error) {
    console.error('WebViewRenderer: Error creating HTML content', error);
    htmlError.value = true;
    emit('error', error);
    return 'data:text/html,<html><body><p style="padding:16px;color:red;font-family:system-ui;">Error loading content</p></body></html>';
  }
});

// Handle messages from the WebView
function handleMessage(event) {
  console.log('WebView message received:', event);
  
  // Check for different message formats (varies by platform)
  const data = event.detail?.data || event.data;
  
  if (data === 'loaded' || (typeof data === 'object' && data?.type === 'contentLoaded')) {
    loading.value = false;
    emit('loaded');
  }
}

// Handle WebView errors
function handleError(error) {
  console.error('WebView error:', error);
  loading.value = false;
  htmlError.value = true;
  emit('error', error);
}

// Watch for content changes
watch(() => props.html, () => {
  // Reset loading state when content changes
  loading.value = true;
});

onMounted(() => {
  // Add a message listener for the parent window
  try {
    window.addEventListener('message', handleMessage);
  } catch (e) {
    // This might fail in some environments, that's ok
  }
  
  // Set a timeout to ensure loading state is eventually cleared
  setTimeout(() => {
    if (loading.value) {
      loading.value = false;
      console.log('WebView loading timeout - assuming content loaded');
      if (!htmlError.value) {
        emit('loaded');
      }
    }
  }, 3000); // Reduced from 5000ms to 3000ms
  
  // Keep another timeout as a safeguard against possible WebView issues
  setTimeout(() => {
    // Double check we're still mounted before emitting
    if (loading.value) {
      loading.value = false;
      console.warn('WebView final timeout reached');
      emit('loaded');
    }
  }, 5000);
});
</script>

<style>
.web-view-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  background-color: #ffffff;
  min-height: 200px; /* Ensure minimum height */
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 100;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3B82F6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>