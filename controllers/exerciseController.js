const asyncHandler = require("express-async-handler");
const exercise = require("../models/exerciseModel");
const user = require("../models/userModel");
const { getUserDetail } = require("./userController");
const { isValidDate } = require("../middleware/validateDate");
const { checkValidFormField } = require("../middleware/validateFormField");
const moment = require("moment");
const { STATUS_CODE } = require("../const/httpStatusCode");

// Adding the Exercises
const addExercise = asyncHandler(async (req, res) => {
  const exerciseObj = {
    ...req.body,
    userId: req.params._id,
    date: req.body.date || moment(),
  };
  const isValidForm = checkValidFormField(exerciseObj);
  if (Object.entries(isValidForm).length === 0) {
    const { username } = await user.findById(req.params._id);
    let { userId, description, duration, date } = await exercise.create(
      exerciseObj
    );
    res.json({ _id: userId, username, description, duration, date });
  } else {
    res.status(STATUS_CODE.CLIENT_ERROR_RESPONSE_CODE).json(isValidForm);
  }
});

// Getting the Exercises
const getExercises = asyncHandler(async (req, res) => {
  const { _id, username } = await getUserDetail(req.params._id);
  let resultArr = await getUserExercises(_id);
  if (req?.query?.from) {
    resultArr = getLimitedExercises(resultArr.exercises, req.query);
  }
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
const getUserExercises = asyncHandler(async (id) => {
  const result = await exercise.find({ userId: id }).sort({ date: 1});
  const filteredExercise = result.map((obj) => {
    const { _id, description, duration, date } = obj;
    return { _id, description, duration, date };
  });
  const count = filteredExercise.length;
  console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&",count)
  return { exercises: filteredExercise, count };
});

//Getting Exercises of The Respective user with some limited exercises
const getLimitedExercises = (inputExercise, query) => {
  const isValidDateformat = isValidDate(query);
  if (!isValidDateformat) {
    const { from, to, limit } = query;
    let startDate = from ? new Date(from) : null;
    let endDate = to ? new Date(to) : null;
    if (endDate) {
      // Set end date to the end of the day
      endDate.setHours(23, 59, 59, 999);
    }

    const results = inputExercise?.filter(
      (exercise) => exercise.date >= startDate && exercise.date <= endDate
    );
    const limitedExercise = limit ? results.slice(0, limit) : results;
    const count = results.length;
    return { exercises: limitedExercise, count };
  }
};

module.exports = {
  addExercise,
  getExercises,
  getUserExercises,
  getLimitedExercises,
};
