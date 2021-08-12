import Layout from "../components/Layout";
import { withRouter } from "next/router";
import Link from "next/link";

function Homepage() {
	return (
		<Layout>
			<div className="container">
				<div className="row">
					<div className="col-md-12 text-center">
						<h1>BlOGS</h1>
					</div>
				</div>
			</div>
		</Layout>
	);
}

export default withRouter(Homepage);
