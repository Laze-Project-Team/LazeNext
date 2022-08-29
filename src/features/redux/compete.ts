import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { Competitor } from '@/typings/compete';

export type CompeteState = {
  collapsed: boolean;
  competitor: Competitor;
};
const initialState: CompeteState = {
  collapsed: true,
  competitor: { id: '', ranking: 0, rankingData: 0, programUrl: '', wasmUrl: '' },
};

export const competeSlice = createSlice({
  name: 'compete',
  initialState,
  reducers: {
    toggleCollapse: (state, action: PayloadAction<Competitor>) => {
      if (state.competitor.ranking === action.payload.ranking) {
        return {
          ...state,
          collapsed: false,
        };
      } else {
        return {
          ...state,
          collapsed: false,
          competitor: action.payload,
        };
      }
    },
    differentCompetitor: (state, action: PayloadAction<Competitor>) => {
      return {
        ...state,
        competitor: action.payload,
      };
    },
    collapse: (state) => {
      return {
        ...state,
        collapsed: true,
      };
    },
  },
});