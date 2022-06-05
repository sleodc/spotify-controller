import React from "react";
import {
	Grid,
	Typography,
	Card,
	IconButton,
	LinearProgress,
} from "@material-ui/core";
import PlayerArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import SkipNextIcon from "@material-ui/icons/SkipNext";

const MusicPlayer = ({ song }) => {
	const songProgress = (song.time / song.duration) * 100;

	const pauseSong = async () => {
		try {
			const response = await fetch("/spotify/pause", {
				method: "PUT",
				header: {
					"Content-Type": "application/json",
				},
			});
		} catch (err) {
			console.log(err);
		}
	};

	const playSong = async () => {
		try {
			const response = await fetch("/spotify/play", {
				method: "PUT",
				header: {
					"Content-Type": "application/json",
				},
			});
		} catch (err) {
			console.log(err);
		}
	};

	const skipSong = async () => {
		try {
			const response = await fetch("/spotify/skip", {
				method: "POST",
				header: {
					"Content-Type": "application/json",
				},
			});
		} catch (err) {
			console.log(err);
		}
	};
	return (
		<Grid
			container
			spacing={0}
			direction="column"
			alignItems="center"
			justify="center"
			style={{ minHeight: "50vh", marginRight: 30, marginLeft: 30 }}
		>
			{Object.keys(song).length === 0 ? (
				<h1>No song playing</h1>
			) : (
				<Card style={{ backgroundColor: "#F8F0E3" }}>
					<Grid container alignItems="center">
						<Grid item align="center" xs={12}>
							<img
								src={song.image_url}
								height="40%"
								width="40%"
							/>
						</Grid>
						<Grid item align="center" xs={12}>
							<Typography component="h5" variant="h5">
								{song.title}
							</Typography>
							<Typography
								color="textSecondary"
								variant="subtitle1"
							>
								{song.artist}
							</Typography>
							<div>
								<IconButton
									onClick={() =>
										song.is_playing
											? pauseSong()
											: playSong()
									}
								>
									{song.is_playing ? (
										<PauseIcon />
									) : (
										<PlayerArrowIcon />
									)}
								</IconButton>
								<IconButton onClick={skipSong}>
									{/* <Typography variant="h6" component="h6"> */}
									{/* 	({song.votes} / {song.votes_required}) */}
									{/* </Typography> */}
									<SkipNextIcon />
								</IconButton>
							</div>
						</Grid>
					</Grid>
					<LinearProgress
						variant="determinate"
						value={songProgress}
					/>
				</Card>
			)}
		</Grid>
	);
};

export default MusicPlayer;
