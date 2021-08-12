import React, { useState } from "react";
import { getBlogsWithCategoriesAndTags } from "../../actions/blog";
import Layout from "../../components/Layout";
import Card from "../../components/blog/Card";
import Link from "next/link";
import { DOMAIN, APP_NAME, API } from "../../config";
import Head from "next/head";
import { withRouter } from "next/router";

function Blog({
	blogs,
	categories,
	tags,
	totalBlogs,
	blogsSkip,
	blogsLimit,
	router,
}) {
	function head() {
		return (
			<Head>
				<title>Programming blogs | {APP_NAME}</title>
				<meta
					name="description"
					content="Programming blogs and tutorials on react node next vue php laravel and web development"
				/>
				<link rel="canonical" href={`${DOMAIN}${router.pathname}`} />
				<meta
					property="og:title"
					content={`Latest web developemnt tutorials | ${APP_NAME}`}
				/>
				<meta
					property="og:description"
					content="Programming blogs and tutorials on react node next vue php laravel and web development"
				/>
				<meta property="og:type" content="website" />
				<meta property="og:url" content={`${DOMAIN}${router.pathname}`} />
				<meta property="og:site_name" content={`${APP_NAME}`} />
			</Head>
		);
	}

	const [skip, setSkip] = useState(0);
	const [limit, setLimit] = useState(blogsLimit);
	const [size, setSize] = useState(totalBlogs);
	const [loadedBlogs, setLoadedBlogs] = useState([]);

	function loadMore() {
		let toSkip = skip + limit;

		getBlogsWithCategoriesAndTags(toSkip, limit).then((data) => {
			if (data.error) {
				console.log(`loadMore blogs error in index.js blog: ${data.error}`);
			} else {
				setLoadedBlogs([...loadedBlogs, ...data.blogs]);
				setSkip(toSkip);
				setSize(data.size);
				console.log(data)
			}
		});
	}

	function loadMoreButton() {
		return (
			size > 0 &&
			size >= limit && (
				<button onClick={loadMore} className="btn btn-primary btn-lg">
					Load More
				</button>
			)
		);
	}

	function showLoadedBlogs() {
		return loadedBlogs.map((b, i) => {
			return (
				<article key={i}>
					<Card blog={b} />
					<hr />
				</article>
			);
		});
	}

	function showAllBlogs() {
		return blogs.map((blog, i) => {
			return (
				<article key={i}>
					<Card blog={blog} />
					<hr />
				</article>
			);
		});
	}

	function showAllCategories() {
		return categories.map((c, i) => {
			return (
				<Link href={`categories/${c.slug}`} key={i}>
					<a className="btn btn-primary mr-1 ml-1 mt-3">{c.name}</a>
				</Link>
			);
		});
	}

	function showAllTags() {
		return tags.map((t, i) => {
			return (
				<Link href={`tags/${t.slug}`} key={i}>
					<a className="btn btn-outline-primary mr-1 ml-1 mt-3">{t.name}</a>
				</Link>
			);
		});
	}

	return (
		<React.Fragment>
			{head()}
			<Layout>
				<main>
					<div className="container-fluid">
						<header>
							<div className="col-md-12 pt-3">
								<h1 className="display-4 font-weight-bold text-center">
									Programming blogs and tutorials
								</h1>
							</div>
							<section>
								<div className="pb-5 text-center">
									{showAllCategories()}
									<br />
									{showAllTags()}
								</div>
							</section>
						</header>
					</div>
					<div className="container-fluid">{showAllBlogs()}</div>
					<div className="container-fluid">{showLoadedBlogs()}</div>
					<div className="text-center pt-3 pb-3">{loadMoreButton()}</div>
				</main>
			</Layout>
		</React.Fragment>
	);
}

export async function getServerSideProps() {
	let skip = 0;
	let limit = 2;
	return await getBlogsWithCategoriesAndTags(skip, limit).then((data) => {
		if (data.error) {
			console.log(
				`Problem with getting server side props blog index.js, error: ${data.error}`
			);
		}
		return {
			props: {
				blogs: data.blogs,
				categories: data.categories,
				tags: data.tags,
				totalBlogs: data.size, //since skip is incremnted, data.size should be smaller each run
				blogsSkip: skip,
				blogsLimit: limit,
			},
		};
	});
}

export default withRouter(Blog);
