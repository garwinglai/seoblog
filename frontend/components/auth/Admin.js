import React, { useEffect } from "react";
import { isAuth } from "../../actions/auth";
import { useRouter } from "next/router";

function Admin({ children }) {
	const router = useRouter();

	useEffect(() => {
		if (!isAuth()) {
			router.push("/signin");
		} else if (isAuth().role !== 0) {
      router.push("/");
    }
	}, []);

	return <React.Fragment>{children}</React.Fragment>;
}

export default Admin; 