const catchAsync = require("../utils/catchAsync");
const Review = require("../models/reviewModel");

exports.createReview = catchAsync(async (req, res) => {
  const { review, rating, user, tour } = req.body;

  const newReview = await Review.create({ review, rating, user, tour });

  res.status(201).json({
    status: "success",
    data: {
      review: newReview,
    },
  });
});

exports.getAllReviews = catchAsync(async (req, res) => {
  const reviews = await Review.find();

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: {
      reviews,
    },
  });
});
