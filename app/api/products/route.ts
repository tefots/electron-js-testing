import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../utils/db';

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     const { productName, quantity, price } = req.body;

//     // Handle image upload
//     const imagePath = req.body.imagePath || null;

//     try {
//       const stmt = db.prepare(
//         'INSERT INTO products (productName, quantity, price, imagePath) VALUES (?, ?, ?, ?)'
//       );
//       stmt.run(productName, quantity, price, imagePath);

//       res.status(200).json({ message: 'Product added successfully' });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Failed to add product' });
//     }
//   } else {
//     res.status(405).json({ error: 'Method not allowed' });
//   }
// }
export function POST (req:NextApiRequest, res: NextApiResponse){
    const { productName, quantity, price } = req.body;

    // Handle image upload
    const imagePath = req.body.imagePath || null;

    try {
      const stmt = db.prepare(
        'INSERT INTO products (productName, quantity, price, imagePath) VALUES (?, ?, ?, ?)'
      );
      stmt.run(productName, quantity, price, imagePath);

      res.status(200).json({ message: 'Product added successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to add product' });
    }
}
export function GET (res: NextApiResponse){
    try {
        const products = db.prepare('SELECT * FROM products').all();
        res.status(200).json(products);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch products' });
      }
}
