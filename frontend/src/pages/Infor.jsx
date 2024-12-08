import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/module/infor.css";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/module/styleLogin.css";
// import avatarPlaceholder from "../assets/1004-the-worlds-finest-assassin-maha.png";
import HeaderLogin from "../components/Login/HeaderLogin";
const Infor = () => {
  const [userInfo, setUserInfo] = useState({
    username: "",
    fullName: "",
    birthDate: "",
    gender: "1",
  });

  const navigate = useNavigate();

  const location = useLocation();
  const params = new URLSearchParams(window.location.search);
  const userFromParams = params.get("user")
    ? JSON.parse(decodeURIComponent(params.get("user")))
    : null;

  const user = location.state?.user || userFromParams;

  console.log("Location state:", user);
  // console.log("User in state:", location.state?.user);

  const [avatar, setAvatar] = useState("");
  const [avatarsList, setAvatarsList] = useState([]);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const avatarResponse = await axios.get("http://localhost:5000/api/avatar/");
        const avatars = avatarResponse.data || [];
        setAvatarsList(avatars);

        // Lấy ngẫu nhiên một avatar từ danh sách
        if (avatars.length > 0) {
          const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
          setAvatar(randomAvatar.AvatarContent);
        }
      } catch (error) {
        setErrorMessage("Error fetching data. Please try again later.", error);
      }
    };

    fetchData();
  }, []);

  const toggleOverlay = () => {
    setOverlayVisible((prev) => !prev);
  };

  const handleAvatarSelect = (avatarUrl) => {
    setAvatar(avatarUrl);
    setOverlayVisible(false); // Ẩn overlay sau khi chọn avatar
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      if (!user?.IdUser) {
        // console.log("User IdUser is missing:", user?.IdUser);
        setErrorMessage("User ID is missing on the client!");
        return;
      }

      // console.log("Sending IdUser to backend:", user.IdUser);

      const response = await axios.put("http://localhost:5000/api/khachhang/update", {
        idUser: user.IdUser,
        fullName: userInfo.fullName,
        birthDate: userInfo.birthDate,
        gender: userInfo.gender,
        idAvatar: avatarsList.find((av) => av.AvatarContent === avatar)?._id,
      });

      if (response.data.success) {
        localStorage.setItem("user", JSON.stringify({
          id: user.IdUser,
          username: userInfo.username || user.username,
          avatar: avatarsList.find((av) => av.AvatarContent === avatar)?.AvatarContent,
        }));

        setSuccessMessage("Information updated successfully!");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
      else {
        setErrorMessage(response.data.message || "Error updating information.");
      }
    } catch (error) {
      console.error("Error saving information:", error);
      setErrorMessage("Error saving information. Please try again later.");
    }
  };
  return (
    <>
      <HeaderLogin />

      {/* Decorations */}
      <div className="cx-decoration">
        <svg
          className="cx-decoration__lines cx-decoration__top-left-lines"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 388 727"
        >
          <path d="M168.269 66.4821L268.943 1.5908L268.401 0.750275L166.986 66.1194L1.1366 19.0246L0.863435 19.9866L165.874 66.8429L71.2691 127.822L0.729147 173.285L1.27088 174.126L95.4719 113.414L167.155 67.2068L291.724 102.579L143.515 419.707L1.41119 214.332L0.588844 214.901L143.025 420.756L0.546997 725.788L1.45303 726.212L143.684 421.711L223.665 537.305L224.487 536.736L144.175 420.662L292.701 102.855L386.952 129.618L387.226 128.656L293.131 101.937L340.122 1.38222L339.217 0.958847L292.156 101.66L168.269 66.4821Z"></path>
        </svg>
        <svg
          className="cx-decoration__lines cx-decoration__top-right-lines"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 457 163"
        >
          <path d="M456.334 162.725L0.333679 1.85438L0.66637 0.911346L456.666 161.782L456.334 162.725Z"></path>
        </svg>
      </div>

      {/* Overlay & Avatar Popup */}
      {overlayVisible && (
        <>
          {/* Overlay Background */}
          <div
            className="overlay"
            id="loginOverlay"
            onClick={() => {
              setOverlayVisible(false); // Tắt overlay khi click vào nền
            }}
            style={{ display: "block" }}
          ></div>

          {/* Avatar Selection Popup */}
          <div
            className="container_pop"
            id="loginForm"
            onClick={(e) => e.stopPropagation()} // Ngăn chặn click thoát overlay khi click vào popup
            style={{ display: "block" }}
          >
            {/* Close Button */}
            <label
              className="close-btn fas fa-times"
              title="close"
              onClick={() => setOverlayVisible(false)} // Tắt overlay khi click vào nút đóng
            ></label>

            {/* Avatar Header */}
            <div className="avatar-header">
              <img
                id="img-header"
                className="img-header"
                src={`http://localhost:5000${avatar}`}
                alt="Avatar"
              />
              <div>
                <span className="section__subtitle">Avatar</span>
                <p className="section__des">
                  Chọn một avatar! Bạn có thể thay đổi chúng sau đó!
                </p>
                <form id="avatarForm">
                  <input type="hidden" name="id" id="avatarId" />
                  <a
                    className="btn-cancel"
                    onClick={() => setOverlayVisible(false)} // Tắt overlay khi click nút "CANCEL"
                  >
                    CANCEL
                  </a>
                  <button type="submit" className="btn-save">
                    SAVE
                  </button>
                </form>
              </div>
            </div>

            {/* Avatar Selection Grid */}
            <div className="row row-cols-6 avatar-container gap-3">
              {avatarsList.map((av) => (
                <div
                  key={av._id}
                  className="col item-avatar"
                  onClick={() => handleAvatarSelect(av.AvatarContent)}
                >
                  <img
                    className="img-avatar"
                    src={`http://localhost:5000${av.AvatarContent}`}
                    alt="Avatar Icon"
                    data-id={av._id}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}



      {/* Main Content */}
      <div className="main__top">
        <div className="main-login__content w-100">
          <h3 className="main__title" style={{ paddingBottom: "2rem" }}>
            Account Information
          </h3>
          <form className="form-login" id="formInfor" autoComplete="off" onSubmit={handleSave}>
            <div
              className="content-login form-group position-relative"
              style={{ zIndex: 100000 }}
            >
              <div className="infor-img">
                <img src={`http://localhost:5000${avatar}`} alt="Avatar" />
                <a
                  type="button"
                  id="btn-avatar"
                  className="btn-avatar"
                  onClick={toggleOverlay}
                >
                  <i className="ri-pencil-line"></i>
                </a>
              </div>

              {/* Input Fields */}
              <div className="inputBox">
                <input
                  name="username"
                  id="Username"
                  type="text"
                  value={user?.username}
                  onChange={handleInputChange}
                  required
                  autoComplete="off"
                />
                <span>Username</span>
                <i></i>
              </div>
              <div className="inputBox">
                <input
                  name="fullName"
                  id="FullName"
                  type="text"
                  value={userInfo.fullName}
                  onChange={handleInputChange}
                  required
                  autoComplete="off"
                />
                <span>Full Name</span>
                <i></i>
              </div>
              <div className="inputBox">
                <input
                  name="birthDate"
                  id="date"
                  type="date"
                  value={userInfo.birthDate}
                  onChange={handleInputChange}
                  required
                />
                <span>Birth Date</span>
                <i></i>
              </div>
              <div className="inputBox w-100">
                <div className="inputBox-item">
                  <h5>Gender</h5>
                  <select
                    name="gender"
                    id="Gender"
                    value={userInfo.gender}
                    onChange={handleInputChange}
                    className="select"
                    required
                  >
                    <option value="1">Male</option>
                    <option value="2">Female</option>
                    <option value="0">Other</option>
                  </select>
                  <i></i>
                </div>
              </div>
              {successMessage && (
                <div className="text-success">
                  {successMessage}
                  <br />
                  Redirecting to home...
                </div>
              )}
              {/* Success/Error Messages */}
              {/* {successMessage && <div className="text-success">{successMessage}</div>} */}
              {errorMessage && <div className="text-danger">{errorMessage}</div>}

              {/* Save/Cancel Buttons */}
              <div className="login">
                <a type="button" onClick={() => alert("Cancelled")} className="btn-cancel">
                  CANCEL
                </a>
                <input type="submit" value="SAVE" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Infor;
