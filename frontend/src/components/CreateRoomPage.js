import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    Button,
    Grid,
    Typography,
    TextField,
    FormHelperText,
    FormControl,
    Radio,
    RadioGroup,
    FormControlLabel,
} from "@material-ui/core";
import { Collapse } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

const CreateRoomPage = ({
    update = false,
    votesToSkip = 2,
    guestCanPause = true,
    roomCode = null,
}) => {
    let navigate = useNavigate();

    const [backData, setBackData] = useState({
        votesToSkip: votesToSkip,
        guestCanPause: guestCanPause,
        update: update,
        roomCode: roomCode,
        successMsg: "",
        errorMsg: "",
    });
    const handleVotesChange = (e) => {
        setBackData((data) => ({
            ...data,
            votesToSkip: e.target.value,
        }));
    };

    const handleGuestCanPauseChange = (e) => {
        setBackData((data) => ({
            ...data,
            guestCanPause: e.target.value == "true" ? true : false,
        }));
    };

    const handleRoomButtonPressed = async () => {
        try {
            const response = await fetch("/api/create-room", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    votes_to_skip: backData.votesToSkip,
                    guest_can_pause: backData.guestCanPause,
                }),
            });
            const data = await response.json();
            navigate("/room/" + data.code);
        } catch (err) {
            console.log(err);
        }
    };
    const handleUpdateButtonPressed = async () => {
        try {
            const response = await fetch("/api/update-room", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    votes_to_skip: backData.votesToSkip,
                    guest_can_pause: backData.guestCanPause,
                    code: backData.roomCode,
                }),
            });
            if (response.ok) {
                setBackData({
                    ...backData,
                    successMsg: "Room updated successfully",
                });
            } else {
                setBackData({
                    ...backData,

                    errorMsg: "Error updating room...",
                });
            }
            const data = await response.json();
            // navigate("/room/" + data.code);
        } catch (err) {
            console.log(err);
        }
    };

    const renderCreateButtons = () => {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={handleRoomButtonPressed}
                    >
                        Create A Room
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button
                        color="secondary"
                        variant="contained"
                        to="/"
                        component={Link}
                    >
                        Back
                    </Button>
                </Grid>
            </Grid>
        );
    };

    const renderUpdateButtons = () => {
        return (
            <Grid item xs={12} align="center">
                <Button
                    color="primary"
                    variant="contained"
                    onClick={handleUpdateButtonPressed}
                >
                    Update Room
                </Button>
            </Grid>
        );
    };

    let title = backData.update ? "Update Room" : "Create a Room";
    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: "100vh" }}
        >
            <Grid item xs={12} align="center">
                <Collapse
                    in={backData.successMsg != "" || backData.errorMsg != ""}
                >
                    {backData.successMsg != "" ? (
                        <Alert
                            style={{ width: "20%" }}
                            severity="success"
                            onClose={() => {
                                setBackData({ ...backData, successMsg: "" });
                            }}
                        >
                            {backData.successMsg}
                        </Alert>
                    ) : (
                        <Alert
                            severity="error"
                            style={{ width: "20%" }}
                            onClose={() => {
                                setBackData({ ...backData, errorMsg: "" });
                            }}
                        >
                            {backData.errorMsg}
                        </Alert>
                    )}
                </Collapse>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography component="h4" variant="h4">
                    {title}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl component="fieldset">
                    <FormHelperText>
                        <div align="center">
                            Guest control of playback state
                        </div>
                    </FormHelperText>
                    <RadioGroup
                        row
                        defaultValue={backData.guestCanPause.toString()}
                        onChange={handleGuestCanPauseChange}
                    >
                        <FormControlLabel
                            value="true"
                            control={<Radio color="primary" />}
                            label="Play/Pause"
                            labelPlacement="bottom"
                        />
                        <FormControlLabel
                            value="false"
                            control={<Radio color="secondary" />}
                            label="No Control"
                            labelPlacement="bottom"
                        />
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl>
                    <TextField
                        required={true}
                        type="number"
                        onChange={handleVotesChange}
                        defaultValue={backData.votesToSkip}
                        inputProps={{
                            min: 1,
                            style: {
                                textAlign: "center",
                            },
                        }}
                    />
                    <FormHelperText>
                        <div align="center">Votes required to skip song</div>
                    </FormHelperText>
                </FormControl>
            </Grid>
            {backData.update ? renderUpdateButtons() : renderCreateButtons()}
        </Grid>
    );
};

export default CreateRoomPage;
