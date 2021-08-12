import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { withRouter } from "next/router";
import { getCookie, isAuth } from "../../actions/auth";
import { getCategories } from "../../actions/category";
import { getTags } from "../../actions/tag";
import { updateBlog, getSingleBlog } from "../../actions/blog";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import { API } from "../../config";

function UpdateBlog({ router }) {
	const [allTags, setAllTags] = useState([]);
	const [allCategories, setAllCategories] = useState([]);

	const [checkedCategories, setCheckedCategories] = useState([]);
	const [checkedTags, setCheckedTags] = useState([]);

	const [body, setBody] = useState("");
	const [blogValues, setBlogValues] = useState({
		error: "",
		success: "",
		title: "",
		photo: "",
		_id: "",
	});

	const { error, success, formData, title, photo, _id } = blogValues;

	const token = getCookie("token");
	const route = useRouter();
	let slugin = route.query.slug;

	useEffect(() => {
		setBlogValues({ ...blogValues, error: "" });
		loadBlog(slugin);
		loadAllCategories();
		loadAllTags();
	}, [router]);

	function loadBlog(slug) {
		if (slug) {
			getSingleBlog(slug).then((data) => {
				if (data.error) {
					console.log(`getting single blog to update error: ${data.error}`);
				} else {
					setBlogValues({ ...blogValues, title: data.title, _id: data._id });
					setBody(data.body);
					setLoadedCategories(data.categories);
					setLoadedTags(data.tags);
				}
			});
		}
	}

	function setLoadedCategories(loadedCategories) {
		let categoryArrayId = loadedCategories.map((c, i) => {
			return c._id;
		});
		setCheckedCategories(categoryArrayId);
		//  console.log(categoryArrayId);
	}

	function setLoadedTags(loadedTags) {
		let tagArrayId = loadedTags.map((t, i) => {
			return t._id;
		});
		setCheckedTags(tagArrayId);
	}

	function loadAllCategories() {
		getCategories().then((data) => {
			if (data.error) {
				setBlogValues({ ...values, error: data.error, success: "" });
			} else {
				setAllCategories(data);
				setBlogValues({ ...setBlogValues, error: "" });
			}
		});
	}

	function loadAllTags() {
		getTags().then((data) => {
			if (data.error) {
				setBlogValues({ ...values, error: data.error, success: "" });
			} else {
				setAllTags(data);
				setBlogValues({ ...setBlogValues, error: "" });
			}
		});
	}

	function handleCheckedCategories(category, index) {
		setBlogValues({ ...blogValues, error: "" });

		const clickedCategoryIndex = checkedCategories.indexOf(category);
		const all = [...checkedCategories];

		if (clickedCategoryIndex === -1) {
			all.push(category);
		} else {
			all.splice(clickedCategoryIndex, 1);
		}
		console.log(all);
		setCheckedCategories(all);
	}

	function handleCheckedTags(tag) {
		setBlogValues({ ...blogValues, error: "" });

		const checkedTagIndex = checkedTags.indexOf(tag);
		const all = [...checkedTags];

		if (checkedTagIndex === -1) {
			all.push(tag);
		} else {
			all.splice(checkedTagIndex, 1);
		}
		setCheckedTags(all);
	}

	function handleIsCheckedCategory(category) {
		//checkedCategories
		const isClickedCategory = checkedCategories.indexOf(category);

		if (isClickedCategory === -1) {
			return false;
		} else {
			return true;
		}
	}

	function handleIsCheckedTag(tag) {
		//checkedCategories
		const isClickedTag = checkedTags.indexOf(tag);

		if (isClickedTag === -1) {
			return false;
		} else {
			return true;
		}
	}

	function showCategories() {
		return (
			allCategories &&
			allCategories.map((c, i) => {
				return (
					<li key={i} className="list-unstyled">
						<input
							checked={handleIsCheckedCategory(c._id)}
							// checked={false}
							onChange={() => handleCheckedCategories(c._id)}
							type="checkbox"
							className="mr-2"
						/>
						<label className="form-check-label">{c.name}</label>
					</li>
				);
			})
		);
	}

	function showTags() {
		return (
			allTags &&
			allTags.map((t, i) => {
				return (
					<li key={i} className="list-unstyled">
						<input
							checked={handleIsCheckedTag(t._id)}
							onChange={() => handleCheckedTags(t._id)}
							type="checkbox"
							className="mr-2"
						/>
						<label className="form-check-label">{t.name}</label>
					</li>
				);
			})
		);
	}

	function handleChange(name, e) {
		let value = name === "photo" ? e.target.files[0] : e.target.value;
		console.log(e.target.value)
		setBlogValues({ ...blogValues, [name]: value, error: "" });
	}

	function handleQuillChange(e) {
		setBody(e);
	}

	function handleSubmit(e) {
		e.preventDefault();
		// e.stopPropagation();
		let formData = new FormData();
		formData.set("title", title);
		formData.set("body", body);
		formData.set("categories", checkedCategories);
		formData.set("tags", checkedTags);
		formData.set("photo", photo);

		updateBlog(formData, slugin, token).then((data) => {
			if (data.error) {
				setBlogValues({ ...blogValues, error: data.error });
			} else {
				setBlogValues({
					...blogValues,
					success: `${data.title || title} successfully updated.`,
				});
				console.log("updated");
				setTimeout(() => {
					router.reload();
				}, 1000);
			}
		});
	}

	function createBlogForm() {
		return (
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label className="text-mute">Title</label>

					<input
						name="title"
						type="text"
						value={title}
						className="form-control"
						onChange={(e) => handleChange("title", e)}
					/>
				</div>

				<div className="form-group">
					<ReactQuill
						modules={UpdateBlog.modules}
						formats={UpdateBlog.formats}
						name="body"
						value={body}
						placeholder="Start your blog here..."
						onChange={handleQuillChange}
					></ReactQuill>
				</div>

				<div>
					<button className="btn btn-primary" type="submit">
						Publish
					</button>
				</div>
			</form>
		);
	}

	function showError() {
		return (
			<div
				className="alert alert-danger"
				style={{ display: error ? "" : "none" }}
			>
				{error}
			</div>
		);
	}

	function showSuccess() {
		return (
			<div
				className="alert alert-success"
				style={{ display: success ? "" : "none" }}
			>
				{success}
			</div>
		);
	}

	return (
		<React.Fragment>
			<div className="container-fluid pb-5">
				<div className="row">
					<div className="col-md-8">
						<p>Create Blog Form</p>
						{createBlogForm()}
						<div className="pt-3">
							{showError()}
							{showSuccess()}
						</div>
						<img
							className="mt-3"
							src={`${API}/blog/photo/${slugin}`}
							alt={title}
							style={{ width: "100%", maxHeight: "auto" }}
						/>
					</div>
					<div className="col-md-4">
						<div className="form-group pb-2">
							<h5>Featured image</h5>
							<hr />
							<div>
								<small className="text-muted">Image: 1mb</small>
							</div>
							<label className="btn btn-outline-info mt-2">
								Upload featured image
								<input
									onChange={(e) => handleChange("photo", e)}
									type="file"
									accept="image/*"
									hidden
								/>
							</label>
						</div>
						<div>
							<h3>Categories</h3>
							<hr />
							<ul style={{ maxHeight: "200px", overflowY: "scroll" }}>
								{showCategories()}
							</ul>
						</div>
						<div>
							<hr />
							<h3>Tags</h3>
							<ul style={{ maxHeight: "200px", overflowY: "scroll" }}>
								{showTags()}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
}

//this is for react quill form editor
UpdateBlog.modules = {
	toolbar: [
		[{ header: "1" }, { header: "2" }, { header: [3, 4, 5, 6] }, { font: [] }],
		[{ size: [] }],
		["bold", "italic", "underline", "strike", "blockquote"],
		[{ list: "ordered" }, { list: "bullet" }],
		["link", "image", "video"],
		["clean"],
		["code-block"],
	],
};

UpdateBlog.formats = [
	"header",
	"font",
	"size",
	"bold",
	"italic",
	"underline",
	"strike",
	"blockquote",
	"list",
	"bullet",
	"link",
	"image",
	"video",
	"code-block",
];

export default withRouter(UpdateBlog);
