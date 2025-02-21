const apiKey = 'c0cc84ab916e457e87066396b03a8777';

// Getting the elements by their ID
const searchButton = document.getElementById('searchBtn');
const ingredientInputField = document.getElementById('ingredient');
const recipesList = document.getElementById('recipes');
const backToSearchButton = document.getElementById('backToSearchBtn');
const backToResultsButton = document.getElementById('backToResultsBtn');
const recipeTitleElement = document.getElementById('recipeTitle');
const recipeDetailsElement = document.getElementById('recipeDetails');

// Screen containers
const searchScreenContainer = document.getElementById('searchScreen');
const resultsScreenContainer = document.getElementById('resultsScreen');
const recipeDetailScreenContainer = document.getElementById('recipeDetailScreen');

// Function to show the different screens
function showScreen(screen) {
    searchScreenContainer.style.display = 'none';
    resultsScreenContainer.style.display = 'none';
    recipeDetailScreenContainer.style.display = 'none';
    screen.style.display = 'block';
}

// Function to get recipes from the Spoonacular API
async function getRecipesFromAPI(ingredient) {
    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredient}&number=5&apiKey=${apiKey}`);
        const data = await response.json();

        if (data.length === 0) {
            recipesList.innerHTML = '<p>No recipes found.</p>';
            return;
        }

        // Clear the list of previous recipes
        recipesList.innerHTML = '';

        // Traverse through the list of recipes and add them to the page
        for (let i = 0; i < data.length; i++) {
            const recipe = data[i];
            const recipeElement = document.createElement('div');
            recipeElement.classList.add('recipe');
            recipeElement.innerHTML = `
                <h3>${recipe.title}</h3>
                <p>Used ingredients: ${recipe.usedIngredients.map(ingredient => ingredient.name).join(', ')}</p>
                <button class="viewRecipeBtn" data-recipe-id="${recipe.id}">View Recipe</button>
            `;
            recipesList.appendChild(recipeElement);
        }

        // Show the results screen
        showScreen(resultsScreenContainer);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        recipesList.innerHTML = '<p>Error fetching recipes.</p>';
    }
}

// Function to fetch the details of a single recipe
async function getRecipeDetails(recipeId) {
    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`);
        const data = await response.json();

        recipeTitleElement.textContent = data.title;
        recipeDetailsElement.innerHTML = `
            <h3>Ingredients</h3>
            <ul>
                ${data.extendedIngredients.map(ingredient => `<li>${ingredient.name}</li>`).join('')}
            </ul>
            <h3>Instructions</h3>
            <p>${data.instructions}</p>
        `;

        // Show the recipe detail screen
        showScreen(recipeDetailScreenContainer);
    } catch (error) {
        console.error('Error fetching recipe details:', error);
        recipeDetailsElement.innerHTML = '<p>Error fetching recipe details.</p>';
    }
}

// Event listener for when the search button is clicked
searchButton.addEventListener('click', () => {
    const ingredient = ingredientInputField.value.trim();
    if (ingredient) {
        getRecipesFromAPI(ingredient);
    } else {
        alert('Please enter an ingredient.');
    }
});

// Event listener for the "back to search" button
backToSearchButton.addEventListener('click', () => {
    showScreen(searchScreenContainer);
});

// Event listener for the "back to results" button
backToResultsButton.addEventListener('click', () => {
    showScreen(resultsScreenContainer);
});

// Event listener for clicking on a recipe to view details
recipesList.addEventListener('click', (event) => {
    if (event.target.classList.contains('viewRecipeBtn')) {
        const recipeId = event.target.getAttribute('data-recipe-id');
        getRecipeDetails(recipeId);
    }
});
