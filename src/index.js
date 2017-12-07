import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Modal extends React.Component {
  render() {
    return (
      <div className="modal" data-status={this.props.status}>
        <div className="modal-left" style={{backgroundImage: "url(" + this.props.product.image + ")"}}>
          <span className="price-tag">{this.props.product.price}</span>
        </div>
        <div className="modal-right">
          <h2>{this.props.product.title}</h2>
          <p>{this.props.product.description}</p>
          <button onClick={this.props.onModalClickClose} className="close">
            <span className="fa fa-close"></span>
          </button>
        </div>
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {modal: false}
    this.modalToggle = this.modalToggle.bind(this);
  }

  modalToggle() {
    this.setState({modal: !this.state.modal});
  }

  render() {
    return (
      <div>
        <button className="place-order" onClick={this.modalToggle}>
          <span className="fa fa-shopping-cart"></span>
        </button>
        <Modal onModalClickClose={this.modalToggle} status={this.state.modal} product={PRODUCT} />
      </div>
    );
  }
}



const PRODUCT = {
  title: "Product title",
  image: "https://dummyimage.com/400x300",
  description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  price: "$99"
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)