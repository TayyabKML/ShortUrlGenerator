import React from "react";
import axios from "axios";
import "./App.css";
import { Button, Grid, Snackbar, TextField } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

class UrlBuilder extends React.Component {
  constructor(props) {
    super(props);
    this.state = { url: "", previousUrls: [], error: false, errorMessage: "" };
  }

  onURLChange = (e) => {
    this.setState({ url: e.target.value });
  };

  onGenerateURL = () => {
    axios
      .post(`http://localhost:5000/api/url/shorten`, {
        longUrl: this.state.url,
      })
      .then((res) => {
        if (res.data.shortUrl) {
          this.setState({ previousUrls: [res.data.shortUrl] });
        }
        if (res.status !== 200) {
          this.setState({ error: true, errorMessage: res.error });
        }
      });
  };

  handleClose = () => {
    this.setState({ error: false, errorMessage: "" });
  };

  render() {
    return (
      <Grid container>
        <Grid container item xs={12} direction="row" justify="center" alignItems="center" style={{ marginTop: "50px" }}>
          <Grid container item xs={12} justify="center" alignItems="center">
            <h2>Human Readable Urls</h2>
          </Grid>
          <Grid container item xs={12} md={8} justify="center" alignItems="center">
            <TextField
              id="outlined-full-width"
              style={{ margin: 8 }}
              placeholder="Enter URL....."
              fullWidth
              variant="outlined"
              onChange={this.onURLChange}
            />
          </Grid>
          <Grid container item xs={12} justify="center" alignItems="center">
            <Button color="primary" variant="contained" onClick={this.onGenerateURL}>
              Generate
            </Button>
          </Grid>
        </Grid>
        <Grid
          container
          item
          xs={12}
          direction="column"
          justify="center"
          alignItems="center"
          style={{ marginTop: "50px" }}
        >
          {this.state.previousUrls.map((x, i) => {
            return (
              <Grid item xs={12} key={i}>
                {i === 0 ? <div className="recentUrl">{x}</div> : <div className="oldUrl">{x}</div>}
              </Grid>
            );
          })}
        </Grid>
        <Snackbar open={this.state.error} autoHideDuration={6000} onClose={this.handleClose}>
          <Alert onClose={this.handleClose} severity="error">
            {this.state.errorMessage}
          </Alert>
        </Snackbar>
      </Grid>
    );
  }
}

export default UrlBuilder;
