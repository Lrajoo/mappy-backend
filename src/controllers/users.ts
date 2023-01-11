import User from "../models/User";
import { v4 as uuidv4 } from "uuid";
import { Friend } from "../interface/friend";

export const createNewUser = async (req: any, res: any) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, X-Auth-Token");
  res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS");
  const homeCity = req.body.homeCity.split(",")[0];
  const homeState = req.body.homeCity.split(",")[1];
  const userNameExists = await User.findOne({ userName: req.body.userName });
  const phoneNumberExists = await User.findOne({ phoneNumber: req.body.phoneNumber });
  if (userNameExists !== null) {
    res.status(400).json({
      status: "Failure",
      field: "userName",
      errorMessage: "This username has already been selected, pick another one",
    });
  } else if (phoneNumberExists !== null) {
    res.status(400).json({
      status: "Failure",
      field: "phoneNumber",
      errorMessage: "This phone number has already been used with another account",
    });
  } else {
    const result = await User.create({
      userId: uuidv4(),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userName: req.body.userName,
      dateOfBirth: req.body.dateOfBirth,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      homeCity: homeCity,
      homeState: homeState,
      friends: [],
    });
    res.status(201).json({ success: "Signed Up!" });
  }
};

export const getUser = async (req: any, res: any) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, X-Auth-Token");
  res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS");
  const userName = req.params.userName;
  const userProfile = await User.findOne({ userName: userName });
  res.status(200).send(userProfile);
};

export const getFriends = async (req: any, res: any) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, X-Auth-Token");
  res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS");
  const userName = req.params.userName;
  const data = await User.findOne({ userName: userName });
  //need to filter friends with accepted status
  res.status(200).send(data?.friends);
};

export const searchUsers = async (req: any, res: any) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, X-Auth-Token");
  res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS");
  const searchquery = req.query.search;
  const searchFields = ["firstName", "lastName", "userName"];
  const query = {
    $or: [
      ...searchFields.map((field) => ({
        [field]: new RegExp("^" + searchquery, "i"),
      })),
    ],
  };
  const data = await User.find(query);
  res.status(200).send(data);
};

export const addFriend = async (req: any, res: any) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, X-Auth-Token");
  res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS");
  const user = req.body.user;
  const friend = req.body.friend;
  const userRequest = {
    userId: friend.userId,
    firstName: friend.firstName,
    lastName: friend.lastName,
    userName: friend.userName,
    friendStatus: "pending",
    requestStatus: "send",
    timestamp: new Date(),
  };
  const friendRequest = {
    userId: user.userId,
    firstName: user.firstName,
    lastName: user.lastName,
    userName: user.userName,
    friendStatus: "pending",
    requestStatus: "receive",
    timestamp: new Date(),
  };
  const userProfile = await User.findOneAndUpdate({ userId: user.userId }, { $push: { friends: userRequest } });
  const friendProfile = await User.findOneAndUpdate({ userId: friend.userId }, { $push: { friends: friendRequest } });
  res.status(201).json({ success: "Friend request sent!" });
};

export const updateRequest = async (req: any, res: any) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, X-Auth-Token");
  res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS");
  const userId = req.body.userId;
  const friendId = req.body.friendId;
  const status = req.body.friendStatus;
  const userProfile = await User.updateOne(
    {
      userId: userId,
      friends: {
        $elemMatch: {
          userId: friendId,
        },
      },
    },
    {
      $set: {
        "friends.$.friendStatus": status,
      },
    }
  );
  const friendProfile = await User.updateOne(
    {
      userId: friendId,
      friends: {
        $elemMatch: {
          userId: userId,
        },
      },
    },
    {
      $set: {
        "friends.$.friendStatus": status,
      },
    }
  );
  res.status(201).json({ success: "Friend request updated!" });
};
