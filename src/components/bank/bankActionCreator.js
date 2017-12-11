import constants from './constants';

const bankActionCreator = {
  /**
   * @param {number} amount to deposit
   */
  depositIntoAccount(amount) {
    return {
      type: constants.DEPOSIT_INTO_ACCOUNT,
      amount: amount
    };
  },

  /**
   * @param {number} amount to withdraw
   */
  withdrawIntoAccount(amount) {
    return {
      type: constants.WITHDRAW_FROM_ACCOUNT,
      amount: amount
    };
  }

};

export default bankActionCreator;