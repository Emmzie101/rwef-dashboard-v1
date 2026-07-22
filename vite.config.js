import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// IMPORTANT: if you deploy this to GitHub Pages at
// https://<your-username>.github.io/<repo-name>/
// set `base` below to "/<repo-name>/" (with slashes on both sides).
// If you're using a custom domain or deploying to the root, set it to "/".
export default defineConfig({
  base: "/rwef-dashboard/",
  plugins: [react()],
});
