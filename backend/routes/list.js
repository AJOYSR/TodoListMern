const router = require("express").Router();
const User = require("../models/user");
const List = require("../models/list");
const bcrypt = require("bcryptjs");

router.post("/addTask", async (req, res) => {
  try {
    const { title, body, email } = req.body;
    const existUser = await User.findOne({ email });
    if (existUser) {
      const list = new List({ title, body, user: existUser });
      await list.save().then(() => res.status(200).json({ list }));
      existUser.list.push(list);
      existUser.save();
    }
  } catch (error) {
    console.log(error);
  }
});

router.put("/updateTask/:id", async (req, res) => {
  try {
    const { title, body, email } = req.body;
    const existUser = await User.findOne({ email });
    if (existUser) {
      const list = await List.findByIdAndUpdate(req.params.id, { title, body });
      list.save().then(() => res.status(200).json({ message: "Task updated" }));
    }
  } catch (error) {
    console.log(error);
  }
});

router.delete("/deleteTask/:id", async (req, res) => {
  try {
    const { email } = req.body;
    const existUser = await User.findOneAndUpdate(
      { email },
      { $pull: { list: req.params.id } }
    );
    if (existUser) {
      const list = await List.findByIdAndDelete(req.params.id).then(() =>
        res.status(200).json({ message: "Task Deleted" })
      );
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/getTasks/:id", async (req, res) => {
  const list = await List.find({ user: req.params.id });
  res.status(200).json({ list });
});

module.exports = router;
