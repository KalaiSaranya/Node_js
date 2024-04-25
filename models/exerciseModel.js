const mongoose = require("mongoose");
const { validateDate } = require("../middleware/validateDate");
const moment = require("moment");

const exerciseSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "User Id is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    duration: {
      type: Number,
      required: [true, "Duration is required"],
      validate: {
        validator: function (value) {
          return value > 0;
        },
        message: "Duration must be a positive number",
      },
    },
    date: {
      type: Date,
      validate: {
        validator: function (value) {
          !moment(value, "YYYY-MM-DD", true).isValid();
        },
        message: "Please Enter a Valid date",
      },
    },
  },
  {
    timeStamps: true,
  }
);

module.exports = mongoose.model("Exercise", exerciseSchema);
