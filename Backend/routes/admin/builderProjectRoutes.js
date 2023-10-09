const express = require("express");
const { protect } = require("../../middleware/authMiddleware");
const {
  postBuilderProjects,
  getProjects,
  deleteProjects,
  changeProjectStatus,
  getProjectsById,
  editProjects,
  topProjectsOrder,
  topProjectsOrderByDrag,
  getProjectsbyCityId,
  getTopProjectbyCity,
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
} = require("../../controllers/admin/builderProjectController");
const router = express.Router();

router
  .post("/", protect, postBuilderProjects)
  .get("/projects",protect, getProjects)
  .get("/projects-page", getProjectsWithPagination)
  .get("/projects/:id",protect, getProjectsById)
  .delete("/delete/:id",protect, deleteProjects)
  .delete("/:projectId/images/:imageId",protect, deleteProjectImage)
  .put("/changeStatus/:id", protect, changeProjectStatus)
  .put("/edit-project/:id", protect, editProjects)
  .put("/top-projects/:id", protect, topProjectsOrder)
  .put("/update-top-projects", protect, topProjectsOrderByDrag)
  .get(
    "/projects-by-order/:city",
    protect,

    getTopProjectbyCity
  )
  .get("/project-details/:cityId", protect, getProjectsbyCityId)
  .get("/projects-by-location/:id", getProjectsbyMicrolocation)
  .put("/change-order/:id", protect, changeProjectOrder)
  .get(
    "/priority-projects/:id",

    getProjectbyMicrolocationWithPriority
  )
  .put("/update-priority", protect, changeProjectOrderbyDrag)
  .get("/search-projects", searchProjects)
  .get("/projects-by-builder/:id", getProjectsbyBuilder)
  .put("/builder-order/:id", protect, changeBuilderProjectOrder)
  .put("/builder-priority", protect, changeBuilderProjectOrderbyDrag)
  .get(
    "/builder-projects/:id",

    getProjectbyByBuilderWithPriority
  )
  .get("/projects-by-plans/:id/:city", getProjectsbyPlansAndCity)
  .put("/plans-order/:id", protect, changePlansProjectOrder)
  .put("/plans-priority", protect, changePlansProjectOrderbyDrag)
  .get(
    "/plans-projects/:id/:city",

    getProjectbyByPlansWithPriority
  )
  .put("/priority-india/:id", protect, indiaProjectsOrder)
  .put("/drag-priority", protect, indiaProjectOrderbyDrag)
  .get("/project-india", protect, indiaProjectsWithPriority)
  .put("/drag-images", protect, imageOrderChanges);
module.exports = router;
