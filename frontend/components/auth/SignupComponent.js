import React, { useState, useEffect } from "react";
import signup, { isAuth, preSignup } from "../../actions/auth";
import { useRouter } from "next/router";

function SignupComponent() {
	const router = useRouter();
	const [values, setValues] = useState({
		name: "",
		email: "",
		password: "",
		loading: false,
		error: false,
		message: "",
		showForm: true,
	});

	const { name, email, password, loading, error, message, showForm } = values;

	useEffect(() => {
		isAuth() && router.push("/");
	}, []);

	function handleChange(e) {
		const { name, value } = e.target;

		setValues({ ...values, [name]: value, error: false });
	}

	function handleSubmit(e) {
		e.preventDefault();

		setValues({ ...values, error: false, loading: true });

		const user = { name, email, password };

		preSignup(user).then((data) => {
			if (data.error) {
				setValues({ ...values, error: data.error, loading: false });
			} else {
				setValues({
					...values,
					name: "",
					email: "",
					password: "",
					error: false,
					loading: false,
					message: data.message,
					showForm: false,
				});
			}
		});
	}

	function showLoading() {
		return loading ? <div className="alert alert-info">Loading...</div> : "";
	}

	function showError() {
		return error ? <div className="alert alert-danger">{error}</div> : "";
	}

	function showMessage() {
		return message ? <div className="alert alert-info">{message}</div> : "";
	}

	function signupForm() {
		return (
			<div className="form">
				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<input
							name="name"
							value={name}
							onChange={handleChange}
							type="text"
							placeholder="Enter your name"
						/>
					</div>
					<div className="form-group">
						<input
							name="email"
							value={email}
							onChange={handleChange}
							type="email"
							placeholder="Enter your email"
						/>
					</div>
					<div className="form-group">
						<input
							name="password"
							value={password}
							onChange={handleChange}
							type="password"
							placeholder="Enter your password"
						/>
					</div>

					<div>
						<button className="btn btn-primary">Sign Up</button>
					</div>
				</form>
			</div>
		);
	}

	return (
		<React.Fragment>
			{showLoading()}
			{showError()}
			{showMessage()}
			{showForm && signupForm()}
		</React.Fragment>
	);
}

export default SignupComponent;
