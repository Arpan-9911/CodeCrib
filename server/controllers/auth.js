import User from "../models/auth.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signUp = async (req, res) => {
  try{
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({ name, email, password: hashedPassword });
    const token = jwt.sign(
      {email: newUser.email, id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return res.status(200).json({ result: newUser, token });
  }
  catch(error){
    return res.status(500).json({ message: "Something went wrong, " + error.message });
  }
};

export const login = async (req, res) => {
  try{
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User doesn't exist" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      {email: user.email, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return res.status(200).json({ result: user, token });
  }
  catch(error){
    return res.status(500).json({ message: "Something went wrong, " + error.message });
  }
};

export const googleLogin = async (req, res) => {
  try{
    const { name, email, sub: googleId } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, password: googleId });
    }
    const token = jwt.sign(
      {email: user.email, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return res.status(200).json({ result: user, token });
  }
  catch(error){
    return res.status(500).json({ message: "Something went wrong, " + error.message });
  }
};