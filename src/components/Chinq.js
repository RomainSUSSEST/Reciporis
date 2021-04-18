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
            recipe_equipment_related: null,
            recipe: [null, null, null, null, null],
            active_card: -1,
            recipesDB: this.props.recipes_json,
            context: 0
        };
        this.changePage = this.changePage.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.triggerChange = this.triggerChange.bind(this);
        this.selectCard = this.selectCard.bind(this);
        this.modifyRecipe = this.modifyRecipe.bind(this);
        this.resetCards = this.resetCards.bind(this);
        this.createRecipe = this.createRecipe.bind(this);
        this.assignRecipe = this.assignRecipe.bind(this);
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

        const n2 = 12 //tweak this to add more items per line

        const y2 = new Array(Math.ceil(this.state.equipments_json.length / n2))
            .fill()
            .map(_ => this.state.equipments_json.splice(0, n2))

        let x2 = [];

        for (var i2 = 0; i2 < y2.length; i2++) {
            x2 = x2.concat(y2[i2]);
        }

        this.setState({
            RAW_CARDS: x,
            PARSED_CARDS: y,
            RAW_EQUIPMENTS: x2,
            PARSED_EQUIPMENTS: y2
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

            let context = this.state.RAW_CARDS;

            if (this.state.context !== 0) {
                context = this.state.RAW_EQUIPMENTS;
            }

            let result = context.filter(function (item) {
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

        if (this.state.searched !== searched) {
            this.handleChange(this)
        }

    }

    selectCard(e) {
        e.preventDefault();

        let active_card = e.currentTarget.getAttribute("data-image");

        let array = this.state.recipe;

        

        if (this.state.context === 0) {

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
        } else {

            if (e.currentTarget.getAttribute("data-id")) {
                document.getElementById(5).setAttribute("data-id", "");
            }

            if (document.getElementById(5).dataset.image === e.currentTarget.getAttribute("data-image")) {
                e.currentTarget.src = require("../images/empty_card_selected.png")["default"];
            } else {
                if (!this.state.recipe_equipment_related)
                    document.getElementById(5).src = require("../images/empty_card.png")["default"];
            }
        }

        this.setState({
            active_card: e.currentTarget.getAttribute("data-image")
        })
    }

    modifyRecipe(e) {
        e.preventDefault();

        if (this.state.context === 0) {
            let array = this.state.recipe;

            if (e.currentTarget.getAttribute("data-id")) {
                array[this.state.active_card] = e.currentTarget.getAttribute("data-id");
                document.getElementById(this.state.active_card).setAttribute("data-id", e.currentTarget.getAttribute("data-id"));
            }

            this.setState({
                recipe: array
            })
        } else {
            if (e.currentTarget.getAttribute("data-id")) {
                document.getElementById(this.state.active_card).setAttribute("data-id", e.currentTarget.getAttribute("data-id"));

                this.setState({
                    recipe_equipment_related: e.currentTarget.getAttribute("data-id")
                })
            }
        }

        document.getElementById("searchbar").value = "";
        this.handleChange();
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
                recipe_equipment_related: this.state.recipe_equipment_related,
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
            this.setState({
                context: 0,
                active_card: -1
            })
        }
    }

    assignRecipe() {
        this.setState({
            context: 1,
            active_card: -1
        })
    }

    checkForDuplicates(array) {
        return new Set(array).size !== array.length
    }

    render() {

        const paginations = [];

        let context = this.state.PARSED_CARDS;
        let pathToImages = "cards";
        let typeImages = ".svg";

        if (this.state.context !== 0) {
            context = this.state.PARSED_EQUIPMENTS;
            pathToImages = "items";
            typeImages = ".png";
        }

        for (let index = 0; index < context.length; index++) {
            if ((index === 0 || index === context.length - 1) || (index >= this.state.paginationIndex - 2 && index <= this.state.paginationIndex + 2)) {

                if (index === this.state.paginationIndex) {
                    paginations.push(<div onClick={this.changePage.bind(this)} className="selected-pagination" pagination-index={index}>{index + 1}</div>)
                } else {
                    paginations.push(<div onClick={this.changePage.bind(this)} pagination-index={index}>{index + 1}</div>)
                }
            }
        }

        let img0 = require("../images/empty_card.png")["default"];
        let img1 = require("../images/empty_card.png")["default"];
        let img2 = require("../images/empty_card.png")["default"];
        let img3 = require("../images/empty_card.png")["default"];
        let img4 = require("../images/empty_card.png")["default"];
        let img5 = require("../images/empty_card.png")["default"];

        if (this.state.context === 0) {
            img0 = this.state.recipe[0] ? require("../images/" + pathToImages + "/" + this.state.recipe[0] + typeImages)["default"] : require("../images/empty_card.png")["default"];
            img1 = this.state.recipe[1] ? require("../images/" + pathToImages + "/" + this.state.recipe[1] + typeImages)["default"] : require("../images/empty_card.png")["default"];
            img2 = this.state.recipe[2] ? require("../images/" + pathToImages + "/" + this.state.recipe[2] + typeImages)["default"] : require("../images/empty_card.png")["default"];
            img3 = this.state.recipe[3] ? require("../images/" + pathToImages + "/" + this.state.recipe[3] + typeImages)["default"] : require("../images/empty_card.png")["default"];
            img4 = this.state.recipe[4] ? require("../images/" + pathToImages + "/" + this.state.recipe[4] + typeImages)["default"] : require("../images/empty_card.png")["default"];
        } else {
            img5 = this.state.recipe_equipment_related ? require("../images/" + pathToImages + "/" + this.state.recipe_equipment_related + typeImages)["default"] : require("../images/empty_card.png")["default"];
        }

        return (
            <div className="cards-content">
                {this.state.context === 0 &&
                    <div className="cards-chinq">
                        <img id="0" className="card-chinq" src={img0} alt="" onClick={this.selectCard.bind(this)} data-image="0" data-id="" />
                        <img id="1" className="card-chinq" src={img1} alt="" onClick={this.selectCard.bind(this)} data-image="1" data-id="" />
                        <img id="2" className="card-chinq" src={img2} alt="" onClick={this.selectCard.bind(this)} data-image="2" data-id="" />
                        <img id="3" className="card-chinq" src={img3} alt="" onClick={this.selectCard.bind(this)} data-image="3" data-id="" />
                        <img id="4" className="card-chinq" src={img4} alt="" onClick={this.selectCard.bind(this)} data-image="4" data-id="" />
                    </div>
                }
                {this.state.context === 1 &&
                    <div className="cards-chinq">
                        <img id="5" className="card-chinq" src={img5} alt="" onClick={this.selectCard.bind(this)} data-image="5" data-id="" />
                    </div>
                }
                <div className="cards-tools">
                    {this.state.recipe[0] && this.state.recipe[1] && this.state.recipe[2] && this.state.recipe[3] && this.state.recipe[4] && this.state.context === 0 &&
                        <div className="btn-recipe recipe-clear" onClick={this.resetCards.bind()}>
                            Réinitialiser les cartes
                        </div>
                    }
                    {this.state.recipe[0] && this.state.recipe[1] && this.state.recipe[2] && this.state.recipe[3] && this.state.recipe[4] && this.state.context === 1 &&
                        <div className="btn-recipe recipe-clear" onClick={() => { this.setState({ context: 0, active_card: -1 }) }}>
                            Retourner à la recette
                        </div>
                    }
                    {this.state.PARSED_CARDS.length > 0 && this.state.searchedResults.length >= 0 && this.state.active_card >= 0 &&
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
                    {this.state.recipe[0] && this.state.recipe[1] && this.state.recipe[2] && this.state.recipe[3] && this.state.recipe[4] && this.state.context === 0 &&
                        <div className="btn-recipe recipe-validate" onClick={this.assignRecipe.bind(this)}>
                            Associer la recette à un truc
                        </div>
                    }
                    {this.state.recipe_equipment_related && this.state.context === 1 &&
                        <div className="btn-recipe recipe-validate" onClick={this.createRecipe.bind(this)}>
                            Créer une recette
                        </div>
                    }
                </div>
                <div className="cards-list">
                    {context.length > 0 && this.state.searchedResults.length <= 0 && this.state.active_card >= 0 &&

                        context[this.state.paginationIndex].map((cards) => {
                            return (
                                <div className="card-details" key={cards.id} onClick={this.modifyRecipe.bind(this)} data-id={cards.id}>
                                    <div className="card-image"><img src={require("../images/" + pathToImages + "/" + cards.id + typeImages)["default"]} alt={cards.name} /></div>
                                    <div className="card-content">
                                        <div className="card-name">{cards.name}</div>
                                        <div className="card-level">Level {cards.level}</div>
                                    </div>
                                </div>
                            )
                        })
                    }
                    {this.state.searchedResults.length > 0 && this.state.active_card >= 0 && this.state.active_card >= 0 &&

                        this.state.searchedResults.map((cards) => {
                            return (
                                <div className="card-details" key={cards.id} onClick={this.modifyRecipe.bind(this)} data-id={cards.id}>
                                    <div className="card-image"><img src={require("../images/" + pathToImages + "/" + cards.id + typeImages)["default"]} alt={cards.name} /></div>
                                    <div className="card-content">
                                        <div className="card-name">{cards.name}</div>
                                        <div className="card-level">Level {cards.level}</div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                {context.length > 0 && this.state.searchedResults.length <= 0 && this.state.active_card >= 0 &&

                    <div className="paginations">
                        {paginations}
                    </div>
                }
            </div>);
    }
}

export default Chinq;