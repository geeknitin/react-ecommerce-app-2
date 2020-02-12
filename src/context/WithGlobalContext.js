import React from 'react';

import { ContextConsumer } from './GlobalContextProvider';

const withGlobalContext = WrappedComponent => props => (
  <ContextConsumer>
    {context => <WrappedComponent store={context} {...props} />}
  </ContextConsumer>
);

export default withGlobalContext;
