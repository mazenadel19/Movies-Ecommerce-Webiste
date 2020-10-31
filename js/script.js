// Variables

const isLoggedIn = localStorage.getItem('isLoggedIn');

const cartNavBtn = document.querySelector('.cart-btn');

const cartItemsNav = document.querySelector('.cart-items');

let cartTotalCartPage = document.querySelector('.cart-total');

const productsDOM = document.querySelector('.products-center');

// user's cart array contains products to add to Local Storage
let cart = [];

// array of add to chart buttons (used to revert changes on buttons)
let buttonsDOM = [];

// let cartCounter = 0;

//getting product
class Products {
	//* function to get products data from json file
	async getProducts() {
		try {
			let result = await fetch('products2.json');
			let data = await result.json();
			return data;
		} catch (error) {
			console.log(error);
		}
	}
}

//displaying products
class UI {
	//* function to display products in gallery page by appending them to empty div
	displayProducts(products) {
		// console.log('products', products)

		// for (const product of products) {
		//     console.log(product)
		// }

		let result = '';
		products.forEach((product) => {
			result += `
                <!--Product-->
                <div class="col-sm-6 col-md-3 mb-3">
                <div class="card product">
                    <img src=${product.image} class="card-img-top product-img" alt="...">
                    <div class="card-body text-center">
                    <h5 class="card-title">${product.title}</h5>
                    <p class="card-text mb-0">Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, velit dolor totam facilis <a href="product.html?id=${product.id}"> Read More ...</a></p>
                    <p class=" mt-3">Price : <span class="card-price"> ${product.price} </span> EGP</p>
                    </div>
                    <button class="btn btn-warning bag-btn" data-id="${product.id}">Add To Cart <i class="fa fa-cart-plus" aria-hidden="true"></i></button>
                </div>
                </div>
                <!-- End of Product -->
            `;
		});
		productsDOM.innerHTML = result;
	}

	//* function to get addtochart btn Id
	getBagBtns() {
		//const addtocartbtns = document.getElementsByClassName('bag-btn');
		const addtocartbtns = [...document.getElementsByClassName('bag-btn')];

		buttonsDOM = addtocartbtns;

		addtocartbtns.forEach((button) => {
			let id = button.dataset.id;
			// console.log('id', id);

			//* check if the item is in my cart
			let inCart = cart.find((item) => item.id === id);
			if (inCart) {
				button.innerHTML = 'In Cart';
				button.disabled = 'true';
			}

			button.addEventListener('click', function (event) {

				if (isLoggedIn) {


					// console.log(event.target);
					event.target.innerHTML = 'In Cart';
					event.target.disabled = 'true';

					//* 1 get the product clicked from local storage
					let cartItem = { ...Storage.getProduct(id), amount: 1 };

					console.log("cartItem", cartItem);

					//* 2 add product to cart array
					cart.push(cartItem);
					// cart=[...cart,cartItem]
					console.log('cart array to be saved in local storage', cart);


					//* 3 save cart to local storage
					Storage.saveProduct('cart', cart);

					//* 4 set cart values
					// cartCounter++;
					// cartItemsNav.innerHTML = cartCounter;

					// console.log('this', this);
					//! setting cart values
					let tempTotal = 0;
					let itemsTotal = 0;
					cart.map((item) => {
						tempTotal += item.price * item.amount;
						// console.log('tempTotal', tempTotal);
						itemsTotal += item.amount;
					});

					let totalCartLS = parseFloat(tempTotal.toFixed(2));
					localStorage.setItem('myCartTot', totalCartLS);

					cartItemsNav.innerHTML = itemsTotal;
					// console.log('cartItemsNav', cartItemsNav);
				} else {
					alert('Sorry you need to login first before you add movies to your the Cart');
				}

			});
		});
	}
	//retrieve the cart value from local storage if exist so we don't lose it after refreshing
	// also keeps the number on
	SetupApp() {
		cart = Storage.getCart();

		let tempTotal = 0;
		let itemsTotal = 0;
		cart.map((item) => {
			tempTotal += item.price * item.amount;
			// console.log('tempTotal', tempTotal);
			itemsTotal += item.amount;
		});

		let totalCartLS = parseFloat(tempTotal.toFixed(2));
		localStorage.setItem('myCartTot', totalCartLS);

		// retrieve cart items numbers on navbar
		cartItemsNav.innerHTML = itemsTotal;

	}

}

//local storage
class Storage {
	//* function to save products to local storage
	static saveProduct(key, val) {
		//static method can be called in any other class just by calling the parent class
		localStorage.setItem(key, JSON.stringify(val));
	}

	//* function to return clicked product from local storage
	static getProduct(btnid) {
		let productsStorage = JSON.parse(localStorage.getItem('products'));
		return productsStorage.find((product) => product.id === btnid);
	}

	static getCart() {
		return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')): []
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const ui = new UI();
	const products = new Products();

	ui.SetupApp()


	//* 1- getting the products
	products
		.getProducts()
		.then((res) => {
			// console.log('res', res); //the actual data
			// return res //the return from then is a promise

			//*2- display the products in gallery page
			ui.displayProducts(res);

			//*3- add products to my local storage
			Storage.saveProduct('products', res);
		})
		.then(() => {
			//*get the id for add to char buttons
			ui.getBagBtns();
		})
		.catch((err) =>
			console.log(
				"promise error cuz I'm connecting all page to same script and there's no ProductsDOM in this page, Will fix it later ...",
				err,
			),
		);
});

// **********************************************************

// stop redirecting to login page if user is already in

	loginRegLink = document.getElementsByClassName('fa-user-circle')[0];

	loginRegLink.addEventListener('click', () => {
		if (isLoggedIn) {
			loginRegLink.parentElement.setAttribute('href', '');
			alert('user already logged in');
		} else {
			loginRegLink.parentElement.setAttribute('href', 'register.html');
		}
	})

// redirect user to cart if logged in, stop if not

	cartLink = document.getElementsByClassName('fa-cart-plus')[0];

	cartNavBtn.addEventListener('click', () => {
		if (isLoggedIn) {

			cartLink.parentElement.setAttribute('href', 'cart.html');
		}
		else {
			alert('Sorry you need to login first in order to view the Cart');
			// cartNavBtn.setAttribute('href', '');
		}
	})

//****************************************
