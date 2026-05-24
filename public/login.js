function checkLoginFields(email, password) {

    if (!email || !password) {

        alert("Email ve şifre boş olamaz!")

        return false
    }

    return true
}

async function login() {

    const email =
        document.getElementById("email").value

    const password =
        document.getElementById("password").value

    const isValid =
        checkLoginFields(email, password)

    if (!isValid) return

    const response =
        await fetch("http://localhost:3000/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })
        })

    const data =
        await response.json()

    if (data.user) {

        window.location.href =
            "/dashboard.html"

    } else {

        alert("Login başarısız ❌")
    }
}