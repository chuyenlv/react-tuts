import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class TodoItem extends React.Component {
  constructor(props) {
    super(props);

    this.handleStatusChange = this.handleStatusChange.bind(this);
    this.handleRemoveNote = this.handleRemoveNote.bind(this);
  }

  handleStatusChange(event) {
    this.props.todo.completed = event.target.checked;
    this.props.onTodoUpdate(this.props.todo);
  }

  handleRemoveNote(todo) {
    this.props.onTodoDelete(todo);
  }

  render() {
    const todo = this.props.todo;
    let classes = todo.completed ? 'completed' : 'none';

    return (
      <li className={classes}>
        <div className="view">
          <input className="toggle" type="checkbox"
              defaultChecked={todo.completed}
              onChange={this.handleStatusChange} />
          <label>{todo.name}</label>
          <button className="destroy"
              onClick={(e) => this.handleRemoveNote(todo)}></button>
        </div>
        <input className="edit" defaultValue={todo.name} />
      </li>
    );
  }
}

class TodoList extends React.Component {
  constructor(props) {
    super(props);
    this.handleTodoStatusChange = this.handleTodoStatusChange.bind(this);
    this.handleTodoDelete = this.handleTodoDelete.bind(this);
  }

  handleTodoStatusChange(todo) {
    let todos = [];
    this.props.todos.forEach((item) => {
      if (item.id === todo.id) {
        todos.push(todo);
      } else {
        todos.push(item);
      }
    });

    this.props.onTodosUpdate(todos);
  }

  handleTodoDelete(todo) {
    let todos = [];
    this.props.todos.forEach((item) => {
      if (item.id !== todo.id) {
        todos.push(item);
      }
    });

    this.props.onTodosUpdate(todos);
  }

  render() {
    const filterType = this.props.fitlerType.toString().toLowerCase();
    const items = [];

    this.props.todos.forEach((todo) => {
      if (filterType === 'all') {
        items.push(
          <TodoItem todo={todo} key={todo.id}
              onTodoUpdate={this.handleTodoStatusChange}
              onTodoDelete={this.handleTodoDelete} />
        );
      } else {
        if (filterType === 'active' && !todo.completed) {
          items.push(
            <TodoItem todo={todo} key={todo.id}
                onTodoUpdate={this.handleTodoStatusChange}
                onTodoDelete={this.handleTodoDelete} />
          );
        }

        if (filterType === 'completed' && todo.completed) {
          items.push(
            <TodoItem todo={todo} key={todo.id}
                onTodoUpdate={this.handleTodoStatusChange}
                onTodoDelete={this.handleTodoDelete} />
          );
        }
      }
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
  constructor(props) {
    super(props);

    this.state = {filterType: this.props.filterType.toString().toLowerCase()}

    this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  handleFilterChange(filterType) {
    this.setState({
      filterType: filterType
    });

    this.props.onFilterChange(filterType);
  }

  render() {
    const items_left = this.props.todos.filter((todo => todo.completed === false));

    let filters = [
      {id: 'all', text: 'All'},
      {id: 'active', text: 'Active'},
      {id: 'completed', text: 'Completed'}
    ];

    let fitlers_render = [];
    let filter_class = '';
    filters.forEach((filter) => {
      filter_class = '';
      if (filter.id === this.state.filterType) {
        filter_class = 'selected';
      }

      fitlers_render.push(
        <li key={filter.id}>
          <a className={filter_class} href="/"
              onClick={(e) => {e.preventDefault(); this.handleFilterChange(filter.id)}}>{filter.text}</a>
        </li>
      );
    });

    return (
      <footer className="footer">
        <span className="todo-count"><strong>{items_left.length}</strong> item left</span>
        <ul className="filters">{fitlers_render}</ul>
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
      lastId: 1,
      todos: [],
      filter: 'all' // all, active and completed.
    }

    this.handleAddNew = this.handleAddNew.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleTodosUpdate = this.handleTodosUpdate.bind(this);
  }

  handleAddNew(e) {
    if (e.key === 'Enter') {
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

  handleFilterChange(filterType) {
    this.setState({
      filter: filterType
    });
  }

  handleTodosUpdate(newTodos) {
    this.setState({
      todos: newTodos
    });
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

        <TodoList todos={this.state.todos}
            fitlerType={this.state.filter}
            onTodosUpdate={this.handleTodosUpdate} />

        <TodoFilters todos={this.state.todos}
            filterType={this.state.filter}
            onFilterChange={this.handleFilterChange} />
      </section>
    );
  }
}


ReactDOM.render(
  <Todo />,
  document.getElementById('root')
);