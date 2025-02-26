import { Link } from "react-router-dom";

const Index = () => {
	return (
		<>
			<h1> 404 - NOT PAGE FOUND </h1>
			<p>Oops! The page you are looking for does not exist.</p>
			<Link to="/">Go back Home</Link>
		</>
	);
};

export default Index;
