const express = require("express");
const router = express.Router();
const validUrl = require("valid-url");
const randomWords = require("random-words");
const config = require("config");

const Url = require("../models/Url");

// @route       POST /api/url/shorten
// @desc        Create Short URL
router.post("/shorten", async (req, res) => {
  const { longUrl } = req.body;
  const baseUrl = config.get("baseUrl");

  // check base url
  if (!validUrl.isUri(baseUrl)) {
    return res.status(401).json("Invalid base url");
  }

  // create url code
  let urlCodeExists = true;
  let urlCode = "";
  while (urlCodeExists) {
    const randomEnglishWords = randomWords({
      exactly: 3,
      formatter: (word, index) => {
        return index === 0 ? word.slice(0, 1).toUpperCase().concat(word.slice(1)) : word.toUpperCase();
      },
    });
    randomEnglishWords.map((x) => {
      urlCode = urlCode + x;
    });
    const urlExist = await Url.findOne({ urlCode });
    if (!urlExist) {
      urlCodeExists = false;
    }
  }

  //check long url
  if (validUrl.isUri(longUrl)) {
    try {
      let url = await Url.findOne({ longUrl });
      if (url) {
        res.json(url);
      } else {
        const shortUrl = baseUrl + "/" + urlCode;

        url = new Url({
          longUrl,
          shortUrl,
          urlCode,
        });

        await url.save();
        res.json(url);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json("Server Error");
    }
  } else {
    res.status(401).send("Invalid long url");
  }
});
module.exports = router;
