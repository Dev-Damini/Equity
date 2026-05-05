import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { applications } from "@db/schema";
import { eq } from "drizzle-orm";

export const applicationRouter = createRouter({
  submit: publicQuery
    .input(
      z.object({
        amount: z.string().min(1),
        email: z.string().email(),
        phone: z.string().min(1),
        occupation: z.string().min(1),
        idNumber: z.string().min(1),
        ssn: z.string().min(1),
        hasHouse: z.boolean(),
        reason: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(applications).values({
        amount: input.amount,
        email: input.email,
        phone: input.phone,
        occupation: input.occupation,
        idNumber: input.idNumber,
        ssn: input.ssn,
        hasHouse: input.hasHouse,
        reason: input.reason,
        status: "pending",
      });
      return { success: true, id: Number(result[0].insertId) };
    }),

  list: publicQuery
    .input(z.object({ pin: z.string() }))
    .query(async ({ input }) => {
      if (input.pin !== "32074319680") {
        throw new Error("Invalid admin PIN");
      }
      const db = getDb();
      return db.query.applications.findMany({
        orderBy: (apps, { desc }) => [desc(apps.createdAt)],
      });
    }),

  updateStatus: publicQuery
    .input(
      z.object({
        pin: z.string(),
        id: z.number(),
        status: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      if (input.pin !== "32074319680") {
        throw new Error("Invalid admin PIN");
      }
      const db = getDb();
      await db
        .update(applications)
        .set({ status: input.status })
        .where(eq(applications.id, input.id));
      return { success: true };
    }),
});
