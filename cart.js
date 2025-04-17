document.addEventListener('DOMContentLoaded', function() {
    // Lấy các phần tử DOM cần dùng
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartTable = document.getElementById('cart-table');
    const cartSummary = document.querySelector('.cart-summary');
    const continueShoppingBtn = document.getElementById('continue-shopping');
    const checkoutBtn = document.getElementById('checkout-button');
    const shopNowBtn = document.getElementById('shop-now');

    // Load giỏ hàng từ localStorage
    loadCartFromLocalStorage();

    // Cập nhật số sản phẩm trong giỏ hàng
    function updateCartCount() {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCount = cartItems.reduce((total, item) => total + parseInt(item.quantity), 0);
        
        // Cập nhật số lượng ở header nếu có phần tử hiển thị số lượng
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = cartCount;
        }
        
        // Cập nhật hiển thị của giỏ hàng
        if (cartItems.length === 0) {
            cartTable.style.display = 'none';
            cartSummary.style.display = 'none';
            emptyCartMessage.style.display = 'block';
        } else {
            cartTable.style.display = 'table';
            cartSummary.style.display = 'flex';
            emptyCartMessage.style.display = 'none';
        }
    }

    // Định dạng số tiền
    function formatCurrency(amount) {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // Tính tổng tiền
    function calculateTotal() {
        const cartItems = document.querySelectorAll('#cart-items tr');
        let total = 0;
        
        cartItems.forEach(item => {
            const price = parseInt(item.querySelector('.item-price').getAttribute('data-price'));
            const quantity = parseInt(item.querySelector('.quantity-input').value);
            total += price * quantity;
        });
        
        totalPriceElement.textContent = formatCurrency(total);
        return total;
    }

    // Cập nhật giỏ hàng trong localStorage
    function updateCartLocalStorage() {
        const cartItems = [];
        const itemRows = document.querySelectorAll('#cart-items tr');
        
        itemRows.forEach(row => {
            const productId = row.getAttribute('data-id');
            const productName = row.querySelector('.product-name').textContent;
            const productImage = row.querySelector('.product-image').src;
            const productPrice = parseInt(row.querySelector('.item-price').getAttribute('data-price'));
            const quantity = parseInt(row.querySelector('.quantity-input').value);
            
            cartItems.push({
                id: productId,
                name: productName,
                image: productImage,
                price: productPrice,
                quantity: quantity
            });
        });
        
        localStorage.setItem('cart', JSON.stringify(cartItems));
        updateCartCount();
    }

    // Tải giỏ hàng từ localStorage
    function loadCartFromLocalStorage() {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Xóa tất cả các sản phẩm hiện tại trong giỏ hàng
        cartItemsContainer.innerHTML = '';
        
        // Thêm các sản phẩm từ localStorage vào giỏ hàng
        cartItems.forEach(item => {
            addItemToCartDOM(item);
        });
        
        // Cập nhật tổng tiền và số lượng
        calculateTotal();
        updateCartCount();
    }

    // Thêm sản phẩm vào DOM
    function addItemToCartDOM(item) {
        const row = document.createElement('tr');
        row.setAttribute('data-id', item.id);
        
        const subtotal = item.price * item.quantity;
        
        row.innerHTML = `
            <td>
                <div class="product-info">
                    <img src="${item.image}" alt="${item.name}" class="product-image">
                    <span class="product-name">${item.name}</span>
                </div>
            </td>
            <td><span class="item-price" data-price="${item.price}">${formatCurrency(item.price)}</span><sup>đ</sup></td>
            <td><input type="number" class="quantity-input" value="${item.quantity}" min="1"></td>
            <td><span class="item-subtotal">${formatCurrency(subtotal)}</span><sup>đ</sup></td>
            <td><button class="delete-btn"><i class="fa-solid fa-trash"></i></button></td>
        `;
        
        cartItemsContainer.appendChild(row);
        
        // Thêm event listener cho input số lượng
        const quantityInput = row.querySelector('.quantity-input');
        quantityInput.addEventListener('change', function() {
            if (parseInt(this.value) < 1) {
                this.value = 1;
            }
            
            // Cập nhật thành tiền
            const price = parseInt(row.querySelector('.item-price').getAttribute('data-price'));
            const subtotal = price * parseInt(this.value);
            row.querySelector('.item-subtotal').textContent = formatCurrency(subtotal);
            
            // Cập nhật tổng tiền và localStorage
            calculateTotal();
            updateCartLocalStorage();
        });
        
        // Thêm event listener cho nút xóa
        const deleteBtn = row.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', function() {
            row.remove();
            calculateTotal();
            updateCartLocalStorage();
        });
    }

    // Event listeners cho các nút
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            alert('Cảm ơn bạn đã mua hàng! Đơn hàng của bạn đang được xử lý.');
            // Xóa giỏ hàng sau khi thanh toán
            localStorage.removeItem('cart');
            loadCartFromLocalStorage();
        });
    }
    
    if (shopNowBtn) {
        shopNowBtn.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }
});

// Hàm thêm sản phẩm vào giỏ hàng (có thể được gọi từ trang sản phẩm)
function addToCart(productId, productName, productImage, productPrice) {
    // Lấy giỏ hàng hiện tại từ localStorage
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const existingItemIndex = cartItems.findIndex(item => item.id === productId);
    
    if (existingItemIndex !== -1) {
        // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng lên 1
        cartItems[existingItemIndex].quantity += 1;
    } else {
        // Nếu sản phẩm chưa có trong giỏ hàng, thêm sản phẩm mới
        cartItems.push({
            id: productId,
            name: productName,
            image: productImage,
            price: productPrice,
            quantity: 1
        });
    }
    
    // Lưu giỏ hàng vào localStorage
    localStorage.setItem('cart', JSON.stringify(cartItems));
    
    // Hiển thị thông báo
    alert('Đã thêm sản phẩm vào giỏ hàng!');
    
    // Cập nhật số lượng sản phẩm trong giỏ hàng trên header
    updateCartCountDisplay();
}

// Hàm cập nhật hiển thị số lượng sản phẩm trong giỏ hàng
function updateCartCountDisplay() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cartItems.reduce((total, item) => total + parseInt(item.quantity), 0);
    
    // Cập nhật số lượng trên nút giỏ hàng
    const cartButton = document.querySelector('.cart-button');
    if (cartButton) {
        cartButton.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> Giỏ hàng (${cartCount})`;
    }
}

// Cập nhật số lượng khi trang được tải
document.addEventListener('DOMContentLoaded', function() {
    updateCartCountDisplay();
});