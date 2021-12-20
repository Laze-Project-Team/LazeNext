import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';

import { explorerSlice } from '@/features/redux/explorer';
import { consoleSlice } from '@/features/redux/console';

const rootReducer = combineReducers({
  explorer: explorerSlice.reducer,
  console: consoleSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/ban-ts-comment */
export const store = configureStore({
  reducer: rootReducer,
  devTools:
    typeof window !== 'undefined' && process.env.NODE_ENV === 'development'
      ? // @ts-ignore
        window.__REDUX_DEVTOOLS_EXTENSION__ &&
        // @ts-ignore
        window.__REDUX_DEVTOOLS_EXTENSION__()
      : undefined,
});
/* eslint-enable no-underscore-dangle */
/* eslint-enable @typescript-eslint/ban-ts-comment */

export const getCurrentCode = (): string | null => {
  const state = store.getState().explorer;

  return state.current ? (state.directory[state.current].content as string) : null;
};

export const getCurrentFile = (): string | null => {
  const state = store.getState().explorer;

  return state.current;
};
