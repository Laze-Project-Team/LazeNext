/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export type logLevel = 'log' | 'error' | 'warn' | 'info';

export type consoleLog = {
  type: 'log';
  content: string;
  timestamp: number;
  level: logLevel;
};

export type separator = {
  type: 'separator';
};

export interface consoleLogPayload {
  console: string;
  content: string;
  level: logLevel;
}

export type consolePanel = {
  label: string;
  log: (consoleLog | separator)[];
};

export type consoleState = {
  active: string;
  scrolled: boolean;
  console: Record<consoleState['active'], consolePanel>;
};

const initialState: consoleState = {
  active: 'master',
  scrolled: true,
  console: {
    master: {
      label: 'Master',
      log: [],
    },
  },
};

export type createPanelPayload = {
  id: string;
  label: string;
  active?: boolean;
};

export const LOG_LIMIT = 1000;

export const consoleSlice = createSlice({
  name: 'console',
  initialState,
  reducers: {
    addLog: (state, action: PayloadAction<consoleLogPayload>) => {
      if (Object.prototype.hasOwnProperty.call(state.console, action.payload.console)) {
        state.console[action.payload.console].log.push({
          type: 'log',
          content: action.payload.content,
          level: action.payload.level,
          timestamp: Date.now(),
        });

        if (state.console[action.payload.console].log.length > LOG_LIMIT) {
          state.console[action.payload.console].log.shift();
        }
      }
    },
    addSeparator: (state, action: PayloadAction<string>) => {
      state.console[action.payload].log.push({
        type: 'separator',
      });
    },
    setActive: (state, action: PayloadAction<string>) => {
      state.active = action.payload;
    },
    createPanel: (state, action: PayloadAction<createPanelPayload>) => {
      state.console[action.payload.id] = {
        label: action.payload.label,
        log: [],
      };
      if (action.payload.active ?? false) {
        state.active = action.payload.id;
      }
    },
    removePanel: (state, action: PayloadAction<string>) => {
      if (state.active === action.payload) {
        state.active = 'master';
      }
      delete state.console[action.payload];
    },
    setScrolled: (state, action: PayloadAction<boolean>) => {
      state.scrolled = action.payload;
    },
  },
});
