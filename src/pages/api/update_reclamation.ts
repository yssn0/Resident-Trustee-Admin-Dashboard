
// src/pages/api/update_reclamation.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { app, loginAdmin } from '../../lib/realm'
import * as Realm from 'realm-web';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ success: boolean } | { error: string }>
) {
  if (req.method === 'POST') {
    try {
      const { reclamationId, syndicComment, imageConfirmedUrl, status } = req.body;
      const user = await loginAdmin();
      const mongodb = user.mongoClient("mongodb-atlas");
      const reclamationCollection = mongodb.db("vervedb").collection("Reclamation");

      const result = await reclamationCollection.updateOne(
        { _id: new Realm.BSON.ObjectId(reclamationId) },
        { $set: { syndicComment, imageConfirmedUrl, status } }
      );

      if (result.modifiedCount === 0) {
        throw new Error('Failed to update reclamation');
      }

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Failed to update reclamation", error);
      res.status(500).json({ error: 'Failed to update reclamation' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}