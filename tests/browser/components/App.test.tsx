import React from 'react';
import { create } from 'react-test-renderer';
import App from '@components/App';

jest.mock('react-hot-loader/root', () => ({
    hot: (App) => () =>
        (
            <div data-hot-loaded>
                <App />
            </div>
        )
}));

describe('<App />', () => {
    let component;

    function renderComponent() {
        component = create(<App />);
    }

    test('<App /> is rendered correctly with the hot loader', () => {
        renderComponent();

        expect(component).toMatchInlineSnapshot(`
            <div
              data-hot-loaded={true}
            >
              <h1>
                hello world ! 
                <span>
                  123
                </span>
              </h1>
            </div>
        `);
    });
});
