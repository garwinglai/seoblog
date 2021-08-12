import Layout from "../../../components/Layout";
import Private from "../../../components/auth/Private";
import Blog from "../../../components/crud/Blog";

function CreateUserBlog() {
	return (
		<Layout>
			<Private>
				<div className="container-fluid">
					<div className="row">
						<div className="col-md-12">
							<h1>Create your blogs</h1>
						</div>
						<div className="col-md-12">
							<Blog />
						</div>
					</div>
				</div>
			</Private>
		</Layout>
	);
}

export default CreateUserBlog;
