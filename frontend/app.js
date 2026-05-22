document.addEventListener("DOMContentLoaded", function () {

let items = JSON.parse(localStorage.getItem("duties")) || [];
let editId = null;

const form = document.getElementById("dutyForm");
const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");
const nameInput = document.getElementById("name");
const commentInput = document.getElementById("comment");
const tableBody = document.getElementById("tableBody");
const searchInput = document.getElementById("searchInput");
const sortBtn = document.getElementById("sortBtn");

render();

form.addEventListener("submit", function(e){
e.preventDefault();
clearErrors();

const data = {
id: editId || Date.now(),
date: dateInput.value,
time: timeInput.value,
name: nameInput.value.trim(),
comment: commentInput.value.trim()
};

if(!validate(data)) return;

if(editId){
items = items.map(item => item.id === editId ? data : item);
editId = null;
} else {
items.push(data);
}

localStorage.setItem("duties", JSON.stringify(items));
form.reset();
render();
});

function validate(data){
let valid = true;

if (!data.date) {
    showError(dateInput, "Оберіть дату");
    valid = false;
} else {
    const today = new Date();
    const selectedDate = new Date(data.date);

    today.setHours(0,0,0,0);

    if (selectedDate < today) {
        showError(dateInput, "Дата не може бути раніше сьогоднішньої");
        valid = false;
    }
}

if(!data.time){
showError(timeInput, "Оберіть час");
valid = false;
}

if(data.name.length < 3){
showError(nameInput, "Ім’я має бути більше 3 букв");
valid = false;
}
else if(data.name.length > 30){ 
showError(nameInput, "Ім’я не більше 30 букв");
valid = false;
}
else if(!/^[A-Za-zА-Яа-яЇїІіЄєҐґ\s]+$/.test(data.name)){
showError(nameInput, "Тільки літери та пробіли");
valid = false;
}

if(data.comment.length > 50){
showError(commentInput, "Коментар максимум 50 символів");
valid = false;
}

return valid;
}

function showError(input, message){
input.classList.add("invalid");
input.nextElementSibling.textContent = message;
}

function clearErrors(){
document.querySelectorAll(".invalid").forEach(el => el.classList.remove("invalid"));
document.querySelectorAll(".error").forEach(el => el.textContent = "");
}

function render(){
let filtered = items.filter(item =>
item.name.toLowerCase().includes(searchInput.value.toLowerCase())
);

tableBody.innerHTML = "";

filtered.forEach((item, index)=>{
const row = document.createElement("tr");
row.innerHTML = `
<td>${index+1}</td>
<td>${item.date}</td>
<td>${item.time}</td>
<td>${item.name}</td>
<td>${item.comment}</td>
<td>
<button onclick="editItem(${item.id})">Редагувати</button>
<button onclick="deleteItem(${item.id})">Видалити</button>
</td>
`;
tableBody.appendChild(row);
});
}   

window.deleteItem = function(id){
items = items.filter(item => item.id !== id);
localStorage.setItem("duties", JSON.stringify(items));
render();
}

window.editItem = function(id){
const item = items.find(item => item.id === id);
dateInput.value = item.date;
timeInput.value = item.time;
nameInput.value = item.name;
commentInput.value = item.comment;
editId = id;
}

searchInput.addEventListener("input", render);

sortBtn.addEventListener("click", function(){
items.sort((a,b)=> new Date(a.date) - new Date(b.date));
render();
});

});
