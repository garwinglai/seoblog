import { API } from "../config";
import fetch from "isomorphic-fetch";
import { handleTokenExpire } from "../actions/auth";

function createTag(tag, token) {
	return fetch(`${API}/tag`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(tag),
	})
		.then((response) => {
			// handleTokenExpire(response);
			return response.json();
		})
		.catch((error) => console.log(`Create Tag Error: ${error}`));
}

function getTags() {
	return fetch(`${API}/tags`, {
		method: "GET",
	})
		.then((response) => {
			// handleTokenExpire(response);
			return response.json();
		})
		.catch((error) => console.log(`Getting Tags Error: ${error}`));
}

function getTag(slug) {
	return fetch(`${API}/tag/${slug}`, {
		method: "GET",
	})
		.then((response) => {
			// handleTokenExpire(response);
			return response.json();
		})
		.catch((error) => console.log(`Getting Tags Error: ${error}`));
}

function removeTag(slug, token) {
	return fetch(`${API}/tag/${slug}`, {
		method: "DELETE",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	})
		.then((response) => {
			// handleTokenExpire(response);
			return response.json();
		})
		.catch((error) => console.log(`Remove Tag Error: ${error}`));
}
export { createTag, getTags, getTag, removeTag };
