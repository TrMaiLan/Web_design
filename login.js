document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Ngừng hành động gửi form để xử lý thủ công
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    // Lấy danh sách người dùng từ localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        // Lưu trạng thái đăng nhập vào localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify({
            username: user.username,
            name: user.name || user.username
        }));
        
        // Nếu người dùng chọn "Ghi nhớ đăng nhập"
        if (remember) {
            localStorage.setItem('rememberUser', username);
        } else {
            localStorage.removeItem('rememberUser');
        }
        
        // Hiển thị thông báo thành công
        document.getElementById('error-message').style.color = '#4CAF50';
        document.getElementById('error-message').innerText = 'Đăng nhập thành công! Đang chuyển hướng...';
        
        // Chuyển hướng sau 1 giây
        setTimeout(function() {
            window.location.href = 'Home.html'; // Chuyển hướng về trang chủ
        }, 1000);
    } else {
        // Hiển thị thông báo lỗi
        document.getElementById('error-message').innerText = 'Tên người dùng hoặc mật khẩu không đúng!';
        
        // Xóa mật khẩu để người dùng nhập lại
        document.getElementById('password').value = '';
    }
});

// Kiểm tra xem có thông tin "ghi nhớ đăng nhập" không
window.addEventListener('DOMContentLoaded', function() {
    const rememberedUser = localStorage.getItem('rememberUser');
    if (rememberedUser) {
        document.getElementById('username').value = rememberedUser;
        document.getElementById('remember').checked = true;
    }
    
    // Nếu người dùng đã đăng nhập, chuyển hướng đến trang chủ
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
        window.location.href = 'Home.html';
    }
});