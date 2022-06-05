import React, { useState, useEffect } from "react";
import HomePage from "./HomePage";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import Playlist from "./Playlist";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Link,
	Navigate,
} from "react-router-dom";

function App() {
	const [roomCode, setRoomCode] = useState(null);

	const clearRoomCode = () => {
		setRoomCode(null);
	};
	useEffect(() => {
		const getUserInRoom = async () => {
			try {
				const response = await fetch("/api/user-in-room");
				const data = await response.json();
				setRoomCode(data.code);
			} catch (err) {
				console.log(err);
			}
		};
		getUserInRoom();
	}, []);
	return (
		<Router>
			<Routes>
				<Route
					path="/"
					element={
						roomCode ? (
							<Navigate to={`/room/${roomCode}`} />
						) : (
							<HomePage />
						)
					}
				/>
				<Route path="/join" element={<RoomJoinPage />} />
				<Route path="/create" element={<CreateRoomPage />} />
				<Route
					path="/room/:roomCode"
					element={<Room leaveRoomCB={clearRoomCode} />}
				/>
				<Route path="/playlist" element={<Playlist />} />
			</Routes>
		</Router>
	);
}
export default App;
