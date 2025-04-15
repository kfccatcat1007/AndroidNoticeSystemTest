import { defineConfig } from 'vite';
import postcssNesting from 'postcss-nesting';
import tailwindcss from 'tailwindcss';
import tailwindcssConfig from './tailwind.config.js'; // 注意匹配实际文件
import postcssPresetEnv from 'postcss-preset-env';
import uni from '@dcloudio/vite-plugin-uni';
import uniTailwind from '@uni-helper/vite-plugin-uni-tailwind';

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    // 只能在 Vite 配置文件内处理 postcss 配置
    // https://github.com/dcloudio/uni-app/issues/3367
    postcss: {
      plugins: [
        postcssNesting(),
        tailwindcss({
          config: tailwindcssConfig,
        }),
        postcssPresetEnv({
          stage: 3,
          features: { 'nesting-rules': false },
        }),
      ],
    },
  },
  plugins: [
    uni(),
    uniTailwind({
      /* options */
    }),
  ],
});