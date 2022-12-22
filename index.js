/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {
    // loop over each item in the data
    for (const game of games){
        // create a new div element, which will become the game card
        const game_card_div = document.createElement("div");

        // add the class game-card to the list
        game_card_div.classList.add("game-card");

        // set the inner HTML using a template literal to display some info 
        // about each game
        // TIP: if your images are not displaying, make sure there is space
        // between the end of the src attribute and the end of the tag ("/>")
        game_card_div.innerHTML = `
            <img src=${game.img} class="game-img">
            <b> ${game.name} </b>
            <p> ${game.description} </p>
            <p> Pledged: ${game.pledged} </p>
            <p> Goal: ${game.goal} </p>
            <p> Backers: ${game.backers} </p>
        `;

        // append the game to the games-container
        gamesContainer.append(game_card_div);
    }
}

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games
addGamesToPage(GAMES_JSON);

/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const total_contributions = GAMES_JSON.reduce((acc, game) => {
    return acc + game.backers;
}, 0) 

// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = `
    <p>${total_contributions.toLocaleString('en-US')}</p>
`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");
const total_raised = GAMES_JSON.reduce((acc, game) => {
    return acc + game.pledged;
}, 0) 

// set inner HTML using template literal
raisedCard.innerHTML = `
    <p>$${total_raised.toLocaleString('en-US')}</p>
`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
gamesCard.innerHTML = `
    <p>${GAMES_JSON.length.toLocaleString('en-US')}</p>
`;

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);
    document.getElementById('search-input').value = "";

    // use filter() to get a list of games that have not yet met their goal
    const unfunded_games = GAMES_JSON.filter((game) => {
        return game.pledged < game.goal;
    });

    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(unfunded_games);
}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);
    document.getElementById('search-input').value = "";

    // use filter() to get a list of games that have met or exceeded their goal
    const funded_games = GAMES_JSON.filter((game) => {
        return game.pledged >= game.goal;
    });

    // use the function we previously created to add funded games to the DOM
    addGamesToPage(funded_games);
}

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);
    document.getElementById('search-input').value = "";

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
const num_unfunded_games = GAMES_JSON.reduce((acc, game) => {
    return acc + (game.pledged < game.goal);
}, 0);

// create a string that explains the number of unfunded games using the ternary operator
const unfunded_games_string = `
A total of $${total_raised.toLocaleString('en-US')} has been raised for ${GAMES_JSON.length.toLocaleString('en-US')} games.
Currently, ${num_unfunded_games != 1 ? num_unfunded_games + " games remain" : num_unfunded_games + " game remains"} unfunded. 
We need your help to fund these amazing games!
`;

// create a new DOM element containing the template string and append it to the description container
const unfunded_games_element = document.createElement("p");
unfunded_games_element.innerHTML = unfunded_games_string;
descriptionContainer.append(unfunded_games_element);
/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
let [first_game, ...others] = GAMES_JSON;
//second game
const {name, description, pledged, goal, backers, img} = others[0];

// create a new element to hold the name of the top pledge game, then append it to the correct element
const first_game_element = document.createElement("p");
first_game_element.innerHTML = `
${first_game.name}
`;
firstGameContainer.append(first_game_element);

// do the same for the runner up item
const second_game_element = document.createElement("p");
second_game_element.innerHTML = `
${name}
`;
secondGameContainer.append(second_game_element);

/************************************************************************************
 * Extra feature: Search bar for games
 */

function filterSearchResults() {
    const query = document.getElementById('search-input').value;
    if (query.length > 0){
        deleteChildElements(gamesContainer);

        // use filter() to get a list of games that match the search query
        const search_results = GAMES_JSON.filter((game) => {
            return game.name.toLowerCase().includes(query.toLowerCase());
        });

        addGamesToPage(search_results);
    }
}
const searchBtn = document.getElementById("search-btn");
const input = document.getElementById('search-input');
searchBtn.addEventListener("click", filterSearchResults);
input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      searchBtn.click();
    }
});