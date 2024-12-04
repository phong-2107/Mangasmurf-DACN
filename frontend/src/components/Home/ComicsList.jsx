
import Slider from "react-slick";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ComicList = ({ comics, title }) => {
    // Cấu hình cho Slick Slider
    const settings = {
        dots: false, // Ẩn các chấm điều hướng
        infinite: true, // Vòng lặp vô hạn
        speed: 500, // Tốc độ chuyển đổi
        slidesToShow: 6, // Số lượng slide hiển thị
        slidesToScroll: 1, // Số lượng slide cuộn mỗi lần
        autoplay: true, // Tự động cuộn
        autoplaySpeed: 2000, // Tốc độ tự động cuộn
        cssEase: "linear", // Hiệu ứng cuộn mượt
        nextArrow: <NextArrow />, // Nút next tùy chỉnh
        prevArrow: <PrevArrow />, // Nút prev tùy chỉnh
        responsive: [
            {
                breakpoint: 1280,
                settings: {
                    slidesToShow: 5,
                },
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 450,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    // Nút prev tùy chỉnh
    function PrevArrow({ className, style, onClick }) {
        return (
            <button
                className={`${className} slick-prev`}
                style={{
                    ...style,
                    display: "block",
                    background: "gray",
                    borderRadius: "50%",
                    padding: "10px",
                    zIndex: 10,
                }}
                onClick={onClick}
            >
                <i className="fa fa-chevron-left" style={{ color: "white" }}></i>
            </button>
        );
    }

    // Nút next tùy chỉnh
    function NextArrow({ className, style, onClick }) {
        return (
            <button
                className={`${className} slick-next`}
                style={{
                    ...style,
                    display: "block",
                    background: "gray",
                    borderRadius: "50%",
                    padding: "10px",
                    zIndex: 10,
                }}
                onClick={onClick}
            >
                <i className="fa fa-chevron-right" style={{ color: "white" }}></i>
            </button>
        );
    }

    return (
        <div className="main__top containers">
            <div className="top__container" style={{ overflow: "hidden" }}>
                <div className="top__content">
                    <div>
                        <span className="section__subtitle">{title || "Đề Cử Hôm Nay"}</span>
                    </div>
                </div>
                <Slider {...settings} className="slick-list autoplay row col-6 w-100 d-flex justify-content-center">
                    {comics.map((comic) => (
                        <div key={comic._id} className="col update-item">
                            <Link to={`/comic/${comic._id}`}>
                                <figure style={{ position: "relative" }}>
                                    {comic.poster && (
                                        <>
                                            <span className="hot-icon" style={{ zIndex: 10001 }}>
                                                HOT
                                            </span>
                                            <img
                                                loading="lazy"
                                                src={`http://localhost:5000${comic.poster}`}
                                                alt="Poster"
                                                className="d-block w-100 poster"
                                            />
                                        </>
                                    )}
                                    <figcaption>
                                        <h6 className="item-title">{comic.tenbo}</h6>
                                    </figcaption>
                                </figure>
                            </Link>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
};

export default ComicList;
