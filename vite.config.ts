import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Split heavy vendor code into its own chunks so the initial JS
        // payload stays small and the vendor files hit Vercel's CDN
        // edge cache on repeat visits. Names are content-hashed; the
        // only constraint is that no two entries land in the same chunk.
        manualChunks: {
          framer: ["framer-motion"],
          radix: ["@radix-ui/react-dialog", "@radix-ui/react-slot"],
          charts: ["recharts"],
          markdown: ["react-markdown", "remark-gfm"],
        },
      },
    },
  },
});
