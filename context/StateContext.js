import { React, createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const Context = createContext();

export const StateContext = ({ children }) => {
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantities, setTotalQuantities] = useState(0);
    const [signedin, setSignedin] = useState(false);
    const [connectedAddress, setConnectedAddress] = useState('');
    // const [qty, setQty] = useState(1);


    const connectMetamask = () => {
        const shopContractAddress = "";
        const shopContractABI = [];
  
        let shopContract;
        let signer;
        let provider = new ethers.providers.Web3Provider(window.ethereum, 80001);
  
        // MetaMask -> request wallet connection
        provider.send("eth_requestAccounts", []).then(() => {
        provider.listAccounts().then((accounts) => {
          signer = provider.getSigner(accounts[0]);
          shopContract = new ethers.Contract(
            shopContractAddress,
            shopContractABI,
            signer
            );
          });
        setConnectedAddress(signer);
        setSignedin(true);
        });
  
        // MetaMask -> request switch to Mumbai
        window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{
              chainId: "0x13881",
              rpcUrls: ["https://rpc-mumbai.maticvigil.com"],
              chainName: "Mumbai",
              nativeCurrency: {
                  name: "MATIC",
                  symbol: "MATIC",
                  decimals: 18
              },
              blockExplorerUrls: ["https://mumbai.polygonscan.com"]
          }]
        });
    }

    
    let foundProduct;
    let index;

    const onAdd = (product) => {
        const checkProductInCart = cartItems.find((item) => item._id === product._id);
        
        if(checkProductInCart) {
            const updatedCartItems = cartItems.map((cartProduct) => {
                if(cartProduct._id === product._id) {
                    // ...cartProduct, 
                    // quantity: cartProduct.quantity + quantity
                    toast.error(`${product.name} is already in cart.`);
                    console.log(`${JSON.stringify(product)}`);
                }
            })

            // setCartItems(updatedCartItems);
        } else {
            // product.quantity = quantity;
            
            setCartItems([...cartItems, {...product}]);
            setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price);
            setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1);
            toast.success(`${product.name} added to the cart.`);
            console.log(`${JSON.stringify(product)}`);
        }
    }

    const onRemove = (product) => {
        foundProduct = cartItems.find((item) => item._id === product._id);
        const newCartItems = cartItems.filter((item) => item._id !== product._id);

        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price * foundProduct.quantity);
        setTotalQuantities((prevTotalQuantity) => prevTotalQuantity - foundProduct.quantity);
        setCartItems(newCartItems);
    }

    const toggleCartItemQuantity = (id, value) => {
        foundProduct = cartItems.find((item) => item._id === id);
        index = cartItems.findIndex((product) => product._id === id);
        const newCartItems = cartItems.filter((item) => item._id !== id);

        if(value === 'inc') {
            setCartItems([...newCartItems, { ...foundProduct, quantity: foundProduct.quantity + 1 }]);

            setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price);

            setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1);
        } else if(value === 'dec') {
            if (foundProduct.quantity > 1) {
                setCartItems([...newCartItems, { ...foundProduct, quantity: foundProduct.quantity - 1 }]);
    
                setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price);
    
                setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1);
            }
        }
    }


    const incQty = () => {
        setQty((prevQty) => prevQty + 1);
    }
    
    const decQty = () => {
        setQty((prevQty) => {
          if(prevQty - 1 < 1) return 1;
         
          return prevQty - 1;
        });
    }

    return (
        <Context.Provider
            value={{
                showCart,
                setShowCart,
                cartItems,
                totalPrice,
                totalQuantities,
                // qty,
                incQty,
                decQty,
                onAdd,
                onRemove,
                toggleCartItemQuantity,
                connectMetamask,
                signedin,
                setSignedin,
                connectedAddress
            }}
        >
            {children}
        </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context);