import React from 'react';
import contextKeys from './contextKeys';
import { storeProducts, detailProduct } from "../data";

const GlobalContext = React.createContext();

export const ContextConsumer = GlobalContext.Consumer;

class GlobalContextProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      [contextKeys.PRODUCTS]: storeProducts,
      [contextKeys.DETAIL_PRODUCT]: detailProduct,
      [contextKeys.CART]: [],
      [contextKeys.MODAL_OPEN]: false,
      [contextKeys.MODAL_PRODUCT]: detailProduct,
      [contextKeys.CART_SUB_TOTAL]: 0,
      [contextKeys.CART_TAX]: 0,
      [contextKeys.CART_TOTAL]: 0,

      get: (key) => {
        const {state} = this;
        return state[key];
      },
      set: (key, value) => {
        const {state} = this;
        state[key] = value;
        this.setState(state);
      },
      remove: (key) => {
        const {state} = this;
        delete state[key];
        this.setState(state);
      },

      setProducts: () => {
        let products = [];
        storeProducts.forEach(item => {
          const singleItem = {...item};
          products = [...products, singleItem];
        });
        this.setState(() => {
          return {products};
        });
      },

      getItem: id => {
        const product = this.state.products.find(item => item.id === id);
        return product;
      },

      addToCart: id => {
        let tempProducts = [...this.state.products];
        const index = tempProducts.indexOf(this.getItem(id));
        const product = tempProducts[index];
        product.inCart = true;
        product.count = 1;
        const price = product.price;
        product.total = price;

        this.setState(() => {
          return {
            products: [...tempProducts],
            cart: [...this.state.cart, product],
            detailProduct: {...product}
          };
        }, this.addTotals);
      },

      openModal: id => {
        const product = this.getItem(id);
        this.setState(() => {
          return {modalProduct: product, modalOpen: true};
        });
      },

      closeModal: () => {
        this.setState(() => {
          return {modalOpen: false};
        });
      },

      increment: id => {
        let tempCart = [...this.state.cart];
        const selectedProduct = tempCart.find(item => {
          return item.id === id;
        });
        const index = tempCart.indexOf(selectedProduct);
        const product = tempCart[index];
        product.count = product.count + 1;
        product.total = product.count * product.price;
        this.setState(() => {
          return {
            cart: [...tempCart]
          };
        }, this.addTotals);
      },

      decrement: id => {
        let tempCart = [...this.state.cart];
        const selectedProduct = tempCart.find(item => {
          return item.id === id;
        });
        const index = tempCart.indexOf(selectedProduct);
        const product = tempCart[index];
        product.count = product.count - 1;
        if (product.count === 0) {
          this.removeItem(id);
        } else {
          product.total = product.count * product.price;
          this.setState(() => {
            return {cart: [...tempCart]};
          }, this.addTotals);
        }
      },

      getTotals: () => {
        // const subTotal = this.state.cart
        //   .map(item => item.total)
        //   .reduce((acc, curr) => {
        //     acc = acc + curr;
        //     return acc;
        //   }, 0);
        let subTotal = 0;
        this.state.cart.map(item => (subTotal += item.total));
        const tempTax = subTotal * 0.1;
        const tax = parseFloat(tempTax.toFixed(2));
        const total = subTotal + tax;
        return {
          subTotal,
          tax,
          total
        };
      },

      addTotals: () => {
        const totals = this.getTotals();
        this.setState(
            () => {
              return {
                cartSubTotal: totals.subTotal,
                cartTax: totals.tax,
                cartTotal: totals.total
              };
            },
            () => {
              // console.log(this.state);
            }
        );
      },

      removeItem: id => {
        let tempProducts = [...this.state.products];
        let tempCart = [...this.state.cart];

        const index = tempProducts.indexOf(this.getItem(id));
        let removedProduct = tempProducts[index];
        removedProduct.inCart = false;
        removedProduct.count = 0;
        removedProduct.total = 0;

        tempCart = tempCart.filter(item => {
          return item.id !== id;
        });

        this.setState(() => {
          return {
            cart: [...tempCart],
            products: [...tempProducts]
          };
        }, this.addTotals);
      },

      clearCart: () => {
        this.setState(
            () => {
              return {cart: []};
            },
            () => {
              this.setProducts();
              this.addTotals();
            }
        );
      }
    }
  }

  render() {
    const { children } = this.props;
    return (<GlobalContext.Provider value={this.state}>{children}</GlobalContext.Provider>);
  }
}

export default GlobalContextProvider;
