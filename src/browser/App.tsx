import React from 'react';
import { hot } from 'react-hot-loader/root';
import Test from '@src/browser/Test';

const App = () => (
    <h1>
        Hello <Test />
    </h1>
);

export default hot(App);
