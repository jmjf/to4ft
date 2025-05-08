// This script registers ts-node as a loader for Node so we can use the officially recommended
// syntax and avoid experimental loaders.
// node --import ./tsnode-esm.mjs --enable-source-maps --env-file=.env.dev src/server.ts

import { register } from 'node:module';
import { pathToFileURL } from 'node:url';
register('ts-node-maintained/esm', pathToFileURL('./'));
