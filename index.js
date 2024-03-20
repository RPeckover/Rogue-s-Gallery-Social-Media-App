const express = require("express");

const app = express();
app.listen(3005, () => console.log("Listening on port 3005"));

app.use(express.static("./public"));
