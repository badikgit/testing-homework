import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from "react-redux";
import { render } from '@testing-library/react';
import { CartApi, ExampleApi } from '../../src/client/api';
import { Application } from '../../src/client/Application';
import { initStore } from '../../src/client/store';

export function renderApp() {
  const basename = "/";
  const api = new ExampleApi(basename);
  const cart = new CartApi();
  const store = initStore(api, cart);
  const app = (
    <BrowserRouter basename={basename}>
      <Provider store={store}>
        <Application />
      </Provider>
    </BrowserRouter>
  );
  return render(app);
}
