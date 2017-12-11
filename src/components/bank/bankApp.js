import React, { Component } from 'react';
import PropTypes from 'prop-types';
import bankStore from './bankStore';
import constants from './constants';
import bankActionCreator from './bankActionCreator';

import './style.css';

class BankApp extends Component {
  handleDeposit() {
    this.props.onDeposit(this.refs.amount.value);
    this.refs.amount.value = '';
  }

  handleWithdraw() {
    this.props.onWithdraw(this.refs.amount.value);
    this.refs.amount.value = '';
  }

  render() {
    return (
      <div>
        <header>
          <img alt="Redux Bank" src="//www.pro-react.com/logos/redux-bank.svg" width="150" />Redux Bank
        </header>
        <h1>Your balance is ${(this.props.balance).toFixed(2)}</h1>
        <div className="atm">
          <input type="text" placeholder="Enter Ammount" ref="amount" />
          <button onClick={this.handleWithdraw.bind(this)}>Withdraw</button>
          <button onClick={this.handleDeposit.bind(this)}>Deposit</button>
        </div>
      </div>
    );
  }
}

BankApp.proType = {
  balance: PropTypes.number,
  onDeposit: PropTypes.func,
  onWithdraw: PropTypes.func
};


class BankAppContainer extends Component {
  constructor(props) {
    super(props);
    bankStore.dispatch({type: constants.CREATE_ACCOUNT});
    this.state = {
      balance: bankStore.getState().balance
    }
  }

  componentDidMount() {
    this.unsubscribe = bankStore.subscribe(() => this.setState({balance: bankStore.getState().balance}));
  }

  componentWillMount() {

  }

  render() {
    return (
      <BankApp balance={bankStore.getState().balance}
        onDeposit={(amount) => bankStore.dispatch(bankActionCreator.depositIntoAccount(amount))}
        onWithdraw={(amount) => bankStore.dispatch(bankActionCreator.withdrawIntoAccount(amount))}
      />
    );
  }
}
export default BankAppContainer;