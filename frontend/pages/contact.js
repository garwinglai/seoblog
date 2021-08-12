import React from "react";
import Contact from "../components/contact";
import Layout from "../components/Layout";

function ContactPage() {
	return (
		<Layout>
			<div className="container">
				<div className="row">
					<h1>Contact Form</h1>
				</div>
				<div className="row">
					<div className="col-md-10">
						<Contact />
					</div>
				</div>
			</div>
		</Layout>
	);
}

export default ContactPage;
