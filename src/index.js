import React from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import './index.css';

// using some little inline style helpers to make the app look okay
const grid = 8;
const getItemStyle = (draggableStyle, isDragging) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background color if dragging
  background: isDragging ? 'lightgreen' : 'white',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : '',
  padding: grid,
  width: 250,
});

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

class CardItem extends React.Component {
  render() {
    const item = this.props.item;

    return (
      <Draggable key={item.id} draggableId={item.id}>
        {(provided, snapshot) => (
          <div>
            <div
              ref={provided.innerRef}
              style={getItemStyle(
                provided.draggableStyle,
                snapshot.isDragging
              )}
              {...provided.dragHandleProps}
            >
              {item.name}
            </div>
            {provided.placeholder}
          </div>
        )}
      </Draggable>
    );
  }
}

class CardsList extends React.Component {
  render() {
    let items = [];
    this.props.cards.forEach(card => {
      items.push(
        <CardItem key={card.id} item={card} />
      );
    });

    return (
      <div className="droppable">
        <h4>{this.props.name}</h4>
        <Droppable droppableId={this.props.name}>
          {(provided, snapshot) => (
            <div className="list" ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
              {items}
              {provided.placeholder}
              <p>Drop card here</p>
            </div>
          )}
        </Droppable>
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: this.props.cards,
      groups: this.props.groups
    }
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    if (result.destination.droppableId === result.source.droppableId) {
      let from = this.state.cards.filter(item => {return item.group === result.destination.droppableId;});
      let fromOrder = reorder(from, result.source.index, result.destination.index);
      let ortherTo = this.state.cards.filter(item => {return item.group !== result.destination.droppableId;});

      this.setState({cards: [...fromOrder, ...ortherTo]});
    } else {
      this.state.cards.forEach(item => {
        if (item.id === result.draggableId) {
          item.group = result.destination.droppableId;
        }
      });

      let to = this.state.cards.filter(item => {return item.group === result.destination.droppableId;});
      let index = to.findIndex(item => item.id === result.draggableId);
      let toOrder = reorder(to, index, result.destination.index)
      let ortherTo = this.state.cards.filter(item => {return item.group !== result.destination.droppableId;});

      this.setState({cards: [...toOrder, ...ortherTo]});
    }
  }

  render() {
    let listCards = [];

    this.state.groups.forEach(groupName => {
      let tmp = this.state.cards.filter(item => {return item.group === groupName});
      listCards.push(
        <CardsList cards={tmp} name={groupName} key={groupName} />
      );
    });

    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <div className="board-cards">
          {listCards}
        </div>
      </DragDropContext>
    );
  }
}

const GROUPS = [
  'From',
  'To'
]

const CARDS = [
  {id: 'banana', name: 'Banana', group: 'From'},
  {id: 'mango', name: 'Mango', group: 'From'},
  {id: 'orange', name: 'Orange', group: 'From'},
  {id: 'apple', name: 'Apple', group: 'To'}
]

ReactDOM.render(
  <App cards={CARDS} groups={GROUPS} />,
  document.getElementById('root')
)