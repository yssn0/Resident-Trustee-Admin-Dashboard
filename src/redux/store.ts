// src/redux/store.ts

import { configureStore } from '@reduxjs/toolkit';
import reclamationReducer from './slices/reclamationSlice';
import appUserReducer from './slices/appUserSlice';
import notificationReducer from './slices/notificationSlice';
import sponsorshipReducer from './slices/sponsorshipSlice';


export const store = configureStore({
  reducer: {
    reclamation: reclamationReducer,
    appUser: appUserReducer,
    notification: notificationReducer,
    sponsorship: sponsorshipReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
