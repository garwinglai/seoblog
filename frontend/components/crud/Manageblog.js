import React, { useEffect, useState } from "react";
import { getUserBlogs, deleteBlog, getAllBlogs } from "../../actions/blog";
import moment from "moment";
import { getCookie, isAuth } from "../../actions/auth";
import { div } from "react-dom-factories";
import Link from 'next/link'

function Manageblog() {
	const [allBlogs, setAllBlogs] = useState([]);
	const [successMessage, setSuccessMessage] = useState("");
	const token = getCookie("token");

	useEffect(() => {
		loadAllBlogs();
	}, []);

	function loadAllBlogs() {
		getAllBlogs(token).then((data) => {
			if (data.error) {
				return console.log(
					`could not load all blogs in manageblog frontend: ${data.error}`
				);
			} else {
				setAllBlogs(data);
			}
		});
	}

	function buttonDeleteBlog(slug) {
		let answer = window.confirm("Delete this blog?");

		if (answer) {
			deleteBlog(slug, token).then((data) => {
				console.log(data);
				if (data.error) {
					console.log(
						`Error deleting blog from Manageblog.js error: ${data.error}`
					);
				} else {
					setSuccessMessage(data.message);
					loadAllBlogs();
				}
			});
		}
	}

	function buttonUpdateBlog(blog) {
		if (isAuth() && isAuth().role === 1) {
			return (
				<Link href={`/user/crud/${blog.slug}`}>
					<a className='btn ml-2 btn-warning'>Update</a>
				</Link>
			);
		} else if (isAuth() && isAuth().role === 0) {
      return (
        <Link href={`/admin/crud/${blog.slug}`}>
          <a className='btn ml-2 btn-warning'>Update</a>
        </Link>
        );Î
    }
	}

	function showAllBlogs() {
		return allBlogs.map((blog, i) => {
			return (
				<div className="pb-5">
					<h4>{blog.title}</h4>
					<p className="mark">
						Written by {blog.postedBy.name} | Published{" "}
						{moment(blog.updatedAt).fromNow()}
					</p>
					<button
						className="btn btn-danger"
						onClick={() => buttonDeleteBlog(blog.slug)}
					>
						Delete
					</button>
					{buttonUpdateBlog(blog)}
				</div>
			);
		});
	}

	function showSuccessMessage() {
		return <div className="alert alert-success mb-5">{successMessage}</div>;
	}

	return (
		<div className="col-md-12 pt-5">
			{successMessage && showSuccessMessage()}
			{showAllBlogs()}
		</div>
	);
}

export default Manageblog;
