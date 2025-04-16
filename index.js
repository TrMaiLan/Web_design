// Biến cho slideshow
var n = 5; // Tổng số hình ảnh trong slideshow
var i = 1; // Vị trí hiện tại của slideshow

// Hàm cập nhật các ảnh nhỏ bên phải (trừ ảnh đang hiển thị)
function updateSlideRight() {
    const slideRight = document.getElementById("slide-right");
    slideRight.innerHTML = ""; // Xóa hết các ảnh nhỏ cũ

    // Thêm các ảnh (trừ ảnh đang hiển thị)
    for (let j = 1; j <= n; j++) {
        if (j !== i) { // Nếu không phải ảnh đang hiển thị
            const li = document.createElement("li"); // Tạo thẻ li
            const img = document.createElement("img"); // Tạo thẻ img
            img.src = `slide${j}.jpg`; // Đường dẫn ảnh
            img.alt = `Slide ${j}`; // Văn bản thay thế
            img.dataset.index = j; // Lưu chỉ số ảnh

            // Khi click vào ảnh nhỏ thì cập nhật ảnh chính
            img.onclick = function() {
                i = parseInt(this.dataset.index); // Lấy chỉ số từ ảnh
                document.getElementById("slide").src = `slide${i}.jpg`; // Hiển thị ảnh chính
                updateSlideRight(); // Cập nhật lại danh sách ảnh nhỏ
            };

            li.appendChild(img); // Thêm ảnh vào thẻ li
            slideRight.appendChild(li); // Thêm li vào danh sách bên phải
        }
    }
}

// Hàm chuyển đến slide tiếp theo
function next() {
    if (i == n) i = 1;
    else i++;
    document.getElementById("slide").setAttribute("src", "slide" + i + ".jpg");
    updateSlideRight(); //cập nhật slide-right
}

// Hàm chuyển đến slide trước đó
function back() {
    if (i == 1) i = n;
    else i--;
    document.getElementById("slide").setAttribute("src", "slide" + i + ".jpg");
    updateSlideRight();
}

// Hàm tự động chạy slideshow
function autoPlay() {
    setInterval(next, 3000); // Chuyển slide sau mỗi 3 giây
}

// Hàm thay đổi slide (sử dụng cho các nút điều khiển)
function changeSlide(direction) {
    if (direction > 0) {
        next();
    } else {
        back();
    }
}

// Xử lý khi trang được tải
$(document).ready(function() {
    // Tự động chạy slideshow
    autoPlay();
    
    // Khởi tạo biến cho giỏ hàng
    var orderDetails = "";
    var count = 0;
    
    // Kiểm tra nếu đã có dữ liệu giỏ hàng trong localStorage
    if (localStorage.getItem("orderDetails")) {
        try {
            var savedOrders = JSON.parse(localStorage.getItem("orderDetails"));
            count = savedOrders.length;
            
            // Cập nhật số lượng trong giỏ hàng
            $("#cart a").text("Giỏ hàng (" + count + ")");
            
            // Tái tạo chuỗi orderDetails từ dữ liệu đã lưu
            savedOrders.forEach(function(order, index) {
                if (index > 0) orderDetails += ",";
                orderDetails += JSON.stringify(order);
            });
        } catch (e) {
            console.error("Lỗi khi đọc dữ liệu giỏ hàng:", e);
            localStorage.removeItem("orderDetails");
        }
    }
    
    // Xử lý sự kiện click vào nút "Thêm vào giỏ"
    $(".add-to-cart").click(function() {
        var item = $(this).closest(".items");
        var name = item.find("a").text();
        var price = item.find(".price-container span:first-child").text();
        var photo = item.find("img").attr("src");
        
        var order = {
            'name': name,
            'price': price,
            'photo': photo
        };
        
        // Thêm vào chuỗi orderDetails
        if (orderDetails.length > 0) {
            orderDetails += "," + JSON.stringify(order);
        } else {
            orderDetails = JSON.stringify(order);
        }
        
        // Lưu vào localStorage
        localStorage.setItem("orderDetails", "[" + orderDetails + "]");
        
        // Tăng số lượng và cập nhật giỏ hàng
        count += 1;
        $("#cart a").text("Giỏ hàng (" + count + ")");
        
        // Hiển thị thông báo
        alert("Đã thêm sản phẩm " + name + " vào giỏ hàng!");
    });
});


function toggleFullCart() {
    const cartSection = document.getElementById("cart-sidebar");
    if (cartSection.style.display === "none" || cartSection.style.display === "") {
        cartSection.style.display = "block";
        showFullCart();
    } else {
        cartSection.style.display = "none";
    }
}

function showFullCart() {
    const tbody = document.getElementById("cart-items");
    const totalSpan = document.getElementById("cart-total");

    tbody.innerHTML = "";
    let total = 0;

    let orderData = JSON.parse(localStorage.getItem("orderDetails")) || [];

    orderData.forEach((order, index) => {
        const priceNumber = parseInt(order.price.replace(/\D/g, ""));
        const row = document.createElement("tr");

        row.innerHTML = `
            <td><img src="${order.photo}" style="width: 50px; vertical-align: middle;"> ${order.name}</td>
            <td>${order.price}</td>
            <td><input type="number" value="1" min="1" class="quantity" data-price="${priceNumber}"></td>
            <td><button class="delete-btn" data-index="${index}">Xóa</button></td>
        `;

        tbody.appendChild(row);
    });

    // Sau khi render xong, gắn sự kiện
    updateTotal();

    // Gắn sự kiện thay đổi số lượng
    document.querySelectorAll(".quantity").forEach(input => {
        input.addEventListener("input", updateTotal);
    });

    // Gắn sự kiện xóa
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            const indexToRemove = parseInt(this.dataset.index);
            orderData.splice(indexToRemove, 1);
            localStorage.setItem("orderDetails", JSON.stringify(orderData));
            showFullCart(); // Reload lại cart
            document.querySelector("#cart a").textContent = "Giỏ hàng (" + orderData.length + ")";
        });
    });
}

// Hàm cập nhật tổng tiền
function updateTotal() {
    let total = 0;
    document.querySelectorAll(".quantity").forEach(input => {
        const quantity = parseInt(input.value) || 1;
        const price = parseInt(input.dataset.price);
        total += quantity * price;
    });
    document.getElementById("cart-total").textContent = total.toLocaleString();
}

// Hàm tìm kiếm sản phẩm với padding chuẩn
function searchProducts() {
    // Lấy từ khóa tìm kiếm
    var searchInput = document.querySelector("#search input").value.toLowerCase();
    
    // Nếu không có từ khóa, hiển thị lại tất cả
    if (searchInput.trim() === "") {
        showAllProducts();
        return;
    }
    
    // Tạo container cho kết quả tìm kiếm
    var resultsContainer = document.createElement("div");
    resultsContainer.id = "search-results";
    resultsContainer.className = "catel col-s-12 col-m-12 col-x-12";
    
    // Áp dụng style giống với container gốc
    resultsContainer.style.padding = "20px 10%";
    
    // Thêm tiêu đề
    var title = document.createElement("h1");
    title.textContent = "KẾT QUẢ TÌM KIẾM";
    resultsContainer.appendChild(title);
    
    // Tạo container sản phẩm
    var productsContainer = document.createElement("div");
    productsContainer.className = "products";
    resultsContainer.appendChild(productsContainer);
    
    // Lấy tất cả sản phẩm
    var allProducts = document.querySelectorAll(".items");
    var foundProducts = false;
    var addedNames = {}; // Đối tượng để kiểm tra trùng lặp
    
    // Kiểm tra từng sản phẩm
    allProducts.forEach(function(product) {
        var productName = product.querySelector("a").innerText.toLowerCase();
        
        // Nếu sản phẩm khớp với từ khóa và chưa được thêm vào
        if (productName.includes(searchInput) && !addedNames[productName]) {
            // Đánh dấu tên này đã được thêm
            addedNames[productName] = true;
            
            // Sao chép sản phẩm và thêm vào kết quả
            var clonedProduct = product.cloneNode(true);
            productsContainer.appendChild(clonedProduct);
            foundProducts = true;
        }
    });
    
    // Nếu không tìm thấy sản phẩm nào
    if (!foundProducts) {
        var message = document.createElement("p");
        message.textContent = "Không tìm thấy sản phẩm nào phù hợp.";
        message.style.textAlign = "center";
        message.style.padding = "20px";
        message.style.color = "#e75480";
        message.style.fontWeight = "bold";
        productsContainer.appendChild(message);
    }
    
    // Thêm nút quay lại
    var backButton = document.createElement("button");
    backButton.textContent = "Quay lại";
    backButton.style.marginBottom = "20px";
    backButton.style.padding = "5px 10px";
    backButton.style.backgroundColor = "#e75480";
    backButton.style.color = "white";
    backButton.style.border = "none";
    backButton.style.borderRadius = "5px";
    backButton.style.cursor = "pointer";
    backButton.style.display = "block"; 
    backButton.style.marginRight = "10px";
    backButton.onclick = showAllProducts;
    
    // Thêm thông tin từ khóa
    var keywordInfo = document.createElement("span");
    keywordInfo.innerHTML = 'Từ khóa: <strong style="color: #e75480">"' + searchInput + '"</strong>';
    keywordInfo.style.marginLeft = "10px";
    
    // Tạo một div để chứa nút quay lại và thông tin từ khóa
    var controlsDiv = document.createElement("div");
    controlsDiv.style.marginBottom = "15px";
    controlsDiv.appendChild(backButton);
    controlsDiv.appendChild(keywordInfo);
    
    resultsContainer.insertBefore(controlsDiv, resultsContainer.firstChild);
    
    // Xóa kết quả tìm kiếm cũ nếu có
    var oldResults = document.getElementById("search-results");
    if (oldResults) {
        oldResults.remove();
    }
    
    // Ẩn tất cả danh mục hiện tại
    var allCategories = document.querySelectorAll(".catel");
    allCategories.forEach(function(category) {
        category.style.display = "none";
    });
    
    // Hiển thị kết quả tìm kiếm
    document.querySelector("#banner").insertAdjacentElement("afterend", resultsContainer);
}

// Hàm hiển thị lại tất cả sản phẩm
function showAllProducts() {
    // Xóa kết quả tìm kiếm nếu có
    var searchResults = document.getElementById("search-results");
    if (searchResults) {
        searchResults.remove();
    }
    
    // Hiển thị lại tất cả danh mục
    var allCategories = document.querySelectorAll(".catel");
    allCategories.forEach(function(category) {
        category.style.display = "block";
    });
    
    // Xóa giá trị trong ô tìm kiếm
    document.querySelector("#search input").value = "";
}

// Thiết lập khi trang web tải xong
document.addEventListener("DOMContentLoaded", function() {
    var searchButton = document.querySelector("#search button");
    var searchInput = document.querySelector("#search input");
    
    // Khi nhấn nút tìm kiếm
    searchButton.addEventListener("click", function(e) {
        e.preventDefault();
        searchProducts();
    });
    
    // Khi nhấn Enter trong ô tìm kiếm
    searchInput.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            searchProducts();
        }
    });
    
    // Tùy chọn: Thêm hiệu ứng hover cho nút quay lại
    var style = document.createElement("style");
    style.textContent = `
        #search-results button:hover {
            background-color: #ff69b4 !important;
            transform: translateY(-2px);
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(style);
});
