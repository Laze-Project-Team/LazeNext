import { listen } from '@codingame/monaco-jsonrpc';
import type { MessageConnection, MonacoLanguageClient } from '@codingame/monaco-languageclient';
import type Monaco from 'monaco-editor-core';
import ReconnectingWebSocket from 'reconnecting-websocket';

const createLanguageClient = async (connection: MessageConnection): Promise<MonacoLanguageClient> => {
  const { MonacoLanguageClient, ErrorAction, CloseAction, createConnection } = await import(
    '@codingame/monaco-languageclient'
  );
  return new MonacoLanguageClient({
    name: 'Sample Language Client',
    clientOptions: {
      // use a language id as a document selector
      documentSelector: ['laze'],
      // disable the default error handler
      errorHandler: {
        error: () => {
          return ErrorAction.Continue;
        },
        closed: () => {
          return CloseAction.DoNotRestart;
        },
      },
    },
    // create a language client connection from the JSON RPC connection on demand
    connectionProvider: {
      get: (errorHandler, closeHandler) => {
        return Promise.resolve(createConnection(connection, errorHandler, closeHandler));
      },
    },
  });
};

const createWebSocket = (url: string): WebSocket => {
  const socketOptions = {
    maxReconnectionDelay: 10000,
    minReconnectionDelay: 1000,
    reconnectionDelayGrowFactor: 1.3,
    connectionTimeout: 10000,
    maxRetries: Infinity,
    debug: false,
  };
  return new ReconnectingWebSocket(url, [], socketOptions) as WebSocket;
};

export const initializeLSP = async (monaco: typeof Monaco): Promise<void> => {
  if (typeof MonacoEnvironment !== 'undefined') {
    MonacoEnvironment.getWorkerUrl = () => {
      return './editor.worker.bundle.js';
    };
  }

  const { MonacoServices } = await import('@codingame/monaco-languageclient');

  // install Monaco language client services
  MonacoServices.install(monaco);

  // create the web socket
  const url = 'ws://localhost:8000/sampleServer';
  const webSocket = createWebSocket(url);
  // listen when the web socket is opened
  listen({
    webSocket,
    onConnection: async (connection) => {
      // create and start the language client
      const languageClient = await createLanguageClient(connection);
      const disposable = languageClient.start();
      connection.onClose(() => {
        return disposable.dispose();
      });
    },
  });
};
