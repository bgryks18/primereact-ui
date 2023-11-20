import { Skeleton } from 'primereact/skeleton'
import React from 'react'

const ProductsPageLoading = () => {
  return (
    <>
      <Skeleton
        className="w-full mb-2 bg-gray-200  rounded-xl"
        height="80px"
      ></Skeleton>
      <Skeleton
        className="w-full bg-gray-200  rounded-xl"
        height="624px"
      ></Skeleton>
    </>
  )
}

export default ProductsPageLoading
