// store.js
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import rootReducer from '../reducers';

const middlewares = [thunk];

// Only use logger in development
if (process.env.NODE_ENV === 'development') {
  middlewares.push(logger);
}

middlewares.push(logger);


const store = createStore(rootReducer, applyMiddleware(...middlewares));

export default store;
