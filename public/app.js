function addTask() {

    const input = document.getElementById("taskInput")

    const task = input.value

    if (task === "") return

    const li = document.createElement("li")
    li.innerHTML = `
    ${task}
    <div>
        <button onclick="editTask(this)">
            Düzenle
        </button>

        <button onclick="deleteTask(this)">
            Sil
        </button>
    </div>
`


    document.getElementById("taskList").appendChild(li)

    input.value = ""
}
function editTask(button) {

    const li = button.parentElement.parentElement

    const newTask =
        prompt("Yeni görev adı:")

    if (newTask) {
        li.firstChild.textContent = newTask
    }
}

function deleteTask(button) {
    button.parentElement.remove()
}

function calculate() {

    const hours =
        document.getElementById("hoursInput").value

    let result = ""

    if (hours >= 6) {
        result = "Çok verimli çalıştın 🔥"
    }
    else if (hours >= 3) {
        result = "İyi gidiyorsun 👍"
    }
    else {
        result = "Daha fazla çalışabilirsin 📚"
    }

    document.getElementById("result").innerText = result
}