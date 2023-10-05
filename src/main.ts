import { describe, test, before } from "node:test";
import { equal, rejects, doesNotReject } from "node:assert";
import { eq } from "drizzle-orm";

import { db } from "./config";
import { tasks, users } from "./schema";

describe("Some Test Suite", () => {
  const currentDate = new Date();

  before(async () => await db.delete(users));

  test("Insert New User", async () => {
    const result = await db
      .insert(users)
      .values({ username: "Hello World" })
      .returning();

    equal(result[0].username, "Hello World");
  });

  test("Insert Multiple Users", async () => {
    const result = await db
      .insert(users)
      .values([
        {
          username: "Foo",
        },
        {
          username: "Bar",
        },
        {
          username: "Baz",
        },
      ])
      .returning();

    equal(result.length, 3);
  });

  test("On Conflict throws error", () => {
    rejects(
      async () => await db.insert(users).values({ username: "Foo" }),
      "SqliteError: UNIQUE constraint failed: users.username"
    );
  });

  test("On Conflict do nothing", () => {
    doesNotReject(
      async () =>
        await db.insert(users).values({ username: "Foo" }).onConflictDoNothing()
    );
  });

  test("Update User", async () => {
    const result = await db
      .update(users)
      .set({ username: "Hello, World" })
      .where(eq(users.username, "Hello World"))
      .returning();

    equal(result[0].username, "Hello, World");
  });

  test("Add new Task", async () => {
    const oneHourFromNow = new Date();
    oneHourFromNow.setHours(oneHourFromNow.getHours() + 1);

    const user = await db.query.users.findFirst({
      where: (user, { eq }) => eq(user.username, "Bar"),
    });

    doesNotReject(
      async () =>
        await db.insert(tasks).values({
          name: "Gym",
          start: currentDate,
          end: oneHourFromNow,
          userId: user!.id,
        })
    );
  });

  test("Throw on conflicting tasks", async () => {
    const oneHourFromNow = new Date();
    oneHourFromNow.setHours(oneHourFromNow.getHours() + 1);

    const user = await db.query.users.findFirst({
      where: (user, { eq }) => eq(user.username, "Bar"),
    });

    rejects(
      async () =>
        await db.insert(tasks).values({
          name: "Watch Anime",
          start: currentDate,
          end: oneHourFromNow,
          userId: user!.id,
        }),
      'UNIQUE constraint failed: tasks.start, tasks.end, tasks.user_id"'
    );
  });

  test("Get all tasks that belong to a user", async () => {
    const user = await db.query.users.findFirst({
      where: (user, { eq }) => eq(user.username, "Bar"),
    });

    const result = await db.query.tasks.findMany({
      where: (task, { eq }) => eq(task.userId, user!.id),
      columns: {
        id: true,
        start: true,
        end: true,
      },
      with: {
        user: {
          columns: {
            username: true,
          },
        },
      },
    });

    equal(result.length, 1);
  });
});
