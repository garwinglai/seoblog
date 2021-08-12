import fetch from "isomorphic-fetch";
import { API } from "../config";
import { handleTokenExpire } from "../actions/auth";

function getUserBlogs(username) {
	return fetch(`${API}/profile/${username}`, {
		method: "GET",
		header: {
			Accept: "application/json",
		},
	})
		.then((response) => {
			// handleTokenExpire(response);
			return response.json();
		})
		.catch((err) => console.log(`Error getting API getUserBlogs ${err}`));
}

function updateUser(token, form) {
	return fetch(`${API}/profile/update`, {
		method: "PUT",
		headers: {
			Accept: "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: form,
	})
		.then((response) => {
			// handleTokenExpire(response);
			return response.json();
		})
		.catch((err) => console.log(`Error updating USER API ${err}`));
}

function getUserProfile(token) {
	return fetch(`${API}/profile`, {
		method: "GET",
		headers: {
			Accept: "application/json",
			Authorization: `Bearer ${token}`,
		},
	})
		.then((response) => {
			// handleTokenExpire(response);
			return response.json();
		})
		.catch((err) => console.log(`Error getting API userProfile: ${err}`));
}

export { getUserBlogs, updateUser, getUserProfile };
