import React from 'react';
import cards_json from '../database/db.json';

const n = 24 //tweak this to add more items per line

const PARSED_CARDS = new Array(Math.ceil(cards_json.length / n))
    .fill()
    .map(_ => cards_json.splice(0, n))

let x = [];

for (var i = 0; i < PARSED_CARDS.length; i++) {
    x = x.concat(PARSED_CARDS[i]);
}

const RAW_CARDS = x;

const WAIT_INTERVAL = 1000;
const ENTER_KEY = 13;

let timer = null;

class Cards extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            paginationIndex: 0,
            searched: '',
            searchedResults: []
        };
        this.changePage = this.changePage.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.triggerChange = this.triggerChange.bind(this);
    }

    changePage(e) {
        e.preventDefault();
        this.setState({
            paginationIndex: parseInt(e.currentTarget.getAttribute("pagination-index"))
        })
    }

    handleChange() {
        clearTimeout(timer);

        let searchedValue = document.getElementById("searchbar").value;

        this.setState({ searched: searchedValue });

        if (searchedValue.length >= 3) {
            let result = RAW_CARDS.filter(function (item) {
                if (item.name.toLowerCase().includes(searchedValue.toLowerCase())) {
                    return item
                } else {
                    return null
                }
            });

            this.setState({ searchedResults: result })
        } else {
            this.setState({ searchedResults: [] })
        }

        timer = setTimeout(this.triggerChange, WAIT_INTERVAL);
    }

    handleKeyDown(e) {
        if (e.keyCode === ENTER_KEY) {
            clearTimeout(timer)
            this.triggerChange.bind()
        }
    }

    triggerChange() {
        const searched = this.state.searched;

        if (this.state.searched !== searched)
            this.handleChange(this)
    }

    render() {

        const paginations = [];

        for (let index = 0; index < PARSED_CARDS.length; index++) {
            if((index === 0 || index ===  PARSED_CARDS.length-1) || (index >= this.state.paginationIndex-2 && index <= this.state.paginationIndex+2)){

                if(index === this.state.paginationIndex) {
                    paginations.push(<div onClick={this.changePage.bind(this)} className="selected-pagination" pagination-index={index}>{index + 1}</div>)
                } else {
                    paginations.push(<div onClick={this.changePage.bind(this)} pagination-index={index}>{index + 1}</div>)
                }
            }
        }
        
        return (
            <div className="cards-content">
                <div className="cards-tools">
                    <input
                        id="searchbar"
                        type="text"
                        placeholder="Nom de la carte recherchée"
                        value={this.state.searched}
                        onChange={this.handleChange.bind(this)}
                        onKeyDown={this.handleKeyDown.bind(this)}
                    />
                </div>
                <div className="cards-list">
                    {PARSED_CARDS.length > 0 && this.state.searchedResults.length <= 0 &&

                        PARSED_CARDS[this.state.paginationIndex].map((cards) => {
                            return (
                                <div className="card-details" key={cards.id}>
                                    <div className="card-image"><img src={require("../images/cards/" + cards.id + ".svg")["default"]} alt={cards.name} /></div>
                                    <div className="card-content">
                                        <div className="card-name">{cards.name}</div>
                                        <div className="card-level">Level {cards.level}</div>
                                    </div>
                                </div>
                            )
                        })
                    }
                    {this.state.searchedResults.length > 0 &&

                        this.state.searchedResults.map((cards) => {
                            return (
                                <div className="card-details" key={cards.id}>
                                    <div className="card-image"><img src={require("../images/cards/" + cards.id + ".svg")["default"]} alt={cards.name} /></div>
                                    <div className="card-content">
                                        <div className="card-name">{cards.name}</div>
                                        <div className="card-level">Level {cards.level}</div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                {PARSED_CARDS.length > 0 && this.state.searchedResults.length <= 0 &&

                    <div className="paginations">
                        {paginations}
                    </div>
                }
            </div>);
    }
}

export default Cards;