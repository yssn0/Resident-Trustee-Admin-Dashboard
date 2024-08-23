
// src/pages/api/assign_syndic.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { app, loginAdmin } from '../../lib/realm'
import { Reclamation } from '../../types/reclamation'
import * as Realm from 'realm-web';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Reclamation | { error: string }>
) {
  if (req.method === 'POST') {
    try {
      const { reclamationId, syndicId } = req.body;
      const user = await loginAdmin();
      const mongodb = user.mongoClient("mongodb-atlas");
      const reclamationCollection = mongodb.db("vervedb").collection("Reclamation");

      // Update only the syndicId of the reclamation
      const result = await reclamationCollection.updateOne(
        { _id: new Realm.BSON.ObjectId(reclamationId) },
        { $set: { syndicId: new Realm.BSON.ObjectId(syndicId) } }
      );

      if (result.modifiedCount === 0) {
        throw new Error('Failed to update reclamation');
      }

      // Fetch the updated reclamation
      const updatedReclamation = await reclamationCollection.findOne({ _id: new Realm.BSON.ObjectId(reclamationId) });

      // Convert Realm.BSON.ObjectId to string for JSON serialization
      const serializedReclamation = {
        ...updatedReclamation,
        _id: updatedReclamation._id.toString(),
        userId: updatedReclamation.userId?.toString(),
        syndicId: updatedReclamation.syndicId?.toString()
      };

      res.status(200).json(serializedReclamation);
    } catch (error) {
      console.error("Failed to assign syndic", error);
      res.status(500).json({ error: 'Failed to assign syndic' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}