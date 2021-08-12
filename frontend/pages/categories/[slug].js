import React from "react";
import Layout from "../../components/Layout";
import { getCategory } from "../../actions/category";
import Card from "../../components/blog/Card";
import { DOMAIN, APP_NAME } from "../../config";
import Head from 'next/head'

function CategoryBlogs({ category, blogs, query }) {
	function head() {
		return (
			<Head>
				<title>
					{category.name} | {APP_NAME}
				</title>
				<meta
					name="description"
					content={`Best programming tutorials on ${category.name}`}
				/>
				<link rel="canonical" href={`${DOMAIN}/blogs/${query.slug}`} />
				<meta property="og:title" content={`${category.name} | ${APP_NAME}`} />
				<meta property="og:description" content={`Best programming tutorials on ${category.name}`} />
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

	console.log(blogs);
	return (
		<React.Fragment>
    {head()}
			<Layout>
				<main>
					<div className="container-fluid text-center">
						<header>
							<div className="col-md-12 pt-3">
								<h1 className="display-4 font-weight-bold">{category.name}</h1>
							</div>
							{blogs.map((blog, i) => {
								return <Card blog={blog} />;
							})}
						</header>
					</div>
				</main>
			</Layout>
		</React.Fragment>
	);
}

export async function getServerSideProps({ query }) {
	return await getCategory(query.slug).then((data) => {
		if (data.error) {
			return console.log(
				`error with fetching related categories & blogs ${data.error}`
			);
		} else {
			return { props: { category: data.category, blogs: data.blogs, query } };
		}
	});
}

export default CategoryBlogs;
