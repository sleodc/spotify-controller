import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Grid, Button, Typography, TextField } from "@material-ui/core";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";
import SettingsIcon from "@material-ui/icons/Settings";
import AddSong from "./AddSong";
import Playlist from "./Playlist";

const Room = ({ leaveRoomCB }) => {
	let navigate = useNavigate();
	const [added, setAdded] = useState("");
	const [showSetting, setShowSetting] = useState(false);
	let { roomCode } = useParams();
	const [backData, setBackData] = useState({
		votesToSkip: 2,
		guestCanPause: false,
		isHost: false,
	});
	const [auth, setAuth] = useState(false);
	const [song, setSong] = useState({});

	const getRoomDetails = async () => {
		const response = await fetch("/api/get-room" + "?code=" + roomCode);
		if (!response.ok) {
			leaveRoomCB();
			navigate("/");
		}
		const data = await response.json();
		setBackData({
			...backData,
			votesToSkip: data.votes_to_skip,
			guestCanPause: data.guest_can_pause,
			isHost: data.is_host,
		});

		if (data.is_host) {
			authenticateSpotify();
		}
	};

	const authenticateSpotify = async () => {
		const response = await fetch("/spotify/is-authenticated");
		const data = await response.json();
		setAuth(data.status);
		if (!data.status) {
			const response = await fetch("/spotify/get-auth-url");
			const data = await response.json();
			window.location.replace(data.url);
		}
	};

	const getCurrentSong = async () => {
		const response = await fetch("/spotify/current-song");
		if (!response.ok) {
			return {};
		}
		const data = await response.json();
		setSong(data);
	};

	const leaveRoom = async () => {
		const response = await fetch("/api/leave-room", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const data = await response.json();
		leaveRoomCB();
		navigate("/");
	};

	const handleViewPlaylist = () => {
		navigate("/playlist");
	};

	const updateSettings = (value) => {
		setShowSetting(value);
	};

	useEffect(() => {
		getRoomDetails();
		// getCurrentSong();
	}, []);

	useEffect(() => {
		const intervalId = setInterval(() => {
			if (data.is_host) {
				authenticateSpotify();
			}
		}, 1800000);
		return () => clearInterval(intervalId);
	}, []);

	useEffect(() => {
		const intervalId = setInterval(() => {
			getCurrentSong();
		}, 1000);
		return () => clearInterval(intervalId);
	}, []);

	const renderSettingsButton = () => {
		return (
			<Grid item xs={12} align="center">
				<Button onClick={() => updateSettings(true)}>
					<SettingsIcon />
				</Button>
			</Grid>
		);
	};

	const renderSettings = () => {
		return (
			<Grid container spacing={0}>
				<Grid item xs={12} align="center">
					<CreateRoomPage
						update={true}
						votesToSkip={backData.votesToSkip}
						guestCanPause={backData.guestCanPause}
						roomCode={roomCode}
					/>
				</Grid>
				<Grid item xs={12} align="center">
					<Button
						variant="contained"
						color="secondary"
						onClick={() => updateSettings(false)}
					>
						Close
					</Button>
				</Grid>
			</Grid>
		);
	};
	if (showSetting) {
		return renderSettings();
	}
	return (
		<Grid
			container
			spacing={0}
			style={{ backgroundColor: "#FAFAD2", paddingTop: 70 }}
		>
			<Grid
				container
				spacing={0}
				justify="center"
				style={{ display: "flex" }}
			>
				<Grid item className="mb-5">
					<Typography variant="h4" component="h4">
						Room: {roomCode}
					</Typography>
					<Grid item xs={12} align="center">
						<Button
							color="secondary"
							variant="contained"
							onClick={leaveRoom}
						>
							Leave Room
						</Button>
					</Grid>
				</Grid>
				<Grid item>
					{backData.isHost ? renderSettingsButton() : null}
				</Grid>
			</Grid>
			<AddSong setAdded={setAdded} />
			<MusicPlayer song={song} />
			<Playlist added={added} setAdded={setAdded} />
		</Grid>
	);
};

export default Room;
