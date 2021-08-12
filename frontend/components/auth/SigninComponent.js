import React, { useState, useEffect } from "react";
import { signin, authenticate, isAuth } from "../../actions/auth";
import { useRouter } from "next/router";
import Link from "next/link";
import LoginGoogle from "./LoginGoogle";

function SigninComponent() {
	const router = useRouter();
	const [values, setValues] = useState({
		email: "",
		password: "",
		loading: false,
		error: false,
		message: "",
		showForm: true,
	});

	const { email, password, loading, error, message, showForm } = values;

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

		const user = { email, password };

		signin(user).then((data) => {
			if (data.error) {
				setValues({ ...values, error: data.error, loading: false });
			} else {
				//save token to cookie
				//save user data to local storage for quick access
				//authenticate user
				authenticate(data, () => {
					if (isAuth() && isAuth().role === 1) {
						router.push("/user");
					} else {
						router.push("/admin");
					}
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

	function signinForm() {
		return (
			<div className="form">
				<form onSubmit={handleSubmit}>
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
						<button
							disabled={email && password ? false : true}
							className="btn btn-primary mb-3"
						>
							Sign in
						</button>
					</div>
				</form>
			</div>
		);
	}

	function forgotPassword() {
		return (
			<Link href="/auth/forgot">
				<a>Forgot password</a>
			</Link>
		);
	}

	return (
		<React.Fragment>
			{showLoading()}
			{showError()}
			{showMessage()}
			{showForm && signinForm()}
			<LoginGoogle />
			{forgotPassword()}
		</React.Fragment>
	);
}

export default SigninComponent;
