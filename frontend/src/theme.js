import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
	typography: {
		h4: {
			fontFamily: ["Luckiest Guy", "cursive"].join(","),
		},
		h5: {
			fontFamily: ["ZCOOL XiaoWei", "serif"].join(","),
		},
		h6: {
			fontFamily: ["Indie Flower", "cursive"].join(","),
		},
	},
});

export default theme;
