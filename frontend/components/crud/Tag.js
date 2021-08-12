import React, { useState, useEffect } from "react";
import { createTag, getTags, getTag, removeTag } from "../../actions/tag";
import { getCookie } from "../../actions/auth";

function Tag() {
	const [values, setValues] = useState({
		name: "",
		tags: [],
		error: false,
		reload: false,
		removed: false,
		success: false,
	});

	const { name, tags, error, reload, success, removed } = values;
	const token = getCookie("token");

	useEffect(() => {
		loadTags();
	}, [reload]);

	function loadTags() {
		getTags().then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
				setValues({ ...values, error: false, tags: data });
			}
		});
	}

	function showTags() {
		return tags.map((t, i) => {
			return (
				<button
					key={i}
					onDoubleClick={() => handleDoubleClick(t.slug)}
					title="Double click to delete."
					className="btn btn-outline-primary mr-1 ml-1 mt-3"
				>
					{t.name}
				</button>
			);
		});
	}

	function handleChange(e) {
		const { name, value } = e.target;
		setValues({ ...values, [name]: value, error: false, success: false });
	}

	function handleSubmit(e) {
		e.preventDefault();
		console.log("submit clicked");

		createTag({ name }, token)
			.then((data) => {
				if (data.error) {
					console.log(data.error);
					setValues({ ...values, error: data.error });
				} else {
					setValues({
						...values,
						name: "",
						error: false,
						success: true,
						reload: !reload,
					});
				}
			});
	}

	function handleDoubleClick(slug) {
		let answer = window.confirm("Delete this tag?");

		if (answer) {
			removeTag(slug, token).then((data) => {
				if (data.error) {
					console.log(data.error);
				} else {
					setValues({
						...values,
						removed: true,
						reload: !reload,
						error: false,
					});
				}
			});
		}
	}

	function showRemoved() {
		if (removed) {
			return <p className="text-danger">Tag is removed</p>;
		}
	}

	function showSuccess() {
		if (success) {
			return <p className="text-success">Tag is created</p>;
		}
	}

	function showError() {
		if (error) {
			return <p className="text-danger">Tag already exists</p>;
		}
	}

	function handleMouseMove() {
		setValues({ ...values, success: false, error: false, removed: false });
	}

	function showTagForm() {
		return (
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label className="text-muted">Name</label>
					<input
						name="name"
						value={name}
						className="form-control"
						type="text"
						onChange={handleChange}
						required
					/>
				</div>
				<div>
					<button className="btn btn-primary" type="submit">
						Create Tag
					</button>
				</div>
			</form>
		);
	}

	return (
		<React.Fragment>
			{showError()}
			{showSuccess()}
			{showRemoved()}
			<div onMouseMove={handleMouseMove}>
				{showTagForm()}
				{showTags()}
			</div>
		</React.Fragment>
	);
}

export default Tag;
