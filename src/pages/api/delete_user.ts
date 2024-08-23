// pages/api/delete_user.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import { app, loginAdmin } from '../../lib/realm'
import { AppUser } from '../../types/appUser'
import * as Realm from 'realm-web';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string } | { error: string }>
) {
  if (req.method !== 'DELETE') {
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { _id } = req.body;

    // Login as admin
    const adminUser = await loginAdmin();

    // Delete user from MongoDB
    const mongodb = adminUser.mongoClient("mongodb-atlas");
    const collection = mongodb.db("vervedb").collection<AppUser>("AppUser");
    
    const result = await collection.deleteOne({ _id: new Realm.BSON.ObjectId(_id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Log that the user was deleted from MongoDB but not from Realm Auth
    console.log(`User ${_id} deleted from MongoDB. Note: User still exists in Realm Auth.`);

    res.status(200).json({ message: 'Utilisateur supprimé de la base de données avec succès. Remarque: L\'utilisateur existe toujours dans Realm Auth.' });
  } catch (error) {
    console.error("Échec de la suppression de l'utilisateur", error);
    res.status(500).json({ error: 'Échec de la suppression de l\'utilisateur' });
  }
}