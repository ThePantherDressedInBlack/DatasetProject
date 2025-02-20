const apiKey = 'c0cc84ab916e457e87066396b03a8777'; // Replace with your API key
const searchBtn = document.getElementById('searchBtn');
const ingredientInput = document.getElementById('ingredient');
const recipesContainer = document.getElementById('recipes');
const backToSearchBtn = document.getElementById('backToSearchBtn');
const backToResultsBtn = document.getElementById('backToResultsBtn');
const recipeTitle = document.getElementById('recipeTitle');
const recipeDetails = document.getElementById('recipeDetails');

// Screen containers
const searchScreen = document.getElementById('searchScreen');
const resultsScreen = document.getElementById('resultsScreen');
const recipeDetailScreen = document.getElementById('recipeDetailScreen');

// Function to switch between screens
function showScreen(screen) {
    searchScreen.style.display = 'none';
    resultsScreen.style.display = 'none';
    recipeDetailScreen.style.display = 'none';
    screen.style.display = 'block';
}

// Function to fetch recipes from Spoonacular
async function fetchRecipes(ingredient) {
    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredient}&number=5&apiKey=${apiKey}`);
        const data = await response.json();

        if (data.length === 0) {
            recipesContainer.innerHTML = '<p>No recipes found.</p>';
            return;
        }

        // Clear previous recipes
        recipesContainer.innerHTML = '';

        // Display new recipes
        data.forEach(recipe => {
            const recipeElement = document.createElement('div');
            recipeElement.classList.add('recipe');
            recipeElement.innerHTML = `
        <h3>${recipe.title}</h3>
        <p>Used ingredients: ${recipe.usedIngredients.map(ingredient => ingredient.name).join(', ')}</p>
        <button class="viewRecipeBtn" data-recipe-id="${recipe.id}">View Recipe</button>
      `;
            recipesContainer.appendChild(recipeElement);
        });

        // Switch to results screen
        showScreen(resultsScreen);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        recipesContainer.innerHTML = '<p>Error fetching recipes.</p>';
    }
}

// Fetch and display recipe details
async function fetchRecipeDetails(recipeId) {
    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`);
        const data = await response.json();

        recipeTitle.textContent = data.title;
        recipeDetails.innerHTML = `
      <h3>Ingredients</h3>
      <ul>
        ${data.extendedIngredients.map(ingredient => `<li>${ingredient.name}</li>`).join('')}
      </ul>
      <h3>Instructions</h3>
      <p>${data.instructions}</p>
    `;

        // Switch to recipe detail screen
        showScreen(recipeDetailScreen);
    } catch (error) {
        console.error('Error fetching recipe details:', error);
        recipeDetails.innerHTML = '<p>Error fetching recipe details.</p>';
    }
}

// Event listener for search button
searchBtn.addEventListener('click', () => {
    const ingredient = ingredientInput.value.trim();
    if (ingredient) {
        fetchRecipes(ingredient);
    } else {
        alert('Please enter an ingredient.');
    }
});

// Event listener for back buttons
backToSearchBtn.addEventListener('click', () => {
    showScreen(searchScreen);
});

backToResultsBtn.addEventListener('click', () => {
    showScreen(resultsScreen);
});

// Event delegation for viewing a specific recipe
recipesContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('viewRecipeBtn')) {
        const recipeId = event.target.getAttribute('data-recipe-id');
        fetchRecipeDetails(recipeId);
    }
});
