import { Link, Outlet } from "react-router-dom";
import "../Styles/Layout.css";

const Index = () => {
	return (
		<>
		<link rel="stylesheet"
  		href="https://fonts.googleapis.com/css?family=Untitled+Sans"/>
			<header className="header-bar">
				<nav className="nav-bar" aria-label="Header Navigation">
					<ul className="slider-menu">
						<li className="item">
							<Link to="/">Home</Link>
						</li>
						<li className="item">
							<Link to="/about">About</Link>
						</li>
					</ul>
				</nav>
			</header>
			<main className="layout-outlet">
				<Outlet /> {/* Renders the current route's component */}
			</main>
			<footer aria-label="Footer">
				<p>&copy; Oscar Hernandez, 2025.</p>
				<nav aria-label="Footer Navigation">
					<ul  className="footer-list">
						<li>
							<Link to="/privacy-policy">Privacy Policy</Link>
						</li>
						<li>
							<Link to="/terms-of-service">Terms of Service</Link>
						</li>
						<li>
							<Link to="/contact">Contact</Link>
						</li>
					</ul>
				</nav>
			</footer>
		</>
	);
};

export default Index;
