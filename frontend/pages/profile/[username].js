import React, { useState, useEffect } from "react";
import { getUserBlogs } from "../../actions/user";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import Card from "../../components/blog/Card";
import Link from "next/link";
import moment from "moment";
import { API } from "../../config";
import Contact from "../../components/contact";

function Profile({ user, blogs, query }) {
	function head() {
		return (
			<Head>
				<title>
					{user[0].name} | {APP_NAME}
				</title>
				<meta
					name="description"
					content={`Best programming tutorials on ${user[0].name}`}
				/>
				<link rel="canonical" href={`${DOMAIN}/profile/${query.username}`} />
				<meta property="og:title" content={`${user[0].name} | ${APP_NAME}`} />
				<meta
					property="og:description"
					content={`Best programming tutorials by ${user[0].name}`}
				/>
				<meta property="og:type" content="website" />
				<meta
					property="og:url"
					content={`${DOMAIN}/profile/${query.username}`}
				/>
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

	const [blogValues, setBlogValues] = useState([]);
	const [error, setError] = useState("");

	const router = useRouter();
	const username = router.query.username;

	// useEffect(() => {
	// 	loadBlogs();
	// }, []);

	function showUserBlogs() {
		return blogs.map((blog, i) => {
			return (
				<div key={i} className="mt-4 mb-4">
					<Link href={`/blogs/${blog.slug}`}>
						<a className="lead">{blog.title}</a>
					</Link>
				</div>
			);
		});
	}

	return (
		<React.Fragment>
			<Layout>
				<div className="container-fluid">
					<div className="row">
						<div className="col-md-12">
							<div className="card">
								<div className="card-body">
									<div className="row">
										<div className="col-md-10">
											<h4>{user[0].name}</h4>
											<p className="text-muted">
												Joined {moment(user[0].createdAt).fromNow()}
											</p>
										</div>
										<div className="col-md-2">
											<img
												src={`${API}/profile/photo/${user[0]._id}`}
												alt="User Profile"
												className="img img-fluid img-thumbnail mb-3"
												style={{ maxHeight: "auto", madWidth: "100%" }}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<br />
				<div className="container pb-5">
					<div className="row">
						<div className="col-md-6">
							<div className="card">
								<div className="card-body">
									<h5 className="card-title bg-primary pt-4 pb-4 pl-4 pr-4">
										Recent blogs by {user[0].name}
									</h5>
									{showUserBlogs()}
								</div>
							</div>
						</div>
						<div className="col-md-6">
							<div className="card">
								<div className="card-body">
									<h5 className="card-title bg-primary pt-4 pb-4 pl-4 pr-4">
										Message {user[0].name}
									</h5>
									<br />
									<Contact authorEmail={user[0].email} />
								</div>
							</div>
						</div>
					</div>
				</div>
			</Layout>
		</React.Fragment>
	);
}

export async function getServerSideProps({ query }) {
	return getUserBlogs(query.username).then((data) => {
		if (data.error) {
			return console.log(data.error);
		} else {
			return { props: { user: data.user, blogs: data.blogs, query } };
		}
	});
}

export default Profile;
