const asyncHandler = require("express-async-handler");
const Builder = require("../../models/builderModel");

const getBuilder = asyncHandler(async (req, res) => {
  Builder.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => console.log(err));
});
const postBuilder = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    about_builder,
    starting_price,
    configuration,
    estb_year,
    ratings,
    type,
    slug,
    residential_num,
    commercial_num,
    coming_soon,
    images,
    BuilderLogo,
    cities,
    seo,
  } = req.body;

  try {
    const BuilderData = await Builder.create({
      name,
      description,
      about_builder,
      starting_price,
      configuration,
      estb_year,
      ratings,
      type,
      slug,
      residential_num,
      commercial_num,
      coming_soon,
      images,
      BuilderLogo,
      cities,
      seo,
    });
    res.json(BuilderData);
  } catch (error) {
    console.log(error);
  }
});

const getBuilderById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const builder = await Builder.findById(id).exec();
    res.status(200).json(builder);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

const editBuilders = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      about_builder,
      starting_price,
      configuration,
      estb_year,
      ratings,
      type,
      slug,
      residential_num,
      commercial_num,
      coming_soon,
      images,
      BuilderLogo,
      cities,
      seo,
    } = req.body;
    const builder = await Builder.findByIdAndUpdate(
      id,
      {
        name,
        description,
        about_builder,
        starting_price,
        configuration,
        estb_year,
        ratings,
        type,
        slug,
        residential_num,
        commercial_num,
        coming_soon,
        images,
        BuilderLogo,
        cities,
        seo,
      },
      { new: true }
    );
    await builder.save();

    return res.status(200).json({ message: "builder updated successfully" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});
module.exports = {
  getBuilder,
  postBuilder,
  getBuilderById,
  editBuilders,
};
