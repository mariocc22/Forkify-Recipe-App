import View from './View';
import previewView from './previewView';
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found in your query! Try Again';
  _message = 'Start by searching for a recipe or an ingredient. Have fun!';

  _generateMarkup() {
    // this is a loop of information with the query results
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsView();
