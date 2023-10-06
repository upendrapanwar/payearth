import React from 'react'

const CartItem = ({values}) => {
  return (
    <div>
           { console.log('item=>',values)} 
           {console.log('value=','static value')}
    </div>
  )
}

export default CartItem