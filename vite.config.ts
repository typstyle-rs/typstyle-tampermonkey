import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';
import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    wasm(),
    topLevelAwait(),
    monkey({
      entry: 'src/main.ts',
      userscript: {
        author: 'paran3xus',
        namespace: 'npm/vite-plugin-monkey',
        match: ['https://typst.app/*'],
        resource: {
          css: './src/style.css'
        }
      },
    }),
  ],
  resolve: {
    extensions: ['.ts', '.js', '.json']
  }
});
