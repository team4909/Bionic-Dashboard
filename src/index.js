import { React } from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "./theme";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<ThemeProvider theme={theme}>
		<CssBaseline />
		<App />
	</ThemeProvider>
);

