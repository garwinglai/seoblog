import { API } from "../config";
import fetch from "isomorphic-fetch";

function submitContactForm(form) {
	const apiSubmitContactForm = form.authorEmail
		? `${API}/contact-blog-author`
		: `${API}/contact`;

	return fetch(apiSubmitContactForm, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(form),
	})
		.then((response) => response.json())
		.catch((err) => console.log(`Error fetching submit contact form: ${err}`));
}

export { submitContactForm };
