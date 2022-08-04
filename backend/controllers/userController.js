const bcrypt = require("bcrypt");
const db = require("../models");
const jwt = require("jsonwebtoken");

const User = db.users;

// @Desc Register User
// @Route POST /api/users/register
exports.registerUser = async (req, res) => {
  const { fname, mobile, city, username, password } = req.body;

  if (!fname || !mobile || !city || !username || !password) {
    res.status(400).json({ Error: "All fields are Required!" });
  }

  // Check user Already exsits
  const userExsits = await User.findOne({ where: { email: username } });
  if (userExsits) {
    res.status(400).json({ Error: "User Already Exists !" });
  } else {
    // Hash password
    const sault = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, sault);

    // Register New user
    const newUser = await User.create({
      fname,
      mobile,
      city,
      email: username,
      password: hashedPassword,
    });

    if (newUser) {
      res.status(201).json({
        user: newUser,
        userToken: generateToken(newUser.id),
      });
    } else {
      res.status(400).json({ Error: "User not Registerd!" });
    }
  }
};

// @Desc Login user
// @Route POST /api/users/login
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  if (!username || !password) {
    res.status(400).json({ Error: "Both Fields Are Required !" });
  } else {
    // Check User from DB
    const user = await User.findOne({ where: { email: username } });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({
        message: "User Athenticated !",
        user: user,
        userToken: generateToken(user.id),
      });
    } else {
      res.status(400).json({ Error: "Invaild Credentials" });
    }
  }
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};
