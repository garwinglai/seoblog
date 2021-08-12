import React, { useState } from "react";
import Layout from "../components/Layout";
import { submitContactForm } from "../actions/contact";

function Contact({ authorEmail }) {
	const [values, setValues] = useState({
		name: "",
		email: "",
		message: "",
		success: "",
		error: "",
		loading: "",
		buttonText: "Submit",
		authorEmail: authorEmail,
	});

	const { name, email, message, success, error, loading, buttonText } = values;

	function handleChange(e) {
		const { name, value } = e.target;
		console.log(name, value);
		setValues({
			...values,
			[name]: value,
			error: false,
			success: false,
			loading: false,
		});
	}

	function handleSubmit(e) {
    console.log(authorEmail)
		e.preventDefault();
		submitContactForm(values).then((data) => {
			if (data.error) {
				console.log(data.error.message.msg);
				return setValues({ ...values, error: data.error.message.msg });
			}
			setValues({
				...values,
				success: true,
				message: "Email has been sent, successfully.",
				buttonText: "sent",
			});
		});
	}

	function showSuccess() {
		return (
			<div
				className="alert alert-info"
				style={{ display: success ? "" : "none" }}
			>
				{message}
			</div>
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

	function contactForm() {
		return (
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label className="lead">Name:</label>
					<input
						name="name"
						onChange={handleChange}
						type="text"
						className="form-control"
						value={name}
						required
					/>
				</div>
				<div className="form-group">
					<lable className="lead">Email:</lable>
					<input
						name="email"
						onChange={handleChange}
						type="email"
						className="form-control"
						value={email}
						required
					/>
				</div>
				<div className="form-group">
					<label className="lead">Message:</label>
					<textarea
						name="message"
						onChange={handleChange}
						cols="30"
						rows="10"
						className="form-control"
					></textarea>
				</div>
				<div>
					<button className="form-control mt-3 btn btn-primary">
						{buttonText}
					</button>
				</div>
			</form>
		);
	}

	return (
		<React.Fragment>
			{showError()}
			{showSuccess()}
			{contactForm()}
		</React.Fragment>
	);
}

export default Contact;
