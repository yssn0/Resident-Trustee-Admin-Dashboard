//src\types\accessRequest.ts

import * as Realm from 'realm-web';

export interface AccessRequest {
  _id: Realm.BSON.ObjectId;
  createdAt: Date;
  email: string;
  name: string;
  phoneNumber: string;
  reason: string;
  status: string;
  surname: string;
};
