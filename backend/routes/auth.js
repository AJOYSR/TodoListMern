const router = require("express").Router();
const User = require("../models/user");
const List = require("../models/list");
const bcrypt = require("bcryptjs");



router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({email : req.body.email});
    if(!user) {
      res.status(400).json({message : "Please SignUp First!"});
    }
    const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);
    
    if(!isPasswordCorrect) {
      res.status(400).json({message : "PassWord Incorrect!"});
    }

    const {password, ...others} = user._doc;
    res.status(200).json({others});

  } catch (error) {
    res.status(400).json({ message: "Internal Server Error" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }
    const hashedPassword = bcrypt.hashSync(password);
    // If the user doesn't exist, create a new user and save it to the database
    const newUser = new User({ email, username, password: hashedPassword });

    await newUser.save();

    // Return the newly created user
    res.status(200).json({ user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
