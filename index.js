import express from "express";
import axios from "axios";
import fs from "fs";

const app = express();
const port = 3000;
const API_URL = "https://api.jikan.moe/v4";

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs", { response: "Response shows here" });
});

app.post("/search", async (req, res) => {
  const animeName = req.body.animeName;
  console.log(animeName);
  try {
    const response = await axios.get(API_URL + `/anime?q=${animeName}`);
    let info = JSON.stringify(response.data);
    fs.truncateSync("./anifo.json");
    fs.writeFileSync("./anifo.json", info, "utf-8");
    res.render("index.ejs", {
      result: response.data,
    });
  } catch (err) {
    res.render("index.ejs", { alert: err.message });
  }
});

app.listen(port, () => {
  console.log("App is listening on port: " + port);
});
