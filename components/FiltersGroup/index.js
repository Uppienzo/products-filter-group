import {BsSearch} from 'react-icons/bs'

import './index.css'

const RatingItem = props => {
  const {details, onChangeRating} = props
  const {ratingId, imageUrl} = details

  const onCheckRating = () => {
    onChangeRating(ratingId)
  }

  return (
    <li className="rating-item">
      <button
        type="button"
        className="rating-item-button"
        onClick={onCheckRating}
      >
        <img src={imageUrl} alt={`rating ${ratingId}`} className="rating-img" />
        <p className="rating-text">& up</p>
      </button>
    </li>
  )
}

const CategoryItem = props => {
  const {details, onCheckCategory, activeCategory} = props
  const {categoryId, name} = details

  const activeCategoryClass = activeCategory === categoryId ? 'active' : ''

  const onCLickCategory = () => {
    onCheckCategory(categoryId)
  }

  return (
    <li className="category-item">
      <button
        type="button"
        className={`category-item-button ${activeCategoryClass}`}
        onClick={onCLickCategory}
      >
        <p>{name} </p>
      </button>
    </li>
  )
}

const FiltersGroup = props => {
  const {
    categoryOptions,
    ratingsList,
    onChangeRating,
    onCheckCategory,
    activeCategory,
    searchInput,
    searchResult,
    searched,
    onClearFilters,
  } = props

  const onChangeSearchInput = event => {
    searchResult(event.target.value)
  }

  const onSubmitForm = event => {
    event.preventDefault()
    searched()
  }
  const clear = () => {
    onClearFilters()
  }

  return (
    <form className="filters-group-container" onSubmit={onSubmitForm}>
      <div className="search-tab">
        <input
          type="search"
          placeholder="Search"
          className="search-input"
          value={searchInput}
          onChange={onChangeSearchInput}
        />
        <BsSearch />
      </div>
      <ul className="category-list-container">
        <li className="head">
          <h1 className="">Category</h1>
        </li>
        {categoryOptions.map(each => (
          <CategoryItem
            key={each.categoryId}
            details={each}
            onCheckCategory={onCheckCategory}
            activeCategory={activeCategory}
          />
        ))}
      </ul>
      <ul className="category-rating-container">
        <li className="head">Rating</li>
        {ratingsList.map(each => (
          <RatingItem
            key={each.ratingId}
            details={each}
            onChangeRating={onChangeRating}
          />
        ))}
      </ul>
      <button type="button" className="clear-filter-btn" onClick={clear}>
        {' '}
        Clear Filters
      </button>
    </form>
  )
}

export default FiltersGroup
