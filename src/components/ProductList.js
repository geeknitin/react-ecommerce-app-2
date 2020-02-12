import React, { Component } from "react";
import Product from "./Product";
import Title from "./Title";
import styled from "styled-components";
import withGlobalContext from '../context/WithGlobalContext';
import contextKeys from '../context/contextKeys';

class ProductList extends Component {

  render() {
    const { store } = this.props;
    const products = store.get(contextKeys.PRODUCTS);
    return (
      <React.Fragment>
        <ProductWrapper className="py-5">
          <div className="container">
            <Title name="our" title="products" />
            <div className="row">
                { products.map(product => {
                    return <Product key={product.id} product={product} />;
                  })
                }
            </div>
          </div>
        </ProductWrapper>
      </React.Fragment>
    );
  }
}

const ProductWrapper = styled.section``;

export default withGlobalContext(ProductList);
