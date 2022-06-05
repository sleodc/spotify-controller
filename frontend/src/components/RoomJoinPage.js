import React, { useState } from "react";
import { TextField, Button, Grid, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const RoomJoinPage = () => {
	let navigate = useNavigate();
	const [roomCode, setRoomCode] = useState("");
	const [error, setError] = useState("");

	const handleTextField = (e) => {
		setRoomCode(e.target.value);
	};
	const handleSubmitButton = async () => {
		try {
			const response = await fetch("/api/join-room", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					code: roomCode,
				}),
			});
			if (response.ok) {
				navigate(`/room/${roomCode}`);
			} else {
				setError({ error: "Room not found" });
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Grid
			container
			spacing={0}
			direction="column"
			alignItems="center"
			justifyContent="center"
			style={{ minHeight: "100vh", backgroundColor: "	#41bec2" }}
		>
			<Grid item xs={12}>
				<Typography variant="h4" component="h4">
					Join a Room
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<TextField
					error={error.error}
					label="Code"
					placeholder="Enter a Room Code"
					value={roomCode}
					helperText={error.error}
					variant="outlined"
					onChange={handleTextField}
				/>
			</Grid>
			<Grid item xs={12}>
				<Button
					variant="contained"
					color="primary"
					onClick={handleSubmitButton}
				>
					Enter Room
				</Button>
			</Grid>
			<Grid item xs={12}>
				<Button
					variant="contained"
					color="secondary"
					to="/"
					component={Link}
				>
					Back
				</Button>
			</Grid>
		</Grid>
	);
};

export default RoomJoinPage;
