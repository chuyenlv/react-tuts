import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class LoginControl extends React.Component {

  constructor(props) {
    super(props);

    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.state = {isLoggedIn: false, user: {firstName: "", lastName: ""}};
  }

  handleLoginClick() {
    this.setState({isLoggedIn: true, user: {firstName: "Chuyen", lastName: "Luu"}});
  }

  handleLogoutClick() {
    this.setState({isLoggedIn: false, user: {firstName: "", lastName: ""}});
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;

    let button = null;
    if (isLoggedIn) {
      button = <button onClick={this.handleLogoutClick}>Logout</button>;
    } else {
      button = <button onClick={this.handleLoginClick}>Login</button>;
    }

    let user = 'Anonymous';
    if (this.state.user.firstName || this.state.user.lastName) {
      if (!this.state.user.firstName) {
        user = this.state.user.lastName;
      }

      if (!this.state.user.lastName) {
        user = this.state.user.firstName;
      }

      user = this.state.user.firstName + ' ' + this.state.user.lastName;
    }

    return (
      <div>
        <h1>Hello, {user}!</h1>
        {button}
      </div>
    );
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
        <p>It is {this.state.date.toLocaleTimeString()}.</p>
      </div>
    )
  }
}

class ListItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {value: props.value}
  }


  render() {
    return <li>{this.state.value.toString()}</li>;
  }
}

class NumberList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {values: props.values}
  }


  render() {
    let listItems = this.state.values.map((val) => <ListItem key={val.toString()} value={val} />);
    return <ul>{listItems}</ul>;
  }
}

class FavoriteForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {firstName: "", lastName: "", isMale: false};

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({[name]: value});
  }

  handleSubmit(event) {
    console.log(this.state);
    event.preventDefault();
    this.setState({firstName: "", lastName: "", isMale: false});
  }

  render() {
    return (
      <form className="form" onSubmit={this.handleSubmit}>
        <div className="form-input">
          <label>First name</label>
          <input
            name="firstName"
            type="text"
            value={this.state.firstName}
            onChange={this.handleInputChange} />
        </div>

        <div className="form-input">
          <label>Last name</label>
          <input
            name="lastName"
            type="text"
            value={this.state.lastName}
            onChange={this.handleInputChange} />
        </div>

        <div className="form-input">
          <label>Male</label>
          <input
            name="isMale"
            type="checkbox"
            checked={this.state.isMale}
            onChange={this.handleInputChange} />
        </div>

        <div className="form-action">
          <input type="submit" value="Submit" />
        </div>
      </form>
    );
  }
}

const numbers = [1, 2, 3, 4, 5];

class App extends React.Component {
  render() {
    return (
      <main>
        <LoginControl />
        <Clock />
        <NumberList values={numbers} />
        <FavoriteForm />
      </main>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);