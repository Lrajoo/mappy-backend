import express from "express";
import { PORT, MONGODB_URI } from "./utils/config";
import { MongoClient } from "mongodb";

const app = express();
const client = new MongoClient(MONGODB_URI);

app.listen(PORT, async () => {
  try {
    await client.connect();
    console.log("Connected correctly to server");
  } catch (err: any) {
    console.log(err.stack);
  } finally {
    await client.close();
  }
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
