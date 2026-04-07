import { useCallback, useEffect, useRef } from 'react';
/* eslint-disable n/no-missing-import */
import { useHistory, useLocation } from '@docusaurus/router';
import Layout from '@theme/Layout';
/* eslint-enable n/no-missing-import */

const FRAME_ORIGIN = 'https://chimerical-trifle-8d3c21.netlify.app';

function Demo() {
	const history = useHistory();
	const location = useLocation();
	const iframeRef = useRef();

	const handleMessage = useCallback(
		(e) => {
			if (e.origin === FRAME_ORIGIN) {
				history.replace(`${location.pathname}#${e.data}`);
			}
		},
		[history, location.pathname],
	);

	useEffect(() => {
		if (!window.crossOriginIsolated) {
			// Reload to apply headers for COI (cross-origin isolated)
			//   This control is not necessary when applying COI to all pages. However,
			//   some external images cannot be loaded on pages using COI.
			//   Another reason is that SPA cannot control the header for each page.
			window.location.reload();

			return;
		}

		if (iframeRef.current) {
			window.addEventListener('message', handleMessage, false);

			iframeRef.current.src = `${FRAME_ORIGIN}${location.hash}`;
		}

		return () => {
			window.removeEventListener('message', handleMessage);
		};
	}, [handleMessage, location.hash]);

	return (
		<Layout title="Demo" wrapperClassName="demo">
			<iframe
				allow="cross-origin-isolated; clipboard-write"
				ref={iframeRef}
				id="demo"
				frameBorder="0"
				style={{
					flex: '1',
				}}
			/>
		</Layout>
	);
}

Demo.title = 'Demo';

export default Demo;
