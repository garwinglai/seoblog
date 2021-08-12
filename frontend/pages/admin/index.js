import Layout from "../../components/Layout";
import Admin from "../../components/auth/Admin";
import Link from "next/link"

function AdminIndex() {
	return (
		<Layout>
			<Admin>
				<div className="container-fluid">
					<div className="row">
						<div className="col-md-12">
							<h1>Admin Dashboard</h1>
						</div>
						<div className="col-md-6">
							<ul className="list-group">
								<li className="list-group-item">
									<Link href="/admin/crud/category-tag">
										<a>Create Category</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link href="/admin/crud/category-tag">
										<a>Create Tag</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link href="/admin/crud/blog">
										<a>Create Blog</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link href="/admin/crud/manage-blogs">
										<a>Update & Delete Blog</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link href="/user/update">
										<a>Update Profile</a>
									</Link>
								</li>
							</ul>
						</div>
						<div className="col-md-6">right</div>
					</div>
				</div>
			</Admin>
		</Layout>
	);
}

export default AdminIndex;


