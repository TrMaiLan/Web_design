document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Ngừng hành động gửi form để xử lý thủ công
    
    // Lấy thông tin từ các trường đầu vào
    const fullname = document.getElementById('fullname').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm_password').value;
    const termsAgreed = document.getElementById('terms').checked;
    
    // Reset thông báo lỗi
    document.getElementById('error-message').innerText = '';
    
    // Kiểm tra mật khẩu có khớp không
    if (password !== confirmPassword) {
        document.getElementById('error-message').innerText = 'Mật khẩu không khớp!';
        return;
    }
    
    // Kiểm tra email có đúng định dạng không
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        document.getElementById('error-message').innerText = 'Email không đúng định dạng!';
        return;
    }
    
    // Kiểm tra độ mạnh của mật khẩu (ít nhất 8 ký tự)
    if (password.length < 8) {
        document.getElementById('error-message').innerText = 'Mật khẩu phải có ít nhất 8 ký tự!';
        return;
    }
    
    // Kiểm tra điều khoản sử dụng
    if (!termsAgreed) {
        document.getElementById('error-message').innerText = 'Bạn phải đồng ý với điều khoản sử dụng!';
        return;
    }
    
    // Kiểm tra nếu người dùng đã đăng ký trước đó
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.some(user => user.username === username || user.email === email);
    
    if (userExists) {
        document.getElementById('error-message').innerText = 'Tên đăng nhập hoặc email đã được sử dụng!';
        return;
    }
    
    // Tạo đối tượng người dùng mới
    const newUser = {
        fullname: fullname,
        username: username,
        email: email,
        password: password,
        signupedDate: new Date().toISOString()
    };
    
    // Lưu vào localStorage
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Hiển thị thông báo thành công
    document.getElementById('error-message').style.color = '#4CAF50';
    document.getElementById('error-message').innerText = 'Đăng ký thành công! Đang chuyển hướng...';
    
    // Chuyển hướng đến trang đăng nhập sau 2 giây
    setTimeout(function() {
        window.location.href = 'login.html';
    }, 2000);
});