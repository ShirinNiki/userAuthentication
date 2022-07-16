import User from "../models/user";
import { comparePassword, hashPassword } from "../utils/auth";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  //if don't not use "use(express.json()) middleware", you cant access req.body
  // console.log(req.body);
  // res.json("register endpoint respon");
  try {
    console.log(req.body);
    const { name, email, password } = req.body;
    //validation
    if (!name) return res.status(400).send("Name is required!");
    if (!password || password.length < 6) {
      return res
        .status(400)
        .send("password is required and should be min  characterrs long");
    }
    let userExist = await User.findOne({ email }).exec();
    if (userExist) res.status(400).send("Email address already taken");
    //hashedPassword
    const hashPass = await hashPassword(password);
    const user = new User({
      name,
      email,
      password: hashPassword,
    });
    await user.save();
    //console.log("saved user", user);
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error, Try again");
  }
};

export const login = async (req, res) => {
  try {
    //console.log(req.body);
    const { email, password } = req.body;
    //check if user exists in database?
    const user = await User.findOne({ email }).exec();
    if (!user) return res.status(400).send("No User found");
    // check password
    const match = await comparePassword(password, user.password);
    //create signed jwt
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    // return user and token to client, exclude hashed password
    user.password = undefined;
    //send token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      //secure: true, // only works on https
    });
    //send user as json response
    res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error, Try again");
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({ message: "Signout succeessfully" });
  } catch (err) {
    console.log(err);
  }
};

export const currentUser = async (req, res) => {
  try {
    //
    const user = await User.findById(req.auth._id).select("-password").exec();
    //console.log("CURRENT USER", user);
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};
