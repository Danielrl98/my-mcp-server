import { Router } from "express";
import { processEdit } from "../services/ai.service";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const result = await processEdit(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
