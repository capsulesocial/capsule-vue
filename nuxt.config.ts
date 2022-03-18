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
		title: 'Blogchain',
		htmlAttrs: {
			lang: 'en',
		},
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ hid: 'capsule', name: 'Blogchain', content: 'Decentralized discourse' },
			// hid is used as unique identifier. Do not use `vmid` for it as it will not work
			{
			  property: 'og:site_name',content:'Decentralized discourse',
			},
			{ hid: 'og:type', property: 'og:type', content: 'website' },
			{
			  hid: 'og:url',property: 'og:url',content: 'https://blogchain.app',
			},
			{
			  hid: 'og:title',property: 'og:title',content:'Blogchain',
			},
			{
			  hid: 'og:description',property: 'og:description',content:'Decentralized discourse',
			},
			{
			  hid: 'og:image',property: 'og:image',content:'/discover.webp',
			},
			{ property: 'og:image:width', content: '740' },
			{ property: 'og:image:height', content: '300' },
			{ name: 'twitter:site', content: '@capsuleSoc' },
			{ name: 'twitter:card', content: 'summary_large_image' },
			{
			  hid: 'twitter:url',name: 'twitter:url',content: 'https://blogchain.app',
			},
			{
			  hid: 'twitter:title',name: 'twitter:title',content:'Blogchain',
			},
			{
			  hid: 'twitter:description',name: 'twitter:description',content:'Decentralized discourse',
			},
			{
			  hid: 'twitter:image',name: 'twitter:image',content:'/discover.webp',
			}
		],
		link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
		script: [],
	},
	loadingIndicator: {
		name: 'chasing-dots',
		color: '#2E556A',
		background: 'white',
	},
	// Global CSS: https://go.nuxtjs.dev/config-css
	css: ['@/assets/css/quill.css', '@/assets/css/hljs-monokai-sublime.css'],

	// Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
	plugins: [
		{ src: '@/plugins/vuex-persist.ts', mode: `client` },
		{ src: '@/plugins/quality.ts' },
		{ src: '@/plugins/helpers.ts' },
		{ src: '@/plugins/toast.ts' },
		{ src: '@/plugins/background.ts' },
		{ src: '@/plugins/colormode.ts' },
		{ src: '@/plugins/backend.ts' },
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
	modules: [['@nuxtjs/dotenv', { path: './' }], `portal-vue/nuxt`],

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
