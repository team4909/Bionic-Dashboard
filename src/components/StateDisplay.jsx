import { Chip } from "@mui/material";
import { React, Component } from "react";

export default class StateDisplay extends Component {

	state = { robotState: null, robotStatus: null };

	componentDidMount() {
		if (window.NetworkTables.isRobotConnected()) 
			window.NetworkTables.addKeyListener("/Bionic-Dashboard/Robot-State", (_k, v) => {
				this.setState({ robotVoltage: v[0], robotStatus: v[1] });
			}, true);
	}

	getStateColor = (status) => {
		if (status === "true") return "success";
		else if (status === "false" ) return "error";
		else return "info";
	};

	render() {
		return (
			<Chip label={`${this.state.robotState}`} color={`${this.getStateColor(this.state.robotStatus)}`} />
		);

	}
}