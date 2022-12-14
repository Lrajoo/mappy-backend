import NewYork from "../models/NewYork";
import SanFrancisco from "../models/SanFrancisco";

const cityTable: any = {
  "New York City": NewYork,
  "San Francisco": SanFrancisco,
};

export const getLocations = async (req: any, res: any) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, X-Auth-Token");
  res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS");
  // res.setHeader("Content-Type", "application/json");
  const city = req.query.city;
  const userId = req.query.userId;
  const locations = await cityTable[city].find({
    userId: userId,
  });
  res.send(locations);
};

export const postLocations = async (req: any, res: any) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, X-Auth-Token");
  res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS");
  // res.setHeader("Content-Type", "application/json");
  await cityTable[req.body.city].create({
    userId: req.body.userId,
    placeId: req.body.placeId,
    timestamp: new Date(),
    mustHave: req.body.mustHave,
    notes: req.body.notes,
  });
  res.status(201).json({ success: "Location added!" });
};

export const deleteLocations = async (req: any, res: any) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, X-Auth-Token");
  res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS");
  // res.setHeader("Content-Type", "application/json");
  const placeId = req.params.placeId;
  await NewYork.findOne({ placeId: placeId }).deleteOne();
  res.status(201).json({ success: "Location removed!" });
};
