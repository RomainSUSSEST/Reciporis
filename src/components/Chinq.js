import React from 'react';

class Chinq extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            paginationIndex: 0,
            searched: '',
            searchedResults: [],
            WAIT_INTERVAL: 1000,
            ENTER_KEY: 13,
            timer: null,
            PARSED_CARDS: [],
            RAW_CARDS: [],
            RAW_EQUIPMENTS: [],
            PARSED_EQUIPMENTS: [],
            cards_json: JSON.parse(this.props.cards_json),
            equipments_json: JSON.parse(this.props.equipments_json),
            recipe: [null, null, null, null, null],
            active_card: -1,
            recipesDB: this.props.recipes_json
        };
        this.changePage = this.changePage.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.triggerChange = this.triggerChange.bind(this);
        this.selectCard = this.selectCard.bind(this);
        this.modifyRecipe = this.modifyRecipe.bind(this);
        this.resetCards = this.resetCards.bind(this);
        this.createRecipe = this.createRecipe.bind(this);
    }

    componentDidMount() {
        const n = 12 //tweak this to add more items per line

        const y = new Array(Math.ceil(this.state.cards_json.length / n))
            .fill()
            .map(_ => this.state.cards_json.splice(0, n))

        let x = [];

        for (var i = 0; i < y.length; i++) {
            x = x.concat(y[i]);
        }

        const a = new Array(Math.ceil(this.state.equipments_json.length / n))
            .fill()
            .map(_ => this.state.equipments_json.splice(0, n))

        let z = [];

        for (var i2 = 0; i < a.length; i2++) {
            z = z.concat(a[i2]);
        }

        this.setState({
            RAW_CARDS: x,
            PARSED_CARDS: y,
            RAW_EQUIPMENTS: a,
            PARSED_EQUIPMENTS: z
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
        });
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

    selectCard(e) {
        e.preventDefault();

        let active_card = e.currentTarget.getAttribute("data-image");

        let array = this.state.recipe;

        if (e.currentTarget.getAttribute("data-id")) {
            document.getElementById(active_card).setAttribute("data-id", "");
            array[active_card] = null;
        }

        for (let index = 0; index < document.getElementsByClassName("card-chinq").length; index++) {

            if (document.getElementsByClassName("card-chinq")[index].dataset.image === e.currentTarget.getAttribute("data-image")) {
                e.currentTarget.src = require("../images/empty_card_selected.png")["default"];
            } else {
                if (!this.state.recipe[index])
                    document.getElementsByClassName("card-chinq")[index].src = require("../images/empty_card.png")["default"];
            }
        }

        this.setState({
            active_card: e.currentTarget.getAttribute("data-image")
        })
    }

    modifyRecipe(e) {
        e.preventDefault();

        let array = this.state.recipe;

        if (e.currentTarget.getAttribute("data-id")) {
            array[this.state.active_card] = e.currentTarget.getAttribute("data-id");
            document.getElementById(this.state.active_card).setAttribute("data-id", e.currentTarget.getAttribute("data-id"));
        }

        this.setState({
            recipe: array
        })
    }

    resetCards() {

        for (let index = 0; index < document.getElementsByClassName("card-chinq").length; index++) {
            document.getElementById(index).setAttribute("data-id", "");
        }

        this.setState({
            recipe: [null, null, null, null, null],
            active_card: -1
        })
    }

    createRecipe() {

        if (!this.checkForDuplicates(this.state.recipe)) {
            let recipe = {
                name: "",
                recipe: this.state.recipe
            }

            let newRecipeDB = JSON.parse(this.state.recipesDB);

            newRecipeDB.push(recipe)

            let recipeJSON = JSON.stringify(newRecipeDB);

            const request = new XMLHttpRequest();

            request.open("PUT", "https://json.extendsclass.com/bin/9565f0b7634e", true);
            request.setRequestHeader('Security-key', 'RECIPORIS')
            request.onreadystatechange = () => {
            };
            request.send(recipeJSON);
        } else {
            alert("CARTES EN DOUBLON")
        }
    }

    checkForDuplicates(array) {
        return new Set(array).size !== array.length
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

        let img0 = this.state.recipe[0] ? require("../images/cards/" + this.state.recipe[0] + ".svg")["default"] : require("../images/empty_card.png")["default"];
        let img1 = this.state.recipe[1] ? require("../images/cards/" + this.state.recipe[1] + ".svg")["default"] : require("../images/empty_card.png")["default"];
        let img2 = this.state.recipe[2] ? require("../images/cards/" + this.state.recipe[2] + ".svg")["default"] : require("../images/empty_card.png")["default"];
        let img3 = this.state.recipe[3] ? require("../images/cards/" + this.state.recipe[3] + ".svg")["default"] : require("../images/empty_card.png")["default"];
        let img4 = this.state.recipe[4] ? require("../images/cards/" + this.state.recipe[4] + ".svg")["default"] : require("../images/empty_card.png")["default"];

        return (
            <div className="cards-content">
                <div className="cards-chinq">
                    <img id="0" className="card-chinq" src={img0} alt="" onClick={this.selectCard.bind(this)} data-image="0" data-id="" />
                    <img id="1" className="card-chinq" src={img1} alt="" onClick={this.selectCard.bind(this)} data-image="1" data-id="" />
                    <img id="2" className="card-chinq" src={img2} alt="" onClick={this.selectCard.bind(this)} data-image="2" data-id="" />
                    <img id="3" className="card-chinq" src={img3} alt="" onClick={this.selectCard.bind(this)} data-image="3" data-id="" />
                    <img id="4" className="card-chinq" src={img4} alt="" onClick={this.selectCard.bind(this)} data-image="4" data-id="" />
                </div>
                <div className="cards-tools">
                    {this.state.recipe[0] && this.state.recipe[1] && this.state.recipe[2] && this.state.recipe[3] && this.state.recipe[4] &&
                        <div className="btn-recipe recipe-clear" onClick={this.resetCards.bind()}>
                            Réinitialiser les cartes
                        </div>
                    }
                    {this.state.PARSED_CARDS.length > 0 && this.state.searchedResults.length <= 0 && this.state.active_card >= 0 &&
                        <div className="cards-search">
                            <input
                                id="searchbar"
                                type="text"
                                placeholder="Nom de la carte recherchée"
                                value={this.state.searched}
                                onChange={this.handleChange.bind(this)}
                                onKeyDown={this.handleKeyDown.bind(this)}
                            />
                        </div>
                    }
                    {this.state.recipe[0] && this.state.recipe[1] && this.state.recipe[2] && this.state.recipe[3] && this.state.recipe[4] &&
                        <div className="btn-recipe recipe-validate" onClick={this.createRecipe.bind(this)}>
                            Créer une nouvelle recette
                        </div>
                    }
                </div>
                <div className="cards-list">
                    {this.state.PARSED_CARDS.length > 0 && this.state.searchedResults.length <= 0 && this.state.active_card >= 0 &&

                        this.state.PARSED_CARDS[this.state.paginationIndex].map((cards) => {
                            return (
                                <div className="card-details" key={cards.id} onClick={this.modifyRecipe.bind(this)} data-id={cards.id}>
                                    <div className="card-image"><img src={require("../images/cards/" + cards.id + ".svg")["default"]} alt={cards.name} /></div>
                                    <div className="card-content">
                                        <div className="card-name">{cards.name}</div>
                                        <div className="card-level">Level {cards.level}</div>
                                    </div>
                                </div>
                            )
                        })
                    }
                    {this.state.searchedResults.length > 0 && this.state.active_card >= 0 &&

                        this.state.searchedResults.map((cards) => {
                            return (
                                <div className="card-details" key={cards.id} onClick={this.modifyRecipe.bind(this)} data-id={cards.id}>
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
                {this.state.PARSED_CARDS.length > 0 && this.state.searchedResults.length <= 0 && this.state.active_card >= 0 &&

                    <div className="paginations">
                        {paginations}
                    </div>
                }
            </div>);
    }
}

export default Chinq;