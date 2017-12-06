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

    let params = {
      method: 'PATCH',
      body: JSON.stringify({
        completed: event.target.checked
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    }

    fetch(window.env.API_URL + '/todos/' + this.props.todo.id, params)
      .then((res) => {
        if (res.status === 200) {
          console.log('Update status of todo ' + this.props.todo.id);
        }
      });
  }

  handleRemoveNote(todo) {
    this.props.onTodoDelete(todo);
    fetch(window.env.API_URL + '/todos/' + todo.id, {method: 'DELETE'})
      .then((res) => {
        if (res.status === 200) {
          console.log('Delete todo ' + todo.id);
        }
      });
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
    if (this.wrapperRef && !this.wrapperRef.contains(event.target) && this.state.editing) {
      if (this.newName.value) {
        this.props.todo.title = this.newName.value;
        this.props.onTodoUpdate(this.props.todo);

        let params = {
          method: 'PATCH',
          body: JSON.stringify({
            title: this.newName.value
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
        }

        fetch(window.env.API_URL + '/todos/' + this.props.todo.id, params)
          .then((res) => {
            if (res.status === 200) {
              console.log('Update title of todo ' + this.props.todo.id);
            }
          });
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
          <label onDoubleClick={this.handleEnableEdit}>{todo.title}</label>
          <button className="destroy"
              onClick={(e) => this.handleRemoveNote(todo)}></button>
        </div>
        <input className="edit" defaultValue={todo.title}
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
        <input id="toggle-all" className="toggle-all" type="checkbox" />
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
      filterType: this.props.filterType.toString().toLowerCase()
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
    this.props.todos.forEach((todo) => {
      if (todo.completed) {
        fetch(window.env.API_URL + '/todos/' + todo.id, {method: 'DELETE'})
          .then((res) => {
            if (res.status === 200) {
              console.log('Delete todo ' + todo.id);
            }
          });
      } else {
        newTodos.push(todo);
      }
    });

    this.props.onClearCompleted(newTodos);
  }

  render() {
    const items_completed = this.props.todos.filter((todo => todo.completed === true));

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
        <span className="todo-count"><strong>{this.props.todos.length - items_completed.length}</strong> item left</span>
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
      todos: [],
      filter: 'all', // all, active and completed.
      userId: 1
    }

    this.handleAddNew = this.handleAddNew.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleTodosUpdate = this.handleTodosUpdate.bind(this);
  }

  handleAddNew(e) {
    if (e.key === 'Enter' && this.name.value) {
      let newTodos = this.state.todos;

      let todo = {
        title: this.name.value,
        completed: false,
        userId: this.state.userId
      }

      let params = {
        method: 'POST',
        body: JSON.stringify(todo),
        headers : {
          "Content-type": "application/json; charset=UTF-8"
        }
      }

      this.name.value = '';

      fetch(window.env.API_URL + '/todos', params)
        .then(res => res.json())
        .then((result) => {
          newTodos.push(result)
          this.setState({todos: newTodos});
        });
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

  componentDidMount() {
    fetch(window.env.API_URL + '/todos?userId=' + this.state.userId)
      .then(res => res.json())
      .then(
        (data) => {
          this.setState({
            todos: data
          });
        },
        (err) => {
          console.log('Fetch data wrong.');
        }
      );
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