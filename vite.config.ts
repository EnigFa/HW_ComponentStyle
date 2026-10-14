import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://127.0.0.1:7000",
        changeOrigin: true,
        secure: false
      },
      "/categories": {
        target: "https://127.0.0.1:7000",
        changeOrigin: true,
        secure: false
      },
      "/images": {
        target: "https://127.0.0.1:7000",
        changeOrigin: true,
        secure: false
      },
      "/products": {
        target: "https://127.0.0.1:7000",
        changeOrigin: true,
        secure: false
      }
    }
  }
});
