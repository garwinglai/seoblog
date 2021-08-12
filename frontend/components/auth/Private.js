import React, { useEffect } from "react";
import { isAuth } from "../../actions/auth";
import { useRouter } from "next/router";

function Private({ children }) {
	const router = useRouter();

	useEffect(() => {
		if (!isAuth()) {
			router.push("/signin");
		}
	}, []);

	return <React.Fragment>{children}</React.Fragment>;
}

export default Private;
