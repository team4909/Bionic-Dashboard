import { createTheme } from "@mui/material";

export const theme = createTheme({
	palette: {
		background: {default: "#154733"},
		primary: { main:"#363636" },
		secondary: { main: "#121212"},
		success: { main: "#3cbd49"},
		warning: { main: "#d6ce2b"},
		error: { main: "#d92a27"},
		info: { main: "#2b75e3"},	
		text: { primary: "#e8e8e8"},
	},
	typography: {
		fontFamily: "Roboto Mono"
	}
});