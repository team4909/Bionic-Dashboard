import { React, Component } from "react";
import { Box } from "@mui/system";
import logo from "../assets/Logo.png";

export default class Logo extends Component {
	render() {
		return (
			<Box display={"flex"} justifyContent={"center"}>
				<img src={logo} style={{
					width: 7076 / 32,
					height: 3570 / 32,
				}} />
			</Box>
		);
	}
}
