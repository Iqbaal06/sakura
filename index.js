await import("./lib/string.prototype.js")

const express = "express".import();
const cors = "cors".import();
const path = "path".import();
const fs = "fs".import();
const os = "os".import();
const crypto = "crypto".import();
const bodyParser = "body-parser".import();

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

//router
const { default: downloader } = await '../routes/downloader.js'.r();

app.use(express.json());
if (typeof bodyParser === "function" || typeof bodyParser?.json !== "function") {
    console.warn("Warning: bodyParser.json is not a function. Skipping bodyParser.");
} else {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
}
app.use(express.static('public'));
app.use(cors());

// app.get('/', (req, res) => {
// res.sendFile(path.join(__dirname, '/views/home.html'))
// })

app.get('/', (req, res) => {
  res.json({
    creator: '@sakura',
    message: 'Welcome to Sakura Downloader API',
    endpoints: {
      tiktok: '/api/downloader/tiktok?url=<tiktok_url>'
    }
  });
});

app.use('/api', downloader)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});