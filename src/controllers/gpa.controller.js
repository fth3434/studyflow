const prisma = require("../prisma")

function calculateLetterGrade(avg) {

    if (avg >= 90) return "AA"

    if (avg >= 85) return "BA"

    if (avg >= 80) return "BB"

    if (avg >= 70) return "CB"

    if (avg >= 60) return "CC"

    if (avg >= 50) return "DC"

    return "FF"
}

const createCourse =
    async (req, res) => {

        try {

            const {
                name,
                credits,
                midterm,
                final,
                average: clientAverage,
                letterGrade: clientLetterGrade
            } = req.body

            const average = clientAverage !== undefined
                ? Number(clientAverage)
                : (midterm * 0.4) + (final * 0.6)

            const letterGrade = clientLetterGrade !== undefined
                ? clientLetterGrade
                : calculateLetterGrade(average)

            const userId =
                req.session.user.id

            const course =
                await prisma.course.create({

                    data: {

                        name,

                        credits: Number(credits || 3),

                        midterm: Number(midterm),

                        final: Number(final),

                        average,

                        letterGrade,

                        userId
                    }
                })

            res.json(course)

        } catch (error) {

            console.log(error)

            res.status(500).json({
                error: "Course oluşturulamadı"
            })
        }
    }

const getCourses =
    async (req, res) => {

        try {

            const userId =
                req.session.user.id

            const courses =
                await prisma.course.findMany({

                    where: {
                        userId
                    }
                })

            res.json(courses)

        } catch (error) {

            console.log(error)

            res.status(500).json({
                error: "Course alınamadı"
            })
        }
    }

const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, credits, midterm, final, average: clientAverage, letterGrade: clientLetterGrade } = req.body;
        const userId = req.session.user.id;
        
        const average = clientAverage !== undefined ? Number(clientAverage) : (Number(midterm) * 0.4) + (Number(final) * 0.6);
        const letterGrade = clientLetterGrade !== undefined ? clientLetterGrade : calculateLetterGrade(average);
        
        const course = await prisma.course.updateMany({
            where: { id: Number(id), userId },
            data: {
                name,
                credits: Number(credits || 3),
                midterm: Number(midterm),
                final: Number(final),
                average,
                letterGrade
            }
        });
        res.json(course);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Course güncellenemedi" });
    }
}

const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        
        await prisma.course.delete({
            where: { id: Number(id) }
        });
        res.json({ message: "Course silindi" });
    } catch (error) {
        console.log("Delete Course Error:", error);
        res.status(500).json({ error: "Course silinemedi" });
    }
}

module.exports = {
    createCourse,
    getCourses,
    updateCourse,
    deleteCourse
}