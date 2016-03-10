// setup jsdom for server-side testing
import jsdom from 'jsdom';
import chai from 'chai';
import chaiImmutable from 'chai-immutable';

const doc = jsdom.jsdom('<!doctype html><html><body><div id="admin"></div></body></html>');
const win = doc.defaultView;

global.document = doc;
global.window = win;

// Hoist window objects to node global objects
Object.keys(window).forEach((key) => {
  if (!(key in global)) {
    global[key] = window[key];
  }
});

chai.use(chaiImmutable);
