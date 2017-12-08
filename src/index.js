import React from 'react';
import ReactDOM from 'react-dom';
import { Draggable, Droppable } from 'react-drag-and-drop'

import './index.css';


class CardItem extends React.Component {
  render() {
    return (
      <Draggable type="card" data={this.props.item.id}><li>{this.props.item.name}</li></Draggable>
    );
  }
}

class CardsList extends React.Component {
  onDrop(data) {
    this.props.onDnD(data.card, this.props.name);
  }

  render() {
    let items = [];
    this.props.cards.forEach(card => {
      items.push(
        <CardItem key={card.id} item={card} />
      );
    });

    return (
      <Droppable
        types={['card']}
        onDrop={this.onDrop.bind(this)}>
        <div className="list-cards">
          <h2>{this.props.name}</h2>
          <ul className="cards dropable">{items}</ul>
        </div>
      </Droppable>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleDnD = this.handleDnD.bind(this);
  }

  handleDnD(id, group) {
    let newCards = [];
    this.props.cards.forEach((card) => {
      if (card.id === id) {
        card.group = group;
      }

      newCards.push(card);
    });

    this.setState({
      cards: newCards
    });
  }

  render() {
    let cards = this.props.cards.sort((a, b) => {
      if (a.group < b.group)
        return -1
      if (a.group > b.group)
        return 1
      return 0
    });

    let listCards = [];
    let tmp = [];
    let lastGroup = null;
    cards.forEach((card) => {
      if (lastGroup !== card.group) {
        if (tmp.length) {
          listCards.push(
            <CardsList cards={tmp} name={lastGroup} key={lastGroup} onDnD={this.handleDnD} />
          );
        }
        tmp = [];
      }

      lastGroup = card.group;

      tmp.push(card);
    });

    if (lastGroup) {
      listCards.push(
        <CardsList cards={tmp} name={lastGroup} key={lastGroup} onDnD={this.handleDnD} />
      );
    }

    return (
      <div className="board-cards">
        {listCards}
      </div>
    );
  }
}



const CARDS = [
  {id: 'banana', name: 'Banana', group: 'From'},
  {id: 'apple', name: 'Apple', group: 'To'},
  {id: 'mango', name: 'Mango', group: 'From'},
  {id: 'orange', name: 'Orange', group: 'From'}
]

ReactDOM.render(
  <App cards={CARDS} />,
  document.getElementById('root')
)