import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form } from "react-bootstrap";
import TrackResult from "./TrackResult";
import { Grid, Button, Typography, TextField } from "@material-ui/core";
const Playlist = ({ added, setAdded }) => {
	const PLAYLIST = "2eKw8IiWRw2nKA1SyqTpBF";
	const [playlist, setPlaylist] = useState();
	const [playlistSongs, setPlaylistSongs] = useState([]);
	const [loading, setLoading] = useState(true);
	let navigate = useNavigate();

	const getPlaylist = async () => {
		try {
			const response = await fetch("/spotify/get-playlist", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					playlist: PLAYLIST,
				}),
			});
			const data = await response.json();
			setPlaylist(data.playlist);
			setPlaylistSongs(data.playlist.tracks.items.reverse());
			setLoading(false);
		} catch (err) {
			console.log(err);
		}
	};
	useEffect(() => {
		getPlaylist();
	}, []);
	useEffect(() => {
		getPlaylist();
		setAdded("");
	}, [added]);

	return (
		<Container
			className="d-flex flex-column bg-warning"
			style={{ height: "100vh", paddingTop: 50 }}
		>
			{loading ? (
				<Grid container spacing={1} align="center">
					<Typography variant="h3" component="h3">
						Playlist loading...
					</Typography>
				</Grid>
			) : (
				<>
					<Grid container spacing={0} align="center">
						<Grid item xs={12}>
							<Typography variant="h4" component="h4">
								{playlist.name} Playlist
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<Typography variant="subtitle2" component="h5">
								Tap on song to play
							</Typography>
						</Grid>
					</Grid>
					<div
						className="flex-grow-1 bg-light"
						style={{ overflowY: "auto", marginTop: 80 }}
					>
						{playlistSongs.map((item) => {
							return <TrackResult Track={item} key={item.id} />;
						})}
					</div>
				</>
			)}
		</Container>
	);
};

export default Playlist;
