import { EventEmitter } from 'events';

import IPCMainMessagePort from '.';

function setupMock() {
  const ipcMain = new EventEmitter();

  ipcMain.send = jest.fn();

  return {
    ipcMain,
    window: {
      webContents: { send: jest.fn() }
    }
  };
}

test('postMessage', () => {
  const { ipcMain, window } = setupMock();
  const messagePort = new IPCMainMessagePort(ipcMain, window, 'channel_name');

  messagePort.postMessage('Hello, World!');

  expect(window.webContents.send).toHaveBeenCalledTimes(1);
  expect(window.webContents.send).toHaveBeenCalledWith('channel_name', 'Hello, World!');
});

test('receive "message" event', () => {
  const { ipcMain, window } = setupMock();
  const messagePort = new IPCMainMessagePort(ipcMain, window, 'channel_name');
  const handleMessage = jest.fn();

  messagePort.on('message', handleMessage);
  ipcMain.emit('channel_name', {}, 'Hello, World!')

  expect(handleMessage).toHaveBeenCalledTimes(0);

  ipcMain.emit('channel_name', {}, 'Aloha!')

  messagePort.start();

  expect(handleMessage).toHaveBeenCalledTimes(2);
  expect(handleMessage.mock.calls[0][0]).toHaveProperty('data', 'Hello, World!');
  expect(handleMessage.mock.calls[0][0]).toHaveProperty('origin', 'ipc-main://./');
  expect(handleMessage.mock.calls[1][0]).toHaveProperty('data', 'Aloha!');
  expect(handleMessage.mock.calls[1][0]).toHaveProperty('origin', 'ipc-main://./');
});

test('"onmessage" handler', () => {
  const { ipcMain, window } = setupMock();
  const messagePort = new IPCMainMessagePort(ipcMain, window, 'channel_name');
  const handleMessage = jest.fn();

  messagePort.onmessage = handleMessage;

  ipcMain.emit('channel_name', {}, 'Hello, World!')

  expect(handleMessage).toHaveBeenCalledTimes(1);
  expect(handleMessage.mock.calls[0][0]).toHaveProperty('data', 'Hello, World!');
  expect(handleMessage.mock.calls[0][0]).toHaveProperty('origin', 'ipc-main://./');
});

test('close', () => {
  const { ipcMain, window } = setupMock();
  const messagePort = new IPCMainMessagePort(ipcMain, window, 'channel_name');
  const handleMessage = jest.fn();

  messagePort.onmessage = handleMessage;
  messagePort.close();

  ipcMain.emit('channel_name', {}, 'Hello, World!')

  expect(handleMessage).toHaveBeenCalledTimes(0);
});
