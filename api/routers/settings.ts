import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { settings } from "@db/schema";
import { eq } from "drizzle-orm";

export const settingsRouter = createRouter({
  get: publicQuery
    .input(z.object({ key: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(settings)
        .where(eq(settings.key, input.key))
        .limit(1);
      return result[0] ?? null;
    }),

  getAll: publicQuery
    .input(z.object({ pin: z.string() }))
    .query(async ({ input }) => {
      if (input.pin !== "32074319680") {
        throw new Error("Invalid admin PIN");
      }
      const db = getDb();
      return db.select().from(settings);
    }),

  set: publicQuery
    .input(
      z.object({
        pin: z.string(),
        key: z.string(),
        value: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      if (input.pin !== "32074319680") {
        throw new Error("Invalid admin PIN");
      }
      const db = getDb();
      const existing = await db
        .select()
        .from(settings)
        .where(eq(settings.key, input.key))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(settings)
          .set({ value: input.value })
          .where(eq(settings.key, input.key));
      } else {
        await db.insert(settings).values({
          key: input.key,
          value: input.value,
        });
      }
      return { success: true };
    }),
});
