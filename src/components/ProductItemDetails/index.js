// Write your code here
import {Component} from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import SimilarProductItem from '../SimilarProductItem'
import {Link} from 'react-router-dom'

const apiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    apiStatus: apiConstants.initial,
    productItem: {},
    similarItems: [],
    quantity: 1,
  }

  componentDidMount() {
    this.getProducts()
  }

  getFormattedData = each => ({
    id: each.id,
    title: each.title,
    imageUrl: each.image_url,
    brand: each.brand,
    description: each.description,
    price: each.price,
    totalReviews: each.total_reviews,
    rating: each.rating,
    availability: each.availability,
  })

  getProducts = async () => {
    this.setState({apiStatus: apiConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const token = Cookies.get(jwt_token)

    const apiUrl = `https://apis.ccbp.in/products/:${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const data = await response.json()
      const formattedData = this.getFormattedData(data)
      const updatedData = data.similar_products.map(each =>
        this.getFormattedData(each),
      )
      this.setState({
        productItem: formattedData,
        similarItems: updatedData,
        apiStatus: apiConstants.success,
      })
    }
    if (response.status === 401) {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderFailure = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
      />
      <h1>Product Not Found</h1>
      <Link to="/products">
        <button type="button">Continue Shopping</button>
      </Link>
    </div>
  )

  onClickDash = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  onClickPlus = () =>
    this.setState(prevState => ({quantity: prevState.quantity + 1}))

  renderSuccess = () => {
    const {productItem, similarItems, quantity} = this.state
    const {
      imageUrl,
      title,
      price,
      brand,
      description,
      rating,
      availability,
      totalReviews,
    } = productItem

    return (
      <>
        <div>
          <img src={imageUrl} alt="product" />
          <h1>{title}</h1>
          <p>Rs {price}</p>
          <p>{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
          />
          <p>{totalReviews}</p>
          <p>{description}</p>
          <p>Available: {availability}</p>
          <p>Brand: {brand}</p>
          <button onClick={this.onClickDash} data-testid="minus">
            <BsDashSquare />
          </button>
          <p>{quantity}</p>
          <button onClick={this.onClickPlus} data-testid="plus">
            <BsPlusSquare />
          </button>
          <button>ADD TO CART</button>
        </div>
        <h1>Similar Products</h1>
        <ul>
          {similarItems.map(each => (
            <SimilarProductItem key={each.id} details={each} />
          ))}
        </ul>
      </>
    )
  }

  renderAllProducts = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiConstants.inProgress:
        return this.renderLoader()
      case apiConstants.success:
        return this.renderSuccess()
      case apiConstants.failure:
        return this.renderFailure()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        {this.renderAllProducts()}
      </div>
    )
  }
}

export default ProductItemDetails
