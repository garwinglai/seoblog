import Layout from "../../../components/Layout";
import Admin from "../../../components/auth/Admin";
import Blog from "../../../components/crud/Blog";


function CreateBlog() {
	return (
		<Layout>
			<Admin>
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
			</Admin>
		</Layout>
	);
}

export default CreateBlog;
