import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class User extends React.Component {

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

  constructor(props) {
    super(props);
    this.state = {date: new Date()}
  }


  componentDidMount() {
    this.timeID = setInterval(() => this.tick(), 1000);
  }

  componentWillMount() {
    clearInterval(this.timeID)
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (
      <div>
        <h1>Hello, <User firstName="Chuyen" lastName="Luu" />!</h1>
        <p>It is {this.state.date.toLocaleTimeString()}.</p>
      </div>
    )
  }
}

class Toggle extends React.Component {

  constructor(props) {
    super(props);

    this.state = {isToggleOn: true}
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(preState => ({isToggleOn: !preState.isToggleOn}));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <main>
        <Clock />
        <Toggle />
      </main>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);