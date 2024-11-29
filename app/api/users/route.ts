import type { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/dbConnection';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, email, role, password } = req.body;

    if (!username || !email || !role || !password ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const stmt = db.prepare(
        'INSERT INTO users (username, email, role, password) VALUES (?, ?, ?, ?)'
      );
      const result = stmt.run(username, email, role, password);
      return res.status(201).json({ id: result.lastInsertRowid });
    } catch (error) {
      return res.status(500).json({ error: 'Database error' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
