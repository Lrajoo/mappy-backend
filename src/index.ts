const express = require("express");
const app = express();
const config = require("./utils/config");

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});

module.exports = app;
