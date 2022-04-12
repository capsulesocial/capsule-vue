import type { Plugin } from '@nuxt/types'
import { Tag } from '@/backend/post'
import textLimits from '@/backend/utilities/text_limits'

// Declare types of functions
type CheckResult = { error: string } | { success: boolean }
type StringInputCheck = (input: string) => CheckResult
type TitleCheck = (title: string, titleError?: string) => CheckResult
type TagsCheck = (tag: string, tags?: Array<string>) => CheckResult

// eslint-disable-next-line quotes
declare module 'vue/types/vue' {
	interface Vue {
		$qualityID: StringInputCheck
		$qualityEmail: StringInputCheck
		$qualityURL: StringInputCheck
		$qualityTitle: TitleCheck
		$qualitySubtitle: TitleCheck
		$qualityFeaturedPhotoCaption: StringInputCheck
		$qualityTags: TagsCheck
		$qualityComment: StringInputCheck
		$qualityContent: StringInputCheck
		$qualityBio: StringInputCheck
		$qualityLocation: StringInputCheck
	}
}

const qualityID: StringInputCheck = (input) => {
	const blockListed = new Set<string>([`root`, `support`, `admin`])
	if (input === `` || input === null) {
		return { error: `Missing ID!` }
	}
	if (input.length < 3) {
		return { error: `ID must be longer than 3 characters` }
	}
	if (input.length > 16) {
		return { error: `ID must be 16 characters or less` }
	}
	if (!/^\w{3,16}$/.test(input)) {
		return { error: `ID must only contain numbers, letters, and underscores` }
	}
	if (blockListed.has(input)) {
		return { error: `ID unavailable` }
	}
	if (input.includes(`capsule`)) {
		return { error: `ID cannot contain capsule as a keyword` }
	}
	return { success: true }
}

const qualityEmail: StringInputCheck = (input) => {
	if (input === `` || input === null) {
		return { error: `Missing Email!` }
	}

	const regex =
		// eslint-disable-next-line no-control-regex
		/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21\x23-\x5B\x5D-\x7F]|\\[\x01-\x09\x0B\x0C\x0E-\x7F])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21-\x5A\x53-\x7F]|\\[\x01-\x09\x0B\x0C\x0E-\x7F])+)\])/

	if (!regex.test(input)) {
		return { error: `Invalid email syntax!` }
	}
	return { success: true }
}

export const URLRegex = /^((http:\/\/)|(https:\/\/))?(((\w|-){1,63})\.)?((\w|-){1,253})\.([a-z]{2,63})(\/.*)?$/

const qualityURL: StringInputCheck = (url) => {
	if (!URLRegex.test(url)) {
		return { error: `Invalid URL` }
	}

	return { success: true }
}

const qualityTitle: TitleCheck = (title, titleError) => {
	if (title.length === 0) {
		return { error: `Please enter a title.` }
	}
	if (title.length < textLimits.post_title.min) {
		return { error: `Title length cannot be less than ${textLimits.post_title.min} characters` }
	}
	if (title.length > textLimits.post_title.max) {
		return { error: `Title length cannot be more than ${textLimits.post_title.max} characters` }
	}
	if (titleError && titleError !== ``) {
		return { error: titleError }
	}
	return { success: true }
}

const qualitySubtitle: TitleCheck = (subtitle, subtitleError) => {
	if (subtitle.length !== 0 && subtitle.length < textLimits.post_subtitle.min) {
		return { error: `Subtitle length cannot be less than ${textLimits.post_subtitle.min} characters` }
	}
	if (subtitle.length !== 0 && subtitle.length > textLimits.post_subtitle.max) {
		return { error: `Subtitle length cannot be more than ${textLimits.post_subtitle.max} characters` }
	}
	if (subtitleError && subtitleError !== ``) {
		return { error: subtitleError }
	}
	return { success: true }
}

const qualityFeaturedPhotoCaption: StringInputCheck = (featuredPhotoCaption) => {
	if (featuredPhotoCaption.length !== 0 && featuredPhotoCaption.length < textLimits.featuredPhotoCaption.min) {
		return { error: `Featured photo caption cannot be less than ${textLimits.featuredPhotoCaption.min} characters` }
	}
	if (featuredPhotoCaption.length !== 0 && featuredPhotoCaption.length > textLimits.featuredPhotoCaption.max) {
		return { error: `Featured photo caption cannot be more than ${textLimits.featuredPhotoCaption.max} characters` }
	}
	return { success: true }
}

const qualityTags: TagsCheck = (tag, tags?: Array<any>) => {
	if (tag.trim().length < textLimits.post_tag.min) {
		return { error: `Tag length cannot be less than ${textLimits.post_tag.min} characters` }
	}
	if (tag.trim().length > textLimits.post_tag.max) {
		return { error: `Tag length cannot be more than ${textLimits.post_tag.max} characters` }
	}
	if (tag.replace(/\s/, ``).trim() !== tag) {
		return { error: `Tag with spaces is not allowed` }
	}
	// Check for numbers, letters, underscores, dashes
	const validexp = /^[\w-]+$/
	if (!validexp.test(tag)) {
		return { error: `Invalid character in tag` }
	}
	if (tags) {
		if (tags.length > 2) {
			return { error: `Maximum 3 tags are allowed` }
		}
		if (tags.some((t: Tag) => t.name === tag)) {
			return { error: `Duplicate tags are not allowed` }
		}
	}
	return { success: true }
}

const qualityComment: StringInputCheck = (input) => {
	if (input.length < textLimits.comment_content.min) {
		return { error: `Comment length cannot be less than ${textLimits.comment_content.min} characters` }
	}
	if (input.length > textLimits.comment_content.max) {
		return { error: `Comment length cannot be more than ${textLimits.comment_content.max} characters` }
	}
	return { success: true }
}

const qualityContent: StringInputCheck = (input) => {
	if (input.length < textLimits.post_content.min) {
		return { error: `Content length cannot be less than ${textLimits.post_content.min} characters` }
	}
	if (input.length > textLimits.post_content.max) {
		return { error: `Content length cannot be more than ${textLimits.post_content.max} characters` }
	}
	return { success: true }
}

const qualityBio: StringInputCheck = (input) => {
	if (input.length < textLimits.bio.min) {
		return { error: `Bio length cannot be less than ${textLimits.bio.min} characters` }
	}
	if (input.length > textLimits.bio.max) {
		return { error: `Bio length cannot be more than ${textLimits.bio.max} characters` }
	}
	return { success: true }
}

const qualityLocation: StringInputCheck = (input) => {
	if (input.length < textLimits.location.min) {
		return { error: `Location length cannot be less than ${textLimits.location.min} characters` }
	}
	if (input.length > textLimits.location.max) {
		return { error: `Location length cannot be more than ${textLimits.location.max} characters` }
	}
	return { success: true }
}

const qualityPlugin: Plugin = (_context, inject) => {
	inject(`qualityID`, qualityID)
	inject(`qualityEmail`, qualityEmail)
	inject(`qualityURL`, qualityURL)
	inject(`qualityTitle`, qualityTitle)
	inject(`qualitySubtitle`, qualitySubtitle)
	inject(`qualityFeaturedPhotoCaption`, qualityFeaturedPhotoCaption)
	inject(`qualityTags`, qualityTags)
	inject(`qualityContent`, qualityContent)
	inject(`qualityComment`, qualityComment)
	inject(`qualityBio`, qualityBio)
	inject(`qualityLocation`, qualityLocation)
}

export default qualityPlugin
