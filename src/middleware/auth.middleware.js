const protect = (req, res, next) => {

    if (!req.session.user) {

        return res.status(401).json({
            error: "Yetkisiz erişim"
        })
    }

    next()
}

module.exports = protect