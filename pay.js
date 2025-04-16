document.getElementById('order-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Ngăn không cho form gửi đi mặc định

    // Lấy giá trị các trường nhập
    const fullName = document.getElementById('full-name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const paymentMethod = document.getElementById('payment-method').value;
    
    const phoneRegex = /^0\d{9}$/;
    // Kiểm tra nếu có trường nào bị trống
    if (!fullName || !email || !phone || !address || !paymentMethod) {
        alert('Vui lòng điền đầy đủ thông tin.');
    } else if (!phoneRegex.test(phone)) {
        alert('Số điện thoại không hợp lệ. Vui lòng nhập lại.');
    } else {
        // Reset form và hiển thị thông báo
        alert('Đặt hàng thành công!');
        document.getElementById('order-form').reset();
        document.getElementById('result-message').style.display = 'block'; // Hiện thông báo
    }
});