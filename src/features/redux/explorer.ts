/* eslint-disable @typescript-eslint/no-unsafe-call */
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { direntType } from '@/typings/directory';

interface explorerDirent extends direntType {
  isRenaming: boolean;
}

export type ExplorerState = {
  current: string | null;
  compiled: boolean;
  directory: Record<string, explorerDirent>;
};

const initialState: ExplorerState = {
  current: null,
  compiled: false,
  directory: {},
};

export type direntPayload = {
  path: string;
};

export type renameDirentPayload = {
  oldPath: string;
  newPath: string;
};

export type saveFilePayload = {
  content: string;
};

export const explorerSlice = createSlice({
  name: 'explorer',
  initialState,
  reducers: {
    createFile: (state, action: PayloadAction<direntPayload>) => {
      state.directory[action.payload.path] = {
        type: 'file',
        content: '',
        isRenaming: true,
      };
    },
    createFolder: (state, action: PayloadAction<direntPayload>) => {
      state.directory[action.payload.path] = {
        type: 'folder',
        isRenaming: true,
      };
    },
    openFile: (state, action: PayloadAction<direntPayload>) => {
      state.current = action.payload.path;
      window.laze.props.variables.compiled = false;
    },
    closeFile: (state) => {
      state.current = null;
    },
    saveFile: (state, action: PayloadAction<saveFilePayload>) => {
      if (state.current) {
        state.directory[state.current].content = action.payload.content;

        window.laze.props.variables.compiled = false;
      }
    },
    renameDirent: (state, action: PayloadAction<renameDirentPayload>) => {
      const rename = (oldPath: string, newPath: string) => {
        if (state.directory[oldPath]) {
          state.directory[newPath] = state.directory[oldPath];
          delete state.directory[oldPath];
        }
      };
      const { oldPath, newPath } = action.payload;

      if (state.directory[oldPath]) {
        state.directory[oldPath].isRenaming = false;
      }

      if (oldPath !== newPath) {
        if (state.current === oldPath) {
          state.current = newPath;
        }

        if (state.directory[oldPath].type === 'folder') {
          for (let i = 0; i < Object.keys(state.directory).length; i++) {
            const path = Object.keys(state.directory)[i];
            if (path.startsWith(`${oldPath}/`)) {
              rename(path, path.replace(`${oldPath}/`, newPath));
            }
          }
        }

        rename(oldPath, newPath);
      }
    },
    startRenaming: (state, action: PayloadAction<direntPayload>) => {
      state.directory[action.payload.path].isRenaming = true;
    },
    stopRenaming: (state, action: PayloadAction<direntPayload>) => {
      state.directory[action.payload.path].isRenaming = false;
    },
    deleteDirent: (state, action: PayloadAction<direntPayload>) => {
      if (action.payload.path === state.current) {
        state.current = null;
      }

      delete state.directory[action.payload.path];
    },
    setDirectory: (state, action: PayloadAction<ExplorerState['directory']>) => {
      state.current = initialState.current;
      state.compiled = initialState.compiled;
      state.directory = action.payload;
    },
  },
});
