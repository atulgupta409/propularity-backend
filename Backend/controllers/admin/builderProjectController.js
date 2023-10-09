const asyncHandler = require("express-async-handler");
const BuilderProject = require("../../models/builderProjectModel");
const City = require("../../models/cityModel");
const MicroLocation = require("../../models/microLocationModel");
const postBuilderProjects = asyncHandler(async (req, res) => {
  const {
    name,
    builder,
    project_type,
    plans_type,
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
    brochure,
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
      plans_type,
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
      brochure,
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
    plans_type,
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
    brochure,
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
      plans_type,
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
      brochure,
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
const getProjectsWithPagination = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Current page number
    const limit = parseInt(req.query.limit) || 10;
    const totalCount = await BuilderProject.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);
    const projects = await BuilderProject.find()
      .populate("location.city", "name")
      .populate("location.micro_location", "name")
      .populate("builder", "name")
      .skip((page - 1) * limit) // Skip results based on page number
      .limit(limit) // Limit the number of results per page
      .exec();

      
    if (!projects) {
      return res.status(404).json({ message: "project not found" });
    }

    res.json({
      totalPages,
      totalCount,
      currentPage: page,
      projects,
    });
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
const deleteProjectImage = asyncHandler(async (req, res) => {
  try {
    const { projectId, imageId } = req.params;

    // Fetch the project by its ID
    const project = await BuilderProject.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Find the index of the image to be deleted in the "images" array
    const imageIndex = project.images.findIndex(image => image._id == imageId);

    if (imageIndex === -1) {
      return res.status(404).json({ message: "Image not found in project" });
    }

    // Remove the image from the "images" array
    project.images.splice(imageIndex, 1);

    // Save the updated project
    await project.save();

    // Optionally, you can also delete the image file from your storage here

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ error: "An error occurred while deleting the image" });
  }
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
    const project = await BuilderProject.findById(id)
      .exec();

    if (!project) {
      res.status(404).json({ message: "Project not found" });
    } else {
      project.images.sort((a, b) => a.order - b.order);
      res.status(200).json(project);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


const topProjectsOrder = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { order, status, cityId } = req.body;

    // Find the coworking project to be updated
    const projectsToUpdate = await BuilderProject.findById(id);

    if (!projectsToUpdate) {
      return res.status(404).json({ error: "Project not found" });
    }

    const currentOrder = projectsToUpdate.is_popular.order;
    if (projectsToUpdate.location.city.toString() !== cityId) {
      return res.status(400).json({
        error: "project does not belong to the specified city",
      });
    }
    if (status === false && order === 1000) {
      // Deactivate priority for the current coworking project
      projectsToUpdate.is_popular.status = false;
      projectsToUpdate.is_popular.order = order;
      await projectsToUpdate.save();

      // Decrement the higher order coworking projects by one
      await BuilderProject.updateMany(
        {
          "location.city": cityId,
          _id: { $ne: id }, // Exclude the current coworking project
          "is_popular.order": { $gt: currentOrder }, // Higher order workprojects
          "is_popular.status": true,
        },
        { $inc: { "is_popular.order": -1 } }
      );
    } else {
      // Update the priority of the coworking project to the specified order
      projectsToUpdate.is_popular.order = order;

      // Update the "is_active" field based on the specified order
      projectsToUpdate.is_popular.status = order !== 1000;

      await projectsToUpdate.save();
    }

    res.json(projectsToUpdate);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

const topProjectsOrderByDrag = asyncHandler(async (req, res) => {
  try {
    const updatedProjects = req.body; // The array of updated projects sent from the client

    // Loop through the updatedProjects array and update each coworking project in the database
    for (const project of updatedProjects) {
      const { _id, is_popular } = project;
      // Find the coworking project by its _id and update its priority order
      await BuilderProject.findByIdAndUpdate(_id, {
        $set: {
          "is_popular.order": is_popular.order,
          "is_popular.status": is_popular.order !== 1000,
        },
      });
    }

    res.json({ message: "Priority updated successfully" });
  } catch (error) {
    console.error("Error updating priority:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating priority" });
  }
});

const getProjectsbyCityId = asyncHandler(async (req, res) => {
  const { cityId } = req.params;

  try {
    const topProjects = await BuilderProject.find({
      "location.city": cityId,
      status: "approve",
    })
      .populate("location.city", "name")
      .populate("location.micro_location", "name")
      .exec();

    res.json(topProjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
const getTopProjectbyCity = asyncHandler(async (req, res) => {
  const { city } = req.params;

  try {
    const projects = await BuilderProject.find({
      "location.city": city,
      status: "approve",
      "is_popular.order": { $nin: [0, 1000] },
    })
      .populate("location.city", "name")
      .populate("location.micro_location", "name")
      .sort({ "is_popular.order": 1 }) // Sort by priority.order in ascending order
      .exec();

    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
const getProjectsbyMicrolocation = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const projects = await BuilderProject.find({
      "location.micro_location": id,
      status: "approve",
    })
      .populate("location.city", "name")
      .populate("location.micro_location", "name")
      .select("name priority")
      .exec();

    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const changeProjectOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { order, is_active, microlocationId } = req.body;

    const projectToUpdate = await BuilderProject.findById(id);
      
    if (!projectToUpdate) {
      return res.status(404).json({ error: "Project not found" });
    }

    const currentPriority = projectToUpdate.priority.find(
      (priority) =>
        priority.microlocationId &&
        priority.microlocationId.toString() === microlocationId &&
        priority.is_active
    );
    let currentOrder = currentPriority ? currentPriority.order : 1000;
    // Check if the microlocationId exists in projectToUpdate's location
    if (
      !projectToUpdate.location.micro_location.some((micro) =>
        micro._id.toString().includes(microlocationId)
      )
    ) {
      return res.status(400).json({
        error: "None of the project match the specified plan types",
      });
    }

    if (is_active === false && order === 1000) {
      projectToUpdate.priority.forEach((priority) => {
        if (
          priority.microlocationId &&
          priority.microlocationId.toString() === microlocationId
        ) {
          priority.order = order;
          priority.is_active = false;
        }
      });
      await projectToUpdate.save();

      const otherProjects = await BuilderProject.find({
        _id: { $ne: id },
        "location.micro_location": microlocationId,
        "priority.is_active": true,
      });
      const projectIdsToUpdate = otherProjects.filter((otherProject) => {
        return otherProject.priority.some((priority) => {
          if (
            priority.microlocationId &&
            priority.microlocationId.toString() === microlocationId
          ) {
            return priority.order > currentOrder && priority.order !== 1000;
          }
        });
      });
      for (const otherProject of projectIdsToUpdate) {
        otherProject.priority.forEach((priority) => {
          if (
            priority.microlocationId &&
            priority.microlocationId.toString() === microlocationId
          ) {
            priority.order = priority.order - 1;
          }
        });

        otherProject.markModified("priority"); // Mark the field as modified
        await otherProject.save();
      }
    } else {
      let existingPriorityFound = false;
      projectToUpdate.priority.forEach((priority) => {
        if (
          priority.microlocationId &&
          priority.microlocationId.toString() === microlocationId
        ) {
          priority.order = order;
          priority.is_active = order !== 1000;
          (priority.microlocationId = microlocationId),
            (existingPriorityFound = true);
        }
      });
      if (!existingPriorityFound) {
        projectToUpdate.priority.push({
          is_active: is_active,
          order: order,
          microlocationId: microlocationId,
        });
        projectToUpdate.markModified("priority"); // Mark the field as modified
      }
      await projectToUpdate.save();
    }

    res.json({ message: "Priority updated successfully" });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};

const getProjectbyMicrolocationWithPriority = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const projects = await BuilderProject.find({
      "location.micro_location": id,
      status: "approve",
      "priority.microlocationId": id,
    })
      .populate("location.city", "name")
      .populate("location.micro_location", "name")
      .select("name priority")
      .exec();

    const filteredProjects = projects.filter((otherProject) => {
      return otherProject.priority.some((priority) => {
        if (
          priority.microlocationId &&
          priority.microlocationId.toString() === id
        ) {
          return priority.order !== 1000;
        }
      });
    });
    filteredProjects.sort((a, b) => {
      const priorityA = a.priority.find(
        (priority) =>
          priority.microlocationId && priority.microlocationId.toString() === id
      );
      const priorityB = b.priority.find(
        (priority) =>
          priority.microlocationId && priority.microlocationId.toString() === id
      );

      return priorityA.order - priorityB.order;
    });
    res.json(filteredProjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const changeProjectOrderbyDrag = asyncHandler(async (req, res) => {
  try {
    const updatedProjects = req.body; // The array of updated projects sent from the client

    // Loop through the updatedProjects array and update each project in the database
    for (const project of updatedProjects) {
      const { _id, priority } = project;

      // Find the project by its _id
      const existingProject = await BuilderProject.findById(_id);

      // Find the index of the priority object within the priority array
      const priorityIndex = existingProject.priority.findIndex(
        (p) => p.microlocationId.toString() === priority.microlocationId
      );

      if (priorityIndex !== -1) {
        // Update the order and is_active fields for the specific priority object
        existingProject.priority[priorityIndex].order = priority.order;
        existingProject.priority[priorityIndex].is_active =
          priority.order !== 1000;

        // Save the updated project
        await existingProject.save();
      }
    }

    res.json({ message: "Priority updated successfully" });
  } catch (error) {
    console.error("Error updating priority:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating priority" });
  }
});

const searchProjects = asyncHandler(async (req, res) => {
  try {
    const { name, city, microlocation, status } = req.query;
    
    const query = {};
    
    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    if (city) {
      const cities = await City.findOne({
        name: { $regex: `^${city}`, $options: "i" },
      });
      if (cities) {
        query["location.city"] = cities._id;
      }
    }

    if (microlocation) {
       const micro = await MicroLocation.findOne({ name: { $regex: `^${microlocation}`, $options: 'i' } });
      if(micro){
        query["location.micro_location"] = micro._id;
      }
    }

    if (status && status !== "All") {
      query.status = status;
    }

    const page = parseInt(req.query.page) || 1; // Current page number
    const limit = parseInt(req.query.limit) || 10;
    const totalCount = await BuilderProject.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);
    const projects = await BuilderProject.find(query)
    .populate("location.city", "name")
    .populate("location.micro_location", "name")
    .skip((page - 1) * limit) 
    .limit(limit) 
    .exec();

    res.json({
      totalPages,
      totalCount,
      currentPage: page,
      projects,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
})
const getProjectsbyBuilder = asyncHandler (async(req, res) => {
  const {id} = req.params;
  
  try {
    const projects = await BuilderProject.find({
      builder: id,
      status: "approve",
    })
      .populate("location.city", "name")
      .populate("location.micro_location", "name")
      .select("name builder_priority")
      .exec();

    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
const changeBuilderProjectOrder = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { order, is_active, builder } = req.body;

    // Find the coworking project to be updated
    const projectToUpdate = await BuilderProject.findById(id);

    if (!projectToUpdate) {
      return res.status(404).json({ error: "Project not found" });
    }

    const currentOrder = projectToUpdate.builder_priority.order;
    if (projectToUpdate.builder.toString() !== builder) {
      return res.status(400).json({
        error: "project does not belong to the specified builder",
      });
    }
    if (is_active === false && order === 1000) {
      // Deactivate priority for the current project
      projectToUpdate.builder_priority.is_active = false;
      projectToUpdate.builder_priority.order = order;
      await projectToUpdate.save();

      // Decrement the higher order project by one
      await BuilderProject.updateMany(
        {
          builder: builder,
          _id: { $ne: id }, // Exclude the current project
          "builder_priority.order": { $gt: currentOrder }, // Higher order project
          "builder_priority.is_active": true,
        },
        { $inc: { "builder_priority.order": -1 } }
      );
    } else {
      // Update the priority of the project to the specified order
      projectToUpdate.builder_priority.order = order;

      // Update the "is_active" field based on the specified order
      projectToUpdate.builder_priority.is_active = order !== 1000;

      await projectToUpdate.save();
    }

    res.json({ message: "Priority updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});
const changeBuilderProjectOrderbyDrag = asyncHandler(async (req, res) => {
  try {
    const updatedProjects = req.body; // The array of updated projects sent from the client

    // Loop through the updatedProjects array and update each project in the database
    for (const project of updatedProjects) {
      const { _id, builder_priority } = project;
      // Find the project by its _id and update its priority order
      await BuilderProject.findByIdAndUpdate(_id, {
        $set: {
          "builder_priority.order": builder_priority.order,
          "builder_priority.is_active": builder_priority.order !== 1000,
        },
      });
    }

    res.json({ message: "Priority updated successfully" });
  } catch (error) {
    console.error("Error updating priority:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating priority" });
  }
});
const getProjectbyByBuilderWithPriority = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const projects = await BuilderProject.find({
      builder: id,
      status: "approve",
      "builder_priority.order": { $nin: [0, 1000] }, // Exclude documents with priority.order equal to 1000
    })
      .populate("location.city", "name")
      .populate("location.micro_location", "name")
      .sort({ "builder_priority.order": 1 }) // Sort by priority.order in ascending order
      .exec();

    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
const getProjectsbyPlansAndCity = asyncHandler(async (req, res) => {
  const { id, city } = req.params;

  try {
    const projects = await BuilderProject.find({
      "location.city": city,
      plans_type: id,
      status: "approve",
    })
      .populate("location.city", "name")
      .populate("location.micro_location", "name")
      .select("name plans_priority")
      .exec();

    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
const changePlansProjectOrder = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { order, is_active, plans_type, cityId } = req.body;

    const projectToUpdate = await BuilderProject.findById(id);
    
    if (!projectToUpdate) {
      return res.status(404).json({ error: "Project not found" });
    }
    if (
      !projectToUpdate.location.city === cityId
    ) {
      return res.status(400).json({
        error: "None of the project match the specified plan types",
      });
    }
    const currentplans_priority = projectToUpdate.plans_priority.find(
      (plans_priority) =>
        plans_priority.plans_type &&
        plans_priority.plans_type.toString() === plans_type &&
        plans_priority.is_active
    );
    let currentOrder = currentplans_priority
      ? currentplans_priority.order
      : 1000;
   
    if (is_active === false && order === 1000) {
      projectToUpdate.plans_priority.forEach((plans_priority) => {
        if (
          plans_priority.plans_type &&
          plans_priority.plans_type.toString() === plans_type
        ) {
          plans_priority.order = order;
          plans_priority.is_active = false;
        }
      });
      await projectToUpdate.save();

      const otherProjects = await BuilderProject.find({
        _id: { $ne: id },
         plans_type: plans_type,
         "location.city": cityId,
        "plans_priority.is_active": true,
      });
      const projectIdsToUpdate = otherProjects.filter((otherProject) => {
        return otherProject.plans_priority.some((plans_priority) => {
          if (
            plans_priority.plans_type &&
            plans_priority.plans_type.toString() === plans_type
          ) {
            return (
              plans_priority.order > currentOrder &&
              plans_priority.order !== 1000
            );
          }
        });
      });
      for (const otherProject of projectIdsToUpdate) {
        otherProject.plans_priority.forEach((plans_priority) => {
          if (
            plans_priority.plans_type &&
            plans_priority.plans_type.toString() === plans_type
          ) {
            plans_priority.order = plans_priority.order - 1;
          }
        });

        otherProject.markModified("plans_priority"); // Mark the field as modified
        await otherProject.save();
      }
    } else {
      let existingplans_priorityFound = false;
      projectToUpdate.plans_priority.forEach((plans_priority) => {
        if (
          plans_priority.plans_type &&
          plans_priority.plans_type.toString() === plans_type
        ) {
          plans_priority.order = order;
          plans_priority.is_active = order !== 1000;
          plans_priority.plans_type = plans_type;
          existingplans_priorityFound = true;
        }
      });
      if (!existingplans_priorityFound) {
        projectToUpdate.plans_priority.push({
          is_active: is_active,
          order: order,
          plans_type: plans_type,
        });
        projectToUpdate.markModified("plans_priority"); // Mark the field as modified
      }
      await projectToUpdate.save();
    }

    res.json({ message: "plans_priority updated successfully" });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});
const changePlansProjectOrderbyDrag = asyncHandler(async (req, res) => {
  try {
    const updatedProjects = req.body;

    for (const project of updatedProjects) {
      const { _id, plans_priority } = project;

      // Find the project by its _id
      const existingProject = await BuilderProject.findById(_id);

      // Find the index of the priority object within the priority array

      const priorityIndex = existingProject.plans_priority.findIndex(
        (p) => p.plans_type.toString() === plans_priority.plans_type
      );

      if (priorityIndex !== -1) {
        // Update the order and is_active fields for the specific priority object
        existingProject.plans_priority[priorityIndex].order =
          plans_priority.order;
        existingProject.plans_priority[priorityIndex].is_active =
          plans_priority.order !== 1000;

        // Save the updated project
        await existingProject.save();
      }
    }

    res.json({ message: "Priority updated successfully" });
  } catch (error) {
    console.error("Error updating priority:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating priority" });
  }
});
const getProjectbyByPlansWithPriority = asyncHandler(async (req, res) => {
  const { id, city } = req.params;
  try {
    const projects = await BuilderProject.find({
      "location.city": city,
      plans_type: id,
      status: "approve",
      "plans_priority.plans_type": id,
    })
      .populate("location.city", "name")
      .populate("location.micro_location", "name")
      .select("name plans_priority")
      .exec();

    const filteredProjects = projects.filter((otherProject) => {
      return otherProject.plans_priority.some((priority) => {
        if (priority.plans_type && priority.plans_type.toString() === id) {
          return priority.order !== 1000;
        }
      });
    });
    filteredProjects.sort((a, b) => {
      const priorityA = a.plans_priority.find(
        (priority) =>
          priority.plans_type && priority.plans_type.toString() === id
      );
      const priorityB = b.plans_priority.find(
        (priority) =>
          priority.plans_type && priority.plans_type.toString() === id
      );

      return priorityA.order - priorityB.order;
    });
    res.json(filteredProjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
const indiaProjectsOrder = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { order, is_active } = req.body;

    // Find the coworking project to be updated
    const projectsToUpdate = await BuilderProject.findById(id);

    if (!projectsToUpdate) {
      return res.status(404).json({ error: "Project not found" });
    }

    const currentOrder = projectsToUpdate.priority_india.order;
    if (is_active === false && order === 1000) {
      projectsToUpdate.priority_india.is_active = false;
      projectsToUpdate.priority_india.order = order;
      await projectsToUpdate.save();

      // Decrement the higher order coworking projects by one
      await BuilderProject.updateMany(
        {
          _id: { $ne: id }, // Exclude the current coworking project
          "priority_india.order": { $gt: currentOrder }, // Higher order workprojects
          "priority_india.is_active": true,
        },
        { $inc: { "priority_india.order": -1 } }
      );
    } else {
      // Update the priority of the coworking project to the specified order
      projectsToUpdate.priority_india.order = order;

      // Update the "is_active" field based on the specified order
      projectsToUpdate.priority_india.is_active = order !== 1000;

      await projectsToUpdate.save();
    }

    res.json(projectsToUpdate);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});
const indiaProjectsWithPriority = asyncHandler(async (req, res) => {

  try {
    const projects = await BuilderProject.find({
      status: "approve",
      "priority_india.order": { $nin: [0, 1000] },
    })
      .populate("location.city", "name")
      .sort({ "priority_india.order": 1 }) // Sort by priority.order in ascending order
      .exec();
    
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
const indiaProjectOrderbyDrag = asyncHandler(async (req, res) => {
  try {
    const updatedProjects = req.body; // The array of updated projects sent from the client

    // Loop through the updatedProjects array and update each coworking project in the database
    for (const project of updatedProjects) {
      const { _id, priority_india } = project;
      // Find the coworking project by its _id and update its priority order
      await BuilderProject.findByIdAndUpdate(_id, {
        $set: {
          "priority_india.order": priority_india.order,
          "priority_india.is_active": priority_india.order !== 1000,
        },
      });
    }

    res.json({ message: "Priority updated successfully" });
  } catch (error) {
    console.error("Error updating priority:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating priority" });
  }
});
const imageOrderChanges = asyncHandler(async (req, res) => {
  try {
    const { _id, updateImage } = req.body; // The array of updated projects sent from the client

    // Loop through the updateImage array and update the image order for each item
    for (const  Image of updateImage) {

      // Update the image order using findByIdAndUpdate
      await BuilderProject.findOneAndUpdate(
        {
          _id,
          "images._id": Image._id, // Match the image by its _id within the array
        },
        {
          $set: {
            "images.$.order": Image.order, // Update the order field of the matched image
          },
        }
      );
    }

    res.json({ message: "Priority updated successfully" });
  } catch (error) {
    console.error("Error updating priority:", error);
    res.status(500).json({ error: "An error occurred while updating priority" });
  }
});

module.exports = {
  postBuilderProjects,
  getProjects,
  deleteProjects,
  changeProjectStatus,
  getProjectsById,
  editProjects,
  topProjectsOrder,
  topProjectsOrderByDrag,
  getTopProjectbyCity,
  getProjectsbyCityId,
  getProjectsbyMicrolocation,
  changeProjectOrder,
  getProjectbyMicrolocationWithPriority,
  changeProjectOrderbyDrag,
  searchProjects,
  getProjectsbyBuilder,
  changeBuilderProjectOrder,
  changeBuilderProjectOrderbyDrag,
  getProjectbyByBuilderWithPriority,
  getProjectsbyPlansAndCity,
  changePlansProjectOrder,
  changePlansProjectOrderbyDrag,
  getProjectbyByPlansWithPriority,
  getProjectsWithPagination,
  indiaProjectsOrder,
  indiaProjectsWithPriority,
  indiaProjectOrderbyDrag,
  imageOrderChanges,
  deleteProjectImage
};
