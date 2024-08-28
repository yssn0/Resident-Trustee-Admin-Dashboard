import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AccessRequest } from '../../types/accessRequest';

interface AccessRequestState {
  accessRequests: AccessRequest[];
}

const initialState: AccessRequestState = {
  accessRequests: [],
};

export const accessRequestSlice = createSlice({
  name: 'accessRequest',
  initialState,
  reducers: {
    setAccessRequests: (state, action: PayloadAction<AccessRequest[]>) => {
      state.accessRequests = action.payload;
    },
  },
});

export const { setAccessRequests } = accessRequestSlice.actions;

export default accessRequestSlice.reducer;