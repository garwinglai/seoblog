import Document, { Html, Head, Main, NextScript } from "next/document";


class MyDocument extends Document {
	render() {
		return (
			<Html>
				<Head>
					<meta charSet="UTF-8" />

					<link
						rel="stylesheet"
						href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css"
					/>
					{/* <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.js" /> */}
					<link rel="stylesheet" href="/static/css/styles.css" /> 
					{/* <link rel="stylesheet" href="https://unpkg.com/react-quill@1.3.3/dist/quill.snow.css" /> */}

				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
export default MyDocument;
