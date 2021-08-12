import React from "react";
import Layout from "../../../components/Layout";
import Private from "../../../components/auth/Private";
import Manageblog from "../../../components/crud/Manageblog";

function ManageUserBlog() {
	return (
		<Layout>
			<Private>
				<div className="container pt-5">
					<div className="row col-md-12">
						<h1>Manage Blogs</h1>
					</div>
					<div className="row">
						<Manageblog />
					</div>
				</div>
			</Private>
		</Layout>
	);
}

export default ManageUserBlog;