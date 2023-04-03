import * as model from '../js/model'
import { MODAL_CLOSE_SEC } from './config'
import recipeView from './views/recipeView'
import searchView from './views/searchView'
import resultsView from './views/resultsView'
import paginationView from './views/paginationView'
import bookmarksView from './views/bookmarksView'
import addRecipeView from './views/addRecipeView'
// In Parcel, if you want to import files that are not JS files, you must use the URL keyword
// at the beginning
import 'core-js/stable'
import 'regenerator-runtime/runtime'

// https://forkify-api.herokuapp.com/v2

// Parcel methods
/* As you make changes to your code, Parcel automatically rebuilds the changed files and updates your app in the browser. By default, Parcel fully reloads the page, but in some cases it may perform Hot Module Replacement (HMR). HMR improves the development experience by updating modules in the browser at runtime without needing a whole page refresh. This means that application state can be retained as you change small things in your code. */
// if (module.hot) {
//   module.hot.accept();
// }

/// ////////////////////////////////////
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1)
    if (!id) return
    recipeView.renderSpinner()

    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage())

    // 1) Updating bookmarks view
    // the debugger keyword will help you to set a stop in your code when running
    // debugger;
    bookmarksView.update(model.state.bookmarks)

    // 2) Loading recipe
    await model.loadRecipe(id)

    // 3) Rendering the recipe
    recipeView.render(model.state.recipe)
  } catch (err) {
    recipeView.renderError()
  }
}

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner()
    // 1) Get search query
    const query = searchView.getQuery()
    if (!query) return

    // 2) Load search results
    // this is not defined in a const/variable because it doesn't return anything, it only changes the state of the dom
    await model.loadSearchResults(query)

    // 3) Render results
    resultsView.render(model.getSearchResultsPage())

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search)
  } catch (err) {
    console.log(err)
  }
}

const controlPagination = function (goToPage) {
  // 3) Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage))

  // 4) Render NEW initial pagination buttons
  paginationView.render(model.state.search)
}

const controlServings = function (newServings) {
  // Update the recipe servings(in state)
  model.updateServings(newServings)

  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe)
}

const controlAddBookmark = function () {
  //  1) Add/remove bookmark
  // this is a condition to check if the recipe is checked or not, to change the state of the button from active to unactive or viceversa
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe)
  else model.deleteBookmark(model.state.recipe.id)

  //  2) update recipe view
  console.log('bookmark', model.state.recipe)
  recipeView.update(model.state.recipe)

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks)
}

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe = async function (newRecipe) {
  try {
    //  Show loading spinner
    addRecipeView.renderSpinner()
    // Upload the new recipe data
    console.log('new recipe', newRecipe)
    await model.uploadRecipe(newRecipe)
    console.log('Data motherfucker', model.state.recipe)

    // Render recipe
    recipeView.render(model.state.recipe)

    // Success Message
    addRecipeView.renderMessage()

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks)

    // Change ID in URL
    // SEARCH MORE ABOUT THE HISTORY API
    window.history.pushState(null, '', `#${model.state.recipe.id}`) //this will change the URL of the page without reloading the page

    // Close form
    setTimeout(function () {
      addRecipeView.toggleWindow()
    }, MODAL_CLOSE_SEC * 1000)
  } catch (err) {
    console.error('💥💥💥', err)
    addRecipeView.renderError(err.message)
  }
}

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipes)
  recipeView.addHandlerUpdateServings(controlServings)
  recipeView.addHandlerAddBookmark(controlAddBookmark)
  searchView.addHandlerSearch(controlSearchResults)
  paginationView.addHandlerClick(controlPagination)
  addRecipeView.addHandlerUpload(controlAddRecipe)
}

init()
