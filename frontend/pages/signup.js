import Layout from "../components/Layout";
import SignupComponent from "../components/auth/SignupComponent";

function Signup() {
	return (
		<Layout>
			<h2 className="text-center pt-4 pb-4">Sign up</h2>
			<div className="row">
				<div className="col-md-6 offset-md-5">
					<SignupComponent />
				</div>
			</div>
		</Layout>
	);
}

export default Signup;
