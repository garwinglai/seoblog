import Layout from "../components/Layout"
import SigninComponent from "../components/auth/SigninComponent";

function Signin() {
	return (
		<Layout>
			<h2 className="text-center pt-4 pb-4">Sign in</h2>
			<div className="row">
				<div className="col-md-6 offset-md-5">
					<SigninComponent />
				</div>
			</div>
		</Layout>
	);
}

export default Signin;
