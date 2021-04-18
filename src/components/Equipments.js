import React from 'react';

class Equipments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            paginationIndex: 0,
            searched: '',
            searchedResults: [],
            RAW_CARDS: [],
            WAIT_INTERVAL: 1000,
            ENTER_KEY: 13,
            timer: null,
            PARSED_CARDS: [],
            cards_json: JSON.parse(this.props.cards_json)
        };
        this.changePage = this.changePage.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.triggerChange = this.triggerChange.bind(this);
    }

    componentDidMount() {
        const n = 24 //tweak this to add more items per line

        const y = new Array(Math.ceil(this.state.cards_json.length / n))
            .fill()
            .map(_ => this.state.cards_json.splice(0, n))

        let x = [];

        for (var i = 0; i < y.length; i++) {
            x = x.concat(y[i]);
        }

        this.setState({
            RAW_CARDS: x,
            PARSED_CARDS: y
        })
    }

    changePage(e) {
        e.preventDefault();
        this.setState({
            paginationIndex: parseInt(e.currentTarget.getAttribute("pagination-index"))
        })
    }

    handleChange() {
        clearTimeout(this.state.timer);

        let searchedValue = document.getElementById("searchbar").value;

        this.setState({ searched: searchedValue });

        if (searchedValue.length >= 3) {
            let result = this.state.RAW_CARDS.filter(function (item) {
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

        this.setState({
            timer: setTimeout(this.triggerChange, this.state.WAIT_INTERVAL)
        })
    }

    handleKeyDown(e) {
        if (e.keyCode === this.state.ENTER_KEY) {
            clearTimeout(this.state.timer)
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

        for (let index = 0; index < this.state.PARSED_CARDS.length; index++) {
            if ((index === 0 || index === this.state.PARSED_CARDS.length - 1) || (index >= this.state.paginationIndex - 2 && index <= this.state.paginationIndex + 2)) {

                if (index === this.state.paginationIndex) {
                    paginations.push(<div onClick={this.changePage.bind(this)} className="selected-pagination" pagination-index={index}>{index + 1}</div>)
                } else {
                    paginations.push(<div onClick={this.changePage.bind(this)} pagination-index={index}>{index + 1}</div>)
                }
            }
        }

        return (
            <div className="cards-content">
                <div className="cards-search">
                    <input
                        id="searchbar"
                        type="text"
                        placeholder="Nom du truc recherché"
                        value={this.state.searched}
                        onChange={this.handleChange.bind(this)}
                        onKeyDown={this.handleKeyDown.bind(this)}
                    />
                </div>
                <div className="cards-list">
                    {this.state.PARSED_CARDS.length > 0 && this.state.searchedResults.length <= 0 &&

                        this.state.PARSED_CARDS[this.state.paginationIndex].map((cards) => {
                            return (
                                <div className="card-details" key={cards.id}>
                                    <div className="card-image"><img src={require("../images/items/40/" + cards.id + ".png")["default"]} alt={cards.name} /></div>
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
                                    <div className="card-image"><img src={require("../images/items/40/" + cards.id + ".png")["default"]} alt={cards.name} /></div>
                                    <div className="card-content">
                                        <div className="card-name">{cards.name}</div>
                                        <div className="card-level">Level {cards.level}</div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                {this.state.PARSED_CARDS.length > 0 && this.state.searchedResults.length <= 0 &&

                    <div className="paginations">
                        {paginations}
                    </div>
                }
            </div>);
    }
}

export default Equipments;