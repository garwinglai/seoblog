import React from "react";
import moment from "moment";
import renderHTML from "react-render-html";
import Link from "next/link";
import { API } from "../../config";

function Card({ blog }) {
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
				<Link key={i} href={`/tags/${t.slug}`}>
					<a className="btn btn-outline-primary mr-1 ml-1 mt-2 mb-2">
						{t.name}
					</a>
				</Link>
			);
		});
	}

	function handleTitleClick() {
		console.log("blog titled clicked");
		console.log(blog.slug);
	}

	return (
		<div className="lead pb-4">
			<header>
				<Link href={`/blogs/${blog.slug}`}>
					<a onClick={handleTitleClick}>
						<h2 className="pt-3 pb-3 font-weight-bold">{blog.title}</h2>
					</a>
				</Link>
			</header>
			<section>
				<p className="mark ml-1 pt-2 pb-2">
					Written by {" "}
					<Link href={`/profile/${blog.postedBy.username}`}>
						<a>{blog.postedBy.name}</a>
					</Link>
					{" "}| Published {moment(blog.updatedAt).fromNow()}
				</p>
			</section>
			<section>
				<div className="pt-2">
					{showAllCategories()}
					{showAllTags()}
				</div>
				<br />
			</section>

			<div className="row">
				<div className="col-md-4">
					<section>
						<img
							src={`${API}/blog/photo/${blog.slug}`}
							style={{ maxHeight: "auto", maxWidth: "100%" }}
							alt={blog.title}
						/>
					</section>
				</div>
				<div className="col-md-8">
					<section>
						<div className="pb-3">{renderHTML(blog.excerpt)}</div>
						<Link href={`/blogs/${blog.slug}`}>
							<a className="btn btn-primary pt-2">Read More</a>
						</Link>
					</section>
				</div>
			</div>
		</div>
	);
}

export default Card;
