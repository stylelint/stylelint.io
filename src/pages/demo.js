import React, { useEffect, useRef } from 'react';
/* eslint-disable node/no-missing-import */
import { useHistory, useLocation } from '@docusaurus/router';
import Layout from '@theme/Layout';
/* eslint-enable node/no-missing-import */

function Demo() {
	const history = useHistory();
	const location = useLocation();
	const iframeEl = useRef();

	useEffect(() => {
		const FRAME_ORIGIN = 'https://deploy-preview-352--chimerical-trifle-8d3c21.netlify.app';

		if (iframeEl.current) {
			window.addEventListener(
				'message',
				(e) => {
					if (e.origin === FRAME_ORIGIN) {
						history.replace(`${location.pathname}#${e.data}`);
					}
				},
				false,
			);

			iframeEl.current.src = `${FRAME_ORIGIN}${location.hash}`;
		}
	}, []);

	return (
		<Layout title="Demo" wrapperClassName="demo">
			<iframe
				allow="cross-origin-isolated"
				ref={iframeEl}
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
