import Layout from "../../../components/Layout";
import Admin from "../../../components/auth/Admin";
import UpdateBlog from "../../../components/crud/UpdateBlog";

function BlogUpdate() {
	return (
		<Layout>
			<Admin>				
				<div className="container-fluid">
					<div className="row">
						<div className="col-md-12">
							<h1>Update your blog</h1>
						</div>
						<div className="col-md-12">
							<UpdateBlog />
						</div>
					</div>
				</div>
			</Admin>
		</Layout>
	);
}

export default BlogUpdate;
