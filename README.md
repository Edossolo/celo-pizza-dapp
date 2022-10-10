# Pizza-Pap

## Description

This is a web application for Pizza Pap which is a pizza selling venture, that shows details about the services and different pizza they sell, their menu and also allows customers to order online for their preferred pizza depending on size, crust they need and also allows them to input a location which they would love the pizza to be delivered to. 

##NOTE
WALLET REQUIRED TO TEST THIS DAPP IS [CELO EXTENSION WALLET](https://chrome.google.com/webstore/detail/celoextensionwallet/kkilomkmpmkbdnfelcpgckmpcaemjcdh?hl=en)

## Live Page 


## Installation / Setup instruction
* Open Terminal {Ctrl+Alt+T}

* ```git clone ```

* ```cd Pizza-pap```

* ```code .``` or ```atom .``` depending on the text editor of your choise.

## Technologies Used

* [HTML5](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5)
* [CSS](https://kristofferandreasen.github.io/wickedCSS/)
* markdown
* [Bootstrap](https://getbootstrap.com/docs/4.5/getting-started/introduction/)
* [jQuery](https://api.jquery.com/)
* [JavaScript](https://devdocs.io/javascript/)


## BDD
| Behaviour      | Input        | Output       |
| :------------- | :----------: | -----------: |
|  Select pizza flavor  |   Chiken Tika |   Chicken Tika   |
| Select piza size  | large, medium, small |  large  |
| Select Crust   |  Either cripsy,stuffed or glutten-free  |     |
| select toppings  |  check all the topppings you want     |     |
| Press Proceed button |     | Table with your selections with the total price for that selection.|
| Press add pizza button | pizza flavor,size, crust and toppings   | new selection added to the table|
| Press Checkout |     | Your bill is ...  |
| Press home delivery | Your name, phone number and delivery location     |  |
| press place order| | We have recieved your order and it will be delivered to you with your name, place of delivery and amount to be paid.|

## Known Bugs

* All toppings has the same price regardless of the pizza size

## License
> *MIT License:*
> {Determine the license under which this application can be used.  See below for more details on licensing.}*[LICENSE](LICENSE)
> Copyright &copy; 2022 
# Install

```

npm install

```

or 

```

yarn install

```

# Start

```

npm run dev

```

# Build

```

npm run build

```
# Usage
1. Install the [CeloExtensionWallet](https://chrome.google.com/webstore/detail/celoextensionwallet/kkilomkmpmkbdnfelcpgckmpcaemjcdh?hl=en) from the google chrome store.
2. Create a wallet.
3. Go to [https://celo.org/developers/faucet](https://celo.org/developers/faucet) and get tokens for the alfajores testnet.
4. Switch to the alfajores testnet in the CeloExtensionWallet.
