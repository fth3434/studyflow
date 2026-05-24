const express = require("express")
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router()

const {
    getDashboard
} = require("../src/controllers/dashboard.controller")

router.get(
    "/dashboard-data",
    protect,
    getDashboard
)
module.exports = router