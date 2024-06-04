import express from "express";
import axios from "axios";
import fs from "fs";

const app = express();
const port = 3000;
const API_URL = "https://api.jikan.moe/v4";

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs", { response: "assets/videos/anime-collection.mp4" });
});

app.post("/search", async (req, res) => {
  const currentPage = req.body.page;
  const animeSearch = req.body.animeSearch;
  if (animeSearch !== null && animeSearch !== "") {
    console.log(animeSearch);
    try {
      const response = await axios.get(
        API_URL + `/anime?q=${animeSearch}&page=${currentPage}`
      );
      res.render("index.ejs", {
        result: response.data,
      });
    } catch (err) {
      res.render("index.ejs", { alert: err.message });
    }
  } else {
    res.render("index.ejs", { alert: "Please enter the Anime title!" });
  }
});

app.post("/anime", async (req, res) => {
  const animeId = req.body.animeId;
  try {
    const response = await axios.get(API_URL + `/anime/${animeId}`);
    let info = JSON.stringify(response.data);
    fs.truncateSync("./anifo.json");
    fs.writeFileSync("./anifo.json", info, "utf-8");
    res.render("index.ejs", { content: response.data });
  } catch (err) {
    res.render("index.ejs", { alert: err.message });
  }
});

app.listen(port, () => {
  console.log("App is listening on port: " + port);
});
