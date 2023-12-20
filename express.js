const express = require("express");
const path = require("path");

const app = express();

// Serve files from the '/out/' directory
const outDirectory = path.join(__dirname, "out");
app.use(express.static(outDirectory));

const PORT = 12931;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
