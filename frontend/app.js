document.addEventListener("DOMContentLoaded", function () {

let items = [];
let editId = null;
let sortAsc = true;

const API = "http://localhost:3000/api/duties";

const form = document.getElementById("dutyForm");
const nameInput = document.getElementById("name");
const commentInput = document.getElementById("comment");
const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");
const tableBody = document.getElementById("tableBody");
const searchInput = document.getElementById("searchInput");
const sortBtn = document.getElementById("sortBtn");

load();

function showError(input, msg) {
    input.nextElementSibling.textContent = msg;
}

function clearErrors() {
    document.querySelectorAll(".error").forEach(e => e.textContent = "");
}

function validate() {

    clearErrors();
    let valid = true;

    const title = nameInput.value.trim();
    const comment = commentInput.value.trim();
    const date = dateInput.value;
    const time = timeInput.value;

    if (!date) {
        showError(dateInput, "Оберіть дату");
        valid = false;
    }

    const today = new Date().toISOString().split("T")[0];
    if (date && date < today) {
        showError(dateInput, "Дата не може бути в минулому");
        valid = false;
    }

    if (!time) {
        showError(timeInput, "Оберіть час");
        valid = false;
    }

    if (!/^[А-Яа-яA-Za-zІіЇїЄєҐґ\s]+$/.test(title)) {
        showError(nameInput, "Лише букви");
        valid = false;
    }

    if (title.length < 3) {
        showError(nameInput, "Ім'я має бути більше 3 букв");
        valid = false;
    }

    if (title.length > 20) {
        showError(nameInput, "Максимум 20 символів");
        valid = false;
    }

    if (comment.length > 50) {
        showError(commentInput, "Максимум 50 символів");
        valid = false;
    }

    return valid;
}

async function load() {
    const res = await fetch(API + "?userId=1");
    const data = await res.json();
    items = data.data || [];
    render();
}

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    if (!validate()) return;

    const duty = {
        title: nameInput.value.trim(),
        description: commentInput.value.trim(),
        date: dateInput.value,
        time: timeInput.value,
        userId: 1
    };

    if (editId) {

        await fetch(`${API}/${editId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                 ...duty,
                 status: "updated"
            })
        });

        editId = null;

    } else {

        await fetch(API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(duty)
        });

    }

    form.reset();
    load();
});

sortBtn.addEventListener("click", function () {
    sortAsc = !sortAsc;

    items.sort((a, b) => {
        return sortAsc
            ? new Date(a.date) - new Date(b.date)
            : new Date(b.date) - new Date(a.date);
    });

    render();
});

function render() {

    const filtered = items.filter(item =>
        item.title.toLowerCase()
            .includes(searchInput.value.toLowerCase())
    );

    tableBody.innerHTML = "";

    filtered.forEach((item, index) => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.date}</td>
            <td>${item.time}</td>
            <td>${item.title}</td>
            <td>${item.description}</td>
            <td>
                <button onclick="editItem(${item.id})">Редагувати</button>
                <button onclick="deleteItem(${item.id})">Видалити</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

window.deleteItem = async function(id){
    await fetch(`${API}/${id}`, {
        method:"DELETE"
    });
    load();
};

window.editItem = function(id){

    const item = items.find(i => i.id === id);

    nameInput.value = item.title;
    commentInput.value = item.description;
    dateInput.value = item.date;
    timeInput.value = item.time;

    editId = id;
};

searchInput.addEventListener("input", render);

});