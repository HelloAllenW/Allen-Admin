import { defineConfig, loadEnv, ConfigEnv, UserConfig } from "vite";
import { resolve } from "path";
import { wrapperEnv } from "./build/getEnv";
import { createProxy } from "./build/proxy";
import { createVitePlugins } from "./build/plugins";
import pkg from "./package.json";
import dayjs from "dayjs";

const { dependencies, devDependencies, name, version } = pkg;
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: dayjs().format("YYYY-MM-DD HH:mm:ss")
};

// @see: https://cn.vitejs.dev/config/
// 使用 defineConfig 工具函数可以实现下面配置项的智能提示。
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  // root 为当前项目所在的绝对路径
  const root = process.cwd();
  // mode 为当前环境，比如开发环境下mode为development。env为当前环境下的配置文件内容
  const env = loadEnv(mode, root);
  // 上述env返回的配置文件对象的value都为字符串，通过wrapperEnv方法将对应value中的Number、Boolean、JSON进行还原。
  const viteEnv = wrapperEnv(env);

  return {
    base: viteEnv.VITE_PUBLIC_PATH,
    // 项目根目录（index.html 文件所在的位置）
    root,
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
        /**
         * 这条配置是为了解决使用 $t 时控制台出现的警告信息：
         * You are running the esm-bundler build of vue-i18n.
         * It is recommended to configure your bundler to explicitly replace feature flag globals with boolean literals to get proper tree-shaking in the final bundle.
         */
        "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js"
      }
    },
    // 定义全局常量替换方式
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__)
    },
    css: {
      // 该选项可以用来为每一段样式内容添加额外的代码
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/var.scss";`
        }
      }
    },
    server: {
      host: "0.0.0.0",
      port: viteEnv.VITE_PORT,
      open: viteEnv.VITE_OPEN,
      cors: true,
      // Load proxy configuration from .env.development
      proxy: createProxy(viteEnv.VITE_PROXY)
    },
    plugins: createVitePlugins(viteEnv),
    esbuild: {
      pure: viteEnv.VITE_DROP_CONSOLE ? ["console.log", "debugger"] : []
    },
    build: {
      // 指定输出路径（相对于项目根目录）
      outDir: "dist",
      // 默认为 esbuild，它比 terser 快 20-40 倍，压缩率只差 1%-2%。
      minify: "esbuild",
      // esbuild 打包更快，但是不能去除 console.log，terser打包慢，但能去除 console.log
      // minify: "terser",
      sourcemap: false,
      // 禁用 gzip 压缩大小报告，可略微减少打包时间
      reportCompressedSize: false,
      // 规定触发警告的 chunk 大小
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          // Static resource classification and packaging
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: "assets/[ext]/[name]-[hash].[ext]"
        }
      }
    }
  };
});
