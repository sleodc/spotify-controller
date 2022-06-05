import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Grid, Button, ButtonGroup, Typography } from "@material-ui/core";

const HomePage = () => {
	return (
		<Grid
			container
			spacing={0}
			direction="column"
			alignItems="center"
			justifyContent="center"
			style={{ minHeight: "100vh", backgroundColor: "#fdc675" }}
		>
			<Grid item xs={12}>
				<Typography variant="h4" compact="h4">
					House Party
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<ButtonGroup
					disableElevation
					variant="contained"
					color="primary"
				>
					<Button color="primary" to="/join" component={Link}>
						Join a Room
					</Button>
					<Button color="secondary" to="/create" component={Link}>
						Create a Room
					</Button>
				</ButtonGroup>
			</Grid>
		</Grid>
	);
};
export default HomePage;
