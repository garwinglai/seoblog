import React from "react";
import { useState, useEffect } from "react";
import {
	create,
	getCategories,
	getCategory,
	removeCategory,
} from "../../actions/category";
import { isAuth, getCookie } from "../../actions/auth";
import Link from "next/link";
import { useRouter } from "next/router";
import slugify from "slugify";

function Category() {
	const router = useRouter();
	const [values, setValues] = useState({
		name: "",
		categories: [],
		error: false,
		success: false,
		reload: false,
		removed: false,
	});

	const { name, categories, error, success, reload, removed } = values;
	const token = getCookie("token");

	useEffect(() => {
		loadCategories();
	}, [reload]);

	function loadCategories() {
		getCategories().then((data) => {
			if (data.error) {
				console.log(data.error);
				setValues({ ...values, error: data.error });
			} else {
				setValues({
					...values,
					categories: data,
				});
			}
		});
	}

	function handleDoubleClick(slug) {
		let answer = window.confirm(
			"Are you sure you want to delete this category?"
		);

		if (answer) {
			removeCategory(slug, token).then((data) => {
				if (data.error) {
					console.log(data);
				} else {
					setValues({
						...values,
						success: false,
						name: "",
						error: false,
						reload: !reload,
						removed: true,
					});
				}
			});
		}
	}

	function showCategories() {
		return categories.map((item, index) => {
			return (
				<button
					onDoubleClick={() => handleDoubleClick(item.slug)}
					title="Double click to delete."
					className="btn btn-outline-primary mr-1 ml-1 mt-3"
					key={index}
					value={item.name}
				>
					{item.name}
				</button>
			);
		});
	}

	function showRemoved() {
		if (removed) {
			return <p className="text-danger">Category is removed</p>;
		}
	}

	function showSuccess() {
		if (success) {
			return <p className="text-success">Category is created</p>;
		}
	}

	function showError() {
		if (error) {
			return <p className="text-danger">Category already exists</p>;
		}
	}

	function handleChange(e) {
		const { name, value } = e.target;
		setValues({
			...values,
			[name]: value,
			error: false,
			success: false,
			removed: false,
		});
	}

	function handleSubmit(e) {
		e.preventDefault();

		create({ name }, token).then((data) => {
			if (data.error) {
				setValues({ ...values, error: data.error, success: false });
			} else {
				setValues({
					...values,
					error: false,
					success: true,
					name: "",
					reload: !reload,
				});
			}
		});
	}

  function handleMouseMove() {
    setValues({...values, error: false, success: false, removed: ""})
  }

	function newCategoryForm() {
		return (
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label className="text-muted">Name</label>
					<input
						name="name"
						value={name}
						type="text"
						className="form-control"
						onChange={handleChange}
						required
					/>
				</div>
				<div>
					<button type="submit" className="btn btn-primary">
						Create
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
				{newCategoryForm()}
				{showCategories()}
			</div>
			<p style={{ marginTop: "25px" }}>Double click to delete.</p>
		</React.Fragment>
	);
}

export default Category;
