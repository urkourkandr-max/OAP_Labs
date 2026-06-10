const API_BASE_URL = "http://localhost:3000/api";
const DEMO_USER_ID = "1"; 

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log("Request:", url, options.method || "GET");

  let response;
  try {
    response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "X-Demo-UserId": DEMO_USER_ID
      },
      ...options
    });
  } catch (networkErr) {
    throw {
      status: 0,
      message: "Сервер недоступний. Перевірте підключення."
    };
  }

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    console.error("API Error:", data);
    const message =
      data?.detail ||
      data?.error?.message ||
      data?.message ||
      `Помилка ${response.status}`;
    throw { status: response.status, message };
  }

  console.log("Response:", data);
  return data;
}

export const dutiesApi = {
  getAll:   ()         => request("/duties"),
  getById:  (id)       => request(`/duties/${id}`),
  create:   (duty)     => request("/duties", {
    method: "POST",
    body: JSON.stringify(duty)
  }),
  update:   (id, duty) => request(`/duties/${id}`, {
    method: "PUT",
    body: JSON.stringify(duty)
  }),
  delete:   (id)       => request(`/duties/${id}`, {
    method: "DELETE"
  })
};