// src/redux/slices/reclamationSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Reclamation } from '../../types/reclamation';

interface ReclamationState {
  reclamations: Reclamation[];
}

const initialState: ReclamationState = {
  reclamations: [],
};

export const reclamationSlice = createSlice({
  name: 'reclamation',
  initialState,
  reducers: {
    setReclamations: (state, action: PayloadAction<Reclamation[]>) => {
      state.reclamations = action.payload;
    },
  },
});

export const { setReclamations } = reclamationSlice.actions;

export default reclamationSlice.reducer;