import { React, Component } from "react";
import { LinearProgress, Typography, Stack } from "@mui/material";
import {
	BatteryUnknown, Battery1Bar, Battery3Bar, Battery6Bar, BatteryFull, BatteryAlert 
} from "@mui/icons-material";

export default class BatteryDisplay extends Component {

	state = { robotVoltage: null };

	componentDidMount() {
		if (window.NetworkTables.isRobotConnected()) 
			window.NetworkTables.addKeyListener("/Bionic-Dashboard/PDH-Voltage", (_k, v) => {
				this.setState({robotVoltage: Math.round(v * 10) / 10});
			}, true);
	}

	getBatteryIcon = (voltage) => {
		if (voltage === null) return <BatteryUnknown color="info" fontSize="large" />;
		else if (voltage < 8) return <Battery1Bar color="error" fontSize="large" />;
		else if (voltage >= 8 && voltage < 12) return <Battery3Bar color="warning" fontSize="large" />;
		else if (voltage >= 12 && voltage < 13) return <Battery6Bar color="success" fontSize="large" />;
		else if (voltage >= 13) return <BatteryFull color="success" fontSize="large"/>;
		else return <BatteryAlert color="info" fontSize="large" />;
	};

	scaleVoltage = (v) => {
		const maxV = 13.2;
		if (v > maxV) { return 100; }
		return (v * 100) / maxV;
	};

	render() {
		return (
			<Stack direction={"row"} justifyContent={"left"} alignItems={"center"} spacing={1}>
				<Typography noWrap color="text" sx={{ width: "35%" }}>{`${this.state.robotVoltage}v`}</Typography>
				<LinearProgress title="Robot Voltage" sx={{
					height: "20px",
					width: "100%",
					border: 1,
					borderRadius: "4px",
					borderColor: "text.primary", backgroundColor: "text.primary",
					"& 	.MuiLinearProgress-bar1Determinate": { backgroundColor: "info.main" },
				}} value={this.scaleVoltage(this.state.robotVoltage)} variant="determinate"/>
				{this.getBatteryIcon(this.state.robotVoltage)}
			</Stack>
		);
	}
}
