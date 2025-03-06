import { Link, Outlet } from "react-router-dom";
import myLogo from '/src/assets/restaurant-icon.svg';
import "../Styles/Layout.css";

const Index = () => {
	return (
		<>

			<header className="header-bar">
				<nav className="nav-bar" aria-label="Header Navigation" >
					
					<ul className="slider-menu">
						<li className="item">
							<Link to="/">The Redhead Restaurant Catalog</Link>
						</li>
						<li className="item" aria-hidden={true}>
							<img className="logo-image" src={myLogo} alt="restaurant-placeholder" />
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
