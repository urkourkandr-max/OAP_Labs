import { run, get } from "./db";

export async function seedDatabase() {
  console.log("Seed started...");

  try {
    const usersCount = await get(
      "SELECT COUNT(*) as count FROM users"
    );

    if (usersCount.count > 0) {
      console.log("Database already contains data");
      return;
    }

    await run(
      `
      INSERT INTO users (name, email, password)
      VALUES
      (?, ?, ?),
      (?, ?, ?),
      (?, ?, ?)
      `,
      [
        "Ivan",
        "ivan@gmail.com",
        "123456",

        "Olena",
        "olena@gmail.com",
        "123456",

        "Petro",
        "petro@gmail.com",
        "123456",
      ]
    );

    await run(
      `
      INSERT INTO duties
      (name, date, time, comment, userId)
      VALUES
      (?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?)
      `,
      [
        "Іван",
        "2027-12-31",
        "10:00-12:00",
        "Почергувати в лабораторії 1",
        1,

        "Олена",
        "2028-01-01",
        "12:00-14:00",
        "Почергувати в лабораторії 2",
        2,

        "Петро",
        "2028-01-02",
        "14:00-16:00",
        "Почергувати в лабораторії 3",
        3,
      ]
    );

    await run(
      `
      INSERT INTO duty_messages
      (dutyId, message)
      VALUES
      (?, ?),
      (?, ?),
      (?, ?)
      `,
      [
        1,
        "Іван: Почергувати в лабораторії 1",

        2,
        "Олена: Почергувати в лабораторії 2",

        3,
        "Петро: Почергувати в лабораторії 3",
      ]
    );

    console.log("Seed completed");
  } catch (error) {
    console.error("Seed error:", error);
  }
}