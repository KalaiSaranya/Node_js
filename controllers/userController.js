const asyncHandler = require("express-async-handler");
const user = require("../models/userModel");
const { validateUserName } = require("../middleware/validateUser");
const { STATUS_CODE } = require("../const/httpStatusCode");
const {
  SUCCESSFUL_RESPONSE_CODE,
  SUCCESSFULLY_CREATED_RESPONSE_CODE,
  CLIENT_ERROR_RESPONSE_CODE,
} = STATUS_CODE;


//Add the user
const addUser = asyncHandler(async (req, res) => {
  const {username}  = req?.body;
  console.log("&&&&&&&&&&&&&"+username,req.body);
  const isValidUser = await validateUserName(username);
  if (!isValidUser) {
    const result = await user.create({ username });
    res.status(SUCCESSFULLY_CREATED_RESPONSE_CODE).json(result);
  } else {
    res.status(CLIENT_ERROR_RESPONSE_CODE).json(isValidUser);
  }
});

//Returns All the user details
const getUsersDetail = asyncHandler(async (req, res) => {
  const users = await user.find({});
  res.status(SUCCESSFUL_RESPONSE_CODE).json(users);
});

// Return single user
const getUserDetail = asyncHandler(async (_id) => {
  const result = await user.findById(_id);
  return result;
});

module.exports = { getUserDetail, getUsersDetail, addUser };
