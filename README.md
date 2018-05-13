# electron-ipcmain-messageport

[![npm version](https://badge.fury.io/js/electron-ipcmain-messageport.svg)](https://badge.fury.io/js/electron-ipcmain-messageport) [![Build Status](https://travis-ci.org/compulim/electron-ipcmain-messageport.svg?branch=master)](https://travis-ci.org/compulim/electron-ipcmain-messageport)

Turns Electron [`IPCMain`](https://github.com/electron/electron/blob/master/docs/api/ipc-main.md) into [MessagePort](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort).

# Background

Instead of learning/using different API for different communication channels, we should unite them into a single interface pattern, either [MessagePort](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort) or [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket).

# How to use

```js
const { BrowserWindow, ipcMain } = require('electron');
const window = new BrowserWindow();
const messagePort = new IPCMainMessagePort(ipcMain, window, 'channel_name');

messagePort.on('message', event => {
  // Could be either a string or Buffer
  console.log(event.data);
};

messagePort.postMessage('Hello, World!');
```

Note: to match the paradigm of MessagePort, we do not support synchronous messages and callbacks.

# Contributions

Like us? [Star](https://github.com/compulim/electron-ipcmain-messageport/stargazers) us.

Want to make it better? [File](https://github.com/compulim/electron-ipcmain-messageport/issues) us an issue.

Don't like something you see? [Submit](https://github.com/compulim/electron-ipcmain-messageport/pulls) a pull request.
