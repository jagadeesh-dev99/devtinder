const express = require("express");
const UserAuth = require("../middlewares/UserAuth");
const requestConnection = require("../models/requestConnection");
const User = require('../models/userModal')
const connectionRoute = express.Router();

connectionRoute.get("/connectionRequests", UserAuth, async (req, res) => {
  const { _id } = req.user;
  const find = await requestConnection
    .find({
      toUserId: _id,
      status: "interested",
    })
    .populate("fromUserId", "firstName lastName");

  if (!find) {
    res.send("No data found.....");
  }
  res.status(200).json({ message: "successfull", data: find });
});

connectionRoute.get("/getAllConnections", UserAuth, async (req, res) => {
  const { _id } = req.user;
  const find = await requestConnection
    .find({
      $or: [
        {
          fromUserId: _id,
          status: "accepted",
        },
        {
          toUserId: _id,
          status: "accepted",
        },
      ],
    })
    .populate("fromUserId", "firstName lastName");
  if (!find) {
    res.send("no data");
  }

  res.json({ message: "success", data: find.map((each) => each.fromUserId) });
});

connectionRoute.get("/feed", UserAuth, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page-1)*limit
  const { _id } = req.user;
  const connections = await requestConnection
    .find({
      $or: [{ fromUserId: _id }, { toUserId: _id }],
    })
    .select("fromUserId toUserId");

  const filtered = new Set();
  connections.forEach((each) => {
    filtered.add(each.fromUserId.toString());
    filtered.add(each.toUserId.toString());
  });
 const users = await User.find({
     $and:[
        {
            _id:{$nin:Array.from(filtered)}
        },
        {
            _id :{ $ne:
                req.user._id
            }
        }
     ]
 }).skip(skip).limit(limit)
  console.log(users, "connect");
  res.send(users);
});

module.exports = connectionRoute;
