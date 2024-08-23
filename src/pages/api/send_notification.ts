// src/pages/api/send_notification.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import { app, loginAdmin } from '../../lib/realm'
import { AppNotification } from '../../types/AppNotification'
import * as Realm from 'realm-web';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string } | { error: string }>
) {
  if (req.method === 'POST') {
    try {
      const { title, content, recipientType, selectedUsers } = req.body;

      const adminUser = await loginAdmin();
      const mongodb = adminUser.mongoClient("mongodb-atlas");
      const collection = mongodb.db("vervedb").collection<AppNotification>("AppNotification");
      const userCollection = mongodb.db("vervedb").collection("AppUser");

      let userIds: Realm.BSON.ObjectId[] = [];

      switch (recipientType) {
        case 'all':
          const allUsers = await userCollection.find();
          userIds = allUsers.map(user => user._id);
          break;
        case 'residents':
          const residents = await userCollection.find({ userType: 'user' });
          userIds = residents.map(user => user._id);
          break;
        case 'syndics':
          const syndics = await userCollection.find({ userType: 'syndic' });
          userIds = syndics.map(user => user._id);
          break;
        case 'specific':
          userIds = selectedUsers.map((id: string) => new Realm.BSON.ObjectId(id));
          break;
        default:
          throw new Error('Invalid recipient type');
      }

      if (userIds.length === 0) {
        throw new Error('No recipients found for the selected type');
      }

      const notifications = userIds.map(userId => ({
        _id: new Realm.BSON.ObjectId(),
        title,
        content,
        createdAt: new Date(),
        isRead: false,
        userId,
      }));

      await collection.insertMany(notifications);

      res.status(200).json({ message: 'Notifications sent successfully' });
    } catch (error) {
      console.error("Failed to send notifications", error);
      res.status(500).json({ error: 'Failed to send notifications: ' + (error as Error).message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}