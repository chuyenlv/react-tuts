import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import bankActionCreator from './bankActionCreator';

import './style.css';

export class BankApp extends Component {
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

BankApp.propTypes = {
  balance: PropTypes.number,
  onDeposit: PropTypes.func,
  onWithdraw: PropTypes.func
};


const mapStateToProps = state => {
  return state
}

const mapDispatchToProps = (dispatch) => {
  return {
    onDeposit: (amount) => dispatch(bankActionCreator.depositIntoAccount(amount)),
    onWithdraw: (amount) => dispatch(bankActionCreator.withdrawIntoAccount(amount))
  }
}

const BankAppContainer = connect(mapStateToProps, mapDispatchToProps)(BankApp);
export default BankAppContainer;