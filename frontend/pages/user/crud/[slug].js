import Layout from "../../../components/Layout";
import Private from "../../../components/auth/Private";
import UpdateBlog from "../../../components/crud/UpdateBlog";

function BlogUpdate() {
	return (
		<Layout>
			<Private>
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
			</Private>
		</Layout>
	);
}

export default BlogUpdate;
