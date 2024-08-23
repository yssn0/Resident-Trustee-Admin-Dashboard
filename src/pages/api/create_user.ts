//src\pages\api\create_user.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { app, loginAdmin } from '../../lib/realm'
import { AppUser } from '../../types/appUser'
import * as Realm from 'realm-web';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string } | { error: string }>
) {
  if (req.method === 'POST') {
    try {
      const { email, password, name, surname, phoneNumber, userType } = req.body;

      // Login as admin
      const adminUser = await loginAdmin();

      // Create user in App Services
      await app.emailPasswordAuth.registerUser({ email, password });

      // Log in as the new user to get their ID
      const newUser = await app.logIn(Realm.Credentials.emailPassword(email, password));

      // Create AppUser document
      const mongodb = adminUser.mongoClient("mongodb-atlas");
      const collection = mongodb.db("vervedb").collection<AppUser>("AppUser");
      
      await collection.insertOne({
        _id: new Realm.BSON.ObjectId(newUser.id),
        email,
        name,
        surname,
        phoneNumber,
        userType
      });

      // Log out the new user
      await app.removeUser(newUser);

      res.status(200).json({ message: 'User created successfully' });
    } catch (error) {
      console.error("Failed to create user", error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}