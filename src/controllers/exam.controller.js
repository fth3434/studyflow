const prisma = require("../prisma")

const createExam =
    async (req, res) => {

        try {

            const {
                title,
                examDate
            } = req.body

            const userId =
                req.session.user.id

            const exam =
                await prisma.exam.create({

                    data: {

                        title,

                        examDate:
                            new Date(examDate),

                        userId
                    }
                })

            res.json(exam)

        } catch (error) {

            console.log(error)

            res.status(500).json({
                error: "Sınav oluşturulamadı"
            })
        }
    }

const getExams =
    async (req, res) => {

        try {

            const userId =
                req.session.user.id

            const exams =
                await prisma.exam.findMany({

                    where: {
                        userId
                    },

                    orderBy: {
                        examDate: "asc"
                    }
                })

            res.json(exams)

        } catch (error) {

            console.log(error)

            res.status(500).json({
                error: "Sınavlar alınamadı"
            })
        }
    }

const updateExam = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, examDate } = req.body;
        const userId = req.session.user.id;
        
        const exam = await prisma.exam.updateMany({
            where: { id: Number(id), userId },
            data: {
                title,
                examDate: new Date(examDate)
            }
        });
        res.json(exam);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Sınav güncellenemedi" });
    }
}

const deleteExam = async (req, res) => {
    try {
        const { id } = req.params;
        
        await prisma.exam.delete({
            where: { id: Number(id) }
        });
        res.json({ message: "Sınav silindi" });
    } catch (error) {
        console.log("Delete Exam Error:", error);
        res.status(500).json({ error: "Sınav silinemedi" });
    }
}

module.exports = {
    createExam,
    getExams,
    updateExam,
    deleteExam
}