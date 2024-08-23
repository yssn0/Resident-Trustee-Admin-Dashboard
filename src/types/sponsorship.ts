import * as Realm from 'realm-web';

export interface Sponsorship {
  _id: Realm.BSON.ObjectId;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  comment?: string;
  createdAt: Date;
  userId: Realm.BSON.ObjectId;
  sponsor?: {
    name?: string;
    surname?: string;
  };
}