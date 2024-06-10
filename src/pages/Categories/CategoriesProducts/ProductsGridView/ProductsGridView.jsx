import React from "react";
import ProductCard from "../../../../components/ProductCard/ProductCard";

const ProductsGridView = ({ products }) => {
  return (
    <>
      {products.length > 0 && (
        <div className="row">
          {products.map((product) => {
            return (
              <div
                key={product.product_id}
                className="col-xl-4 col-lg-4 col-md-6"
              >
                <ProductCard productInfo={product} />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default ProductsGridView;
