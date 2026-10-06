const axios = require("axios").default;
const path = require("path");
const fs = require("fs");
const setPic = require("./getPic");
const genIndex = require("./genIndex");
const {
  generateMarkupLocal,
  generateMarkupRemote,
} = require("./generateMarkup");

require("dotenv").config();

const NAME = process.env.NAME || "Fayza";
const PIC = process.env.PIC || "sample-pic.jpeg";
const NICKNAME = process.env.NICKNAME || "Fayza";
const HBD_MSG = process.env.HBD_MSG || "Happy Birthday Fayza!";
const OPEN_DATE = process.env.OPEN_DATE || "2026-10-10";
const picPath = PIC;
const msgPath = process.env.SCROLL_MSG;

//Local initialization
const setLocalData = async () => {
  try {
    const pic = path.join(__dirname, "../local/", picPath);
    let markup = "";
    if (msgPath) {
      const text = fs.readFileSync(path.join(__dirname, "../local/", msgPath), {
        encoding: "utf-8",
      });
      markup = generateMarkupLocal(text);
    }
    await setPic(pic);
    genIndex(markup);
  } catch (e) {
    throw new Error(e.message);
  }
};

//Remote initialization
const setRemoteData = async () => {
  try {
    let pic;
    if (picPath.startsWith("http")) {
      const res = await axios.get(picPath, {
        responseType: "arraybuffer",
      });
      pic = res.data;
    } else {
      pic = path.join(__dirname, "../local/", picPath);
    }
    let markup = "";
    if (msgPath) {
      const article = msgPath.split("/").pop();
      const res = await axios.get(
        `https://api.telegra.ph/getPage/${article}?return_content=true`
      );
      const { content } = res.data.result;
      markup = content.reduce(
        (string, node) => string + generateMarkupRemote(node),
        ""
      );
    }
    await setPic(pic);
    genIndex(markup);
  } catch (e) {
    throw new Error(e.message);
  }
};

if (process.argv[2] === "--local") setLocalData();
else if (process.argv[2] === "--remote") setRemoteData();
else console.log("Fetch mode not specified.");
