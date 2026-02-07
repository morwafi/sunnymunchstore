import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import autoprefixer from "autoprefixer";

export default ({ mode }) => {
  // Load env from your custom folder
  const env = loadEnv(mode, path.resolve(__dirname, "/../MainEnv"), "");

  return defineConfig({
    plugins: [react(), tailwindcss()],

    server: {
      allowedHosts: ["dev.sinceitssunny.com"],
      host: true,
      port: 5173,
      strictPort: true,
      proxy: {
        "/api": {
          target: "https://managementdev.sinceitssunny.com",
          changeOrigin: true,
          secure: false,
        },
      },
    },

    define: {
      "import.meta.env": env,
    },

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  });
};
