import View from './View';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _prevPage(curPage) {
    return `
    <button data-goto="${
      curPage - 1
    }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${curPage - 1}</span>
    </button>
  `;
  }

  _nextPage(curPage) {
    return `
        <button data-goto="${
          curPage + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
      `;
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    console.log('number of pages', numPages);
    // Page 1, and there are more pages
    if (curPage === 1 && numPages > 1) {
      return this._nextPage(curPage);
    }
    // Last Page
    if (curPage === numPages && numPages > 1) {
      return this._prevPage(curPage);
    }
    // Other Page
    if (curPage < numPages) {
      return [this._prevPage(curPage), this._nextPage(curPage)].join('');
    }
    // Page 1, and no other pages
    return '';
  }
}

export default new PaginationView();
