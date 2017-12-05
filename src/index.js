import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class TodoItem extends React.Component {
  render() {
    const todo = this.props.todo;
    let classes = todo.completed ? 'completed' : 'none';

    return (
      <li className={classes}>
        <div className="view">
          <input className="toggle" type="checkbox" defaultChecked={todo.completed} />
          <label>{todo.name}</label>
          <button className="destroy"></button>
        </div>
        <input className="edit" defaultValue={todo.name} />
      </li>
    );
  }
}

class TodoList extends React.Component {
  render() {
    const items = [];

    this.props.todos.forEach((todo) => {
      items.push(
        <TodoItem todo={todo} key={todo.id} />
      );
    });

    return (
      <section className="main">
        <input itemID="toggle-all" className="toggle-all" type="checkbox" />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul className="todo-list">{items}</ul>
      </section>
    );
  }
}

class TodoFilters extends React.Component {
  render() {
    const items_left = this.props.todos.filter((todo => todo.completed === false));

    return (
      <footer className="footer">
        <span className="todo-count"><strong>{items_left.length}</strong> item left</span>
        <ul className="filters">
          <li>
            <a className="selected" href="#/">All</a>
          </li>
          <li>
            <a href="#/active">Active</a>
          </li>
          <li>
            <a href="#/completed">Completed</a>
          </li>
        </ul>
        <button className="clear-completed">Clear completed</button>
      </footer>
    );
  }
}

class Todo extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      newTodo: '',
      lastId: 3,
      todos: this.props.todos
    }

    this.handleAddNew = this.handleAddNew.bind(this);
  }

  handleAddNew(e) {
    if (e.key === 'Enter') {
      console.log('Add new todo: ' + this.name.value);

      let newTodos = this.state.todos;
      newTodos.push({
        id: this.state.lastId + 1,
        name: this.name.value,
        completed: false
      });

      this.setState({todos: newTodos});
      this.setState({lastId: this.state.lastId + 1});

      this.name.value = '';
    }
  }

  render() {
    return (
      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <input className="new-todo"
              placeholder="What needs to be done?"
              onKeyPress={this.handleAddNew}
              ref={(input) => this.name = input} />
        </header>

        <TodoList todos={this.state.todos} />

        <TodoFilters todos={this.state.todos} />
      </section>
    );
  }
}


const TODOS = [
  {id: 1, name: 'Create a TodoMVC template', completed: true},
  {id: 2, name: 'Rule the web', completed: false},
  {id: 3, name: 'Thinking in ReactJs', completed: false}
];

ReactDOM.render(
  <Todo todos={TODOS} />,
  document.getElementById('root')
);