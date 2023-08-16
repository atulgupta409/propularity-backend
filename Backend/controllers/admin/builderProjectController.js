const asyncHandler = require("express-async-handler");
const BuilderProject = require("../../models/builderProjectModel");

const postBuilderProjects = asyncHandler(async (req, res) => {
  const {
    name,
    builder,
    project_type,
    slug,
    starting_price,
    configuration,
    ratings,
    coming_soon,
    project_status,
    project_size,
    short_descrip,
    for_rent,
    for_sale,
    location,
    plans,
    master_plan,
    highlights,
    amenties,
    description,
    images,
    seo,
    geo_location,
    contact_details,
    is_active,
    status,
    priority,
    is_popular,
  } = req.body;

  try {
    const builderData = await BuilderProject.create({
      name,
      builder,
      project_type,
      slug,
      starting_price,
      configuration,
      ratings,
      coming_soon,
      project_status,
      project_size,
      short_descrip,
      for_rent,
      for_sale,
      location,
      plans,
      master_plan,
      highlights,
      amenties,
      description,
      images,
      seo,
      geo_location,
      contact_details,
      is_active,
      status,
      priority,
      is_popular,
    });
    res.json(builderData);
  } catch (error) {
    console.log(error);
  }
});
const editProjects = asyncHandler(async (req, res) => {
  const {
    name,
    builder,
    project_type,
    slug,
    starting_price,
    configuration,
    ratings,
    coming_soon,
    project_status,
    project_size,
    short_descrip,
    for_rent,
    for_sale,
    location,
    plans,
    master_plan,
    highlights,
    amenties,
    description,
    images,
    seo,
    geo_location,
    contact_details,
    is_active,
    status,
    priority,
    is_popular,
  } = req.body;
  const { id } = req.params;
  await BuilderProject.findByIdAndUpdate(
    id,
    {
      name,
      builder,
      project_type,
      slug,
      starting_price,
      configuration,
      ratings,
      coming_soon,
      project_status,
      project_size,
      short_descrip,
      for_rent,
      for_sale,
      location,
      plans,
      master_plan,
      highlights,
      amenties,
      description,
      images,
      seo,
      geo_location,
      contact_details,
      is_active,
      status,
      priority,
      is_popular,
    },
    { new: true }
  )
    .then(() => res.send("updated successfully"))
    .catch((err) => {
      console.log(err);
      res.send({
        error: err,
      });
    });
});
const getProjects = asyncHandler(async (req, res) => {
  try {
    const projects = await BuilderProject.find()
      .populate("amenties", "name")
      .populate("builder", "name")
      .populate("location.city", "name")
      .populate("location.micro_location", "name")
      .populate("location.state", "name")
      .populate("location.country", "name")
      .populate("plans.category", "name")
      .exec();

    if (!projects) {
      return res.status(404).json({ message: "project not found" });
    }

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});
const deleteProjects = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await BuilderProject.findByIdAndDelete(id)
    .then(() => {
      res.send("delete successfully");
    })
    .catch((err) => {
      res.send({
        error: err,
      });
    });
});
const changeProjectStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const projects = await BuilderProject.findById(id);

    if (!projects) {
      return res.status(404).json({ error: "projects not found" });
    }

    projects.status = status;
    await projects.save();

    return res.status(200).json({ message: "Status updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to update status" });
  }
});
const getProjectsById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const projects = await BuilderProject.findById(id).exec();
    res.status(200).json(projects);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});
module.exports = {
  postBuilderProjects,
  getProjects,
  deleteProjects,
  changeProjectStatus,
  getProjectsById,
  editProjects,
};
