export const ensureFont = () => {
	if (typeof window !== 'undefined' && 'FontFace' in window) {
		const font = new FontFace(
			'Montserrat',
			'url(https://fonts.gstatic.com/s/montserrat/v10/zhcz-_WihjSQC0oHJ9TCYPk_vArhqVIZ0nv9q090hN8.woff2)'
		);
		return font.load().then(() => {
			document.fonts.add(font);
		});
	}

	throw new Error('browser does not support FontFace');
};
