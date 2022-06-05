import React, { useState } from "react";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import { IconButton } from "@material-ui/core";

const TrackResult = ({ Track }) => {
	const { track } = Track;
	const [playing, setPlaying] = useState(false);
	const smallestAlbumImage = track.album.images.reduce((smallest, image) => {
		if (image.height < smallest.height) return image;
		return smallest;
	}, track.album.images[0]);
	const artist = track.artists[0].name;

	const playSong = async () => {
		setPlaying(true);
		try {
			const response = await fetch("/spotify/playlist-song", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					uri: track.uri,
				}),
			});
		} catch (err) {
			console.log(err);
		}
	};

	const pauseSong = async () => {
		setPlaying(false);
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
	return (
		<div
			className="d-flex m-2 align-items-center"
			onClick={playSong}
			style={{ cursor: "pointer" }}
		>
			<img
				src={smallestAlbumImage.url}
				style={{ height: "64px", width: "64px" }}
			/>
			<div className="ml-3">
				<div>{track.name}</div>
				<div className="text-muted">{artist}</div>
			</div>
		</div>
	);
};

export default TrackResult;
