import View from './View'
import icons from 'url:../../img/icons.svg'

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload')
  _message = 'Recipe was suceessfuly uploaded!'
  _window = document.querySelector('.add-recipe-window')
  _overlay = document.querySelector('.overlay')
  _btnOpen = document.querySelector('.nav__btn--add-recipe')
  _btnClose = document.querySelector('.btn--close-modal')

  constructor() {
    super()
    this._addHandlerShowWindow()
    this._addHandlerHideWindow()
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this))
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden')
    this._window.classList.toggle('hidden')
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this))
    this._overlay.addEventListener('click', this.toggleWindow.bind(this))
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault()
      // this is a function that help us to get all the info from a Form Element and store it in key/value pairs (title, value) as an Array
      const dataArr = [...new FormData(this)]
      // this takes an array of entries and converts  it into an object REALLY IMPORTANT TO KNOW!!!
      const data = Object.fromEntries(dataArr)
      handler(data)
    })
  }

  _generateMarkup() {}
}

export default new AddRecipeView()
