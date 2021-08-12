import React, { useEffect } from "react";
import Head from "next/head";
import "../public/static/css/styles.css"

function MyApp({ Component, pageProps }) {


	return (
		<>
			<Head>
				{/* <meta name="viewport" content="viewport-fit=cover" /> */}

				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				{/* <link rel="stylesheet" href="https://unpkg.com/react-quill@1.3.3/dist/quill.snow.css" /> */}
			</Head>
			<Component {...pageProps} />
		</>
	);
}

export default MyApp;
