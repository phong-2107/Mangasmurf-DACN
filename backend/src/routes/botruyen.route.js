const express = require('express');
const upload = require('../middleware/upload.middleware');
const BoTruyen = require('../model/botruyen.model');
const TacGia = require('../model/tacgia.model');
const LoaiTruyen = require('../model/loaitruyen.model');
const Chapter = require('../model/chapter.model');
const router = express.Router();


// Taọ mới bộ truyện
router.post('/create-post', async (req, res) => {
    const {
        id_tg,
        ...boTruyenData
    } = req.body;

    // Kiểm tra ID tác giả có tồn tại không
    try {
        const tacGia = await TacGia.findById(id_tg);
        if (!tacGia) {
            return res.status(404).send({
                message: "Tác giả không tìm thấy"
            });
        }
        // Nếu tác giả tồn tại, tạo bộ truyện mới với dữ liệu nhận được
        const newPost = new BoTruyen({
            ...boTruyenData,
            id_tg
        });
        await newPost.save();
        res.status(201).send({
            message: "Bộ truyện được tạo thành công",
            post: newPost
        });
    } catch (error) {
        console.log("Error : ", error);
        res.status(500).send({
            message: "Lỗi khi tạo bộ truyện"
        });
    }
});

// API tạo bộ truyện và upload ảnh
router.post('/create', upload.single('image'), async (req, res) => {
    const {
        id_tg,
        tenbo,
        mota,
        dotuoi
    } = req.body;

    try {
        // Kiểm tra ID tác giả có tồn tại không
        const tacGia = await TacGia.findById(id_tg);
        if (!tacGia) {
            return res.status(404).send({
                message: "Tác giả không tìm thấy"
            });
        }

        // Kiểm tra file upload
        if (!req.file) {
            return res.status(400).send({
                message: "Vui lòng upload ảnh"
            });
        }

        // Đường dẫn file ảnh
        const filePath = `/uploads/${req.file.filename}`;

        // Tạo bộ truyện mới
        const newPost = new BoTruyen({
            tenbo,
            mota,
            dotuoi,
            poster: filePath,
            id_tg,
        });

        await newPost.save();

        res.status(201).send({
            message: "Bộ truyện được tạo thành công",
            post: newPost,
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({
            message: "Lỗi khi tạo bộ truyện"
        });
    }
});




// Thêm loại truyện vào bộ truyện 
router.post('/:id/add-loai', async (req, res) => {
    const {
        id
    } = req.params;
    const {
        loaiTruyenId
    } = req.body;

    try {
        // Cập nhật danh sách loại trong BoTruyen
        const boTruyen = await BoTruyen.findByIdAndUpdate(
            id, {
                $addToSet: {
                    listloai: loaiTruyenId
                }
            }, {
                new: true
            }
        );

        if (!boTruyen) {
            return res.status(404).json({
                message: 'Không tìm thấy bộ truyện'
            });
        }

        // Cập nhật danh sách bộ truyện trong LoaiTruyen
        const loaiTruyen = await LoaiTruyen.findByIdAndUpdate(
            loaiTruyenId, {
                $addToSet: {
                    listTruyen: id
                }
            }, // Tránh thêm trùng lặp
            {
                new: true
            }
        );

        if (!loaiTruyen) {
            return res.status(404).json({
                message: 'Không tìm thấy loại truyện'
            });
        }

        res.status(200).json({
            message: 'Thêm loại truyện vào bộ truyện thành công',
            boTruyen,
            loaiTruyen,
        });
    } catch (error) {
        console.error('Error adding LoaiTruyen to BoTruyen:', error);
        res.status(500).json({
            message: 'Lỗi khi thêm loại truyện vào bộ truyện'
        });
    }
});


// Xóa loại truyện vào bộ truyện 
router.post('/:id/remove-loai', async (req, res) => {
    const {
        id
    } = req.params;
    const {
        loaiTruyenId
    } = req.body;

    try {
        // Xóa loại khỏi bộ truyện
        const boTruyen = await BoTruyen.findByIdAndUpdate(
            id, {
                $pull: {
                    listloai: loaiTruyenId
                }
            }, {
                new: true
            }
        );

        if (!boTruyen) {
            return res.status(404).json({
                message: 'Không tìm thấy bộ truyện'
            });
        }

        // Xóa bộ truyện khỏi loại
        const loaiTruyen = await LoaiTruyen.findByIdAndUpdate(
            loaiTruyenId, {
                $pull: {
                    listTruyen: id
                }
            }, {
                new: true
            }
        );

        if (!loaiTruyen) {
            return res.status(404).json({
                message: 'Không tìm thấy loại truyện'
            });
        }

        res.status(200).json({
            message: 'Xóa loại truyện khỏi bộ truyện thành công',
            boTruyen,
            loaiTruyen,
        });
    } catch (error) {
        console.error('Error removing LoaiTruyen from BoTruyen:', error);
        res.status(500).json({
            message: 'Lỗi khi xóa loại truyện khỏi bộ truyện'
        });
    }
});

// sắp xếp truyen có lượt đọc cao nhất
router.get('/top-read', async (req, res) => {
    try {
        const topReadComics = await BoTruyen.find({
                active: true
            })
            .sort({
                TongLuotXem: -1
            })
            .limit(10)
            .populate('id_tg', 'ten');
        res.status(200).json(topReadComics);
        // console.log("luot xem ", topReadComics);
    } catch (error) {
        console.error('Error fetching top-read comics:', error);
        res.status(500).send({
            message: 'Lỗi khi lấy danh sách top truyện'
        });
    }
});

router.get('/categories', async (req, res) => {
    try {
        const categories = await LoaiTruyen.find();
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).send({
            message: 'Lỗi khi lấy danh sách loại truyện'
        });
    }
});


function calculateTimeAgo(releaseDate) {
    if (!releaseDate) return "Không có thông tin thời gian";

    const now = new Date();
    const timeSinceRelease = now - new Date(releaseDate);

    const minutes = Math.floor(timeSinceRelease / (1000 * 60));
    const hours = Math.floor(timeSinceRelease / (1000 * 60 * 60));
    const days = Math.floor(timeSinceRelease / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);

    if (minutes < 60) {
        return `${minutes} phút trước`;
    } else if (hours < 24) {
        return `${hours} giờ trước`;
    } else if (days < 7) {
        return `${days} ngày trước`;
    } else if (weeks < 4) {
        return `${weeks} tuần trước`;
    } else {
        return `${months} tháng trước`;
    }
}



// Lấy danh sách truyện mới cập nhật
router.get('/latest', async (req, res) => {
    try {
        // Lấy danh sách truyện mới nhất
        const latestComics = await BoTruyen.find({
                active: true
            })
            .sort({
                updatedAt: -1
            })
            .limit(12)
            .select('tenbo poster premium updatedAt')
            .lean();

        // Lấy chương mới nhất cho từng truyện
        const comicIds = latestComics.map((comic) => comic._id);
        const latestChapters = await Chapter.aggregate([{
                $match: {
                    id_bo: {
                        $in: comicIds
                    },
                    active: true
                }
            },
            {
                $sort: {
                    thoi_gian: -1
                }
            },
            {
                $group: {
                    _id: '$id_bo',
                    latestChapter: {
                        $first: '$$ROOT'
                    }
                }
            },
        ]);

        // Ghép chương mới nhất vào danh sách truyện
        const chapterMap = latestChapters.reduce((map, chap) => {
            map[chap._id] = chap.latestChapter;
            return map;
        }, {});

        const formattedComics = latestComics.map((comic) => {
            const latestChapter = chapterMap[comic._id] || null;

            return {
                _id: comic._id,
                TenBo: comic.tenbo,
                AnhBia: comic.poster,
                TtPemium: comic.premium,
                latestChapter: latestChapter ?
                    {
                        SttChap: latestChapter.stt_chap,
                        TenChap: latestChapter.ten_chap,
                        ThoiGian: calculateTimeAgo(latestChapter.thoi_gian),
                    } :
                    null, // Nếu không có chương mới nhất, trả về null
            };
        });

        res.status(200).json(formattedComics);
    } catch (error) {
        console.error('Error fetching latest comics:', error);
        res.status(500).json({
            message: 'Lỗi khi lấy danh sách truyện mới cập nhật'
        });
    }
});

// Lấy danh sách truyện Trending
router.get('/trending', async (req, res) => {
    try {
        const {
            page = 1, limit = 12
        } = req.query;
        const skip = (page - 1) * limit;

        // Lấy danh sách truyện theo phân trang
        const trendingComics = await BoTruyen.find({
                active: true
            })
            .sort({
                TongLuotXem: -1
            })
            .skip(skip)
            .limit(parseInt(limit))
            .select('tenbo poster TongLuotXem TtPemium')
            .lean();

        // Tổng số lượng truyện
        const totalCount = await BoTruyen.countDocuments({
            active: true
        });

        const comicIds = trendingComics.map((comic) => comic._id);

        const latestChapters = await Chapter.aggregate([{
                $match: {
                    id_bo: {
                        $in: comicIds
                    },
                    active: true
                }
            },
            {
                $sort: {
                    thoi_gian: -1
                }
            },
            {
                $group: {
                    _id: '$id_bo',
                    latestChapter: {
                        $first: '$$ROOT'
                    }
                }
            },
        ]);

        const chapterMap = latestChapters.reduce((map, chap) => {
            map[chap._id] = chap.latestChapter;
            return map;
        }, {});

        const formattedComics = trendingComics.map((comic) => ({
            _id: comic._id,
            TenBo: comic.tenbo,
            AnhBia: comic.poster,
            TongLuotXem: comic.TongLuotXem,
            TtPemium: comic.TtPemium,
            latestChapter: chapterMap[comic._id] ?
                {
                    SttChap: chapterMap[comic._id].stt_chap,
                    ThoiGian: chapterMap[comic._id].thoi_gian,
                } :
                null,
        }));

        res.status(200).json({
            comics: formattedComics,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: parseInt(page),
        });
    } catch (error) {
        console.error('Error fetching trending comics:', error);
        res.status(500).json({
            message: 'Lỗi khi lấy danh sách truyện Trending'
        });
    }
});


// lấy tất cả bộ truyện còn active 
router.get('/active', async (req, res) => {
    try {
        const activeBoTruyen = await BoTruyen.find({
                active: true
            })
            .populate('id_tg', 'ten')
            .sort({
                createdAt: -1
            });

        console.log('Active BoTruyen:', activeBoTruyen);
        res.status(200).send(activeBoTruyen);
    } catch (error) {
        console.error('Error fetching active Bo Truyen:', error);
        res.status(500).send({
            message: 'Failed to fetch active Bo Truyen'
        });
    }
});



// Lấy chi tiết một bộ truyện (route công khai)
router.get('/:id', async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const boTruyen = await BoTruyen.findById(id)
            .populate('id_tg', 'ten email')
            .populate('listloai', 'ten')
            .populate('chapters');
        if (!boTruyen) return res.status(404).json({
            message: 'Không tìm thấy bộ truyện'
        });
        res.status(200).json(boTruyen);
    } catch (error) {
        console.error('Error fetching Bo Truyen by ID:', error);
        res.status(500).json({
            message: 'Lỗi khi lấy thông tin bộ truyện'
        });
    }
});

//Tìm kiếm bộ truyện theo tên
router.get('/search', async (req, res) => {
    const {
        query
    } = req.query;
    try {
        const boTruyen = await BoTruyen.find({
            tenbo: {
                $regex: query,
                $options: 'i'
            },
        });
        res.status(200).json(boTruyen);
    } catch (error) {
        console.error('Error searching Bo Truyen:', error);
        res.status(500).json({
            message: 'Lỗi khi tìm kiếm bộ truyện'
        });
    }
});

//Lọc bộ truyện theo trạng thái
router.get('/filter', async (req, res) => {
    const {
        trangthai
    } = req.query;
    try {
        const boTruyen = await BoTruyen.find({
            trangthai
        });
        res.status(200).json(boTruyen);
    } catch (error) {
        console.error('Error filtering Bo Truyen:', error);
        res.status(500).json({
            message: 'Lỗi khi lọc bộ truyện'
        });
    }
});


// Cập nhật một bộ truyện 
// router.patch('/update-post/:id', verifyToken, isAdmin, async (req, res) => {
//     try {
//         const id = req.params.id;

//         const updatedBoTruyen = await BoTruyen.findByIdAndUpdate(id, { ...req.body }, { new: true });

//         if (!updatedBoTruyen) {
//             return res.status(404).send({ message: 'Bo Truyen not found' });
//         }

//         res.status(200).send({ message: 'Bo Truyen updated successfully', post: updatedBoTruyen });
//     } catch (error) {
//         console.error('Error updating Bo Truyen:', error);
//         res.status(500).send({ message: 'Failed to update Bo Truyen' });
//     }
// });

// Xóa một bộ truyện 
// router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
//     try {
//         const id = req.params.id;

//         const deletedBoTruyen = await BoTruyen.findByIdAndDelete(id);

//         if (!deletedBoTruyen) {
//             return res.status(404).send({ message: 'Bo Truyen not found' });
//         }

//         res.status(200).send({ message: 'Bo Truyen deleted successfully' });
//     } catch (error) {
//         console.error('Error deleting Bo Truyen:', error);
//         res.status(500).send({ message: 'Failed to delete Bo Truyen' });
//     }
// });

module.exports = router;

