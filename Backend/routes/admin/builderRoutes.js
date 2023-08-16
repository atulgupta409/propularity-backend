const express = require("express");
const { protect } = require("../../middleware/authMiddleware");
const {
  postBuilder,
  getBuilder,
  getBuilderById,
  editBuilders,
} = require("../../controllers/admin/builderController");
const router = express.Router();

router
  .post("/", protect, postBuilder)
  .put("/edit-builder/:id", editBuilders)
  .get("/builders", protect, getBuilder)
  .get("/builders/:id", protect, getBuilderById);

module.exports = router;
