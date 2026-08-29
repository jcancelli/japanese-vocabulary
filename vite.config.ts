import tailwindcss from "@tailwindcss/vite"
import adapter from "@sveltejs/adapter-static"
import { sveltekit } from "@sveltejs/kit/vite"
import { defineConfig, type ConfigEnv } from "vite"

export default defineConfig((config: ConfigEnv) => {
	return {
		plugins: [
			tailwindcss(),
			sveltekit({
				compilerOptions: {
					runes: ({ filename }) => {
						return filename.split(/[/\\]/).includes("node_modules") ? undefined : true
					},
					experimental: {
						async: true,
					},
				},
				adapter: adapter(),
				paths: {
					base: config.mode === "development" ? "" : "/japanese-vocabulary",
				},
				prerender: {
					handleUnseenRoutes: "warn",
				},
			}),
		],
	}
})
