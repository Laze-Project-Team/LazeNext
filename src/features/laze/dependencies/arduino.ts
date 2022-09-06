import type { Laze } from '@/typings/laze';

type arduinoObjects = {
  port: SerialPort | null;
  serialReader: ReadableStreamDefaultReader<string> | null;
  lastCommand: {
    command: number;
    data: number;
  };
  receiveText: string;
  digitalInput: number[];
  analogInput: number[];
  pulseInput: number[];
};

export type importArduinoProps = {
  arduinoObjects: arduinoObjects;
  lazeCallNoParam: CallableFunction;
};

const checkImportArduinoProps = (arg: unknown): boolean => {
  const props = arg as importArduinoProps;

  return typeof props?.arduinoObjects === 'object' && typeof props?.lazeCallNoParam === ('object' || 'null');
};

const initialArduinoObjects: arduinoObjects = {
  port: null,
  serialReader: null,
  lastCommand: {
    command: -1,
    data: -1,
  },
  receiveText: '',
  digitalInput: new Array(100).fill(0),
  analogInput: new Array(100).fill(0),
  pulseInput: new Array(100).fill(0),
};

const importArduino = (p: unknown): WebAssembly.Imports => {
  if (!checkImportArduinoProps(p)) {
    throw new Error('The props in importArduino is not of type importArduinoProps.');
  }

  const props = p as importArduinoProps;

  return {
    arduino: {
      setUp: async (vendorId: bigint, index: number) => {
        const executeCallback = () => {
          if (props.lazeCallNoParam) {
            props.lazeCallNoParam(index);
          }
        };

        const { arduinoObjects } = props;
        if (!arduinoObjects.port) {
          arduinoObjects.port = await window.navigator.serial.requestPort({
            filters: [{ usbVendorId: Number(vendorId) }],
          });
          await arduinoObjects.port.open({ baudRate: 9600 });
          executeCallback();
          const decoder = new TextDecoderStream();
          arduinoObjects.port.readable?.pipeTo(decoder.writable);
          const inputStream = decoder.readable;
          arduinoObjects.serialReader = inputStream.getReader();
        } else {
          executeCallback();
        }
      },
      sendCommand: (command: number, data: number) => {
        const { arduinoObjects } = props;
        if (arduinoObjects.port) {
          if (arduinoObjects.lastCommand.command !== command || arduinoObjects.lastCommand.data !== data) {
            const writer = arduinoObjects.port.writable?.getWriter();
            if (writer) {
              writer.write(new Uint8Array([command]));
              writer.write(new Uint8Array([data]));
              writer.releaseLock();
              // console.log(command, data);
            } else {
              console.error('no writer');
            }
          }
          arduinoObjects.lastCommand.command = command;
          arduinoObjects.lastCommand.data = data;
        }
      },
      checkInput: async () => {
        const { arduinoObjects } = props;
        if (arduinoObjects.serialReader) {
          const { value } = await arduinoObjects.serialReader.read();
          const val = value?.replaceAll('\r', '');
          if (val && !val.includes('\n')) {
            arduinoObjects.receiveText += val;
          } else if (val?.includes('\n')) {
            arduinoObjects.receiveText += val;
            const splitData = arduinoObjects.receiveText.split('\n');

            for (let i = 0; i < splitData.length - 1; i++) {
              const receiveText = splitData[i];
              if (receiveText.length) {
                const input = parseInt(receiveText.substring(2));
                switch (receiveText[0]) {
                  case 'D':
                    arduinoObjects.digitalInput[parseInt(receiveText[1])] = input;
                    break;
                  case 'A':
                    arduinoObjects.analogInput[parseInt(receiveText[1])] = input;
                    break;
                  case 'P':
                    arduinoObjects.pulseInput[parseInt(receiveText[1])] = input;
                    break;
                }
              }
            }

            arduinoObjects.receiveText = splitData.slice(-1)[0];
          }
        }
      },
      analogRead: (pinNumber: bigint) => {
        return props.arduinoObjects.analogInput[Number(pinNumber)];
      },
      digitalRead: (pinNumber: bigint) => {
        return props.arduinoObjects.digitalInput[Number(pinNumber)];
      },
      distanceRead: (pinNumber: bigint) => {
        return props.arduinoObjects.pulseInput[Number(pinNumber)];
      },
    },
  };
};

export const arduinoModule: Laze.Module = {
  props: {
    lazeCallNoParam: null,
    arduinoObjects: initialArduinoObjects,
  },
  importFunc: importArduino,
};
