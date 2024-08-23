import type { NextApiRequest, NextApiResponse } from 'next'
import { app, loginAdmin } from '../../lib/realm'
import { AppNotification } from '../../types/AppNotification'
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

    // Delete notification from MongoDB
    const mongodb = adminUser.mongoClient("mongodb-atlas");
    const collection = mongodb.db("vervedb").collection<AppNotification>("AppNotification");
    
    const result = await collection.deleteOne({ _id: new Realm.BSON.ObjectId(_id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Notification non trouvée' });
    }

    res.status(200).json({ message: 'Notification supprimée de la base de données avec succès.' });
  } catch (error) {
    console.error("Échec de la suppression de la notification", error);
    res.status(500).json({ error: 'Échec de la suppression de la notification' });
  }
}