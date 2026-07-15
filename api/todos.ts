import { db } from "../src/db";
import { todos } from "../src/db/schema";
import { eq } from "drizzle-orm";

export default async function handler(req: any, res: any): Promise<void> {
  try {
    if (req.method === "GET") {
      const all = await db.select().from(todos).orderBy(todos.createdAt);
      res.status(200).json(all);
      return;
    }

    if (req.method === "POST") {
      const { text } = req.body || {};
      if (!text || typeof text !== "string" || !text.trim()) {
        res.status(400).json({ error: "text is required" });
        return;
      }
      const [created] = await db
        .insert(todos)
        .values({ text: text.trim() })
        .returning();
      res.status(201).json(created);
      return;
    }

    if (req.method === "PATCH") {
      const { id, done } = req.body || {};
      if (typeof id !== "number") {
        res.status(400).json({ error: "id is required" });
        return;
      }
      const [updated] = await db
        .update(todos)
        .set({ done: !!done })
        .where(eq(todos.id, id))
        .returning();
      res.status(200).json(updated);
      return;
    }

    if (req.method === "DELETE") {
      const { id } = req.body || {};
      if (typeof id !== "number") {
        res.status(400).json({ error: "id is required" });
        return;
      }
      await db.delete(todos).where(eq(todos.id, id));
      res.status(200).json({ ok: true });
      return;
    }

    res.status(405).json({ error: "method not allowed" });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "internal error" });
  }
}
