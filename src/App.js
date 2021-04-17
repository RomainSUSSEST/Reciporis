import React from 'react';
import './App.css';

import Cards from './components/Cards';
import Equipments from './components/Equipments';
import Chinq from './components/Chinq';

import cardIcon from './images/card-icon.png';
import equipmentsIcon from './images/equipments-icon.png';
import chinqIcon from './images/chinq-icon.png';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showComponent: false };
    this.changeComponent = this.changeComponent.bind(this);
  }

  changeComponent(e) {
    e.preventDefault();
    this.setState({
      showComponent: e.currentTarget.getAttribute("data-component")
    })
  }

  render() {
    let renderingComponent;

    if (this.state.showComponent !== false) {
      switch (this.state.showComponent) {
        case "Cards":
          renderingComponent = <Cards />
          break;
        case "Equipments":
          renderingComponent = <Equipments />
          break;
        case "Chinq":
          renderingComponent = <Chinq />
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
