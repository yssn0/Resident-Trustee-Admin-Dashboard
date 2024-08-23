//src\types\appUser.ts
import * as Realm from 'realm-web';

export interface AppUser {
  _id: Realm.BSON.ObjectId;
  email: string;
  name?: string;
  phoneNumber?: string;
  surname?: string;
  userType: string;
}