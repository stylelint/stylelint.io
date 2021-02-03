import React, { useEffect, useRef } from 'react';
import Layout from '@theme/Layout';
import { useHistory, useLocation } from '@docusaurus/router';

function Demo() {
	const history = useHistory();
	const location = useLocation();
	const iframeEl = useRef();

	useEffect(() => {
		const FRAME_ORIGIN = 'https://stylelint-demo.herokuapp.com';

		if (iframeEl.current) {
			window.addEventListener(
				'message',
				function (e) {
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
		<Layout title="Demo" wrapperClassName="demoWrapper">
			<iframe
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
