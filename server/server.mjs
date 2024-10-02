import { Server } from "@hocuspocus/server";
import { SQLite } from "@hocuspocus/extension-sqlite";

const server = Server.configure({
  extensions: [
    new SQLite({
      database: "./db/db.sqlite",
    }),
  ],
});

server.listen();