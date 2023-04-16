const express = require("express");
const { exec } = require("child_process");
const axios = require("axios");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("<h1>Hello World!!</h1>");
});

app.get("/whoami", (req, res) => {
  res.status(200).end();
});

app.post("/verify-domain", async (req, res) => {
  try {
    await axios.get(`https://${req.body.domain}/whoami`);
    res.status(200).json({ message: "Domain is pointed with SSL!" });
  } catch (error) {
    try {
      await axios.get(`http://${req.body.domain}/whoami`);
      res.status(200).json({ message: "Domain is pointed but no SSL found!" });
    } catch (error) {
      res.status(400).json({ message: "Domain is not pointed!" });
    }
  }
});

app.post("/generate-ssl", (req, res) => {
  const domain = req.body.domain;
  const email = "ahnafurp@gmail.com"; // change to your email address

  const command = `sudo certbot --nginx -d ${domain} --non-interactive --agree-tos -m ${email}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      res.status(500).json({ error: "Failed to generate SSL certificate." });
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
    res.json({ message: "SSL certificate generated successfully." });
  });
});

app.listen(3000, () => {
  console.log("App is running!!");
});
