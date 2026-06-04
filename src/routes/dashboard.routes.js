const express = require("express")
const protect = require('../middleware/auth.middleware');

const router = express.Router()

const {
    getDashboard
} = require("../controllers/dashboard.controller")

router.get(
    "/dashboard-data",
    protect,
    getDashboard
)
module.exports = router