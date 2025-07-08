await import("./lib/string.prototype.js")

const express = "express".import();
const cors = "cors".import();
const path = "path".import();
const fs = "fs".import();
const os = "os".import();
const multer = "multer".import();
const crypto = "crypto".import();
const bodyParser = "body-parser".import();

const app = express();
const PORT = process.env.PORT || 5000;

//router
let downloader = await('.././routes/downloader.js').r();

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors());
app.use((req, res, next) => {
  const pathsToIncrementRequests = req.path.includes('/api/');

  if (pathsToIncrementRequests) {
    try {
      const filePath = './database/request.json';

      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading request file:', err);
          return;
        }

        let requestData = JSON.parse(data);

        requestData.all = (requestData.all || 0) + 1; 

        fs.writeFileSync(filePath, JSON.stringify(requestData), 'utf8', (err) => {
          if (err) {
            console.error('Error updating request count:', err);
          }
        });
      });
    } catch (error) {
      console.error('Error updating request count:', error);
    }
  }

  next();
});

app.get('/sse-total-requests', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const filePath = './database/request.json';
  let lastTotalRequests = 0;

  const interval = setInterval(() => {
    try {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading request file:', err);
          return;
        }

        const requestData = JSON.parse(data);
        const currentTotalRequests = requestData.all;

        if (currentTotalRequests !== lastTotalRequests) {
          res.write(`data: ${currentTotalRequests}\n\n`);
          lastTotalRequests = currentTotalRequests;
        }
      });
    } catch (error) {
      console.error('Error reading request file:', error);
    }
  }, 1000);

  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });
});

app.get('/', (req, res) => {
res.sendFile(path.join(__dirname, '/views/home.html'))
})

app.use('/api', downloader)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});