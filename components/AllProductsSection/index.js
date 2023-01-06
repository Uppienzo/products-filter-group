import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const progressState = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
  noProducts: 'NO_PRODUCTS',
}

class AllProductsSection extends Component {
  state = {
    productsList: [],
    activeOptionId: sortbyOptions[0].optionId,
    titleSearch: '',
    category: '',
    rating: '',
    status: progressState.initial,
    isPrime: true,
  }

  componentDidMount() {
    this.getProducts()
    this.CheckPrimeStatus()
  }

  CheckPrimeStatus = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/prime-deals'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const primeResponse = await fetch(apiUrl, options)
    if (primeResponse.status === 401) {
      this.setState({isPrime: false})
    } else if (primeResponse.status === 200) {
      this.setState({isPrime: true})
    }
  }

  getProducts = async () => {
    this.setState({
      status: progressState.loading,
    })
    const jwtToken = Cookies.get('jwt_token')
    const {titleSearch, category, rating} = this.state
    // TODO: Update the code to get products with filters applied

    const {activeOptionId} = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${category}&rating=${rating}&title_search=${titleSearch}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    const fetchedData = await response.json()

    const updatedData = fetchedData.products.map(product => ({
      title: product.title,
      brand: product.brand,
      price: product.price,
      id: product.id,
      imageUrl: product.image_url,
      rating: product.rating,
    }))

    if (response.ok) {
      if (updatedData.length < 1) {
        this.setState({status: progressState.noProducts})
      } else {
        this.setState({
          productsList: updatedData,
          status: progressState.success,
        })
      }
    } else {
      this.setState({productsList: 'failed', status: progressState.failure})
    }
  }

  onChangeRating = id => {
    this.setState({rating: id}, this.getProducts)
  }

  onCheckCategory = id => {
    this.setState({category: id}, this.getProducts)
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  onClearFilters = () => {
    this.setState(
      {
        activeOptionId: sortbyOptions[0].optionId,
        titleSearch: '',
        category: '',
        rating: '',
      },
      this.getProducts,
    )
  }

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state

    // TODO: Add No Products View
    return (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  searchResult = value => {
    this.setState({titleSearch: value})
  }

  searched = () => {
    this.getProducts()
  }

  // TODO: Add failure view
  failureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
        className="product-failure-img"
      />
      <h1 className="product-failure-text">Oops! Something Went Wrong</h1>
      <p className="products-failure-description">
        We are having some trouble processing Your request. Please try again.
      </p>
    </div>
  )

  noProductsView = () => (
    <div className="no-products-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
        alt="no products"
        className="product-failure-img"
      />
      <h1 className="product-failure-text">No Products Found.</h1>
      <p className="products-failure-description">
        We could not find any products. Try other filters.
      </p>
    </div>
  )

  renderRenderPart = () => {
    const {status} = this.state

    switch (status) {
      case progressState.loading:
        return this.renderLoader()
      case progressState.success:
        return this.renderProductsList()
      default:
        return this.noProductsView()
    }
  }

  render() {
    const {isPrime, category, titleSearch} = this.state

    return (
      <div className="all-products-section">
        {/* TODO: Update the below element */}
        <FiltersGroup
          categoryOptions={categoryOptions}
          ratingsList={ratingsList}
          onChangeRating={this.onChangeRating}
          onCheckCategory={this.onCheckCategory}
          activeCategory={category}
          searchResult={this.searchResult}
          searchInput={titleSearch}
          searched={this.searched}
          onClearFilters={this.onClearFilters}
        />

        {isPrime ? this.renderRenderPart() : this.failureView()}
      </div>
    )
  }
}

export default AllProductsSection
