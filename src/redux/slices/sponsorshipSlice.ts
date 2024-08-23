// src/redux/slices/sponsorshipSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Sponsorship } from '../../types/sponsorship';

interface SponsorshipState {
  sponsorships: Sponsorship[];
}

const initialState: SponsorshipState = {
  sponsorships: [],
};

const sponsorshipSlice = createSlice({
  name: 'sponsorship',
  initialState,
  reducers: {
    setSponsorships: (state, action: PayloadAction<Sponsorship[]>) => {
      state.sponsorships = action.payload;
    },
  },
});

export const { setSponsorships } = sponsorshipSlice.actions;
export default sponsorshipSlice.reducer;