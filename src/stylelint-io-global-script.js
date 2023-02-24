export function onRouteDidUpdate({ location }) {
	if (!window.crossOriginIsolated || location.pathname === '/demo') {
		return;
	}

	for (const img of iterateImages()) {
		if (!isSameOrigin(img.src)) {
			// Reload to remove headers for COI (cross-origin isolated)
			//   In the COI state, some images load fine using the crossOrigin attribute,
			//   but some still fail.
			//   So we have to reload the page to reapply the header.
			//   Another reason is that SPA cannot control the header for each page.
			window.location.reload();

			return null;
		}
	}

	function* iterateImages() {
		for (const img of document.getElementsByTagName('img')) {
			yield img;
		}

		for (const object of document.getElementsByTagName('object')) {
			for (const img of object.contentWindow.document.getElementsByTagName('img')) {
				yield img;
			}
		}
	}

	function isSameOrigin(sUrl) {
		let loc = window.location;

		const url = new URL(sUrl);

		return url.hostname === loc.hostname && url.port === loc.port && url.protocol === loc.protocol;
	}
}
