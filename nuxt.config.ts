import type { NuxtConfig } from '@nuxt/types'

const config: NuxtConfig = {
	// Global page headers: https://go.nuxtjs.dev/config-head
	srcDir: `src/`,
	generate: {
		dir: `.app`,
	},
	ssr: false,
	telemetry: false,
	head: {
		title: `Blogchain — Decentralized discourse and publishing on Web3`,
		htmlAttrs: {
			lang: `en`,
		},
		meta: [
			{ charset: `utf-8` },
			{ name: `viewport`, content: `width=device-width, initial-scale=1` },
			{
				hid: `description`,
				name: `description`,
				content: `Blogchain makes it easy for writers, journalists and social critics to publish, grow an audience and get paid on a fast and beautiful Web3 platform. Sign up today and participate in decentralized discourse.`,
			},
			{
				hid: `capsule`,
				name: `Blogchain`,
				content: `Blogchain makes it easy for writers, journalists and social critics to publish, grow an audience and get paid on a fast and beautiful Web3 platform. Sign up today and participate in decentralized discourse.`,
			},
			// hid is used as unique identifier. Do not use `vmid` for it as it will not work
			{
				property: `og:site_name`,
				content: `Blogchain makes it easy for writers, journalists and social critics to publish, grow an audience and get paid on a fast and beautiful Web3 platform. Sign up today and participate in decentralized discourse.`,
			},
			{ hid: `og:type`, property: `og:type`, content: `website` },
			{
				hid: `og:url`,
				property: `og:url`,
				content: `https://blogchain.app`,
			},
			{
				hid: `og:title`,
				property: `og:title`,
				content: `Blogchain — Decentralized discourse and publishing on Web3`,
			},
			{
				hid: `og:description`,
				property: `og:description`,
				content: `Blogchain makes it easy for writers, journalists and social critics to publish, grow an audience and get paid on a fast and beautiful Web3 platform. Sign up today and participate in decentralized discourse.`,
			},
			{
				hid: `og:image`,
				property: `og:image`,
				content: `https://blogchain.app/discover.png`,
			},
			{ name: `twitter:site`, content: `@BlogchainApp` },
			{ name: `twitter:card`, content: `summary_large_image` },
			{
				hid: `twitter:url`,
				name: `twitter:url`,
				content: `https://blogchain.app`,
			},
			{
				hid: `twitter:title`,
				name: `twitter:title`,
				content: `Blogchain — Decentralized discourse and publishing on Web3`,
			},
			{
				hid: `twitter:description`,
				name: `twitter:description`,
				content: `Blogchain makes it easy for writers, journalists and social critics to publish, grow an audience and get paid on a fast and beautiful Web3 platform. Sign up today and participate in decentralized discourse.`,
			},
			{
				hid: `twitter:image`,
				name: `twitter:image`,
				content: `https://blogchain.app/discover.png`,
			},
			{
				hid: `msapplication-TileColor`,
				name: `msapplication-TileColor`,
				content: `#2d89ef`,
			},
			{
				hid: `theme-color`,
				name: `theme-color`,
				content: `#ffffff`,
			},
		],
		link: [
			{ rel: `icon`, type: `image/png`, sizes: `32x32`, href: `/favicon-32x32.png` },
			{ rel: `icon`, type: `image/png`, sizes: `16x16`, href: `/favicon-16x16.png` },
			{ rel: `apple-touch-icon`, sizes: `180x180`, href: `/apple-touch-icon.png` },
			{ rel: `manifest`, href: `/site.webmanifest` },
			{ rel: `mask-icon`, href: `/safari-pinned-tab.svg`, color: `#4a4a4a` },
		],
		script: [{ src: `https://js.hcaptcha.com/1/api.js?explicit=true`, defer: true, async: true }],
	},
	loadingIndicator: {
		name: `chasing-dots`,
		color: `#2E556A`,
		background: `white`,
	},
	// Global CSS: https://go.nuxtjs.dev/config-css
	css: [`@/assets/css/quill.css`],

	// Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
	plugins: [
		{ src: `@/plugins/vuex-persist.ts`, mode: `client` },
		{ src: `@/plugins/quality.ts` },
		{ src: `@/plugins/toast.ts` },
		{ src: `@/plugins/helpers.ts` },
		{ src: `@/plugins/background.ts` },
		{ src: `@/plugins/color.ts` },
		{ src: `@/plugins/colormode.ts` },
		{ src: `@/plugins/backend.ts` },
	],

	// Auto import components: https://go.nuxtjs.dev/config-components
	components: true,

	// Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
	buildModules: [
		// https://go.nuxtjs.dev/tailwindcss
		`@nuxtjs/tailwindcss`,
		`@nuxt/typescript-build`,
	],

	tailwindcss: {
		cssPath: `~/assets/css/tailwind.css`,
	},

	// Modules: https://go.nuxtjs.dev/config-modules
	modules: [[`@nuxtjs/dotenv`, { path: `./` }], `portal-vue/nuxt`, `@nuxtjs/robots`, `@nuxt/image`],
	robots: [
		{
			UserAgent: `*`,
			Disallow: `/bookmarks`,
		},
		{
			UserAgent: `*`,
			Disallow: `/settings`,
		},
		{
			UserAgent: `*`,
			Disallow: `/subscriptions`,
		},
	],

	// Nuxt image configuration
	image: {},

	// Build Configuration: https://go.nuxtjs.dev/config-build
	build: {
		extractCSS: {
			ignoreOrder: false,
		},
		extend(conf, _) {
			// @ts-ignore
			conf.resolve.alias.vue = `vue/dist/vue.common`
		},
		splitChunks: {
			commons: true,
			layouts: false,
			pages: true,
		},
	},
	typescript: {
		typeCheck: {
			eslint: {
				files: `./src/**/*.{ts,vue,js}`,
			},
		},
	},
}

export default config
