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