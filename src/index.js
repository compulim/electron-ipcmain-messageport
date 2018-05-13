import { hoistLegacyEventHandler, HTMLEventEmitter } from 'websocket-util';

export default class IPCMainMessagePort extends HTMLEventEmitter {
  constructor(ipcMain, { webContents }, channel) {
    super();

    this._backlog = [];
    this.channel = channel;
    this.ipcMain = ipcMain;
    this.webContents = webContents;

    this.handleMessage = this.handleMessage.bind(this);

    ipcMain.on(channel, this.handleMessage);

    this.on('message', event => {
      this._onmessage && this._onmessage(event);
    });
  }

  set onmessage(handler) {
    this._onmessage = handler;
    this.start();
  }

  close() {
    this.ipcMain.removeListener(this.channel, this.handleMessage);
  }

  handleMessage(event, arg) {
    const messageEvent = { data: arg, origin: 'ipc-main://./', source: this, type: 'message' };

    if (this._backlog) {
      this._backlog.push(messageEvent);
    } else {
      this.emit('message', messageEvent);
    }
  }

  postMessage(data) {
    // We don't support transferList

    this.webContents.send(this.channel, data);
  }

  start() {
    if (this._backlog) {
      this._backlog.forEach(event => this.emit('message', event));
      this._backlog = null;
    }
  }
}
