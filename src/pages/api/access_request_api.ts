// src/pages/api/access_request_api.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { app, loginAdmin } from '../../lib/realm'
import { AccessRequest } from '../../types/accessRequest'
import * as Realm from 'realm-web';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AccessRequest[] | { error: string }>
) {
  if (req.method === 'GET') {
    try {
      const user = await loginAdmin();
      const mongodb = user.mongoClient("mongodb-atlas");
      const accessRequestCollection = mongodb.db("vervedb").collection<AccessRequest>("AccessRequest");

      const accessRequests = await accessRequestCollection.find();

      res.status(200).json(accessRequests);
    } catch (error) {
      console.error("Failed to fetch access requests", error);
      res.status(500).json({ error: 'Failed to fetch access requests' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}