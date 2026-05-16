import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "Username and password required" });

    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, name: user.name, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, username: user.username, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, username, password, role } = req.body;
    if (!name || !username || !password)
      return res.status(400).json({ message: "Name, username and password required" });

    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ message: "Username already taken" });

    const user = await User.create({ name, username, password, role });
    res.status(201).json({
      message: "User created",
      user: { id: user._id, name: user.name, username: user.username, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create user", error: error.message });
  }
};

export const updateCredentials = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username) return res.status(400).json({ message: "Username is required" });
    if (password && password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const taken = await User.findOne({ username, _id: { $ne: req.params.id } });
    if (taken) return res.status(400).json({ message: "Username already taken" });

    user.username = username;
    if (password) user.password = password;
    await user.save();

    res.json({ message: "Credentials updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update credentials", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user", error: error.message });
  }
};
