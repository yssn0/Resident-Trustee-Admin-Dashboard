//src\types\AppNotification.ts
import * as Realm from 'realm-web';

export interface AppNotification {
  _id: Realm.BSON.ObjectId;
  title: string;
  content: string;
  createdAt: Date;
  isRead: boolean;
  userId: Realm.BSON.ObjectId;
  recipient?: {
    name?: string;
    surname?: string;
    userType?: string
  }
}
