import { API_URL, RES_PER_PAGE, KEY } from './config.js'
// import { getJSON, sendJSON } from './helpers.js'
import { AJAX } from './helpers.js'

// the state will contain all the data from the application
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
}

const createRecipeObject = function (data) {
  const { recipe } = data.data
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }), //this is an excellent way to conditionally add properties to objects by using the short circuit (if the first condition is true, then return the second value and destructure it so it converts it into its simplest form)
  }
}
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${KEY}`)
    state.recipe = createRecipeObject(data)

    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true
    } else {
      state.recipe.bookmarked = false
    }
    console.log(state.recipe)
  } catch (err) {
    throw err
  }
}

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`)
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      }
    })
    state.search.page = 1
  } catch (err) {
    console.error(`${err} 💥💥💥💥💥💥`)
    throw err
  }
}

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page
  const start = (page - 1) * state.search.resultsPerPage // 0
  const end = page * state.search.resultsPerPage // 9
  return state.search.results.slice(start, end) // slice doesnt take the last number
}

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings
    // use formula : (newQt = oldQt * newServings / oldServings) => This is just RULE OF THREE
  })
  state.recipe.servings = newServings
}

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks))
}
// This is a common pattern where the function that adds something receives the entire data
// "addBookmark", and when you delete something you usually receive the ID only "deleteBookmark"
export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe)

  // Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true

  // Adding to Local storage
  persistBookmarks()
}

export const deleteBookmark = function (id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id)
  state.bookmarks.splice(index, 1)

  // Mark current recipe as NOT bookmark
  if (id === state.recipe.id) state.recipe.bookmarked = false

  // Adding to Local storage
  persistBookmarks()
}

const init = function () {
  const storage = localStorage.getItem('bookmarks')
  if (storage) state.bookmarks = JSON.parse(storage)
}

init()
console.log('Current bookmarks loaded: ', state.bookmarks)

// For debugging!
const clearBookmarks = function () {
  localStorage.clear('bookmarks')
}

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim())
        // const ingArr = ing[1].replaceAll(' ', '').split(',')
        if (ingArr.length !== 3)
          throw new Error('Wrong ingredient format! Use the correct one')
        const [quantity, unit, description] = ingArr
        return { quantity: quantity ? +quantity : null, unit, description }
      })
    console.log('These are the ingredients that are not empty', ingredients)
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    }
    console.log('Ingredients in format: ', recipe)
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe)
    state.recipe = createRecipeObject(data)
    addBookmark(state.recipe)
  } catch (err) {
    throw err
  }
}
