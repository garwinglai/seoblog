import React, { useState, useEffect } from "react";
import { searchBlogs } from "../../actions/blog";
import Link from "next/link";

function SearchBar() {
	const [values, setValues] = useState({
		search: undefined,
		searched: false,
		message: "",
		searchResults: [],
	});

	const { search, searched, message, searchResults } = values;

	function showResults() {
		return (
			<div className="jumbotron bg-white">
				{message && <p className="pt-4 text-muted font-italic">{message}</p>}
				{searchResults.map((blog, i) => {
					return (
						<div key={i}>
							<Link href={`/blogs/${blog.slug}`}>
								<a className="text-primary">{blog.title}</a>
							</Link>
						</div>
					);
				})}
			</div>
		);
	}

	function handleOnChange(e) {
		console.log(e.target.value);
		setValues({
			...values,
			searched: false,
			search: e.target.value,
			searchResults: [],
		});
	}

	function handleSubmit(e) {
		e.preventDefault();
		searchBlogs({ search }).then((data) => {
			setValues({
				...values,
				searched: true,
				searchResults: data,
				message: `${data.length} blogs found`,
			});
		});
	}

	function searchBarForm() {
		return (
			<form onSubmit={handleSubmit}>
				<div className="row">
					<div className="col-md-8">
						<input
							className="form-control"
							type="search"
							placeholder="Search blogs"
							onChange={handleOnChange}
						/>
					</div>
					<div className="col-md-4">
						<button type="submit" className="btn btn-outline-primary btn-block">
							Search
						</button>
					</div>
				</div>
			</form>
		);
	}

	return (
		<div className="container-fluid">
			<div className="pb-5">
				{searchBarForm()}
				{searched && showResults()}
			</div>
		</div>
	);
}

export default SearchBar;
