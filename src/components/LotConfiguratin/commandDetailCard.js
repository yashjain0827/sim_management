import * as React from "react";
import { Grid } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function BasicCard({ command, keyToVerify }) {
  debugger;
  const data =
    keyToVerify != null &&
    keyToVerify != undefined &&
    Object.keys(keyToVerify).length > 0 &&
    Object.entries(keyToVerify);
  console.log(data);
  return (
    <Card sx={{ margin: 1 }}>
      <CardContent>
        <Typography
          variant="h5"
          component="div"
          gutterBottom
          style={{
            backgroundColor: "rgb(14 57 115 / 86%)",
            width: "100%",
            overflow:
              "auto" /* or overflow: hidden; depending on your preference */,
            wordWrap: "break-word",
            border: "none",
            borderRadius: "3px",
            padding: 2,
            color: "#fff",
          }}
        >
          {command}
        </Typography>
        <Typography variant="body2">
          {data &&
            data.length > 0 &&
            data.map(([key, value]) => {
              return (
                <Grid container justifyContent="flex-start" spacing={2}>
                  <Grid item>
                    <Typography
                      variant="button"
                      style={{ color: "#111", fontSize: "1.1rem" }}
                    >
                      {key}:{" "}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      variant="button"
                      style={{ color: "#555", fontSize: "1.1rem" }}
                    >
                      {value}{" "}
                    </Typography>
                  </Grid>
                </Grid>
              );
            })}
        </Typography>
      </CardContent>
    </Card>
  );
}
