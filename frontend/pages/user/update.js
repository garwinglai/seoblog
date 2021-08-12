import React from "react";
import Layout from "../../components/Layout";
import Private from "../../components/auth/Private";
import ProfileUpdate from '../../components/auth/profile'

function UserUpdate() {


	return (
		<React.Fragment>
			<Layout>
				<Private>
					<div className="container-fluid">
						<div className="row">
							<ProfileUpdate />
						</div>
					</div>
				</Private>
			</Layout>
		</React.Fragment>
	);
}

export default UserUpdate;
