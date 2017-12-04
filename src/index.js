import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class FullForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.fname.value + ' ' + this.lname.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          First Name:
          <input type="text" ref={(input) => this.fname = input} />
        </label>
        <label>
          Last Name:
          <input type="text" ref={(input) => this.lname = input} />
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