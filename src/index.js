import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import bankStore from './components/bank/bankStore';
import BankAppContainer from './components/bank/bankApp';

//import './index.css';


ReactDOM.render(
  <Provider store={bankStore}>
    <BankAppContainer />
  </Provider>,
  document.getElementById('root')
)