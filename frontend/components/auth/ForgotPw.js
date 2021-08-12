import React, { useState } from "react";
import { sendResetPasswordLink } from "../../actions/auth";

function ForgotPw() {
	const [values, setValues] = useState({
		email: "",
		loading: false,
		error: false,
		success: false,
		message: "",
	});

	const { email, loading, error, success, message } = values;

	function handleChange(e) {
		const { name, value } = e.target;
		setValues({
			...values,
			loading: false,
			success: false,
			error: false,
			[name]: value,
		});
	}

	function handleSubmit(e) {
		e.preventDefault();

		console.log(values);
		sendResetPasswordLink(email).then((data) => {
			console.error(data.error);
			if (data.error) {
				console.log("data erorr");
				setValues({
					...values,
					error: data.error,
					loading: false,
					success: false,
				});
			} else {
				setValues({
					...values,
					success: true,
					loading: false,
					error: false,
					message: data.message,
				});
			}
		});
	}

	console.log(error);

	function showSuccess() {
		return (
			<div className="container">
				<div
					className="alert alert-info"
					style={{ display: success ? "" : "none" }}
				>
					{message}
				</div>
			</div>
		);
	}

	function showError() {
		return (
			<div className="container">
				<div
					className="alert alert-danger"
					style={{ display: error ? "" : "none" }}
				>
					{error}
				</div>
			</div>
		);
	}

	function showEmailForm() {
		return (
			<div className="container">
				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<label className="lead">Please enter your email address.</label>
						<input
							name="email"
							onChange={handleChange}
							type="email"
							className="form-control"
						/>
					</div>
					<div>
						<button disabled={email ? false : true} className="btn btn-primary">
							Send Password Reset Link
						</button>
					</div>
				</form>
			</div>
		);
	}

	return (
		<React.Fragment>
			{showSuccess()}
			{showError()}
			{showEmailForm()}
		</React.Fragment>
	);
}

export default ForgotPw;
