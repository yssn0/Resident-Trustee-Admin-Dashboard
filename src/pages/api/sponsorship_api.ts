 // src/pages/api/sponsorship_api.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { app, loginAdmin } from '../../lib/realm'
import { Sponsorship } from '../../types/sponsorship'
import { AppUser } from '../../types/appUser'
import * as Realm from 'realm-web';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<(Sponsorship & { sponsor?: { name?: string; surname?: string } })[] | { error: string }>
) {
  if (req.method === 'GET') {
    try {
      const user = await loginAdmin();
      const mongodb = user.mongoClient("mongodb-atlas");
      const sponsorshipCollection = mongodb.db("vervedb").collection<Sponsorship>("Sponsorship");
      const userCollection = mongodb.db("vervedb").collection<AppUser>("AppUser");

      const sponsorships = await sponsorshipCollection.find();

      // Fetch user information for each sponsorship
      const sponsorshipsWithUserInfo = await Promise.all(
        sponsorships.map(async (sponsorship) => {
          const sponsorUser = await userCollection.findOne({ _id: sponsorship.userId });
          return {
            ...sponsorship,
            sponsor: sponsorUser ? { name: sponsorUser.name, surname: sponsorUser.surname } : undefined
          };
        })
      );

      res.status(200).json(sponsorshipsWithUserInfo);
    } catch (error) {
      console.error("Failed to fetch sponsorships", error);
      res.status(500).json({ error: 'Failed to fetch sponsorships' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}