const User = require("../model/userModel");
const crypto = require('crypto');

// Function to hash password
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if username is already in use
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.status(400).json({ msg: "Username already used", status: false });

    // Check if email is already in use
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.status(400).json({ msg: "Email already used", status: false });

    // Hash the password and create a new user
    const hashedPassword = hashPassword(password);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    const userObj = user.toObject(); // Convert to plain object
    delete userObj.password; // Remove password from response

    return res.json({ status: true, user: userObj });
  } catch (ex) {
    console.error(ex); // Log the error for debugging
    next(ex);
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
