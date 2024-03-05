import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const signup = async (req, res,next ) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password || !password.length === '' || !username.length === '' || !email.length === '') {
        next(errorHandler(400, "All fields are required"));
    }
    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });

    try {
        await newUser.save();
        res.json({ message: "User created successfully" });
    } catch (error) {
        next(error);
    }
    
}

export const signin = async (req, res, next) => {
    const {username, password} = req.body;
    if (!username || !password || !username.length === '' || !password.length === '') {
        next(errorHandler(400, "All fields are required"));
    }
    try {
        const validUser = await User.findOne({ username });
        if (!validUser) {
            next(errorHandler(404, "User not found"));
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(400, "Invalid password"));
        }
        
        const token = jwt.sign({
            id: validUser._id
        }, process.env.JWT_SECRET); 

        const { password: pass, ...rest } = validUser._doc;



        res.status(200).cookie( 'access_token',  token,{
            httpOnly: true,
            
        }).json(rest);

    } catch (error) {
        next(error);
    }
}