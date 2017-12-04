import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Include jQuery and other plugins.
import $ from 'jquery';
window.jQuery = $
require('chosen-js');
require('chosen-js/chosen.min.css');

class Chosen extends React.Component {

  componentDidMount() {
    this.$el = $(this.el);
    this.$el.chosen();
  }

  componentWillUnmount() {
    this.$el.chosen('destroy');
  }

  render() {
    return (
      <div>
        <select className="chosen-choices"
          ref={(el) => this.el = el}
          defaultValue={this.props.optionSelected}>
          {this.props.children}
        </select>
      </div>
    );
  }
}

class FullForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    console.log(this);
    alert('A name was submitted: ' + this.fname.value + ' ' + this.lname.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <Chosen optionSelected="US">
          <option value="VN">Vietnam</option>
          <option value="CN">China</option>
          <option value="US">USA</option>
          <option value="UK">UK</option>
        </Chosen>
        <label>
          First Name:
          <input defaultValue="React" type="text" ref={(input) => this.fname = input} />
        </label>
        <label>
          Last Name:
          <input defaultValue="App" type="text" ref={(input) => this.lname = input} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

ReactDOM.render(
  <FullForm />,
  document.getElementById('root')
);