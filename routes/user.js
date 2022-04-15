const express = require("express");
const router = express.Router();

const User = require("../models/user");

const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

// create a user = sign up
router.post("/user/signup", async (req, res) => {
  console.log(req.fields);
  try {
    const username = req.fields.username;
    if (username.length < 1) {
      return res.json({ message: "enter an username" });
    }
    const email = req.fields.email;
    const existingUsers = await User.find();
    console.log(existingUsers);
    for (let i = 0; i < existingUsers.length; i++) {
      if (email === existingUsers[i]["email"]) {
        return res.json({ message: "email already used" });
      }
    }
    const password = req.fields.password;
    const salt = uid2(16);
    const token = uid2(16);

    const newUser = new User({
      email: email,
      account: {
        username: username,
      },
      newsletter: req.fields.newsletter,
      salt: salt,
      hash: SHA256(password + salt).toString(encBase64),
      token: token,
    });
    await newUser.save();
    res.json({
      id: newUser.id,
      token: newUser.token,
      account: newUser.account,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/user/login", async (req, res) => {
  console.log(req.fields);
  try {
    const loggingInUser = await User.findOne({ email: req.fields.email });
    console.log(loggingInUser);
    if (loggingInUser === null) {
      return res.json({ message: "account not found" });
    }
    const password = req.fields.password;
    console.log(password);
    const hashToCheck = SHA256(password + loggingInUser.salt).toString(
      encBase64
    );
    console.log(loggingInUser.salt);
    console.log(hashToCheck);
    if (hashToCheck !== loggingInUser.hash) {
      return res.json({ error: "incorrect password" });
    } else {
      res.json({ message: "success", token: loggingInUser.token });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
