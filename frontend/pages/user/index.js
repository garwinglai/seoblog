import Layout from "../../components/Layout";
import Private from "../../components/auth/Private";
import Link from 'next/link'

function UserIndex() {
	return (
		<Layout>
			<Private>
				<div className="container-fluid">
					<div className="row">
						<div className="col-md-12">
							<h1>User Dashboard</h1>
						</div>
						<div className="col-md-6">
							<ul className="list-group">
					
								<li className="list-group-item">
									<Link href="/user/crud/blog">
										<a>Create Blog</a>
									</Link>
								</li>
								<li className="list-group-item">
									<Link href="/user/crud/manage-blogs">
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
			</Private>
		</Layout>
	);
}

export default UserIndex;
