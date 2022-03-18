import imageCompression from 'browser-image-compression'

export function getCompressedImage(file: File) {
	return imageCompression(file, {
		maxSizeMB: 5,
		maxWidthOrHeight: 1920,
		useWebWorker: true,
		initialQuality: 0.9,
	})
}
