const protect =
    require("../middleware/auth.middleware")
const express = require("express")

const router = express.Router()

const {
    createTask,
    getTasks,
    deleteTask,
    updateTask,
    toggleTask
} = require("../controllers/task.controller")

router.get(
    "/tasks",
    protect,
    getTasks
)
router.post(
    "/tasks",
    protect,
    createTask
)

router.delete(
    "/tasks/:id",
    protect,
    deleteTask
)

router.put(
    "/tasks/:id",
    protect,
    updateTask
)

router.patch(
    "/tasks/:id/toggle",
    protect,
    toggleTask
)

module.exports = router