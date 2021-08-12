import fetch from "isomorphic-fetch";
import { API } from "../config";
import queryString from "query-string";
import { isAuth, handleTokenExpire } from './auth';

function createBlog(blog, token) {
	const apiCreateBlog =
		isAuth() && isAuth().role === 0 ? `${API}/blog` : `${API}/user/blog`;

	return fetch(apiCreateBlog, {
		method: "POST",
		headers: {
			Accept: "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: blog,
	})
		.then((response) => {
			handleTokenExpire(response);
			return response.json();
		})
		.catch((err) => console.log(`error creating blog: ${err}`));
}

function getAllBlogs(token) {
	return fetch(`${API}/blogs`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
		.then((response) => {
			console.log(response.status);
			handleTokenExpire(response.status);
			return response.json();
		})
		.catch((err) => console.log(`Get All Blogs Action: ${err}`));
}

function getBlogsWithCategoriesAndTags(skip, limit) {
	const data = {
		skip,
		limit,
	};

	return fetch(`${API}/blogs-categories-tags`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	})
		.then((response) => {
			// handleTokenExpire(response);
			return response.json();
		})
		.catch((err) => console.log(`error getting all blogs API: ${err}`));
}

function getSingleBlog(slug) {
	return fetch(`${API}/blog/${slug}`, {
		method: "GET",
	})
		.then((response) => {
			// handleTokenExpire(response);
			return response.json();
		})
		.catch((err) => console.log(`getting single blog action error: ${err}`));
}

function getRelatedBlogs(blog) {
	return fetch(`${API}/blog/related`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(blog),
	})
		.then((res) => {
			// handleTokenExpire(res);
			return res.json();
		})
		.catch((err) =>
			console.log(`error getting related blogs from action blog: ${err}`)
		);
}

function updateBlog(blog, slug, token) {
	const apiUpdateBlog =
		isAuth() && isAuth().role === 0
			? `${API}/blog/${slug}`
			: `${API}/user/blog/${slug}`;

	return fetch(apiUpdateBlog, {
		method: "PUT",
		headers: {
			Accept: "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: blog,
	})
		.then((res) => {
			handleTokenExpire(res);
			return res.json();
		})
		.catch((err) => console.log(`Error updating blog action ${err}`));
}

function deleteBlog(slug, token) {
	const apiDeleteBlog =
		isAuth() && isAuth().role === 0
			? `${API}/blog/${slug}`
			: `${API}/user/blog/${slug}`;

	return fetch(apiDeleteBlog, {
		method: "DELETE",
		headers: {
			Accept: "application/json",
			"Content-Type": "application json",
			Authorization: `Bearer ${token}`,
		},
	})
		.then((res) => {
			handleTokenExpire(res);
			return res.json();
		})
		.catch((err) => console.log(`Error deleting blog action ${err}`));
}

function searchBlogs(param) {
	let query = queryString.stringify(param);
	// console.log(query)

	return fetch(`${API}/blogs/search?${query}`, {
		method: "GET",
	})
		.then((response) => {
			// handleTokenExpire(response);
			return response.json();
		})
		.catch((err) => console.log(`getting searched blog action error: ${err}`));
}

export {
	createBlog,
	getAllBlogs,
	getBlogsWithCategoriesAndTags,
	getSingleBlog,
	getRelatedBlogs,
	updateBlog,
	deleteBlog,
	searchBlogs,
};
