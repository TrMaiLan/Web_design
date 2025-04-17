document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartTable = document.getElementById('cart-table');
    const cartSummary = document.querySelector('.cart-summary');
    const continueShoppingBtn = document.getElementById('continue-shopping');
    const checkoutBtn = document.getElementById('checkout-button');
    const shopNowBtn = document.getElementById('shop-now');

    function formatCurrency(amount) {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
    }

    function updateCartCountDisplay() {
        const cartItems = JSON.parse(localStorage.getItem('orderDetails')) || [];
        const cartCount = cartItems.length;
        const cartCountElement = document.querySelector('.cart-count');
        const cartButton = document.querySelector('.cart-button');

        if (cartCountElement) {
            cartCountElement.textContent = cartCount;
        }

        if (cartButton) {
            cartButton.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> Giỏ hàng (${cartCount})`;
        }
    }

    function updateCartDisplay() {
        const cartItems = JSON.parse(localStorage.getItem('orderDetails')) || [];
        cartItemsContainer.innerHTML = '';

        if (cartItems.length === 0) {
            cartTable.style.display = 'none';
            cartSummary.style.display = 'none';
            emptyCartMessage.style.display = 'block';
            totalPriceElement.textContent = '0đ';
            return;
        }

        cartTable.style.display = 'table';
        cartSummary.style.display = 'flex';
        emptyCartMessage.style.display = 'none';

        let total = 0;

        cartItems.forEach((item, index) => {
            const row = document.createElement('tr');
            const price = parseInt(item.price.replace(/\D/g, '')) || 0;
            const quantity = item.quantity || 1;
            const subtotal = price * quantity;
            total += subtotal;

            row.innerHTML = `
                <td>
                    <div class="product-info">
                        <img src="${item.photo}" alt="${item.name}" class="product-image">
                        <span class="product-name">${item.name}</span>
                    </div>
                </td>
                <td><span class="item-price" data-price="${price}">${formatCurrency(price)}</span></td>
                <td><input type="number" class="quantity-input" value="${quantity}" min="1"></td>
                <td><span class="item-subtotal">${formatCurrency(subtotal)}</span></td>
                <td><button class="delete-btn"><i class="fa-solid fa-trash"></i></button></td>
            `;

            cartItemsContainer.appendChild(row);

            const quantityInput = row.querySelector('.quantity-input');
            quantityInput.addEventListener('change', () => {
                let newQuantity = parseInt(quantityInput.value);
                if (isNaN(newQuantity) || newQuantity < 1) {
                    newQuantity = 1;
                    quantityInput.value = 1;
                }
                item.quantity = newQuantity;
                localStorage.setItem('orderDetails', JSON.stringify(cartItems));
                updateCartDisplay();
                updateCartCountDisplay();
            });

            const deleteBtn = row.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                cartItems.splice(index, 1);
                localStorage.setItem('orderDetails', JSON.stringify(cartItems));
                updateCartDisplay();
                updateCartCountDisplay();
            });
        });

        totalPriceElement.textContent = formatCurrency(total);
    }

    window.addToCart = function(productId, productName, productImage, productPrice) {
        let cartItems = JSON.parse(localStorage.getItem('orderDetails')) || [];
        const existingItem = cartItems.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItems.push({
                id: productId,
                name: productName,
                photo: productImage,
                price: productPrice,
                quantity: 1
            });
        }

        localStorage.setItem('orderDetails', JSON.stringify(cartItems));
        alert('Đã thêm sản phẩm vào giỏ hàng!');
        updateCartCountDisplay();
    };

    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            window.location.href = 'pay.html';
        });
    }

    if (shopNowBtn) {
        shopNowBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    updateCartDisplay();
    updateCartCountDisplay();
});
