import fetch from "isomorphic-fetch";
import { API } from "../config";
import cookie from "js-cookie";
import { useRouter } from "next/router";
import Router from "next/router";

function handleTokenExpire(response) {
	console.log("foo");

	console.log(response.status);
	if (response.status === 401) {
		signout(() => {
			return Router.push({
				pathname: "/signin",
				query: {
					message: "Your session has expired. Please signin.",
				},
			});
		});
	}
}

function preSignup(user) {
	return fetch(`${API}/presignup`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(user),
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
}

function signup(user) {
	console.log("foo");
	console.log(JSON.stringify(user));
	return fetch(`${API}/signup`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(user),
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
}

function signin(user) {
	return fetch(`${API}/signin`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(user),
	})
		.then((response) => {
			return response.json();
		})
		.catch((err) => console.log(err));
}

function signout(next) {
	removeCookie("token");
	removeLocalStorage("user");
	next();
}

//set cookie

function setCookie(key, value) {
	if (process.browser) {
		cookie.set(key, value, { expires: 1 });
	}
}

function removeCookie(key) {
	if (process.browser) {
		cookie.remove(key, { expires: 1 });
	}
}

//get cookie to authenticate
function getCookie(key) {
	if (process.browser) {
		return cookie.get(key);
	}
}

//localStorage
function setLocalStorage(key, value) {
	if (process.browser) {
		localStorage.setItem(key, JSON.stringify(value));
	}
}

function removeLocalStorage(key) {
	if (process.browser) {
		localStorage.removeItem(key);
	}
}

//authenticate by passing data to cookie and localStorage
function authenticate(data, next) {
	setCookie("token", data.token);
	setLocalStorage("user", data.user);
	next();
}

function isAuth() {
	if (process.browser) {
		if (getCookie("token")) {
			if (localStorage.getItem("user")) {
				return JSON.parse(localStorage.getItem("user"));
			} else {
				return false;
			}
		}
	}
}

function updateUserLocalStorage(user, next) {
	console.log(process.browser);
	if (localStorage.getItem("user")) {
		let storageUser = JSON.parse(localStorage.getItem("user"));
		storageUser = user;
		setLocalStorage("user", storageUser);
		next();
	}
}

function sendResetPasswordLink(email) {
	console.log(JSON.stringify({ email }));
	return fetch(`${API}/forgot-password`, {
		method: "PUT",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ email }),
	})
		.then((response) => response.json())
		.catch((err) => {
			console.log(`sendResetPassLink error: ${err}`);
		});
}

function resetPassword(resetPasswordLink, newPassword) {
	console.log(JSON.stringify({ resetPasswordLink, newPassword }));
	return fetch(`${API}/reset-password`, {
		method: "PUT",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ resetPasswordLink, newPassword }),
	})
		.then((response) => response.json())
		.catch((err) => {
			console.log(`resetPassword error: ${err}`);
		});
}

function googleLogin(user) {
	return fetch(`${API}/google-login`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(user),
	})
		.then((response) => response.json())
		.catch((err) => {
			console.log(`Problem logging in with google error: ${err}`);
		});
}

export default signup;
export {
	preSignup,
	handleTokenExpire,
	signin,
	authenticate,
	isAuth,
	signout,
	getCookie,
	updateUserLocalStorage,
	sendResetPasswordLink,
	resetPassword,
	googleLogin,
};
