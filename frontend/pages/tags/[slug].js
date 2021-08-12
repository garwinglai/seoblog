import React from "react";
import { getTag } from "../../actions/tag";
import Layout from "../../components/Layout";
import Card from "../../components/blog/Card";
import Head from "next/head";
import { DOMAIN, APP_NAME } from "../../config";

function TagBlogs({ tag, blogs, query }) {
	function head() {
		return (
			<Head>
				<title>
					{tag.name} | {APP_NAME}
				</title>
				<meta
					name="description"
					content={`Best programming tutorials on ${tag.name}`}
				/>
				<link rel="canonical" href={`${DOMAIN}/blogs/${query.slug}`} />
				<meta property="og:title" content={`${tag.name} | ${APP_NAME}`} />
				<meta
					property="og:description"
					content={`Best programming tutorials on ${tag.name}`}
				/>
				<meta property="og:type" content="website" />
				<meta property="og:url" content={`${DOMAIN}/blogs/${query.slug}`} />
				<meta property="og:site_name" content={`${APP_NAME}`} />

				{/* <meta property="og:image" content={`${API}/blog/photo/${query.slug}`} /> */}
				{/* <meta
					property="og:image:secure_url"
					content={`${API}/blog/photo/${query.slug}`}
				/> */}
				<meta property="og:image:type" content="image/jpg" />
			</Head>
		);
	}

	return (
		<React.Fragment>
    {head()}
			<Layout>
				<main>
					<div className="container-fluid text-center">
						<header>
							<h1 className="display font-weight-bold">{tag.name}</h1>
						</header>
						{blogs.map((b, i) => {
							return <Card blog={b} />;
						})}
					</div>
				</main>
			</Layout>
		</React.Fragment>
	);
}

export async function getServerSideProps({ query }) {
	return getTag(query.slug).then((data) => {
		if (data.error) {
			return console.log(`error getting related blogs for tags: ${data.error}`);
		} else {
			return { props: { tag: data.tag, blogs: data.blogs, query } };
		}
	});
}

export default TagBlogs;
