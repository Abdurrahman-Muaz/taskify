// import User from "../models/user.model.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// export const signupUser = async (req, res) => {
//   try {
//     const { email, name, password, surname } = req.body;
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Email already exists" });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({
//       email,
//       name,
//       surname,
//       password: hashedPassword,
//     });
//     try {
//       await newUser.save();
//       res.status(201).json({ success: true, data: newUser });
//     } catch (error) {
//       console.error("Error in Create user:", error.message);
//       res.status(500).json({ success: false, message: "Server Error" });
//     }
//   } catch (error) {
//     console.error("Error in Create user:", error.message);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };
// export const signinUser = async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) {
//     return res
//       .status(401)
//       .json({ success: false, message: "Information is invalid" });
//   }

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid credentials" });
//     }

//     const accessToken = jwt.sign(
//       { id: user._id, email: user.email },
//       process.env.ACCESS_TOKEN_SECRET,
//       { expiresIn: "3h" }
//     );

//     res.status(200).json({ success: true, accessToken });
//   } catch (error) {
//     console.error("Error in Login user:", error.message);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };
import jwt from "jsonwebtoken";
import Token from "../models/token.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

export const signupUser = async (req, res) => {
  try {
    const { email, name, password, surname } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Bu email zaten kullanılıyor",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      name,
      surname,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    console.error("Error in Create user:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const signinUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    // Refresh token'ı kaydet
    await Token.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 gün
    });

    res.status(200).json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        surname: user.surname,
      },
    });
  } catch (error) {
    console.error("Error in Login:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
