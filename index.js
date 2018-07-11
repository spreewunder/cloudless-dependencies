// PouchDB dependencies
import PouchDB from 'pouchdb-browser';
import * as PouchDBErrors from 'pouchdb-errors';
import { adapterFun, clone } from 'pouchdb-utils';
import {
    binaryStringToBlobOrBuffer,
    binaryStringToArrayBuffer,
    blobOrBufferToBinaryString,
    blobOrBufferToBase64,
    base64StringToBlobOrBuffer,
    readAsBinaryString
} from 'pouchdb-binary-utils';

// Y-JS dependencies
import Y from 'yjs';
import extendUsingYMemory from 'y-memory';
import extendUsingYMap from 'y-map';
import extendUsingYArray from 'y-array';
import extendUsingYText from 'y-text';

// Additional dependencies (ES5)
import SocketIO from 'socket.io-client';
import EventEmitter from 'events';

const binUtils = {
    binaryStringToBlobOrBuffer,
    readAsBinaryString,
    binaryStringToArrayBuffer,
    blobOrBufferToBinaryString,
    blobOrBufferToBase64,
    base64StringToBlobOrBuffer
};

export {
    adapterFun,
    clone,
    binUtils,
    PouchDB,
    PouchDBErrors,

    extendUsingYArray,
    extendUsingYMap,
    extendUsingYMemory,
    extendUsingYText,
    Y,

    EventEmitter,
    SocketIO
}
