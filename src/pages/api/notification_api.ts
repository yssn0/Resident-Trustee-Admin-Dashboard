//src\pages\api\notification_api.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import { app, loginAdmin } from '../../lib/realm'
import { AppNotification } from '../../types/AppNotification';
import { AppUser } from '../../types/appUser';
import * as Realm from 'realm-web';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<(AppNotification & { recipient?: { name?: string; surname?: string } })[] | { error: string }>
) {
  if (req.method === 'GET') {
    try {
      const user = await loginAdmin();
      const mongodb = user.mongoClient("mongodb-atlas");
      const notificationCollection = mongodb.db("vervedb").collection<AppNotification>("AppNotification");
      const userCollection = mongodb.db("vervedb").collection<AppUser>("AppUser");

      const notifications = await notificationCollection.find();

      // Fetch user information for each notification

      const notificationsWithUsersInfo  = await Promise.all(
        notifications.map(async (notification) => {
        const recipientUser = await userCollection.findOne({ _id: notification.userId });
        return {
          ...notification,
          recipient: recipientUser ? { name: recipientUser.name, surname: recipientUser.surname, userType: recipientUser.userType } : undefined
        };
      })
    );
      
      res.status(200).json(notificationsWithUsersInfo);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
      res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}