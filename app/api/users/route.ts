import type { NextApiRequest, NextApiResponse } from "next";
import { signupUser, getUsers } from "../../../db";

// Define response types
type SuccessResponse = { message: string; id?: number };
type ErrorResponse = { error: string };

// API Handler Function
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse | any> // 'any' for GET response
) {
  if (req.method === "POST") {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = signupUser({ username, email, password, role });

    if (result.success) {
      res.status(201).json({ message: "User created successfully", id: result.id });
    } else {
      res.status(400).json({ error: result.error });
    }
  } else if (req.method === "GET") {
    const users = getUsers();
    res.status(200).json(users);
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
