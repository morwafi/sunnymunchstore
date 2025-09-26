import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default ({ mode }) => {
  // Load env from your custom folder
  const env = loadEnv(mode, path.resolve(__dirname, '../MainEnv'));

  return defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
      allowedHosts: ["admindev.sunnymunch.com"],
      host: true,
      port: 5173,
    },
    define: {
      'development.env': env,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  });
};