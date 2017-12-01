import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {firstName: props.firstName, lastName: props.lastName}
  }

  render() {
    if (this.state.firstName || this.state.lastName) {
      if (!this.state.firstName) {
        return this.state.lastName;
      }

      if (!this.state.lastName) {
        return this.state.firstName;
      }

      return this.state.firstName + ' ' + this.state.lastName;
    }

    return 'Anonymous';
  }
}

class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello, <Welcome firstName="Chuyen" lastName="Luu" />!</h1>
        <p>It is {new Date().toLocaleTimeString()}.</p>
        <h1>Hello, <Welcome firstName="LC" />!</h1>
      </div>
    )
  }
}

function tick() {
  ReactDOM.render(
    <Clock />,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);