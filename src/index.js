'use strict';

import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import App from './components/app';

const hoge = () => {
  return {items: 'hoge'}
}

let store = createStore(hoge, {items: "ITEMS_INITIALIZED"} );
console.log(store.getState());

//let unsubscribe = store.subscribe(() => {
//  console.log(store.getState());
//});

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
