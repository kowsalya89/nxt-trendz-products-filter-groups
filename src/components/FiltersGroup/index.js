import {BsSearch} from 'react-icons/bs'

import './index.css'

const FiltersGroup = props => {
  const {
    categoryData,
    ratingData,
    // searchInputToFilterProducts,
    filtersChangeHandler,
  } = props

  // Have to use inputSearchString, selectedCategoryId, selectedRatingId
  // as object keys with appropriate values, when calling filtersChangeHandler
  // method with changed filter data object as input.
  const onSearchInputChange = searchInputChangeEvent => {
    if (searchInputChangeEvent.code === 'Enter') {
      const updatedSearchString = searchInputChangeEvent.target.value
      const changedSearchInputFilterObject = {
        inputSearchString: updatedSearchString,
      }

      filtersChangeHandler(changedSearchInputFilterObject)
    }
  }

  const onClearFilters = () => {
    const searchInputElement = document.querySelector(
      'div.product-search-container input',
    )
    searchInputElement.value = ''

    filtersChangeHandler({
      inputSearchString: '',
      selectedCategoryId: '',
      selectedRatingId: '',
    })
  }

  return (
    <div className="filters-group-container">
      <div className="product-search-container">
        <input
          type="search"
          className="product-search-input"
          placeholder="Search"
          onKeyDown={onSearchInputChange}
          // value={searchInputToFilterProducts}
        />

        <BsSearch className="search-icon" />
      </div>

      <div className="single-filter-container">
        <h1 className="filter-header">Category</h1>
        <ul className="filter-options-container">
          {categoryData.map(categoryDataItem => (
            <li key={categoryDataItem.categoryId} className="filter-option">
              <button
                type="button"
                className="filter-option-button"
                onClick={() =>
                  filtersChangeHandler({
                    selectedCategoryId: categoryDataItem.categoryId,
                  })
                }
              >
                <p className="filter-option-text">{categoryDataItem.name}</p>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="single-filter-container">
        <h1 className="filter-header">Rating</h1>
        <ul className="filter-options-container">
          {ratingData.map(ratingDataItem => (
            <li key={ratingDataItem.ratingId} className="filter-option">
              <button
                type="button"
                className="filter-option-button"
                onClick={() =>
                  filtersChangeHandler({
                    selectedRatingId: ratingDataItem.ratingId,
                  })
                }
              >
                <img
                  className="filter-option-button-img"
                  src={ratingDataItem.imageUrl}
                  alt={`rating ${ratingDataItem.ratingId}`}
                />{' '}
                {} & up
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        className="clear-filters-button"
        onClick={onClearFilters}
      >
        Clear Filters
      </button>
    </div>
  )
}

export default FiltersGroup
