import React from "react";
import moment from "moment";
import renderHTML from "react-render-html";
import Link from "next/link";
import { API } from "../../config";

function SmallCard({ blog }) {
	return (
		<div className="card">
			<section>
				<Link href={`/blogs/${blog.slug}`}>
					<a>
						<img
							src={`${API}/blog/photo/${blog.slug}`}
							style={{ height: "250px", maxWidth: "100%" }}
							alt={blog.title}
						/>
					</a>
				</Link>
			</section>
			<div className="card-body">
				<section>
					<Link href={`/blogs/${blog.slug}`}>
						<a>
							<h5 className="card-title">{blog.title}</h5>
						</a>
					</Link>
					<p className="card-text">{renderHTML(blog.excerpt)}</p>
				</section>
			</div>
			<div className="card-body">
				<div>
					Posted by{" "}
					<Link href={`/profile/${blog.postedBy.username}`}>
						<a>{blog.postedBy.name}</a>
					</Link>{" "}
					| Published {moment(blog.updatedAt).fromNow()}
				</div>
			</div>
		</div>
	);
}

export default SmallCard;
