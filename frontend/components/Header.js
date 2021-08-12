import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
	Collapse,
	Navbar,
	NavbarToggler,
	NavbarBrand,
	Nav,
	NavItem,
	NavLink,
	UncontrolledDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	NavbarText,
} from "reactstrap";
import { APP_NAME } from "../config";
import { isAuth, signout } from "../actions/auth";
import { useRouter } from "next/router";
import NProgress from "nprogress";
import Router from "next/router";
import ".././node_modules/nprogress/nprogress.css";
import SearchBar from "../components/blog/search";

Router.onRouteChangeStart = (url) => NProgress.start();
Router.onRouteChangeComplete = (url) => NProgress.done();
Router.onRouteChangeError = (url) => NProgress.dont();

const Header = (props) => {
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);

	const toggle = () => setIsOpen(!isOpen);

	// useEffect(() => {
	// 	router.events.on("routeChangeStart", NProgress.start());
	//   router.events.on('routeChangeComplete', NProgress.done());
	//   router.events.on('routeChangeError', NProgress.done());

	// 	return () => {
	// 		router.events.off('routeChangeStart', NProgress.done())
	// 	}
	// }, []);

	return (
		<React.Fragment>
			<Navbar color="light" light expand="md">
				<Link href="/">
					<NavbarBrand
						style={{ cursor: "pointer" }}
						className="font-weight-bold"
					>
						{APP_NAME}
					</NavbarBrand>
				</Link>
				<NavbarToggler onClick={toggle} />
				<Collapse isOpen={isOpen} navbar>
					<Nav className="mr-auto" navbar>
						<React.Fragment>
							<NavItem>
								<Link href="/blogs">
									<NavLink style={{ cursor: "pointer" }}>Blogs</NavLink>
								</Link>
							</NavItem>
						</React.Fragment>

						{!isAuth() && (
							<React.Fragment>
								<NavItem>
									<Link href="/signin">
										<NavLink style={{ cursor: "pointer" }}>Sign In</NavLink>
									</Link>
								</NavItem>
								<NavItem>
									<Link href="/signup">
										<NavLink style={{ cursor: "pointer" }}>Sign Up</NavLink>
									</Link>
								</NavItem>
							</React.Fragment>
						)}

						{isAuth() && isAuth().role === 1 && (
							<NavItem>
								<Link href="/user">
									<NavLink style={{ cursor: "pointer" }}>{`${
										isAuth().name
									}'s Dashboard`}</NavLink>
								</Link>
							</NavItem>
						)}

						{isAuth() && isAuth().role === 0 && (
							<NavItem>
								<Link href="/admin">
									<NavLink style={{ cursor: "pointer" }}>{`${
										isAuth().name
									}'s Dashboard`}</NavLink>
								</Link>
							</NavItem>
						)}

						{isAuth() && (
							<NavItem>
								<Link href="/contact">
									<NavLink style={{ cursor: "pointer" }}>Contact</NavLink>
								</Link>
							</NavItem>
						)}

						<NavItem>
							{isAuth() && (
								<NavLink
									style={{ cursor: "pointer" }}
									onClick={() => signout(() => router.replace("/signin"))}
								>
									Sign Out
								</NavLink>
							)}
						</NavItem>
					</Nav>
				</Collapse>
			</Navbar>
			<SearchBar />
		</React.Fragment>
	);
};

export default Header;
