/**
 * @jest-environment jsdom
 */

import React from 'react';

const AppMock = () => <div>App</div>;
jest.mock('@components/App', () => AppMock);

describe('index | ', () => {
    let rootElement;

    function requireModule() {
        require('@browser/index.tsx');
    }

    beforeEach(() => {
        rootElement = document.createElement('div');
        rootElement.id = 'root';
        document.body.appendChild(rootElement);
    });

    test('the <App /> in rendered into the root element', () => {
        requireModule();

        expect(rootElement).toMatchInlineSnapshot(`
            <div
              id="root"
            >
              <div>
                App
              </div>
            </div>
        `);
    });
});
