// PouchDB dependencies
import PouchDB from './node_modules/pouchdb-browser/lib/index.es.js';
import * as PouchDBErrors from './node_modules/pouchdb-errors/lib/index.es.js';
import { adapterFun } from './node_modules/pouchdb-utils/lib/index.es.js';

// Y-JS dependencies
import Y from './node_modules/yjs/y.js';

// Additional dependencies (ES5)
import SocketIO from './node_modules/socket.io-client/lib/index.js';
import EventEmitter from 'events';

export {
    adapterFun,
    PouchDB,
    PouchDBErrors,
    Y,
    EventEmitter,
    SocketIO
}
