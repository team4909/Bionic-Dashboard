import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import { React } from "react";
import BatteryDisplay from "./components/BatteryDisplay";

function App() {
	return (
		<Box className="App" p={2}>
			<Grid container rowSpacing={10} direction="column">
				{/* Header */}
				<Grid item container columnSpacing={2} flexDirection="row">
					<Grid item xs={10}/>
					<Grid item xs={2}>
						<BatteryDisplay />
					</Grid>
				</Grid>
			</Grid>

		</Box>
	);
}

export default App;
