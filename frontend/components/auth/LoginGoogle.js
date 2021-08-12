import { googleLogin, authenticate, isAuth } from "../../actions/auth";
import { GOOGLE_CLIENT_ID } from "../../config";
import React, { useState, useEffect } from "react";
import GoogleLogin from "react-google-login";
import { useRouter } from "next/router";

function LoginGoogle() {
	const router = useRouter();
	
	function responseGoogle(response) {
		const tokenId = response.tokenId;
		const user = { tokenId };

		googleLogin(user).then((data) => {
			if (data.error) {
				console.log(data.error);
			} else {
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

	return (
		<div className="pb-3">
			<GoogleLogin
				clientId={`${GOOGLE_CLIENT_ID}`}
				buttonText="Login with Google"
				onSuccess={responseGoogle}
				onFailure={responseGoogle}
				theme="dark"
			/>
		</div>
	);
}

export default LoginGoogle;
