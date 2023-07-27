const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

exports.getAll = (Model) =>
  catchAsync(async (req, res) => {
    // To allow for nested GET reviews on tour
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const docs = await features.query.explain();

    res.status(200).json({
      status: "success",
      results: docs.length,
      data: {
        [Model.collection.collectionName]: docs,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    // Tour.findOne({ _id: req.params.id })
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate("reviews");
    const doc = await query;

    if (!doc) {
      return next(new AppError("No tour found with that id", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        [Model.collection.collectionName.slice(0, -1)]: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res) => {
    // const newModel = new Model({})
    // newTour.save()

    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        [Model.collection.collectionName]: doc,
      },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) return next(new AppError("No document found with that ID!", 404));

    res.status(200).json({
      status: "success",
      data: {
        [Model.collection.collectionName]: doc,
      },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) return next(new AppError("No document found with that ID!", 404));

    res.status(204).json({
      status: "success",
      data: null,
    });
  });
