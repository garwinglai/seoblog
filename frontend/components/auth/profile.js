import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { getCookie, isAuth, updateUserLocalStorage } from "../../actions/auth";
import { updateUser, getUserProfile } from "../../actions/user";
import { API } from "../../config";

function ProfileUpdate() {
	const [values, setValues] = useState({
		name: "",
		id: "",
		username: "",
		password: "",
		email: "",
		photo: "",
		photoLoad: "",
		about: "",
		error: "",
		success: "",
		loading: "",
	});

	const {
		name,
		id,
		username,
		email,
		password,
		photo,
		photoLoad,
		about,
		loading,
		error,
		success,
	} = values;

	const token = getCookie("token");
	const router = useRouter();

	useEffect(() => {
		loadUserProfile(token);
	}, []);

	function loadUserProfile(token) {
		getUserProfile(token).then((data) => {
			if (data.error) {
				setValues({ ...values, error: data.error });
			} else {
				const user = data.user;
				setValues({
					...values,
					name: user.name,
					id: user._id,
					username: user.username,
					profile: user.profile,
					photoLoad: user.photo,
					email: user.email,
					error: false,
					loading: false,
					success: false,
				});
			}
		});
	}

	function handleChange(name, e) {
		let arr = [];
		const value = name === "photo" ? e.target.files[0] : e.target.value;
		// let form = new FormData();
		// form.set(name, value);
		setValues({
			...values,
			[name]: value,
			error: false,
			success: false,
			loading: false,
			// newData: form,
		});
	}

	function handleSubmit(e) {
		e.preventDefault();
		setValues({ ...values, loading: true });
		let formData = new FormData();

		for (const key in values) {
			console.log(`${key}: ${values[key]}`)
			if (values[key] && values[key] !== '') {
				formData.set(key, values[key])
			}
		}

		updateUser(token, formData).then((data) => {
			if (data.error) {
				setValues({
					...values,
					error: data.error,
					success: false,
					loading: false,
				});
			} else {
				console.log(data);
				updateUserLocalStorage(data, () => {
					setValues({
						...values,
						success: true,
						loading: false,
						error: false,
						name: data.name,
						username: data.username,
						email: data.email,
						about: data.about,
					});
					setTimeout(() => router.reload(), 500);
				});
			}
		});
	}

	function profileUpdateForm() {
		return (
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label className="btn btn-outline-info mt-2">
						Upload Profile Photo
						<input
							onChange={(e) => handleChange("photo", e)}
							type="file"
							accept="image/*"
							hidden
						/>
					</label>
				</div>
				<div className="form-group">
					<lable className="text-muted">Username</lable>
					<input
						type="text"
						onChange={(e) => handleChange("username", e)}
						value={username}
						className="form-control"
					/>
				</div>
				<div className="form-group">
					<lable className="text-muted">Name</lable>
					<input
						type="text"
						onChange={(e) => handleChange("name", e)}
						value={name}
						className="form-control"
					/>
				</div>
				<div className="form-group">
					<lable className="text-muted">Email</lable>
					<input
						type="email"
						onChange={(e) => handleChange("email", e)}
						value={email}
						className="form-control"
					/>
				</div>
				<div className="form-group">
					<lable className="text-muted">Password</lable>
					<input
						type="password"
						onChange={(e) => handleChange("password", e)}
						value={password}
						className="form-control"
					/>
				</div>
				<div className="form-group">
					<lable className="text-muted">About</lable>
					<textarea
						type="text"
						onChange={(e) => handleChange("about", e)}
						value={about}
						className="form-control"
					/>
				</div>
				<div>
					<button type="submit" className="btn btn-primary">
						Submit
					</button>
				</div>
			</form>
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

	function showSuccess() {
		return (
			<div
				className="alert alert-success"
				style={{ display: success ? "" : "none" }}
			>
				Profile Updated
			</div>
		);
	}

	function showLoading() {
		return (
			<div
				className="alert alert-info"
				style={{ display: loading ? "" : "none" }}
			>
				Loading...
			</div>
		);
	}

	return (
		<React.Fragment>
			<div className="container">
				<div className="row">
					<div className="col-md-4">
						{photoLoad ? (
							<img
								src={`${API}/profile/photo/${id}`}
								alt="User Profile"
								className="img img-fluid img-thumbnail mb-3"
								style={{ maxHeight: "auto", madWidth: "100%" }}
							/>
						) : (
							<h3>Add Profile Image</h3>
						)}
					</div>
					<div className="col-md-8">
						{showError()}
						{showSuccess()}
						{showLoading()}

						{profileUpdateForm()}
					</div>
				</div>
			</div>
		</React.Fragment>
	);
}

export default ProfileUpdate;
