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

const productsAPIResponseStatus = {
  initial: 'UNINITIATED',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const initialFilterSetting = {
  inputSearchString: '',
  selectedCategoryId: '',
  selectedRatingId: '',
}

class AllProductsSection extends Component {
  state = {
    productsList: [],
    productsResponseStatus: productsAPIResponseStatus.initial,
    activeOptionId: sortbyOptions[0].optionId,
    filters: initialFilterSetting,
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      productsResponseStatus: productsAPIResponseStatus.loading,
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied
    const {filters} = this.state
    const {inputSearchString, selectedCategoryId, selectedRatingId} = filters

    const {activeOptionId} = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&title_search=${inputSearchString}&category=${selectedCategoryId}&rating=${selectedRatingId}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    let currentProductsResponseStatus = null
    let updatedData = null
    let response = null

    try {
      response = await fetch(apiUrl, options)
    } catch (fetchException) {
      currentProductsResponseStatus = productsAPIResponseStatus.failure
    }

    if (response !== null && response.ok) {
      const fetchedData = await response.json()
      updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))

      currentProductsResponseStatus = productsAPIResponseStatus.success
    } else {
      // failed response
      currentProductsResponseStatus = productsAPIResponseStatus.failure
    }

    this.setState({
      productsList: updatedData,
      productsResponseStatus: currentProductsResponseStatus,
    })
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  onProductFilterChange = newFilters =>
    this.setState(prevAllProductsSectionState => {
      const {filters} = prevAllProductsSectionState
      const updatedFilters = {...filters, ...newFilters}

      return {
        filters: updatedFilters,
      }
    }, this.getProducts)

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state

    // TODO: Add No Products View
    let finalProductsListUI = null

    if (productsList.length === 0) {
      finalProductsListUI = this.renderErrorView({
        errorImageUrl:
          'https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png',
        errorImageAltAttributeValue: 'no products',
        errorContentHeader: 'No Products Found',
        errorDescription: 'We could not find any products. Try other filters.',
      })
    } else {
      finalProductsListUI = (
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

    return finalProductsListUI
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  // TODO: Add failure view
  renderErrorView = errorViewData => (
    <div className="products-error-view-container">
      <img
        className="products-error-img"
        src={errorViewData.errorImageUrl}
        alt={errorViewData.errorImageAltAttributeValue}
      />
      <h1 className="products-error-header">
        {errorViewData.errorContentHeader}
      </h1>
      <p className="products-error-description">
        {errorViewData.errorDescription}
      </p>
    </div>
  )

  renderProductsUIBasedOnAPIResponseStatus = currentProductsResponseStatus => {
    let finalProductsUI = null

    if (
      currentProductsResponseStatus === productsAPIResponseStatus.initial ||
      currentProductsResponseStatus === productsAPIResponseStatus.loading
    ) {
      finalProductsUI = this.renderLoader()
    } else if (
      currentProductsResponseStatus === productsAPIResponseStatus.success
    ) {
      finalProductsUI = this.renderProductsList()
    } else {
      // currentProductsResponseStatus === productsAPIResponseStatus.failure
      finalProductsUI = this.renderErrorView({
        errorImageUrl:
          'https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png',
        errorImageAltAttributeValue: 'products failure',
        errorContentHeader: 'Oops! Something Went Wrong',
        errorDescription:
          'We are having some trouble processing your request. Please try again.',
      })
    }

    return finalProductsUI
  }

  render() {
    const {productsResponseStatus, filters} = this.state

    return (
      <div className="all-products-section">
        <FiltersGroup
          categoryData={categoryOptions}
          ratingData={ratingsList}
          searchInputToFilterProducts={filters.inputSearchString}
          filtersChangeHandler={this.onProductFilterChange}
        />
        {this.renderProductsUIBasedOnAPIResponseStatus(productsResponseStatus)}
        {/* TODO: Update the below element */}
        {/* {isLoading ? this.renderLoader() : this.renderProductsList()} */}
      </div>
    )
  }
}

export default AllProductsSection
