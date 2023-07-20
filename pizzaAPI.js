document.addEventListener("alpine:init", () => {
    Alpine.data('pizzaCart', () => {
        return {
            title: 'Samu`s Pizza Cart API',
            pizzas: [],
            username: '',
            cartId: '',
            cartPizzas: [],
            cartTotal: 0.00,
            //clearCart: false,
            paymentAmount: 0.00,
            message: '',
            showChangeMessage: false,
            showCart: false,
            featuredPizza: [],
            cartCode: [],
            orders: [],
            showPizzas: false,


            Login() {
                if (this.username.length > 2) {
                    localStorage['username'] = this.username;
                    this.createCart();
                } else {
                    alert("Username is too short");
                }
            },
            Logout() {
                if (confirm('Do you want to logout?')) {
                    this.username = '';
                    this.cartId = '';
                    localStorage['cartId'] = '';
                    localStorage['username'] = '';
                }
            },
            createCart() {
                if (!this.username) {
                    // this.cartId = 'No username entered!'
                    return Promise.resolve();
                }

                const cartId = localStorage['cartId'];

                if (cartId) {
                    this.cartId = cartId;
                    return Promise.resolve();

                } else {
                    const createCartURL = `https://pizza-api.projectcodex.net/api/pizza-cart/create?username=${this.username}`
                    return axios.get(createCartURL)
                        .then(result => {
                            this.cartId = result.data.cart_code;
                            localStorage['cartId'] = this.cartId;
                        });
                }
            },

            getCart() {
                const getCartURL = `https://pizza-api.projectcodex.net/api/pizza-cart/${this.cartId}/get`
                return axios.get(getCartURL);
            },
            addPizza(pizzaId) {
                return axios.post('https://pizza-api.projectcodex.net/api/pizza-cart/add', {
                    "cart_code": this.cartId,
                    "pizza_id": pizzaId
                })
            },

            removePizza(pizzaId) {
                return axios.post('https://pizza-api.projectcodex.net/api/pizza-cart/remove', {
                    "cart_code": this.cartId,
                    "pizza_id": pizzaId
                })
            },

            pay(amount) {
                return axios.post('https://pizza-api.projectcodex.net/api/pizza-cart/pay', {
                    "cart_code": this.cartId,
                    amount
                })
            },

            postFeaturedPizza(pizzaId) {
                axios.post('https://pizza-api.projectcodex.net/api/pizzas/featured?username=SamuNhlapho', {
                    username: 'SamuNhlapho',
                    pizza_id: pizzaId,
                }).then(() => this.getFeaturedPizza())
            },

            getFeaturedPizza() {
                return axios.get('https://pizza-api.projectcodex.net/api/pizzas/featured?username=SamuNhlapho')
                    .then(result => {
                        //  console.log(result.data)
                        this.featuredPizza = result.data.pizzas;
                    })
            },

            // getUserHisory(e) {
            //     if (!this.username) return;
            //     this.getCart()
            //         .then(result => {
            //             console.log(result.data)
            //             this.cartCode = result.data.cartCode;
            //             this.rders = result.data.orders;
            //         })
            // },

            // getOrders() {
            //     if (!this.cartCode) return;
            //     axios.get(`https://pizza-api.projectcodex.net/api/pizzas/pizza-orders?cartCode=${this.cartCode}`)
            //         .then(result => {
            //             this.pizza = result.data.cartCode;
            //             this.showPizzas = true;

            //         })
            // },

            showCartData() {
                this.getCart().then(result => {
                    const cartData = result.data;
                    this.cartPizzas = cartData.pizzas;
                    this.cartTotal = cartData.total.toFixed(2);
                    // alert(this.cartTotal);
                });
            },

            init() {

                const storedUsername = localStorage['username'];
                if (storedUsername) {
                    this.username = storedUsername;
                }

                axios
                    .get('https://pizza-api.projectcodex.net/api/pizzas')
                    .then(result => {
                        //code here
                        //console.log(result.data);
                        this.pizzas = result.data.pizzas
                        //code here 
                    });


                if (!this.cartId) {
                    this
                        .createCart()
                        .then(() => {
                            this.showCartData();
                        })
                }

                this.getFeaturedPizza();
            },
            addPizzaToCart(pizzaId) {
                // alert(pizzaId)
                this.addPizza(pizzaId)
                    .then(() => {
                        this.showCartData();
                    })
            },
            removePizzaFromCart(pizzaId) {
                // alert(pizzaId)
                this.removePizza(pizzaId)
                    .then(() => {
                        this.showCartData();
                    })

            },

            payForCart() {
                // alert("Pay Now! : " + this.paymentAmount)
                this
                    .pay(this.paymentAmount)
                    .then(result => {
                        if (result.data.status == 'failure') {
                            this.message = result.data.message;
                            setTimeout(() => this.message = '', 3000);

                        } else {
                            this.message = 'Payment recieved, Enjoy!!';

                            const change = this.paymentAmount - this.cartTotal;
                            if (change > 0) {
                                this.message = `Here is your change: R${change.toFixed(2)},  Enjoy!!`;
                            } 
                            this.showChangeMessage = true;

                            setTimeout(() => {
                                this.message = '';
                                this.cartPizzas = [];
                                this.cartTotal = 0.00;
                                this.cartId = ''
                                this.paymentAmount = 0.00;
                                this.showCart = 0;
                                localStorage['cartId'] = '';
                                this.createCart();
                            
                            }, 3000);
                        }
                    })
            },

            pizzaImage(pizza) {
                return `pizza.png`
            },

            pizzaImage(featured) {
                return `pizza.png`
            }

        }
    });
});