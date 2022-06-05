import React, { useState } from "react";
import {
	Grid,
	TextField,
	Button,
	Typography,
	Collapse,
} from "@material-ui/core";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import Alert from "@material-ui/lab/Alert";

const AddSong = ({ setAdded }) => {
	const PLAYLIST = "2eKw8IiWRw2nKA1SyqTpBF";
	const [addSong, setAddSong] = useState("");
	const [songLink, setSongLink] = useState("");
	const [msg, setMsg] = useState({
		success: "",
		error: "",
	});

	const handleChange = (e) => {
		setAddSong(e.target.value);
		const link = e.target.value;
		const split1 = link.split("?");
		const split2 = split1[0].split("/");
		const songId = split2[split2.length - 1];
		setSongLink("spotify:track:".concat(songId));
	};

	const handleClick = async (e) => {
		e.preventDefault();
		setAddSong("");
		try {
			const response = await fetch("/spotify/add-song", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					playlist: PLAYLIST,
					song: songLink,
				}),
			});
			setAdded("added");
			if (response.ok) {
				setMsg({
					...msg,
					success: "Song added successfully",
				});
			} else {
				setMsg({
					...msg,
					errorMsg: "Error adding song...",
				});
			}
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<Grid
			container
			spacing={0}
			justify="center"
			style={{ display: "flex" }}
			alignItems="center"
		>
			<Grid item xs={12} align="center">
				<Collapse in={msg.success != "" || msg.error != ""}>
					{msg.success != "" ? (
						<Alert
							style={{ width: "70%" }}
							severity="success"
							onClose={() => {
								setMsg({ ...msg, success: "" });
							}}
						>
							{msg.success}
						</Alert>
					) : (
						<Alert
							severity="error"
							style={{ width: "70%" }}
							onClose={() => {
								setMsg({ ...msg, error: "" });
							}}
						>
							{msg.error}
						</Alert>
					)}
				</Collapse>
			</Grid>
			<Grid item xs={10}>
				<Typography variant="caption" component="h5">
					Add song to playlist:
				</Typography>
			</Grid>
			<Grid item xs={10}>
				<TextField
					placeholder="https://open.spotify.com/track/2aBxt229cbLDOvtL7Xbb9x?si=YwSxVWttRnmnvovhcSiScw"
					value={addSong}
					onChange={handleChange}
					style={{ width: "100%" }}
					InputProps={{
						endAdornment: (
							<Button onClick={handleClick}>
								<PlaylistAddIcon />
							</Button>
						),
					}}
				/>
			</Grid>
		</Grid>
	);
};

export default AddSong;
