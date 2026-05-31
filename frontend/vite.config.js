import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  build: {
    outDir: "build",
    emptyOutDir: true,
  },
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "https://flow-board-project-management-platform.onrender.com",
        changeOrigin: true,
      },
    },
  },
});
