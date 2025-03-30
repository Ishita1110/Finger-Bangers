const bcrypt = require("bcryptjs");
const User = require("./models/user.model");

// Register logic
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully", userId: newUser._id });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login logic
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({ message: `Welcome back, ${user.username}!` });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { registerUser, loginUser };
