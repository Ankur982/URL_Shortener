const router = require("express").Router();

const Url = require("../models/Url");

const validUrl = require('valid-url');
const shortid = require('shortid');


router.post('/shorten', async (req, res) => {
    const { longUrl } = req.body;
    const baseUrl = process.env.baseUrl;

    if (!validUrl.isUri(baseUrl)) {
        return res.status(401).json('invalid base url');
    }

    // create url code
    const urlCode = shortid.generate();

    // check long url
    if (validUrl.isUri(longUrl)) {
        try {
            let url = await Url.findOne({ longUrl });
            if (url) {
                res.json(url);
            } else {
                const shortUrl = baseUrl + '/' + urlCode;

                url = new Url({
                    longUrl,
                    shortUrl,
                    urlCode,
                    date: new Date(),
                    uses: 1
                });
                await url.save();
                res.json(url);
            }
        } catch (error) {
            console.log(error);
            res.status(500).json('server error');
        }
    } else {
        res.status(401).json('Invalid long url');
    }
});



router.get('/:urlCode', async (req, res) => {
    try {
        const url = await Url.findOne({ urlCode: req.params.urlCode });

        if(url.uses == 0){
            return res.status(404).json('url is single usable please genrate new url.....!');
        }

        if (url) {
            await Url.updateOne({ urlCode: req.params.urlCode } ,{$set: { uses: 0 }})
            return res.redirect(url.longUrl);
        } else {
            return res.status(404).json('No url found.....!');
        }
    } catch (error) {
        console.log(error);
        res.status(500).json('server error...!');
    }
});



router.get("/", async (req, res) => {
    try {
      const url = await Url.find();
      res.send(url);
    } catch (e) {
      res.status(404).send(e);
    }
  });
  

  router.delete("/:id", async (req, res) => {
    try {
      const url = await Url.deleteOne({ _id: req.params.id });
      res.send("Url Deleted..");
    } catch (e) {
      res.status(404).send(e);
    }
  });
  


module.exports = router;