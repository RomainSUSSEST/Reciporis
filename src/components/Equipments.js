import React from 'react';

class Equipments extends React.Component {
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
            card_opened: false,
            selected_recipes: []
        };
        this.changePage = this.changePage.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.triggerChange = this.triggerChange.bind(this);
        this.searchRecipe = this.searchRecipe.bind(this);
    }

    componentDidMount() {
        const n = 20 //tweak this to add more items per line

        const y = new Array(Math.ceil(this.state.equipments_json.length / n))
            .fill()
            .map(_ => this.state.equipments_json.splice(0, n))

        let x = [];

        for (var i = 0; i < y.length; i++) {
            x = x.concat(y[i]);
        }

        this.setState({
            RAW_EQUIPMENTS: x,
            PARSED_EQUIPMENTS: y
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
            let result = this.state.RAW_EQUIPMENTS.filter(function (item) {
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

    searchRecipe(e) {
        e.preventDefault();

        const parsedRecipes = JSON.parse(this.props.recipes_json);
        const recipes = parsedRecipes.filter(element => element.recipe_equipment_related === e.currentTarget.getAttribute("data-id"));
        let recipe = [];

        if (recipes.length > 0) {

            for (let index = 0; index < recipes.length; index++) {
                let x = [];
                for (let index2 = 0; index2 < recipes[index].recipe.length; index2++) {

                    x.push(this.state.cards_json.find(element => element.id === parseInt(recipes[index].recipe[index2])))
                }

                recipe.push(x)
            }

            this.setState({
                card_opened: true,
                selected_recipes: recipe
            })
        } else {
            this.setState({ 
                card_opened: false, 
                selected_recipes: [] 
            })
        }
    }

    checkRecipeNumber(id) {
        console.log(id)
        const parsedRecipes = JSON.parse(this.props.recipes_json);
        const recipes = parsedRecipes.filter(element => element.recipe_equipment_related === id.toString());

        return recipes.length
    }

    render() {

        const paginations = [];

        for (let index = 0; index < this.state.PARSED_EQUIPMENTS.length; index++) {
            if ((index === 0 || index === this.state.PARSED_EQUIPMENTS.length - 1) || (index >= this.state.paginationIndex - 2 && index <= this.state.paginationIndex + 2)) {

                if (index === this.state.paginationIndex) {
                    paginations.push(<div onClick={this.changePage.bind(this)} className="selected-pagination" pagination-index={index}>{index + 1}</div>)
                } else {
                    paginations.push(<div onClick={this.changePage.bind(this)} pagination-index={index}>{index + 1}</div>)
                }
            }
        }

        if (this.state.selected_recipes) {

            console.log(this.state.selected_recipes)
        }

        return (
            <div className="cards-content">
                {this.state.card_opened === false &&

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
                }
                <div className={this.state.card_opened ? "cards-list-recipes" : "cards-list"}>
                    <div className={this.state.card_opened === true ? "btn-return" : "hide"} onClick={this.searchRecipe.bind(this)}>Retourner à la liste</div>
                    {this.state.card_opened === true &&
                        this.state.selected_recipes.map((recipe) => {
                            return (
                                <div className="card-details">
                                    {
                                        recipe.map((recipe2) => {
                                            return (
                                                <div className="card-details">
                                                    <div className="card-image"><img src={require("../images/cards/" + recipe2.id + ".svg")["default"]} alt={recipe2.name} /></div>
                                                    <div className="card-content">
                                                        <div className="card-name">{recipe2.name}</div>
                                                        <div className="card-level">Level {recipe2.level}</div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                </div>
                            )
                        })
                    }
                    {this.state.PARSED_EQUIPMENTS.length > 0 && this.state.searchedResults.length <= 0 && this.state.card_opened === false &&

                        this.state.PARSED_EQUIPMENTS[this.state.paginationIndex].map((cards) => {
                            return (
                                <div className="card-details" key={cards.id} onClick={this.searchRecipe.bind(this)} data-id={cards.id}>
                                    <div className="card-image"><img src={require("../images/items/" + cards.id + ".png")["default"]} alt={cards.name} /></div>
                                    <div className="card-content">
                                        <div className="card-name">{cards.name}</div>
                                        <div className="card-level">Level {cards.level}</div>
                                        <div className={this.checkRecipeNumber(cards.id) > 0 ? "card-recipes" : "hide"} >{this.checkRecipeNumber(cards.id)} combinaison(s)</div>
                                    </div>
                                </div>
                            )
                        })
                    }
                    {this.state.searchedResults.length > 0 && this.state.card_opened === false &&

                        this.state.searchedResults.map((cards) => {
                            return (
                                <div className="card-details" key={cards.id} onClick={this.searchRecipe.bind(this)} data-id={cards.id}>
                                    <div className="card-image"><img src={require("../images/items/" + cards.id + ".png")["default"]} alt={cards.name} /></div>
                                    <div className="card-content">
                                        <div className="card-name">{cards.name}</div>
                                        <div className="card-level">Level {cards.level}</div>
                                        <div className={this.checkRecipeNumber(cards.id) > 0 ? "card-recipes" : "hide"} >{this.checkRecipeNumber(cards.id)} combinaison(s)</div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                {this.state.PARSED_EQUIPMENTS.length > 0 && this.state.searchedResults.length <= 0 && this.state.card_opened === false &&

                    <div className="paginations">
                        {paginations}
                    </div>
                }
            </div>);
    }
}

export default Equipments;