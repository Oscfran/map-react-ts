import { Link, Outlet } from "react-router-dom";
import "../Styles/Layout.css";

const Index = () => {
	return (
		<>
			<header className="header-bar">
				<nav className="nav-bar" aria-label="Header Navigation">
					<ul className="slider-menu">
						<li className="item">
							<Link to="/">Home</Link>
						</li>
					</ul>
				</nav>
			</header>
			<main className="layout-outlet">
				<Outlet /> {/* Renders the current route's component */}
			</main>
		</>
	);
};

export default Index;
