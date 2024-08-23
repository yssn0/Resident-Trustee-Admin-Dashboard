// pages/api/update_user.ts (or app/api/update_user/route.ts for App Router)

import type { NextApiRequest, NextApiResponse } from 'next'
import { app, loginAdmin } from '../../lib/realm'
import { AppUser } from '../../types/appUser'
import * as Realm from 'realm-web';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string } | { error: string }>
) {
  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { _id, ...updateData } = req.body;

    // Login as admin
    const adminUser = await loginAdmin();

    // Update user in MongoDB
    const mongodb = adminUser.mongoClient("mongodb-atlas");
    const collection = mongodb.db("vervedb").collection<AppUser>("AppUser");
    
    const result = await collection.updateOne(
      { _id: new Realm.BSON.ObjectId(_id) },
      { $set: updateData }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: 'User not found or no changes made' });
    }

    res.status(200).json({ message: 'Mise à jour de l\'utilisateur réussie' });
  } catch (error) {
    console.error("Failed to update user", error);
    res.status(500).json({ error: 'Failed to update user' });
  }
}