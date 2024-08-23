// src/pages/api/reclamation_api.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { app, loginAdmin } from '../../lib/realm'
import { Reclamation } from '../../types/reclamation'
import * as Realm from 'realm-web';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Reclamation[] | { error: string }>
) {
  if (req.method === 'GET') {
    try {
      const user = await loginAdmin();
      const mongodb = user.mongoClient("mongodb-atlas");
      const collection = mongodb.db("vervedb").collection("Reclamation");
      const results = await collection.find();
      
      // Convert MongoDB date to JavaScript Date and Realm.BSON.ObjectId to string
      const formattedResults = results.map(rec => ({
        ...rec,
        _id: rec._id.toString(),
        userId: rec.userId?.toString(),
        syndicId: rec.syndicId?.toString(),
        date: rec.date ? new Date(rec.date).toISOString() : undefined
      }));

      res.status(200).json(formattedResults);
    } catch (error) {
      console.error("Failed to fetch reclamations", error);
      res.status(500).json({ error: 'Failed to fetch reclamations' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
