const prisma = require("../prisma")

const getDashboard = async (req, res) => {

    try {

        const userId =
            req.session.user.id

        const totalTasks =
            await prisma.task.count({

                where: {
                    userId
                }
            })

        const completedTasks =
            await prisma.task.count({

                where: {
                    userId,
                    completed: true
                }
            })

        const pendingTasks =
            totalTasks - completedTasks

        let completionRate = 0

        if (totalTasks > 0) {

            completionRate =
                Math.round(
                    (completedTasks / totalTasks) * 100
                )
        }

        res.json({

            totalTasks,

            completedTasks,

            pendingTasks,

            completionRate
        })

    } catch (error) {

        console.log(error)

        res.status(500).json({
            error: "Dashboard verileri alınamadı"
        })
    }
}

module.exports = {
    getDashboard
}