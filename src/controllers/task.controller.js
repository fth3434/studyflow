const prisma = require("../prisma")

const createTask = async (req, res) => {

    try {

        const { title } = req.body

        const userId = req.session.user.id

        const task = await prisma.task.create({

            data: {
                title,
                userId
            }
        })

        res.json(task)

    } catch (error) {

        console.log(error)

        res.status(500).json({
            error: "Task oluşturulamadı"
        })
    }
}

const getTasks = async (req, res) => {

    try {

        const userId = req.session.user.id

        const tasks = await prisma.task.findMany({

            where: {
                userId
            }
        })

        res.json(tasks)

    } catch (error) {

        console.log(error)

        res.status(500).json({
            error: "Tasklar alınamadı"
        })
    }
}

const deleteTask = async (req, res) => {

    try {

        const { id } = req.params

        await prisma.task.delete({

            where: {
                id: Number(id)
            }
        })

        res.json({
            message: "Task silindi"
        })

    } catch (error) {

        console.log(error)

        res.status(500).json({
            error: "Task silinemedi"
        })
    }
}

const updateTask = async (req, res) => {

    try {

        const { id } = req.params

        const { title } = req.body

        const updatedTask =
            await prisma.task.update({

                where: {
                    id: Number(id)
                },

                data: {
                    title
                }
            })

        res.json(updatedTask)

    } catch (error) {

        console.log(error)

        res.status(500).json({
            error: "Task güncellenemedi"
        })
    }
}
const toggleTask = async (req, res) => {

    try {

        const { id } = req.params

        const task =
            await prisma.task.findUnique({

                where: {
                    id: Number(id)
                }
            })

        const updatedTask =
            await prisma.task.update({

                where: {
                    id: Number(id)
                },

                data: {
                    completed: !task.completed
                }
            })

        res.json(updatedTask)

    } catch (error) {

        console.log(error)

        res.status(500).json({
            error: "Task update başarısız"
        })
    }
}
module.exports = {
    createTask,
    getTasks,
    deleteTask,
    updateTask,
    toggleTask
}