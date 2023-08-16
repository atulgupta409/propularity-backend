const express = require("express");
const { protect } = require("../../middleware/authMiddleware");
const {
  postBuilderProjects,
  getProjects,
  deleteProjects,
  changeProjectStatus,
  getProjectsById,
  editProjects,
} = require("../../controllers/admin/builderProjectController");
const router = express.Router();

router
  .post("/", protect, postBuilderProjects)
  .get("/projects", getProjects)
  .get("/projects/:id", getProjectsById)
  .delete("/delete/:id", deleteProjects)
  .put("/changeStatus/:id", protect, changeProjectStatus)
  .put("/edit-project/:id", editProjects);
module.exports = router;
