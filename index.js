const express = require("express")
const app = express()

const path = require("path")
const prisma = require("./prisma")

const session = require("express-session")

// MIDDLEWARE
app.use(express.json())

app.use(session({
    secret: "studyflowsecret",
    resave: false,
    saveUninitialized: false
}))

// ROUTES
const authRoutes = require("./routes/auth.routes")
const taskRoutes = require("./routes/task.routes")
const dashboardRoutes = require("./routes/dashboard.routes")
const studyRoutes = require("./routes/study.routes")
const gpaRoutes = require("./routes/gpa.routes")
const examRoutes = require("./routes/exam.routes")

// API ROUTES (daha temiz yapı)
app.use(authRoutes)
app.use(taskRoutes)
app.use(dashboardRoutes)
app.use(studyRoutes)
app.use(gpaRoutes)
app.use(examRoutes)

// STATIC FRONTEND
app.use(express.static("public"))

// HOME
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"))
})

// REGISTER (fallback)
app.post("/register", async (req, res) => {
    try {

        const { name, email, password } = req.body

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password
            }
        })

        res.json({
            message: "Kayıt başarılı",
            user
        })

    } catch (error) {

        console.log(error)

        res.status(500).json({
            error: "Kayıt başarısız"
        })
    }
})

// ME ENDPOINT
app.get("/me", (req, res) => {

    if (!req.session.user) {

        return res.json({
            message: "Giriş yapılmamış"
        })
    }

    res.json(req.session.user)
})

// SERVER START
// Eski app.listen kısmını bununla değiştiriyoruz:
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda çalışıyor...`));
}

// Vercel'in bu dosyayı çalıştırabilmesi için en alta ekle:
module.exports = app;