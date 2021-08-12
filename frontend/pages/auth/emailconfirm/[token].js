import React, { useState } from "react";
import Layout from "../../../components/Layout";
import signup from "../../../actions/auth";
import { useRouter } from "next/router";

function ActivateAccount() {
	const [values, setValues] = useState({
		error: "",
		success: "",
		message: "",
	});

	const { error, success, message } = values;

	const router = useRouter();
	const token = router.query.token;

	function handleClick(e) {
		e.preventDefault();

		signup({ token }).then((data) => {
			if (data.error) {
				return setValues({ error: data.error, success: false });
			} else {
				setValues({ error: false, success: true, message: data.message });
			}
		});
	}

	function showSuccess() {
		return (
			<div className="container">
				<div className="row">
					<div className="col-md-6">
						<div
							className="alert alert-info"
							style={{ display: success ? "" : "none" }}
						>
							{message}
						</div>
					</div>
				</div>
			</div>
		);
	}

	function showError() {
		return (
			<div className="container">
				<div className="row">
					<div className="col-md-6">
						<div
							className="alert alert-danger"
							style={{ display: error ? "" : "none" }}
						>
							{error}
						</div>
					</div>
				</div>
			</div>
		);
	}

	function showActivationPage() {
		return (
			<div className="container">
				<div className="form-group">
					<form onSubmit={handleClick}>
						<label className="lead">Account Activation</label>
						<button type="submit" className="btn btn-primary form-control">
							Activate Account
						</button>
					</form>
				</div>
			</div>
		);
	}

	return (
		<Layout>
			{showSuccess()}
			{showError()}
			{showActivationPage()}
		</Layout>
	);
}

export default ActivateAccount;
