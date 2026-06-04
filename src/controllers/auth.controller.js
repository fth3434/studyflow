const bcrypt = require("bcrypt")
const prisma = require("../prisma")

const register = async (req, res) => {

    try {

        const { name, email, password } = req.body

        const hashedPassword =
            await bcrypt.hash(password, 10)

        const user = await prisma.user.create({

            data: {

                name,

                email,

                password: hashedPassword
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
}

const login = async (req, res) => {

    try {

        const { email, password } = req.body

        const user =
            await prisma.user.findUnique({

                where: {
                    email
                }
            })

        if (!user) {

            return res.status(401).json({
                error: "Kullanıcı bulunamadı"
            })
        }

        const isMatch =
            await bcrypt.compare(
                password,
                user.password
            )

        if (!isMatch) {
            return res.status(401).json({
                error: "Şifre hatalı"
            })
        }

        req.session.user = user

        res.json({
            message: "Giriş başarılı",
            user
        })

    } catch (error) {

        console.log(error)

        res.status(500).json({
            error: "Login başarısız"
        })
    }

}
module.exports = {
    register,
    login
}

const logout = (req, res) => {

    req.session.destroy(() => {
        res.json({ message: "Çıkış yapıldı" })
    })
}

const updatePassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const userId = req.session.user.id;

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });

        res.json({ message: "Şifre güncellendi" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Şifre güncellenemedi" });
    }
}

module.exports = {
    register,
    login,
    logout,
    updatePassword
}