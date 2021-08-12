import Layout from "../../../components/Layout";
import Admin from "../../../components/auth/Admin";
import Category from "../../../components/crud/Category";
import Tag from "../../../components/crud/Tag"

function CategoryTag() {
	return (
		<Layout>
			<Admin>
				<div className="container-fluid">
					<div className="row">
						<div className="col-md-12">
							<h1>Manage Category and Tags</h1>
						</div>
						<div className="col-md-6">
							<Category />
						</div>
						<div className="col-md-6">
							<Tag />
						</div>
					</div>
				</div>
			</Admin>
		</Layout>
	);
}

export default CategoryTag;
