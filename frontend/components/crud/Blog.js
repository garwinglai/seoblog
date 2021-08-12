import React from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { withRouter } from "next/router";
import { getCookie, isAuth } from "../../actions/auth";
import { getCategories } from "../../actions/category";
import { getTags } from "../../actions/tag";
import { createBlog } from "../../actions/blog";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

function Blog({ router }) {
	const blogLS = () => {
		if (typeof window === "undefined") {
			return false;
		}

		if (localStorage.getItem("blog")) {
			return JSON.parse(localStorage.getItem("blog"));
		} else {
			return false;
		}
	};
	const [categories, setCategories] = useState([]);
	const [tags, setTags] = useState([]);

	// const [isCheckedC, setIsCheckedC] = useState("");

	const [checkedCategories, setCheckedCategories] = useState([]);
	const [checkedTags, setCheckedTags] = useState([]);

	const [body, setBody] = useState(blogLS);
	const [values, setValues] = useState({
		error: "",
		sizeError: "",
		success: "",
		formData: "",
		title: "",
		photo: "",
		hidePublishButton: false,
	});

	const {
		error,
		sizeError,
		success,
		formData,
		title,
		photo,
		hidePublishButton,
	} = values;
	const token = getCookie("token");

	useEffect(() => {
		setValues({ ...values, error: "", success: "" });
		loadCategories();
		loadTags();
	}, [router]);

	function loadCategories() {
		getCategories().then((data) => {
			if (data.error) {
				setValues({ ...values, error: data.error, success: "" });
			} else {
				setCategories(data);
				setValues({ ...values, error: "" });
			}
		});
	}

	function loadTags() {
		getTags().then((data) => {
			if (data.error) {
				setValues({ ...values, error: data.error, success: "" });
			} else {
				setTags(data);
				setValues({ ...values, error: "" });
			}
		});
	}

	function handleCheckedCategories(category, index) {
		setValues({ ...values, error: "" });

		const clickedCategoryIndex = checkedCategories.indexOf(category);
		const all = [...checkedCategories];

		if (clickedCategoryIndex === -1) {
			all.push(category);
		} else {
			all.splice(clickedCategoryIndex, 1);
		}
		setCheckedCategories(all);
		// formData.set("categories", all);
	}

	//display categories
	function showCategories() {
		return (
			categories &&
			categories.map((c, i) => {
				return (
					<li key={i} className="list-unstyled">
						<input
							// check={isCheckedC}
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

	function handleCheckedTags(tag) {
		const checkedTagIndex = checkedTags.indexOf(tag);
		const all = [...checkedTags];

		if (checkedTagIndex === -1) {
			all.push(tag);
		} else {
			all.splice(tag, 1);
		}
		console.log(all);
		setCheckedTags(all);
		// formData.set("tags", all);
	}

	//display Tags
	function showTags() {
		return (
			tags &&
			tags.map((t, i) => {
				return (
					<li key={i} className="list-unstyled">
						<input
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
		const value = name === "photo" ? e.target.files[0] : e.target.value;
		// formData.set(name, value);
		if (name === "photo") {
			console.log(e.target.files[0]);
		}
		setValues({ ...values, [name]: value, error: "" });
	}

	function handleQuillChange(e) {
		console.log(e);
		setBody(e);
		// formData.set("body", e); //review this to see how it populates the backend
		if (typeof window !== "undefined") {
			localStorage.setItem("blog", JSON.stringify(e));
		}
	}

	function handleSubmit(e) {
		e.preventDefault(); //this stops event capturing | parent -> child actions
		// e.stopPropagation(); // this causes the page to refresh b/c stops event bubbling | child -> parent actions
		// setIsCheckedC(false)
		let formData = new FormData();
		formData.append("title", title);
		formData.append("body", body);
		formData.append("tags", checkedTags);
		formData.append("categories", checkedCategories);
		formData.append("photo", photo);

		createBlog(formData, token).then((data) => {
			if (data.error) {
				console.log(`publish blog error: ${data.error}`);
				setValues({ ...values, error: data.error, success: "" });
			} else {
				setValues({
					...values,
					title: "",
					error: "",
					success: `Blog titled ${data.title} has been created`,
				});
				setCheckedCategories([]);
				setCheckedTags([]);
				setBody("");
			}
		});

		// localStorage.removeItem("blog"); //Must use to clear body if rerender page
		console.log("published blog");
	}

	//display blog form
	function createBlogForm() {
		return (
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label className="text-mute">Title</label>
					<input
						name="gar"
						type="text"
						value={title}
						className="form-control"
						onChange={(e) => handleChange("title", e)}
					/>
				</div>

				<div className="form-group">
					<ReactQuill
						modules={Blog.modules}
						formats={Blog.formats}
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
		if (error) {
			return <p className="alert alert-danger">{error}</p>;
		}
	}

	function showSuccess() {
		if (success) {
			return <p className="alert alert-info">{success}</p>;
		}
	}

	return (
		<React.Fragment>
			<div className="container-fluid pb-5">
				<div className="row">
					<div className="col-md-8">
						{createBlogForm()}
						<div className="pt-3">
							{showError()}
							{showSuccess()}
						</div>
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
							<h4>Categories</h4>
							<hr />
							<ul style={{ maxHeight: "200px", overflowY: "scroll" }}>
								<h5>{showCategories()}</h5>
							</ul>
						</div>
						<div>
							<h4>Tags</h4>
							<hr />
							<ul style={{ maxHeight: "200px", overflowY: "scroll" }}>
								<h5>{showTags()}</h5>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
}

//this is for react quill form editor
Blog.modules = {
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

Blog.formats = [
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

export default withRouter(Blog);
