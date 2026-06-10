import { dutiesApi } from "./apiClient.js";

const form          = document.getElementById("dutyForm");
const dateInput     = document.getElementById("date");
const timeInput     = document.getElementById("time");
const nameInput     = document.getElementById("name");
const commentInput  = document.getElementById("comment");
const editIdInput   = document.getElementById("editId");
const tableBody     = document.getElementById("tableBody");
const searchInput   = document.getElementById("searchInput");
const sortBtn       = document.getElementById("sortBtn");
const stateLoading  = document.getElementById("stateLoading");
const stateEmpty    = document.getElementById("stateEmpty");
const stateError    = document.getElementById("stateError");
const stateErrorMsg = document.getElementById("stateErrorMsg");

let items   = [];
let sortAsc = true;

function setUIState(state, errorMessage = "") {
  stateLoading.hidden = state !== "loading";
  stateEmpty.hidden   = state !== "empty";
  stateError.hidden   = state !== "error";
  document.querySelector("table").hidden = state === "loading" || state === "error";
  if (state === "error") stateErrorMsg.textContent = errorMessage;
}

async function loadDuties() {
  setUIState("loading");
  try {
    const result = await dutiesApi.getAll();
    items = result?.data || result || [];
    setUIState(items.length === 0 ? "empty" : "success");
    render();
  } catch (err) {
    setUIState("error", err.message || "Невідома помилка");
  }
}

function render() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = query
    ? items.filter(i => (i.name || "").toLowerCase().includes(query))
    : items;

  tableBody.innerHTML = "";

  if (filtered.length === 0 && items.length > 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="6" style="text-align:center;color:#888">Нічого не знайдено</td>`;
    tableBody.appendChild(row);
    return;
  }

  filtered.forEach((item, idx) => {
    const row = document.createElement("tr");

    const tdNum     = document.createElement("td");
    const tdDate    = document.createElement("td");
    const tdTime    = document.createElement("td");
    const tdName    = document.createElement("td");
    const tdComment = document.createElement("td");
    const tdActions = document.createElement("td");

    tdNum.textContent     = idx + 1;
    tdDate.textContent    = item.date    || "";
    tdTime.textContent    = item.time    || "";
    tdName.textContent    = item.name    || "";
    tdComment.textContent = item.comment || "";

    const editBtn = document.createElement("button");
    editBtn.textContent = "Ред.";
    editBtn.onclick = () => fillForm(item);

    const delBtn = document.createElement("button");
    delBtn.textContent = "Вид.";
    delBtn.onclick = () => deleteDuty(item.id);

    tdActions.appendChild(editBtn);
    tdActions.appendChild(delBtn);

    row.appendChild(tdNum);
    row.appendChild(tdDate);
    row.appendChild(tdTime);
    row.appendChild(tdName);
    row.appendChild(tdComment);
    row.appendChild(tdActions);

    tableBody.appendChild(row);
  });
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
    showError(dateInput, "Обов'язкове поле"); valid = false;
  } else {
    const today = new Date(); today.setHours(0,0,0,0);
    if (new Date(date) < today) {
      showError(dateInput, "Не можна вводити дату з минулого"); valid = false;
    }
  }

  if (!time) { showError(timeInput, "Оберіть час"); valid = false; }

  if (!name) {
    showError(nameInput, "Обов'язкове поле"); valid = false;
  } else if (name.length < 3) {
    showError(nameInput, "Мінімум 3 символи"); valid = false;
  } else if (name.length > 20) {
    showError(nameInput, "Максимум 20 символів"); valid = false;
  } else if (/\d/.test(name)) {
    showError(nameInput, "Ім'я не повинно містити цифри"); valid = false;
  }

  if (comment.length > 50) {
    showError(commentInput, "Максимум 50 символів"); valid = false;
  }

  if (!valid) return;

  const duty = { title: name, description: comment, date, time };

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
  } catch (err) {
    alert("Помилка збереження: " + err.message);
  }
});

function fillForm(item) {
  nameInput.value    = item.name    || "";
  commentInput.value = item.comment || "";
  dateInput.value    = item.date    || "";
  timeInput.value    = item.time    || "";
  editIdInput.value  = item.id;
  nameInput.focus();
}

async function deleteDuty(id) {
  if (!confirm("Видалити цей запис?")) return;
  try {
    await dutiesApi.delete(id);
    await loadDuties();
  } catch (err) {
    alert("Помилка видалення: " + err.message);
  }
}

sortBtn.addEventListener("click", () => {
  sortAsc = !sortAsc;
  items.sort((a, b) => sortAsc
    ? new Date(a.date) - new Date(b.date)
    : new Date(b.date) - new Date(a.date)
  );
  render();
});

searchInput.addEventListener("input", render);

loadDuties();

function showError(input, msg) {
  const el = input.parentElement.querySelector(".error");
  if (el) el.textContent = msg;
}

function clearErrors() {
  document.querySelectorAll(".error").forEach(el => el.textContent = "");
}