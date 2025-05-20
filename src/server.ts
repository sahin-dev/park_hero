
import config from './app/config'
import app from './app'
import { Server } from 'http';

let server:Server

async function main() {
  server = app.listen(config.port, () => {
    console.log("Server is running on port", config.port);
  })
}

main()