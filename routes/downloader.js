const express = await "express".import();
var router = express.Router();

let { tiktok } = await "../lib/scraper/downloader.js".r();

let creator = '@sakura';

let PromiseRes = (hasil) => {
  return { creator: creator, status: 200, result: hasil }
}

router.get('/downloader/tiktok', async (req, res, next) => {
  try {
    const url = req.query.url;
    if (!url) return res.json({ creator: creator, mess: "masukkan parameter url" });
    let hasil = await tiktok(url)
    res.json(PromiseRes(hasil)).status(200)
  } catch (err) {
    res.status(500).json({ creator: creator, mess: `${err.toString()}` })
  }
})

export default router;