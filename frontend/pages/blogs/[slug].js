import React, { useState, useEffect } from "react";
import { getSingleBlog, getRelatedBlogs } from "../../actions/blog";
import Layout from "../../components/Layout";
import Link from "next/link";
import { DOMAIN, APP_NAME, API } from "../../config";
import Head from "next/head";
import SmallCard from "../../components/blog/SmallCard";
import moment from "moment";
import renderHTML from "react-render-html";

function SingleBlog({ blog }) {
	function head() {
		return (
			<Head>
				<title>
					{blog.title} | {APP_NAME}
				</title>
				<meta name="description" content={blog.mdesc} />
				<link rel="canonical" href={`${DOMAIN}/blogs/${blog.slug}`} />
				<meta property="og:title" content={`${blog.title} | ${APP_NAME}`} />
				<meta property="og:description" content={blog.mdesc} />
				<meta property="og:type" content="website" />
				<meta property="og:url" content={`${DOMAIN}/blogs/${blog.slug}`} />
				<meta property="og:site_name" content={`${APP_NAME}`} />

				<meta property="og:image" content={`${API}/blog/photo/${blog.slug}`} />
				<meta
					property="og:image:secure_url"
					content={`${API}/blog/photo/${blog.slug}`}
				/>
				<meta property="og:image:type" content="image/jpg" />
			</Head>
		);
	}

	const [relatedBlogs, setRelatedBlogs] = useState([]);

	useEffect(() => {
		loadRelatedBlogs();
	}, []);

	function loadRelatedBlogs() {
		getRelatedBlogs({ blog }).then((data) => {
			if (data.error) {
				console.log(`error getting related blogs from slug.js: ${data.error}`);
			} else {
				setRelatedBlogs(data);
			}
		});
	}

	function showRelatedBlogs() {
		return relatedBlogs.map((b, i) => {
			return (
				<div className="col-md-4" key={i}>
					<article>
						<SmallCard blog={b} />
					</article>
				</div>
			);
		});
	}

	function showAllCategories() {
		return blog.categories.map((c, i) => {
			return (
				<Link key={i} href={`/categories/${c.slug}`}>
					<a className="btn btn-primary mr-1 ml-1 mt-2 mb-2">{c.name}</a>
				</Link>
			);
		});
	}

	function showAllTags() {
		return blog.tags.map((t, i) => {
			return (
				<Link key={i} href={`/categories/${t.slug}`}>
					<a className="btn btn-outline-primary mr-1 ml-1 mt-2 mb-2">
						{t.name}
					</a>
				</Link>
			);
		});
	}

	return (
		<React.Fragment>
			{head()}
			<Layout>
				<main>
					<article>
						<div className="container-fluid">
							<section>
								<div className="row" style={{ marginTop: "-30px" }}>
									<img
										src={`${API}/blog/photo/${blog.slug}`}
										alt={`${blog.title}`}
										className="img img-fluid featured-image"
									/>
								</div>
							</section>
							<section>
								<div className="container">
									<h1 className="display-2 pb-3 text-center font-weight-bold">
										{blog.title}
									</h1>
									<p className="lead pt-1 pb-1">
										Written by{" "}
										<Link href={`/profile/${blog.postedBy.username}`}>
											<a>{blog.postedBy.name}</a>
										</Link>{" "}
										| Published {moment(blog.updatedAt).fromNow()}
									</p>

									<div className="pb-3">
										{showAllCategories()}
										{showAllTags()}
										<br />
									</div>
								</div>
							</section>
						</div>
						<div className="container">
							<section>
								<div className="col-md-12">{renderHTML(blog.body)}</div>
							</section>
						</div>
						<div className="container pb-5">
							<h4 className="text-center pt-5 pb-5 h2">Related blogs</h4>
							<hr />
							<div className="row">{showRelatedBlogs()}</div>
						</div>
						<div className="container pb-5">
							<p>show comments</p>
						</div>
					</article>
				</main>
			</Layout>
		</React.Fragment>
	);
}

export async function getServerSideProps({ query }) {
	return await getSingleBlog(query.slug).then((data) => {
		if (data.error) {
			console.log(
				`Problem with getting server side props blog index.js, error: ${data.error}`
			);
		} else {
			return {
				props: {
					blog: data,
				},
			};
		}
	});
}

export default SingleBlog;
