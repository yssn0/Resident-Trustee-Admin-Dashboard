//src\pages\api\appuser_api.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { app, loginAdmin } from '../../lib/realm'
import { AppUser } from '../../types/appUser'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AppUser[] | { error: string }>
) {
  if (req.method === 'GET') {
    try {
      const user = await loginAdmin();
      const mongodb = user.mongoClient("mongodb-atlas");
      const collection = mongodb.db("vervedb").collection<AppUser>("AppUser");
      const results = await collection.find();
      
      res.status(200).json(results);
    } catch (error) {
      console.error("Failed to fetch app users", error);
      res.status(500).json({ error: 'Failed to fetch app users' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}