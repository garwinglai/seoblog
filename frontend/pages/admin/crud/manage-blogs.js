import React from "react";
import Layout from "../../../components/Layout";
import Admin from "../../../components/auth/Admin";
import Manageblog from "../../../components/crud/Manageblog";

function ManageBlog() {
	return (
		<Layout>
			<Admin>
				<div className="container pt-5">
					<div className="row col-md-12">
						<h1>Manage Blogs</h1>
					</div>
					<div className="row">
						<Manageblog />
					</div>
				</div>
			</Admin>
		</Layout>
	);
}

export default ManageBlog;
