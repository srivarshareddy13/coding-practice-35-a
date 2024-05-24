// Write your code here
const SimilarProductItem = props => {
  const {details} = props
  const {imageUrl, title, rating, brand, price} = details

  return (
    <div>
      <li>
        <img src={imageUrl} alt={`similar product ${title}`} />
        <h1>{title}</h1>
        <p>by {brand}</p>
        <p>Rs {price}</p>
        <p>{rating}</p>
        <img
          src="https://assets.ccbp.in/frontend/react-js/star-img.png"
          alt="star"
        />
      </li>
    </div>
  )
}

export default SimilarProductItem
