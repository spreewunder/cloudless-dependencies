// PouchDB dependencies
import PouchDB from "pouchdb-browser/lib/index.es.js";
import * as PouchDBErrors from "pouchdb-errors/lib/index.es.js";
import { adapterFun } from "pouchdb-utils/lib/index.es.js";

// Y-JS dependencies
import Y from "yjs";

// Additional dependencies (ES5)
import SocketIO from "socket.io-client";
import EventEmitter from "events";

export { adapterFun, PouchDB, PouchDBErrors, Y, EventEmitter, SocketIO };
