import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import path from "path"; // 추가!

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"), // 이 부분 추가!
		},
	},
});
