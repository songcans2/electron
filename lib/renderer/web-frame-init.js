'use strict'

const { webFrame } = require('electron')
const ipcRenderer = require('@electron/internal/renderer/ipc-renderer-internal')
const errorUtils = require('@electron/internal/common/error-utils')

module.exports = () => {
  // Call webFrame method
  ipcRenderer.on('ELECTRON_INTERNAL_RENDERER_WEB_FRAME_METHOD', (event, requestId, method, async, args) => {
    new Promise(resolve => {
      if (async) {
        webFrame[method](...args, resolve)
      } else {
        resolve(webFrame[method](...args))
      }
    }).then(result => {
      return [null, result]
    }, error => {
      return [errorUtils.serialize(error)]
    }).then(responseArgs => {
      event.sender.send(`ELECTRON_INTERNAL_BROWSER_WEB_FRAME_RESPONSE_${requestId}`, ...responseArgs)
    })
  })
}
