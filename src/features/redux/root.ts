import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { load, save } from 'redux-localstorage-simple';

import { consoleSlice } from '@/features/redux/console';
import { explorerSlice } from '@/features/redux/explorer';

const rootReducer = combineReducers({
  explorer: explorerSlice.reducer,
  console: consoleSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/ban-ts-comment */
export const store = configureStore({
  reducer: rootReducer,

  preloadedState: typeof window !== 'undefined' ? load() : undefined,
  middleware:
    typeof window !== 'undefined'
      ? (getDefaultMiddleware) => {
          return getDefaultMiddleware().concat(save());
        }
      : undefined,
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
