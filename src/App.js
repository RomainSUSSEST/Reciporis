import React from 'react';
import './App.css';

import Cards from './components/Cards';
import Equipments from './components/Equipments';
import Chinq from './components/Chinq';

import cardIcon from './images/card-icon.png';
import equipmentsIcon from './images/equipments-icon.png';
import chinqIcon from './images/chinq-icon.png';

import cardsDB from './database/db.json';
import thingsDB from './database/items.json';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      showComponent: false,
      recipesDB: ""
     };
    this.changeComponent = this.changeComponent.bind(this);
  }

  changeComponent(e) {
    e.preventDefault();
    this.setState({
      showComponent: e.currentTarget.getAttribute("data-component")
    })
  }

  componentDidMount(){
    const request = new XMLHttpRequest();

        request.open("GET", "https://json.extendsclass.com/bin/9565f0b7634e", true);
        request.setRequestHeader('Security-key', 'RECIPORIS')
        request.onreadystatechange = () => {
            this.setState({
                recipesDB: request.responseText
            })
        };
        request.send();
  }

  render() {
    let renderingComponent;
    let cards = JSON.stringify(cardsDB);
    let things = JSON.stringify(thingsDB);

    if (this.state.showComponent !== false) {
      switch (this.state.showComponent) {
        case "Cards":
          renderingComponent = <Cards cards_json={cards} />
          break;
        case "Equipments":
          renderingComponent = <Equipments cards_json={things} />
          break;
        case "Chinq":
          renderingComponent = <Chinq cards_json={cards} equipments_json={things} recipes_json={this.state.recipesDB}/>
          break;
        default:
          console.log(`Sorry, we are out of ${this.state.showComponent}.`);
      }
    }

    return (
      <div className="App">
        <div className="header">
          <div onClick={this.changeComponent.bind(this)} data-component="Cards">
            <img src={cardIcon} alt="" />
          Cartes
        </div>
          <div onClick={this.changeComponent.bind(this)} data-component="Equipments">
            <img src={equipmentsIcon} alt="" />
          Un peu de tout
        </div>
          <div onClick={this.changeComponent.bind(this)} data-component="Chinq">
            <img src={chinqIcon} alt="" />
          Chinq
        </div>
        </div>
        <div className="content">
          {renderingComponent}
        </div>
      </div>
    );
  }
}

export default App;
