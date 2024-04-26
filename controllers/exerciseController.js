const asyncHandler = require("express-async-handler");
const exerciseModal = require("../models/exerciseModel");
const user = require("../models/userModel");
const { getUserDetail } = require("./userController");
const { isValidDate } = require("../middleware/validateDate");
const { checkValidFormField } = require("../middleware/validateFormField");
const moment = require("moment");
const { STATUS_CODE } = require("../const/httpStatusCode");
const mongoose=require("mongoose");

// Adding the Exercises
const addExercise = asyncHandler(async (req, res) => {
  const errMsg={
    message:" User does not exits"
  }
  const exerciseObj = {
    ...req.body,
    userId: req.params._id,
    date: req.body.date || moment(),
  };
  const isValidForm = checkValidFormField(exerciseObj);
  if (Object.entries(isValidForm).length === 0) {
    const userDetails = await user.findById(req.params._id);
    if (!userDetails) {
      res
        .status(STATUS_CODE.CLIENT_ERROR_RESPONSE_CODE)
        .json(errMsg);
    } else {
      let { userId, description, duration, date } = await exerciseModal.create(
        exerciseObj
      );
      res.json({ _id: userId, username, description, duration, date });
    }
  } else {
    res.status(STATUS_CODE.CLIENT_ERROR_RESPONSE_CODE).json(isValidForm);
  }
});

// Getting the Exercises
const getExercises = asyncHandler(async (req, res) => {
  const { _id, username } = await getUserDetail(req.params._id);
  let resultArr = await getUserExercises(_id);
  if (req?.query?.from) {
    resultArr = await getLimitedExercises(req.query,_id);
  }
  console.log("resultArr,",resultArr);
  const { exercises, count } = resultArr;
  const result = {
    _id,
    username,
    count,
    logs: exercises,
  };

  res.json(result);
});

//Getting Exercises of the Respective user

const getUserExercises = async (id) => {
  const exercises = await exerciseModal.find({ userId: id }).sort({ date: 1 });
  const count = exercises.length;
  return { exercises, count };
};

const getLimitedExercises = async ( query, id) => {
  try {
    const { from, to, limit } = query;

    let filter = { userId: id };

    if (from && isValidDate(from)) {
      filter.date = { $gte: new Date(from) };
    }

    if (to && isValidDate(to)) {
      filter.date = { ...filter.date, $lte: new Date(to) };
    }

    const exercises = await exerciseModal.find(filter).sort({ date: 1 }).limit(limit);
    const count = await exerciseModal.countDocuments(filter);
    console.log(exercises,count)

    return { exercises, count };
  } catch (error) {
    console.error("Error retrieving exercises:", error);
  }
};


module.exports = {
  addExercise,
  getExercises,
  getUserExercises,
  getLimitedExercises,
};