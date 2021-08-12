import React, { useState } from "react";
import { resetPassword } from "../../actions/auth";
import { useRouter } from "next/router";

function ForgotPw() {
	const [values, setValues] = useState({
		newPassword: "",
		loading: false,
		error: false,
		success: false,
		message: "",
	});

	const { newPassword, loading, error, success, message } = values;
	const router = useRouter();
	const resetPasswordLink = router.query.resetPasswordLink;

  console.log(router)

	function handleChange(e) {
		const { name, value } = e.target;
		setValues({
			...values,
			success: false,
			error: false,
			[name]: value,
		});
	}

	function handleSubmit(e) {
		e.preventDefault();

		resetPassword(resetPasswordLink, newPassword).then((data) => {
			if (data.error) {
				return setValues({
					...values,
					error: data.error,
					loading: false,
					success: false,
				});
			}
			setValues({
				...values,
				success: true,
				loading: false,
				error: false,
				message: data.message,
			});
		});
	}

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

	function showPasswordForm() {
		return (
			<div className="container">
				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<label className="lead">Please enter your new password.</label>
						<input
							name="newPassword"
							onChange={handleChange}
							type="password"
							className="form-control"
						/>
					</div>
					<div>
						<button className="btn btn-primary">Create new password</button>
					</div>
				</form>
			</div>
		);
	}

	return (
		<React.Fragment>
			{showSuccess()}
			{showError()}
			{showPasswordForm()}
		</React.Fragment>
	);
}

export default ForgotPw;
