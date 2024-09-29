#!/usr/bin/env node
/* eslint-env node */
import express from 'express'
import http from 'http'
import { WebSocketServer } from 'ws'
import { logger } from './server/utils/logger'

async function main() {
  const envVars = (await import('./env')).default
  // start the internal web socket server
  import('./wss/index')

  const app = express()

  const mainAppServer = (await import('./server/index')).default

  app.use(mainAppServer)

  const server = http.createServer(app)

  const wss = new WebSocketServer({ server, path: '/websocket' })
  const { setupWebSocketServer } = await import('./wss/wss')
  setupWebSocketServer(wss)

  server.listen(Number(envVars.PORT), () => {
    logger.info(
      `📡 Interval Server listening at http://localhost:${envVars.PORT}`
    )
  })
}

main()
