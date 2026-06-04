const express = require("express")

const router = express.Router()
const protect = require("../middleware/auth.middleware")

const {

    createExam,

    getExams,
    updateExam,
    deleteExam

} = require("../controllers/exam.controller")

router.post("/exams", protect, createExam)

router.get("/exams", protect, getExams)

router.put("/exams/:id", protect, updateExam)

router.delete("/exams/:id", protect, deleteExam)

module.exports = router