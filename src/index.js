import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class TodoItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {editing: false}

    this.handleStatusChange = this.handleStatusChange.bind(this);
    this.handleRemoveNote = this.handleRemoveNote.bind(this);
    this.handleEnableEdit = this.handleEnableEdit.bind(this);

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  handleStatusChange(event) {
    this.props.todo.completed = event.target.checked;
    this.props.onTodoUpdate(this.props.todo);
  }

  handleRemoveNote(todo) {
    this.props.onTodoDelete(todo);
  }

  handleEnableEdit() {
    this.setState({
      editing: true
    });
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillMount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      if (this.newName.value) {
        this.props.todo.name = this.newName.value;
        this.props.onTodoUpdate(this.props.todo);
      }

      this.setState({
        editing: false
      });
    }
  }

  render() {
    const todo = this.props.todo;
    let classes = '';
    if (todo.completed) {
      classes += ' completed';
    }

    if (this.state.editing) {
      classes += ' editing';
    }

    return (
      <li className={classes} ref={this.setWrapperRef}>
        <div className="view">
          <input className="toggle" type="checkbox"
              defaultChecked={todo.completed}
              onChange={this.handleStatusChange} />
          <label onDoubleClick={this.handleEnableEdit}>{todo.name}</label>
          <button className="destroy"
              onClick={(e) => this.handleRemoveNote(todo)}></button>
        </div>
        <input className="edit" defaultValue={todo.name}
            ref={(input) => this.newName = input} />
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

    this.state = {
      filterType: this.props.filterType.toString().toLowerCase(),
      todos: this.props.todos
    }

    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleClearCompleted = this.handleClearCompleted.bind(this);
  }

  handleFilterChange(filterType) {
    this.setState({
      filterType: filterType
    });

    this.props.onFilterChange(filterType);
  }

  handleClearCompleted() {
    let newTodos = [];
    this.state.todos.forEach((todo) => {
      if (todo.completed) {
        console.log('Delete todo: ' + todo.name);
      } else {
        newTodos.push(todo);
      }
    });

    this.props.onClearCompleted(newTodos);
  }

  render() {
    const items_completed = this.state.todos.filter((todo => todo.completed === true));

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

    let btn_clear = '';
    if (items_completed.length) {
      btn_clear = <button className="clear-completed" onClick={this.handleClearCompleted}>Clear completed</button>
    }

    return (
      <footer className="footer">
        <span className="todo-count"><strong>{this.state.todos.length - items_completed.length}</strong> item left</span>
        <ul className="filters">{fitlers_render}</ul>
        {btn_clear}
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
            onFilterChange={this.handleFilterChange}
            onClearCompleted={this.handleTodosUpdate} />
      </section>
    );
  }
}


ReactDOM.render(
  <Todo />,
  document.getElementById('root')
);