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
            img.src = `img_dantranh${j}.jpg`; // Đường dẫn ảnh
            img.alt = `Đàn tranh ${j}`; // Văn bản thay thế
            img.dataset.index = j; // Lưu chỉ số ảnh
            
            // Khi click vào ảnh nhỏ thì cập nhật ảnh chính
            img.onclick = function() {
                i = parseInt(this.dataset.index); // Lấy chỉ số từ ảnh
                document.getElementById("slide").src = `img_dantranh${i}.jpg`; // Hiển thị ảnh chính
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
    document.getElementById("slide").setAttribute("src", "img_dantranh" + i + ".jpg");
    updateSlideRight(); //cập nhật slide-right
}

// Hàm chuyển đến slide trước đó
function back() {
    if (i == 1) i = n;
    else i--;
    document.getElementById("slide").setAttribute("src", "img_dantranh" + i + ".jpg");
    updateSlideRight();
}

// Hàm tự động chạy slideshow
function autoPlay() {
    setInterval(next, 9000); // Chuyển slide sau mỗi 3 giây
}

// Hàm thay đổi slide (sử dụng cho các nút điều khiển)
function changeSlide(direction) {
    if (direction > 0) {
        next();
    } else {
        back();
    }
}

// Xử lý số lượng sản phẩm
function handleQuantity() {
    const minusBtn = document.querySelector('.minus');
    const plusBtn = document.querySelector('.plus');
    const quantityInput = document.getElementById('product-quantity');
    
    if(minusBtn && plusBtn && quantityInput) {
        minusBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            if(value > 1) {
                quantityInput.value = value - 1;
            }
        });
        
        plusBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            quantityInput.value = value + 1;
        });
    }
}

// Xử lý các tab
function showTab(tabId, event) {
    const contents = document.querySelectorAll('.tab-content');
    const buttons = document.querySelectorAll('.tab-button');
    
    contents.forEach(c => c.classList.remove('active'));
    buttons.forEach(b => b.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    if (event) {
        event.target.classList.add('active');
    }
}

// Xử lý khi trang được tải
window.onload = function() {
    updateSlideRight(); // Gọi hàm cập nhật ảnh nhỏ
    autoPlay(); // Khởi động slideshow tự động
    handleQuantity(); // Xử lý tăng/giảm số lượng
    
    // Mặc định hiển thị tab đầu tiên
    document.querySelector('.tab-button').classList.add('active');
    document.querySelector('.tab-content').classList.add('active');
};

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
        var item = $(this).closest(".product-info");
        var name = item.find("h2").text();
        var price = item.find(".price-container span:nth-child(2)").text();
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