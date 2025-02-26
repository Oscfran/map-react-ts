import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import MapApi from "./Components/MapView/Map.tsx";
import Layout from "./Components/Pages/Layout.tsx";
import NoPage from "./Components/Pages/NoPage.tsx";

createRoot(document.getElementById("root") as HTMLElement).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<MapApi />} />
					<Route path="*" element={<NoPage />} />{" "}
					{/* Catch-all for unknown routes */}
				</Route>
			</Routes>
		</BrowserRouter>
	</StrictMode>,
);
