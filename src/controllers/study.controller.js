const prisma = require("../prisma")

const createStudySession =
    async (req, res) => {

        try {

            const { subject, topic, hours, minutes } = req.body

            const userId =
                req.session.user.id

            const session =
                await prisma.studySession.create({

                    data: {
                        subject,
                        topic,
                        hours: Number(hours || 0),
                        minutes: Number(minutes || 0),
                        userId
                    }
                })

            res.json(session)

        } catch (error) {

            console.log(error)

            res.status(500).json({
                error: "Session oluşturulamadı"
            })
        }
    }

const getStudySessions =
    async (req, res) => {

        try {

            const userId =
                req.session.user.id

            const sessions =
                await prisma.studySession.findMany({

                    where: {
                        userId
                    }
                })

            res.json(sessions)

        } catch (error) {

            console.log(error)

            res.status(500).json({
                error: "Sessionlar alınamadı"
            })
        }
    }

const getTotalHours =
    async (req, res) => {

        try {

            const userId =
                req.session.user.id

            const sessions =
                await prisma.studySession.findMany({

                    where: {
                        userId
                    }
                })

            let totalHours = 0

            sessions.forEach(session => {

                totalHours += session.hours
            })

            res.json({
                totalHours
            })

        } catch (error) {

            console.log(error)

            res.status(500).json({
                error: "Toplam saat hesaplanamadı"
            })
        }
    }

const deleteStudySession = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.studySession.delete({
            where: { id: Number(id) }
        });
        res.json({ message: "Study session deleted" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Could not delete study session" });
    }
}

module.exports = {

    createStudySession,

    getStudySessions,

    getTotalHours,

    deleteStudySession
}