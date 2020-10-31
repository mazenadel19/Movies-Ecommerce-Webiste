const cartContent = document.querySelector('.cart-content');
const buyCartBtn = document.querySelector('.buy-cart');


// setting the cart total
cartTotalCartPage.innerHTML = localStorage.getItem('myCartTot');


let cartItem = JSON.parse(localStorage.getItem('cart'));
console.log('cartItem', cartItem);

// display saved cart items from local storage
for (const item in cartItem) {
    const divCartItem = document.createElement('div');
    divCartItem.classList.add('cartStyle')
    divCartItem.innerHTML = `
    <article>
        <span class=" p-0 card mb-3 cart-item">
            <div class="row no-gutters">
                <div class="col-md-4">
                    <img src=${cartItem[item].image} class="card-img h-100" alt="...">
                </div>
                <div class="col-md-7">
                    <div class="card-body pb-0">
                        <h5 class="card-title">${cartItem[item].title}</h5>
                        <p class="mt-3">Price : <span class="item-price "> ${cartItem[item].price} </span> EGP</p>
                        <p class="mt-3">Amount :
                            <i class="btn-sm btn btn-warning fas fa-angle-left" data-id=${cartItem[item].id}></i>
                            <span class="item-amount">${cartItem[item].amount}</span>
                            <i class="btn-sm btn btn-warning fas fa-angle-right" data-id=${cartItem[item].id}></i>
                        </p>
                    </div>
                </div>
                <div class="col-md-1 d-flex justify-content-end align-items-start">
                    <i class="btn btn-danger text-light far fa-trash-alt" data-id=${cartItem[item].id}></i>
                </div>
            </div>
        </span>
    </article>`;

	cartContent.appendChild(divCartItem);
	console.log('cartContent', cartContent);
}


(function () {
    // send mail, clear cart
    buyCartBtn.addEventListener('click', () => {

        updateMailString();

        clearCart()
    })
    // cart functionality / event delegation to remove item and change amount

    cartContent.addEventListener('click', event => {
        // console.log(event.target);  //returns  clicked item
        if (event.target.classList.contains('fa-trash-alt')) {
            let removeItem = event.target;
            console.log('removeItem', removeItem);
            console.log('removeItemPP', removeItem.parentElement.parentElement);
            let id = removeItem.dataset.id;
            removeItemFun(id);
        } else if (event.target.classList.contains('fa-angle-right')) {
            let addAmount = event.target;
            let id = addAmount.dataset.id;

            //getting the amount the items was saved with
            // increasing that amount with 1
            let tempItem = cart.find((item) => item.id == id);
            tempItem.amount += 1;

            //updating local storage
            Storage.saveProduct('cart', cart);

            //updating cart with new amount and total nav items;
            let tempTotal = 0;
            let itemsTotal = 0;
            cart.map((item) => {
                tempTotal += item.price * item.amount;
                itemsTotal += item.amount;
            });
            let totalCartLS = parseFloat(tempTotal.toFixed(2));
            localStorage.setItem('myCartTot', totalCartLS);
            cartItemsNav.innerHTML = itemsTotal;

            // update amount
            addAmount.previousElementSibling.innerText = tempItem.amount;
            // setting the cart total
            cartTotalCartPage.innerHTML = localStorage.getItem('myCartTot');

        } else if (event.target.classList.contains('fa-angle-left')) {
            let subAmount = event.target;
            let id = subAmount.dataset.id;

            //getting the amount the items was saved with
            // decreasing that amount with 1
            let temp = cart.find((item) => item.id == id);
            if (temp.amount>=2) {
                temp.amount -= 1;
                // $('.fa-angle-left').removeClass('disabled');
            } else if (temp.amount < 2) {
                temp.amount = 1;
                // $('.fa-angle-left').addClass('disabled');
            }

            //updating local storage
            Storage.saveProduct('cart', cart);

            //updating cart total and total nav items;
            let tempTotal = 0;
            let itemsTotal = 0;
            cart.map((item) => {
                tempTotal += item.price * item.amount;
                itemsTotal += item.amount;
            });
            let totalCartLS = parseFloat(tempTotal.toFixed(2));
            localStorage.setItem('myCartTot', totalCartLS);
            cartItemsNav.innerHTML = itemsTotal;

            // update amount
                subAmount.nextElementSibling.innerText = temp.amount;


            // setting the cart total
            cartTotalCartPage.innerHTML = localStorage.getItem('myCartTot');

        }
    })


})()
function updateMailString() {
    var subj = "my cart"
    var body=''
    for (const item in cart) {
        body += ` you are getting ${cart[item].amount} ${cart[item].title}`;
    }
    var pay = `you'll pay ${localStorage.getItem('myCartTot')}`

    window.open(`mailto:test@example.com?subject=${subj}&body=${body} ${pay}`);

 }
function clearCart() {
    console.log("BUY BUTTON CLICKED!!!");
    let cartItems = cart.map((item) => item.id); //I can access cart in script js :D
    // console.log(cartItems);
    cartItems.forEach((id) => this.removeItemFun(id));
}

function removeItemFun(id) {
    cart = cart.filter(item => item.id != id);
    console.log(cart);

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

    Storage.saveProduct('cart', cart);

    location.reload() //rebuild the page after emptying the array

 }
