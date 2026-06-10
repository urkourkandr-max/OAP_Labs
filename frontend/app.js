import { dutiesApi } from "./apiClient.js";

const form         = document.getElementById("dutyForm");
const dateInput    = document.getElementById("date");
const timeInput    = document.getElementById("time");
const nameInput    = document.getElementById("name");
const commentInput = document.getElementById("comment");
const editIdInput  = document.getElementById("editId");
const tableBody    = document.getElementById("tableBody");
const searchInput  = document.getElementById("searchInput");
const sortBtn      = document.getElementById("sortBtn");

const stateLoading = document.getElementById("stateLoading");
const stateEmpty   = document.getElementById("stateEmpty");
const stateError   = document.getElementById("stateError");
const stateErrorMsg = document.getElementById("stateErrorMsg");

let items   = [];
let sortAsc = true;
const userId = 1;

loadDuties();

async function loadDuties() {
  setUIState("loading");
  try {
    const data = await dutiesApi.getAll();
    items = data.data || data || [];
    setUIState(items.length === 0 ? "empty" : "success");
    render();
  } catch (err) {
    console.error("Load error:", err);
    setUIState("error", err.message || "Не вдалося завантажити дані.");
  }
}

function setUIState(state, errorMessage = "") {
  stateLoading.hidden = state !== "loading";
  stateEmpty.hidden   = state !== "empty";
  stateError.hidden   = state !== "error";
  tableBody.closest("table").hidden = state === "loading" || state === "error";

  if (state === "error") {
    stateErrorMsg.textContent = errorMessage;
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearErrors();

  const date    = dateInput.value.trim();
  const time    = timeInput.value.trim();
  const name    = nameInput.value.trim();
  const comment = commentInput.value.trim();

  let valid = true;

  if (!date) {
    showError(dateInput, "Обов'язкове поле");
    valid = false;
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(date);
    if (selected < today) {
      showError(dateInput, "Не можна вводити дату з минулого");
      valid = false;
    }
  }

  if (!time) {
    showError(timeInput, "Оберіть час");
    valid = false;
  }

  if (!name) {
    showError(nameInput, "Обов'язкове поле");
    valid = false;
  } else if (name.length < 3) {
    showError(nameInput, "Мінімум 3 символи");
    valid = false;
  } else if (name.length > 20) {
    showError(nameInput, "Максимум 20 символів");
    valid = false;
  } else if (/\d/.test(name)) {
    showError(nameInput, "Ім'я не повинно містити цифри");
    valid = false;
  }

  if (comment.length > 50) {
    showError(commentInput, "Максимум 50 символів");
    valid = false;
  }

  if (!valid) return;

  const duty = { title: name, description: comment, date, time, userId };

  try {
    const editId = editIdInput.value;
    if (editId) {
      await dutiesApi.update(editId, duty);
    } else {
      await dutiesApi.create(duty);
    }

    form.reset();
    editIdInput.value = "";
    clearErrors();
    await loadDuties();
  } catch (error) {
    alert("Помилка збереження: " + error.message);
  }
});

function showError(input, msg) {
  const el = input.parentElement.querySelector(".error");
  if (el) el.textContent = msg;
}

function clearErrors() {
  document.querySelectorAll(".error").forEach(el => el.textContent = "");
}

sortBtn.addEventListener("click", () => {
  sortAsc = !sortAsc;
  items.sort((a, b) =>
    sortAsc
      ? new Date(a.date) - new Date(b.date)
      : new Date(b.date) - new Date(a.date)
  );
  render();
});

searchInput.addEventListener("input", render);

function render() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = query
    ? items.filter(i => (i.title || i.name || "").toLowerCase().includes(query))
    : items;

  tableBody.innerHTML = "";

  if (filtered.length === 0 && items.length > 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="6" style="text-align:center;color:#888">Нічого не знайдено</td>`;
    tableBody.appendChild(row);
    return;
  }

  filtered.forEach((item, idx) => {
    const title       = item.title || item.name || "";
    const description = item.description || item.comment || "";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${idx + 1}</td>
      <td>${item.date}</td>
      <td>${item.time}</td>
      <td>${title}</td>
      <td>${description}</td>
      <td>
        <button onclick="editDuty(${item.id})">Ред.</button>
        <button onclick="deleteDuty(${item.id})">Вид.</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

window.editDuty = (id) => {
  const item = items.find(i => i.id === id);
  if (!item) return;
  nameInput.value    = item.title || item.name || "";
  commentInput.value = item.description || item.comment || "";
  dateInput.value    = item.date;
  timeInput.value    = item.time;
  editIdInput.value  = id;
  nameInput.focus();
};

window.deleteDuty = async (id) => {
  if (!confirm("Видалити цей запис?")) return;
  try {
    await dutiesApi.delete(id);
    await loadDuties();
  } catch (err) {
    alert("Помилка видалення: " + err.message);
  }
};