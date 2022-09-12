import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { CompetitionByLevel, Competitor } from '@/typings/compete';

export type CompeteState = {
  collapsed: boolean;
  competitor: Competitor;
  competition: CompetitionByLevel;
};
const initialState: CompeteState = {
  collapsed: true,
  competitor: { id: '', ranking: 0, rankingData: 0, programUrl: '', wasmUrl: '', publish: false },
  competition: { id: '', name: '', level: '', players: [], levelID: '' },
};

export const competeSlice = createSlice({
  name: 'compete',
  initialState,
  reducers: {
    updateCompetition: (state, action: PayloadAction<CompetitionByLevel>) => {
      return {
        ...state,
        competition: action.payload,
      };
    },
    toggleCollapse: (state, action: PayloadAction<Competitor>) => {
      return {
        ...state,
        collapsed: false,
        competitor: action.payload,
      };
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
