const C = {
    API: '/api',
};

// Application State
const state = {
    user: null, // { username, role }
    products: [],
    cart: [], // { product, quantity }
    orders: []
};

// UI Handling helpers
const ui = {
    showModal: (id) => document.getElementById(id).classList.add('active'),
    closeModal: (id) => document.getElementById(id).classList.remove('active'),
    showToast: (msg) => {
        const toast = document.getElementById('toast');
        toast.innerText = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    },
    renderNavbar: () => {
        const navRight = document.getElementById('navRight');
        if (state.user) {
            let links = '';
            if (state.user.role === 'ADMIN') {
                links += `<div class="nav-item" onclick="app.navigate('admin')"><span class="material-icons">dashboard</span> Admin</div>`;
            } else {
                links += `<div class="nav-item" onclick="app.navigate('orders')"><span class="material-icons">inventory_2</span> Orders</div>`;
            }
            links += `
                <div class="nav-item" onclick="app.navigate('cart')">
                    <span class="material-icons">shopping_cart</span> Cart (${app.getCartTotalCount()})
                </div>
                <div class="nav-item dropdown">
                    <span class="material-icons">account_circle</span> ${state.user.username}
                </div>
                <div class="nav-item" onclick="app.logout()">
                    <span class="material-icons">logout</span>
                </div>
            `;
            navRight.innerHTML = links;
        } else {
            navRight.innerHTML = `
                <button class="btn nav-item login-btn" onclick="app.showLogin()">Login</button>
                <div class="nav-item" onclick="app.navigate('cart')">
                    <span class="material-icons">shopping_cart</span> Cart (${app.getCartTotalCount()})
                </div>
            `;
        }
    },
    renderView: (html) => {
        document.getElementById('app-content').innerHTML = html;
    },
    togglePassword: (id, icon) => {
        const input = document.getElementById(id);
        if (input.type === 'password') {
            input.type = 'text';
            icon.innerText = 'visibility_off';
        } else {
            input.type = 'password';
            icon.innerText = 'visibility';
        }
    }
};

// Main App Logic
const app = {
    init: async () => {
        await app.checkSession();
        app.navigate('home');

        // Setup payment method selection
        document.querySelectorAll('.pay-method').forEach(el => {
            el.addEventListener('click', function () {
                document.querySelectorAll('.pay-method').forEach(m => m.classList.remove('selected'));
                this.classList.add('selected');
            });
        });
    },

    checkSession: async () => {
        try {
            const res = await fetch(`${C.API}/auth/me`);
            if (res.ok) {
                state.user = await res.json();
            }
        } catch (e) {
            console.error('Session check failed', e);
        }
        ui.renderNavbar();
    },

    navigate: async (view) => {
        if (view === 'home') {
            await app.fetchProducts();
            app.renderHome();
        } else if (view === 'cart') {
            app.renderCart();
        } else if (view === 'orders') {
            if (!state.user) return app.showLogin();
            await app.fetchUserOrders();
            app.renderOrders();
        } else if (view === 'admin') {
            if (!state.user || state.user.role !== 'ADMIN') return app.navigate('home');
            app.renderAdmin();
        }
    },

    fetchProducts: async () => {
        try {
            const res = await fetch(`${C.API}/products`);
            state.products = await res.json();
        } catch (e) {
            ui.showToast('Failed to load products');
        }
    },

    fetchUserOrders: async () => {
        try {
            const res = await fetch(`${C.API}/orders/my-orders`, { credentials: 'include' });
            state.orders = await res.json();
        } catch (e) {
            ui.showToast('Failed to load orders');
        }
    },

    addToCart: (productId) => {
        const product = state.products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = state.cart.find(item => item.product.id === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            state.cart.push({ product, quantity: 1 });
        }
        ui.showToast(`${product.name} added to cart!`);
        ui.renderNavbar();
    },

    updateCartItemCount: (productId, delta) => {
        const item = state.cart.find(i => i.product.id === productId);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                state.cart = state.cart.filter(i => i.product.id !== productId);
            }
        }
        app.renderCart();
        ui.renderNavbar();
    },

    getCartTotalCount: () => {
        return state.cart.reduce((total, item) => total + item.quantity, 0);
    },

    getCartTotalPrice: () => {
        return state.cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    },

    // Rendering functions
    renderHome: () => {
        let html = '';

        if (!state.user) {
            html += `
                <div class="card mb-20 text-center" style="padding: 40px 20px; background: linear-gradient(135deg, var(--primary-color), var(--primary-hover)); color: white;">
                    <h1 style="font-size: 36px; margin-bottom: 15px;">Welcome to CampusKart! 🎓</h1>
                    <p style="font-size: 18px; margin-bottom: 25px; opacity: 0.9;">Your one-stop destination for all campus needs. Authentic products, guaranteed delivery.</p>
                    <button class="btn" style="background: white; color: var(--primary-color); font-size: 18px; padding: 12px 30px;" onclick="app.showLogin()">Login to Start Shopping</button>
                </div>
                <h2 class="mb-20" style="padding-left: 10px;">Sneak Peek at Our Catalog</h2>
            `;
        } else {
            html += `<h2 class="mb-20" style="padding-left: 10px;">Welcome back, ${state.user.username}! Here are today's top picks:</h2>`;
        }

        if (state.products.length === 0) {
            html += `<div class="empty-state"><h3>No products available at the moment.</h3></div>`;
            ui.renderView(html);
            return;
        }

        html += `<div class="product-grid">`;

        // Only show up to 3 products if NOT logged in, show all if logged in
        const displayProducts = state.user ? state.products : state.products.slice(0, 3);

        displayProducts.forEach(p => {
            html += `
                <div class="card product-card">
                    <img src="${p.imageUrl || 'https://via.placeholder.com/200'}" alt="${p.name}">
                    <div class="product-category">${p.category || 'General'}</div>
                    <div class="product-title">${p.name}</div>
                    <div class="product-price">₹${p.price.toLocaleString('en-IN')}</div>
                    <button class="btn btn-primary mt-10" onclick="${state.user ? `app.addToCart(${p.id})` : `app.showLogin()`}">${state.user ? 'Add to Cart' : 'Login to Buy'}</button>
                </div>
            `;
        });
        html += `</div>`;

        if (!state.user && state.products.length > 3) {
            html += `
                <div class="text-center mt-20">
                    <p style="color: var(--text-light); margin-bottom: 15px;">Login to view thousands of more products!</p>
                </div>
            `;
        }

        ui.renderView(html);
    },

    renderCart: () => {
        if (state.cart.length === 0) {
            ui.renderView(`
                <div class="card empty-state">
                    <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/empty-cart_ee1603.png" alt="Empty Cart">
                    <h3>Your cart is empty!</h3>
                    <p>Add items to it now.</p>
                    <button class="btn btn-primary mt-10" onclick="app.navigate('home')">Shop Now</button>
                </div>
            `);
            return;
        }

        let html = `
            <div class="card">
                <h2 class="mb-20">Shopping Cart</h2>
                <div class="flex-row">
                    <div class="flex-2">
        `;

        state.cart.forEach(item => {
            html += `
                <div class="cart-item">
                    <img src="${item.product.imageUrl || 'https://via.placeholder.com/100'}" alt="${item.product.name}">
                    <div style="flex-grow:1;">
                        <h3>${item.product.name}</h3>
                        <div class="product-price mt-10">₹${item.product.price.toLocaleString('en-IN')}</div>
                        <div class="qty-controls">
                            <button class="qty-btn" onclick="app.updateCartItemCount(${item.product.id}, -1)">-</button>
                            <span style="border:1px solid #c2c2c2; padding: 2px 15px;">${item.quantity}</span>
                            <button class="qty-btn" onclick="app.updateCartItemCount(${item.product.id}, 1)">+</button>
                        </div>
                    </div>
                </div>
            `;
        });

        const total = app.getCartTotalPrice();
        html += `
                    </div>
                    <div class="flex-1">
                        <div class="card" style="box-shadow: 0 1px 4px 0 rgba(0,0,0,.15); position:sticky; top: 80px;">
                            <h3 style="color:var(--text-light); border-bottom: 1px solid var(--border-color); padding-bottom: 15px; margin-bottom: 15px;">PRICE DETAILS</h3>
                            <div style="display:flex; justify-content:space-between; margin-bottom:15px; font-size:16px;">
                                <span>Price (${app.getCartTotalCount()} items)</span>
                                <span>₹${total.toLocaleString('en-IN')}</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; margin-bottom:15px; font-size:16px;">
                                <span>Delivery Charges</span>
                                <span style="color:var(--success-color)">FREE</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; margin-top:15px; padding-top:15px; border-top: 1px dashed var(--border-color); font-size:18px; font-weight:bold;">
                                <span>Total Amount</span>
                                <span>₹${total.toLocaleString('en-IN')}</span>
                            </div>
                            <button class="btn btn-buy-now mt-20" style="width:100%; border-radius: 2px" onclick="app.startCheckout()">PLACE ORDER</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        ui.renderView(html);
    },

    renderOrders: () => {
        if (state.orders.length === 0) {
            ui.renderView(`<div class="card empty-state"><h3>You have no orders yet.</h3></div>`);
            return;
        }

        let html = `<h2>Track Your Orders</h2><div class="mt-20">`;
        state.orders.forEach(order => {
            const date = new Date(order.createdAt).toLocaleDateString();

            html += `
                <div class="card mb-20" style="display:flex; gap:20px;">
                    <div style="flex:1;">
                        <h3 style="color:var(--primary-color)">Order #${order.id}</h3>
                        <p style="color:var(--text-light); font-size:12px;">Placed on: ${date}</p>
                        <ul style="margin-top:10px; margin-left: 20px; font-size:14px; line-height:1.6">
            `;
            order.items.forEach(item => {
                html += `<li>${item.quantity}x ${item.product.name} - ₹${item.price.toLocaleString('en-IN')}</li>`;
            });
            html += `
                        </ul>
                        <div class="mt-20 font-weight-bold">Total: ₹${order.totalAmount.toLocaleString('en-IN')}</div>
                    </div>
                    <div style="flex:1;">
                        <h4>Status Tracking</h4>
                        <div class="mt-10 mb-10" style="font-size:13px; color:var(--text-light); background:#f5faff; padding:10px; border-radius:4px; border:1px solid #e0e0e0;">
                            <b>Delivery To:</b><br>${order.deliveryAddress || 'N/A'}
                        </div>
                        <div class="order-timeline">
                            <div class="timeline-item active">
                                <b>Ordered</b><br><small>${date}</small>
                            </div>
                            <div class="timeline-item ${order.status === 'SHIPPED' || order.status === 'DELIVERED' ? 'active' : ''}">
                                <b>Shipped</b><br><small>${order.status === 'SHIPPED' ? 'In transit' : 'Pending'}</small>
                            </div>
                            <div class="timeline-item ${order.status === 'DELIVERED' ? 'active' : ''}">
                                <b>Delivered</b><br><small>${order.status === 'DELIVERED' ? 'Package arrived' : 'Expected soon'}</small>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        html += `</div>`;
        ui.renderView(html);
    },

    renderAdmin: async () => {
        let html = `<div class="card"><h2>Admin Dashboard</h2><div class="flex-row mt-20">`;

        // Fetch All Orders
        let ordersHtml = '';
        try {
            const res = await fetch(`${C.API}/admin/orders`, { credentials: 'include' });
            if (res.ok) {
                const allOrders = await res.json();
                ordersHtml = `<table class="admin-table"><tr><th>ID</th><th>User</th><th>Address</th><th>Total</th><th>Status</th><th>Action</th></tr>`;
                allOrders.forEach(o => {
                    ordersHtml += `
                        <tr>
                            <td>#${o.id}</td>
                            <td>${o.user.username}</td>
                            <td style="max-width:200px; font-size:12px;">${o.deliveryAddress || 'N/A'}</td>
                            <td>₹${o.totalAmount.toLocaleString('en-IN')}</td>
                            <td>${o.status}</td>
                            <td>
                                <select onchange="app.updateOrderStatus(${o.id}, this.value)">
                                    <option value="PLACED" ${o.status === 'PLACED' ? 'selected' : ''}>PLACED</option>
                                    <option value="SHIPPED" ${o.status === 'SHIPPED' ? 'selected' : ''}>SHIPPED</option>
                                    <option value="DELIVERED" ${o.status === 'DELIVERED' ? 'selected' : ''}>DELIVERED</option>
                                </select>
                            </td>
                        </tr>
                    `;
                });
                ordersHtml += `</table>`;
            }
        } catch (e) { }

        // Build product list for management
        let productListHtml = '';
        if (state.products.length > 0) {
            productListHtml = `<table class="admin-table" style="margin-top:10px"><tr><th>Name</th><th>Price</th><th>Category</th><th>Actions</th></tr>`;
            state.products.forEach(p => {
                productListHtml += `
                    <tr>
                        <td>${p.name}</td>
                        <td>₹${p.price.toLocaleString('en-IN')}</td>
                        <td>${p.category || '-'}</td>
                        <td style="white-space:nowrap;">
                            <button class="btn" style="font-size:12px; padding:4px 10px; margin-right:4px; background:var(--primary-color); color:white;" onclick="app.populateEditForm(${p.id})">✏️ Edit</button>
                            <button class="btn" style="font-size:12px; padding:4px 10px; background:#e53935; color:white;" onclick="app.deleteProduct(${p.id})">🗑️ Delete</button>
                        </td>
                    </tr>
                `;
            });
            productListHtml += `</table>`;
        } else {
            productListHtml = `<p style="color:var(--text-light)">No products yet. Add one below!</p>`;
        }

        html += `
            <div style="flex: 1">
                <h3>All Orders</h3>
                ${ordersHtml || '<p>No orders to manage.</p>'}
            </div>
            <div style="flex: 1">
                <h3>Manage Products</h3>
                ${productListHtml}
                <h3 style="margin-top:20px;" id="productFormTitle">➕ Add New Product</h3>
                <form id="addProductForm" onsubmit="app.handleAddProduct(event)" class="mt-20">
                    <input type="hidden" id="pEditId">
                    <div class="form-group"><input type="text" id="pName" required placeholder=" "><label>Product Name</label></div>
                    <div class="form-group"><input type="number" step="0.01" id="pPrice" required placeholder=" "><label>Price (₹)</label></div>
                    <div class="form-group"><input type="text" id="pCategory" placeholder=" "><label>Category</label></div>
                    <div class="form-group"><input type="text" id="pImage" placeholder=" "><label>Image URL</label></div>
                    <button class="btn btn-primary" type="submit" id="pSubmitBtn">Publish Product</button>
                    <button class="btn" type="button" style="margin-left:10px; background:#ccc; color:#333;" onclick="app.resetProductForm()" id="pCancelBtn" style="display:none">Cancel Edit</button>
                </form>
            </div>
        `;
        html += `</div></div>`;
        ui.renderView(html);
    },

    populateEditForm: (productId) => {
        const product = state.products.find(p => p.id === productId);
        if (!product) return;
        document.getElementById('pEditId').value = product.id;
        document.getElementById('pName').value = product.name;
        document.getElementById('pPrice').value = product.price;
        document.getElementById('pCategory').value = product.category || '';
        document.getElementById('pImage').value = product.imageUrl || '';
        document.getElementById('productFormTitle').innerText = `✏️ Editing: ${product.name}`;
        document.getElementById('pSubmitBtn').innerText = 'Save Changes';
        document.getElementById('pCancelBtn').style.display = 'inline-flex';
        document.getElementById('pName').focus();
    },

    resetProductForm: () => {
        document.getElementById('pEditId').value = '';
        document.getElementById('addProductForm').reset();
        document.getElementById('productFormTitle').innerText = '➕ Add New Product';
        document.getElementById('pSubmitBtn').innerText = 'Publish Product';
        document.getElementById('pCancelBtn').style.display = 'none';
    },

    deleteProduct: async (productId) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            const res = await fetch(`${C.API}/products/${productId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (res.ok) {
                ui.showToast('Product deleted!');
                await app.fetchProducts();
                app.navigate('admin');
            } else {
                ui.showToast('Failed to delete product');
            }
        } catch (e) {
            ui.showToast('Network Error');
        }
    },

    startCheckout: () => {
        if (!state.user) return app.showLogin();
        const total = app.getCartTotalPrice();
        document.getElementById('payAmount').innerText = total.toLocaleString('en-IN');

        // Reset modal state
        document.getElementById('payLoading').style.display = 'none';
        document.getElementById('paymentSuccess').style.display = 'none';
        document.getElementById('qrCodeContainer').style.display = 'block';
        document.getElementById('btnPayNow').style.display = 'inline-flex';
        ui.showModal('paymentModal');
    },

    processPayment: () => {
        document.getElementById('payLoading').style.display = 'block';
        document.getElementById('qrCodeContainer').style.display = 'none';
        document.getElementById('btnPayNow').style.display = 'none';

        // Simulate a delay for the fake payment gateway
        setTimeout(() => {
            // Show Success Animation before transitioning
            document.getElementById('payLoading').style.display = 'none';
            document.getElementById('paymentSuccess').style.display = 'block';

            setTimeout(async () => {
                ui.closeModal('paymentModal');

                const addr = document.getElementById('deliveryAddress').value;

                const payload = {
                    items: state.cart.map(i => ({ productId: i.product.id, quantity: i.quantity, price: i.product.price })),
                    totalAmount: app.getCartTotalPrice(),
                    paymentStatus: 'PAID',
                    deliveryAddress: addr || 'Not provided'
                };

                try {
                    const res = await fetch(`${C.API}/orders/checkout`, {
                        method: 'POST',
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    if (res.ok) {
                        state.cart = []; // Empty cart
                        app.updateCartItemCount(0, 0); // trigger redraw
                        ui.showToast('Payment Successful! Order Placed.');
                        app.navigate('orders');
                    } else {
                        ui.showToast('Checkout failed processing serverside.');
                    }
                } catch (e) {
                    ui.showToast('Network error during checkout.');
                }
            }, 2000); // 2 second success message hold
        }, 2500); // 2.5 second fake processing
    },

    updateOrderStatus: async (id, newStatus) => {
        try {
            await fetch(`${C.API}/admin/orders/${id}/status`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            ui.showToast('Order status updated');
            await app.fetchProducts();
            app.navigate('admin');
        } catch (e) {
            ui.showToast('Update failed');
        }
    },

    handleAddProduct: async (e) => {
        e.preventDefault();
        const editId = document.getElementById('pEditId').value;
        const payload = {
            name: document.getElementById('pName').value,
            price: parseFloat(document.getElementById('pPrice').value),
            category: document.getElementById('pCategory').value,
            imageUrl: document.getElementById('pImage').value || 'https://via.placeholder.com/200'
        };

        const isEdit = editId && editId !== '';
        const url = isEdit ? `${C.API}/products/${editId}` : `${C.API}/products`;
        const method = isEdit ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method: method,
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                ui.showToast(isEdit ? 'Product Updated!' : 'Product Added!');
                e.target.reset();
                await app.fetchProducts();
                app.navigate('admin');
            } else {
                const errText = await res.text();
                ui.showToast('Failed: ' + (errText || 'Make sure you are logged in as Admin'));
            }
        } catch (err) {
            ui.showToast('Network Error');
        }
    },

    // Auth flows
    showLogin: () => {
        ui.closeModal('registerModal');
        ui.showModal('authModal');
    },
    showRegister: () => {
        ui.closeModal('authModal');
        ui.showModal('registerModal');
    },

    handleLogin: async (e) => {
        e.preventDefault();
        const u = document.getElementById('loginUsername').value;
        const p = document.getElementById('loginPassword').value;

        try {
            const res = await fetch(`${C.API}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: u, password: p })
            });

            if (res.ok) {
                ui.closeModal('authModal');
                ui.showToast('Logged in successfully');
                await app.checkSession();
                app.navigate('home');
            } else {
                document.getElementById('loginError').innerText = 'Invalid username or password';
            }
        } catch (e) {
            document.getElementById('loginError').innerText = 'Network error. Try again.';
        }
    },

    handleRegister: async (e) => {
        e.preventDefault();
        const u = document.getElementById('regUsername').value;
        const p = document.getElementById('regPassword').value;

        try {
            const res = await fetch(`${C.API}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: u, password: p })
            });

            if (res.ok) {
                ui.closeModal('registerModal');
                ui.showToast('Registration successful! Please login.');
                app.showLogin();
            } else {
                const text = await res.text();
                document.getElementById('regError').innerText = text || 'Registration failed';
            }
        } catch (e) {
            document.getElementById('regError').innerText = 'Network error. Try again.';
        }
    },

    logout: async () => {
        try {
            await fetch(`${C.API}/auth/logout`, { method: 'POST' });
        } catch (e) { }
        state.user = null;
        state.cart = [];
        ui.showToast('Logged out');
        ui.renderNavbar();
        app.navigate('home');
    }
};

window.onload = app.init;
