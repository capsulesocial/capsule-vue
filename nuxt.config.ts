/* eslint-disable */
import type { NuxtConfig } from '@nuxt/types'

const config: NuxtConfig = {
	// Global page headers: https://go.nuxtjs.dev/config-head
	srcDir: 'src/',
	generate: {
		dir: '.app',
	},
	ssr: false,
	telemetry: false,
	head: {
		title: 'Capsule Social',
		htmlAttrs: {
			lang: 'en',
		},
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ hid: 'capsule', name: 'Capsule Social', content: 'Decentralized discourse' },
			// {
			// 	hid: `og:title`,
			// 	name: `og:title`,
			// 	content: `Capsule Social - Decentralized discourse`,
			// },
		],
		link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
		script: [],
	},

	// Global CSS: https://go.nuxtjs.dev/config-css
	css: ['@/assets/css/quill.css', '@/assets/css/hljs-monokai-sublime.css'],

	// Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
	plugins: [
		{ src: '@/plugins/persistedstate.ts' },
		{ src: '@/plugins/quality.ts' },
		{ src: '@/plugins/helpers.ts' },
		{ src: '@/plugins/backend.ts' },
		{ src: '@/plugins/toast.ts' },
		{ src: '@/plugins/background.ts' },
		{ src: '@/plugins/colormode.ts' },
	],

	// Auto import components: https://go.nuxtjs.dev/config-components
	components: true,

	// Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
	buildModules: [
		// https://go.nuxtjs.dev/tailwindcss
		'@nuxtjs/tailwindcss',
		'@nuxt/typescript-build',
	],

	tailwindcss: {
		cssPath: '~/assets/css/tailwind.css',
	},

	// Modules: https://go.nuxtjs.dev/config-modules
	modules: [['@nuxtjs/dotenv', { path: './' }]],

	// Build Configuration: https://go.nuxtjs.dev/config-build
	build: {
		extractCSS: {
			ignoreOrder: false,
		},
		extend(config, ctx) {
			config.resolve.alias['vue'] = 'vue/dist/vue.common'
		},
	},
	typescript: {
		typeCheck: {
			eslint: {
				files: './src/**/*.{ts,vue,js}',
			},
		},
	},
}

export default config
