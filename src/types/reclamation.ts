// src/types/reclamation.ts
import * as Realm from 'realm-web';

export interface Reclamation {
  problemType: any;
  _id: Realm.BSON.ObjectId;
  color?: string;
  commentaire?: string;
  date?: Date;
  imageConfirmedUrl?: string;
  imageUrl: string;
  isOpen?: boolean;
  problem?: string;
  reactionComment?: string;
  satisfactionLevel?: number;
  status?: string;
  syndicComment?: string;
  syndicId?: Realm.BSON.ObjectId;
  userId?: Realm.BSON.ObjectId;
}