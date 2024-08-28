
// src/pages/api/update_access_request.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { app, loginAdmin } from '../../lib/realm'
import { AccessRequest } from '../../types/accessRequest'
import * as Realm from 'realm-web';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string } | { error: string }>
) {
  if (req.method === 'PUT') {
    try {
      const { requestId, status } = req.body;

      const adminUser = await loginAdmin();
      const mongodb = adminUser.mongoClient("mongodb-atlas");
      const collection = mongodb.db("vervedb").collection<AccessRequest>("AccessRequest");
      
      const result = await collection.updateOne(
        { _id: new Realm.BSON.ObjectId(requestId) },
        { $set: { status } }
      );

      if (result.modifiedCount === 0) {
        return res.status(404).json({ error: 'Access request not found' });
      }

      res.status(200).json({ message: 'Access request updated successfully' });
    } catch (error) {
      console.error("Failed to update access request", error);
      res.status(500).json({ error: 'Failed to update access request' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}