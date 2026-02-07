import { enhancedImages } from "@sveltejs/enhanced-img"
import { sveltekit } from "@sveltejs/kit/vite"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"
import { sveltekitOG } from "@ethercorps/sveltekit-og/plugin"

export default defineConfig({
	plugins: [tailwindcss(), enhancedImages(), sveltekit(), sveltekitOG()],
	ssr: {
		noExternal: ["svelte-motion"]
	},
	assetsInclude: ["**/*.md"],
	build: {
		sourcemap: false
	},
	server: {
		host: true,
		allowedHosts: true
	}
})
