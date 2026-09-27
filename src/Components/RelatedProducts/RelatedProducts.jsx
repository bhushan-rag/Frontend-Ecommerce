import React, { useEffect, useState } from 'react'
import './RelatedProducts.css'
import Item from '../Item/Item'
import { backend_url } from '../../config';

const RelatedProducts = ({category,id}) => {

  const [related,setRelated] = useState([]);

  useEffect(()=>{
    fetch(`${backend_url}/relatedproducts`,{
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({category:category}),
      })
    .then((res)=>res.json())
    .then((data)=>setRelated(Array.isArray(data) ? data : []))
    .catch((error)=>console.error("Failed to load related products", error))
  },[category])

  return (
    <div className='relatedproducts'>
      <h1>Related Products</h1>
      <hr />
      <div className="relatedproducts-item">
        {related.filter((item)=>item.id !== id).map((item)=>(
          <Item key={item.id} id={item.id} name={item.name} image={item.image}  new_price={item.new_price} old_price={item.old_price}/>
        ))}
      </div>
    </div>
  )
}

export default RelatedProducts
