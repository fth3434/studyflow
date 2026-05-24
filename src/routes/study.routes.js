const express = require("express")
const protect = require("../src/middleware/auth.middleware")
const router = express.Router()

const {

    createStudySession,

    getStudySessions,

    getTotalHours,

    deleteStudySession

} = require("../src/controllers/study.controller")

router.post(
    "/study-sessions",
    protect,
    createStudySession
)

router.get(
    "/study-sessions",
    protect,
    getStudySessions
)

router.delete(
    "/study-sessions/:id",
    protect,
    deleteStudySession
)

router.get(
    "/total-hours",
    getTotalHours
)

module.exports = router