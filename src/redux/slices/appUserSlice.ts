import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppUser } from '../../types/appUser';

interface AppUserState {
  appUsers: AppUser[];
}

const initialState: AppUserState = {
  appUsers: [],
};

export const appUserSlice = createSlice({
  name: 'appUser',
  initialState,
  reducers: {
    setAppUsers: (state, action: PayloadAction<AppUser[]>) => {
      state.appUsers = action.payload;
    },
  },
});

export const { setAppUsers } = appUserSlice.actions;

export default appUserSlice.reducer;