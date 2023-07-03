import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from "react-redux";
import { CartApi, ExampleApi } from '../../src/client/api';
import { Application } from '../../src/client/Application';
import { initStore } from '../../src/client/store';
import { renderApp } from './renderApp';

describe('Общие требования:', () => {
    it('В шапке отображаются ссылки на страницы магазина, а также ссылка на корзину', () => {
        const routes = ["/delivery" , "/catalog", "/contacts", "/cart"];
        const { getByRole } = renderApp();

        const navigation = getByRole("navigation");
        const navLinksHrefs = Object.values(navigation.querySelectorAll('.nav-link'))
            .filter(el => el.tagName === 'A')
            .map((link) => link?.getAttribute('href') || '');

        expect(routes.every((route) => navLinksHrefs.includes(route))).toBe(true);
    });

    it('Название магазина в шапке должно быть ссылкой на главную страницу', () => {
      const routes = ["/delivery" , "/catalog", "/contacts", "/cart"];
      const { getAllByRole } = renderApp();

      const homeLink = getAllByRole("link").find(
        (element) => element.textContent === 'Example store'
      );

      expect(homeLink?.getAttribute("href")).toBe("/");
  });
});
