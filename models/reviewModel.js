const mongoose = require("mongoose");
const Tour = require("../models/tourModel");
const AppError = require("../utils/appError");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      trim: true,
      required: [true, "Review is required"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review must belong to a tour."],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user."],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate([
    // { path: "tour", select: "name" },
    { path: "user", select: "name email" },
  ]);
  next();
});

reviewSchema.pre("save", async function (next) {
  const review = await Review.findOne({ tour: this.tour });
  if (review)
    return next(
      new AppError(
        "Each user is allowed to post one comment for a specific tour.",
        405,
      ),
    );
  next();
});

reviewSchema.post("save", async function () {
  // this points to current review
  await this.constructor.calculateAverageRatings(this.tour);
});

reviewSchema.post(/^findOneAnd/, async function (doc) {
  await doc.constructor.calculateAverageRatings(doc.tour);
});

reviewSchema.statics.calculateAverageRatings = async function (tour) {
  const stats = await this.aggregate([
    {
      $match: { tour },
    },
    {
      $group: {
        _id: "$tour",
        nRatings: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tour, {
      ratingsQuantity: stats[0].nRatings,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tour, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
