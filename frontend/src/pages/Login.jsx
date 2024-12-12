import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import yuri from "../assets/img/log-in-yuzu.png";
import imgLogin from "../assets/img_login.png";
import HeaderLogin from "../components/Login/HeaderLogin";

const Login = () => {
  const [username, setUsername] = useState(""); // Tên đăng nhập
  const [password, setPassword] = useState(""); // Mật khẩu
  const [errorMessage, setErrorMessage] = useState(""); // Thông báo lỗi
  const navigate = useNavigate(); // Điều hướng sau khi đăng nhập thành công

  // Xử lý sự kiện gửi form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn không reload trang khi submit

    try {
        // Gửi yêu cầu đăng nhập đến backend
        const response = await axios.post("http://localhost:5000/api/login", {
            username: username.trim(),
            password: password.trim(),
        });

        if (response.data.success) {
            // Lưu thông tin session vào localStorage
            localStorage.setItem("session", JSON.stringify(response.data.session));

            // Lưu thông tin người dùng, bao gồm IdUser, UserName và avatar
            localStorage.setItem("user", JSON.stringify({
                id: response.data.user.IdUser,
                username: response.data.user.UserName,
                avatar: response.data.user.avatar || "/default-avatar.png", // Sử dụng avatar từ API hoặc avatar mặc định
            }));

            // Điều hướng đến trang chính hoặc trang lưu trước đó
            const redirectUrl = localStorage.getItem("redirectAfterLogin") || "/";
            localStorage.removeItem("redirectAfterLogin");
            navigate(redirectUrl);
        } else {
            // Hiển thị thông báo lỗi nếu đăng nhập thất bại
            setErrorMessage(response.data.message || "Đăng nhập thất bại!");
        }
    } catch (error) {
        // Hiển thị thông báo lỗi khi có vấn đề với yêu cầu
        setErrorMessage("Có lỗi xảy ra. Vui lòng thử lại sau.");
        console.error("Login error:", error);
    }
};


  return (
    <>
      <HeaderLogin />
      <div className="main-login">
        <div className="main-login__content w-100">
          <h3 className="main__title">LOGIN</h3>
          <form className="form-login" onSubmit={handleSubmit}>
            <div className="content-login form-group">
              {/* Input cho tên đăng nhập */}
              <div className="inputBox">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="off"
                  placeholder="Username"
                />
                <span>Username</span>
                <i></i>
              </div>

              {/* Input cho mật khẩu */}
              <div className="inputBox">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="Password"
                />
                <span>Password</span>
                <i></i>
              </div>

              {/* Hiển thị lỗi nếu có */}
              {errorMessage && <div className="text-danger">{errorMessage}</div>}

              {/* Nút đăng nhập */}
              <div className="login">
                <input type="submit" value="Đăng nhập" />
              </div>

              <h6>or</h6>

              {/* Đăng nhập qua mạng xã hội */}
              <div className="other">
                <div className="facebook">
                  <a href="#">
                    <i className="ri-facebook-fill"></i>
                  </a>
                </div>
                <div className="google">
                  <a href={`http://localhost:5000/api/auth/google`}>
                    <i className="ri-google-fill"></i>
                  </a>
                </div>
              </div>

              {/* Đăng ký tài khoản mới */}
              <div className="regis">
                Bạn chưa có tài khoản?{" "}
                <a href="/register" className="register-link">
                  ĐĂNG KÝ
                </a>
              </div>
            </div>

            {/* Hình ảnh trang login */}
            <div className="img">
              <img src={imgLogin} alt="anh login" className="img-login" />
              <img src={yuri} alt="anh login" className="img-login-cat" />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
