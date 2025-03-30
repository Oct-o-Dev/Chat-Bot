const User = require("../model/userModel");
const crypto = require('crypto');

// Function to hash password
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    
    // Log the received data (excluding password)
    console.log('Registration attempt:', { username, email });

    // Validate required fields
    if (!username || !email || !password) {
      console.log('Missing required fields');
      return res.status(400).json({ 
        msg: "All fields are required", 
        status: false,
        fields: { username: !!username, email: !!email, password: !!password }
      });
    }

    // Check if username is already in use
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck) {
      console.log('Username already exists:', username);
      return res.status(400).json({ msg: "Username already used", status: false });
    }

    // Check if email is already in use
    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
      console.log('Email already exists:', email);
      return res.status(400).json({ msg: "Email already used", status: false });
    }

    // Hash the password and create a new user
    const hashedPassword = hashPassword(password);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    const userObj = user.toObject(); // Convert to plain object
    delete userObj.password; // Remove password from response

    console.log('User registered successfully:', username);
    return res.json({ status: true, user: userObj });
  } catch (ex) {
    console.error('Registration error:', ex);
    return res.status(500).json({ 
      msg: "Internal server error during registration", 
      status: false 
    });
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).json({ msg: "Username or password is incorrect", status: false });

    // Check if the password is valid
    const hashedPassword = hashPassword(password);
    const isPasswordValid = hashedPassword === user.password;
    if (!isPasswordValid)
      return res.status(400).json({ msg: "Username or password is incorrect", status: false });

    const userObj = user.toObject();
    delete userObj.password;

    return res.json({ status: true, user: userObj });
  } catch (ex) {
    console.error(ex);
    next(ex);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;

    // Update user avatar
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );

    if (!userData) {
      return res.status(404).json({ msg: "User not found" });
    }

    return res.json({ isSet: userData.isAvatarImageSet, image: userData.avatarImage });
  } catch (ex) {
    console.error(ex);
    next(ex);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);

    return res.json(users);
  } catch (ex) {
    console.error(ex);
    next(ex);
  }
};
