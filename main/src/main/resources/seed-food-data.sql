-- =====================================================================
-- SEED DATA: food_category + food (Vietnamese Food Database - 100+ món)
-- Database: SQL Server (QLAppTheDuc)
-- Chạy script này 1 lần để nạp dữ liệu vào bảng food
-- Tất cả giá trị dinh dưỡng đã chuẩn hóa PER 100g
-- =====================================================================

-- ─── Bước 1: Insert các danh mục thức ăn ──────────────────────────────
SET IDENTITY_INSERT food_category ON;

MERGE INTO food_category AS target
USING (VALUES 
    (1, N'Món nước'),
    (2, N'Chiên nướng'),
    (3, N'Cơm/Xôi'),
    (4, N'Đồ ăn nhanh'),
    (5, N'Khác'),
    (6, N'Tráng miệng'),
    (7, N'Đồ uống'),
    (8, N'Rau củ'),
    (9, N'Trái cây'),
    (10, N'Hải sản'),
    (11, N'Thịt'),
    (12, N'Trứng/Sữa')
) AS source (id, name)
ON target.id = source.id
WHEN MATCHED THEN UPDATE SET name = source.name
WHEN NOT MATCHED THEN INSERT (id, name) VALUES (source.id, source.name);

SET IDENTITY_INSERT food_category OFF;

-- ─── Bước 2: Insert 100+ món ăn Việt Nam ─────────────────────────────
SET IDENTITY_INSERT food ON;

MERGE INTO food AS target
USING (VALUES 
    -- ══════════════ MÓN NƯỚC (cat=1) ══════════════
    (1,  N'Phở bò chín',            120,   6,   16,  3.5, 1),
    (2,  N'Phở gà',                 110,   7,   15,  3,   1),
    (3,  N'Bún bò Huế',             130,   7,   17,  4,   1),
    (4,  N'Hủ tiếu Nam Vang',       125,   6,   16,  4,   1),
    (5,  N'Cháo lòng',               85,   5,   12,  2,   1),
    (6,  N'Phở bò tái',             125,   7,   15,  4,   1),
    (7,  N'Bún riêu cua',           110,   5,   14,  4,   1),
    (8,  N'Canh chua cá lóc',        55,   5,    5,  1.5, 1),
    (9,  N'Súp gà ngô non',          60,   4,    8,  1,   1),
    (10, N'Mì Quảng',               140,   6,   18,  5,   1),
    (11, N'Bún mắm',                115,   6,   15,  3.5, 1),
    (12, N'Bún thang',              100,   6,   13,  3,   1),
    (13, N'Canh bí đao thịt bằm',    40,   3,    4,  1.5, 1),
    (14, N'Canh rau muống',           25,   2,    3,  0.5, 1),
    (15, N'Cháo gà',                 80,   5,   11,  1.5, 1),

    -- ══════════════ CHIÊN NƯỚNG (cat=2) ══════════════
    (16, N'Bún chả Hà Nội',         180,   8,   20,  7,   2),
    (17, N'Bánh xèo',               210,   6,   20, 12,   2),
    (18, N'Mì xào hải sản',         175,   8,   24,  6,   2),
    (19, N'Nem rán (Chả giò)',       220,   7,   18, 14,   2),
    (20, N'Thịt nướng xiên',         200,  15,    5, 14,   2),
    (21, N'Cá nướng giấy bạc',      130,  18,    2,  6,   2),
    (22, N'Gà nướng mật ong',       190,  20,    8,  9,   2),
    (23, N'Đậu hũ chiên sả ớt',     170,   8,   10, 12,   2),
    (24, N'Tôm chiên xù',           220,  10,   18, 12,   2),
    (25, N'Cánh gà chiên nước mắm',  230,  17,    8, 15,   2),

    -- ══════════════ CƠM/XÔI (cat=3) ══════════════
    (26, N'Cơm tấm sườn bì chả',    220,  10,   25,  8,   3),
    (27, N'Xôi xéo',                280,   6,   50,  6,   3),
    (28, N'Cơm chiên dương châu',    190,   5,   28,  7,   3),
    (29, N'Cơm gà Hải Nam',         180,   9,   22,  6,   3),
    (30, N'Cơm rang thập cẩm',      195,   7,   26,  7,   3),
    (31, N'Xôi gấc',                250,   5,   45,  5,   3),
    (32, N'Cơm trắng',              130,   3,   28,  0.3, 3),
    (33, N'Cơm lam',                150,   3,   32,  1,   3),
    (34, N'Cơm tấm sườn nướng',     210,  12,   24,  8,   3),
    (35, N'Xôi mặn (thịt gà)',      260,   8,   42,  7,   3),

    -- ══════════════ ĐỒ ĂN NHANH (cat=4) ══════════════
    (36, N'Bánh mì thịt nướng',      250,   9,   35,  9,   4),
    (37, N'Bánh mì ốp la',           230,   8,   30,  8,   4),
    (38, N'Bánh bao nhân thịt',      240,   8,   35,  7,   4),
    (39, N'Bánh mì chả cá',         220,   7,   32,  7,   4),
    (40, N'Bánh mì pate',            260,   8,   30, 12,   4),
    (41, N'Xúc xích nướng',          280,  12,    3, 25,   4),
    (42, N'Mì gói (ăn liền)',        450,   9,   58, 20,   4),
    (43, N'Bánh tráng trộn',         180,   4,   28,  6,   4),
    (44, N'Tokbokki (Hàn)',          200,   5,   38,  4,   4),
    (45, N'Hamburger bò',            250,  13,   25, 12,   4),

    -- ══════════════ KHÁC (cat=5) ══════════════
    (46, N'Gỏi cuốn',               110,   6,   18,  2,   5),
    (47, N'Bánh cuốn nấm thịt',     160,   5,   25,  5,   5),
    (48, N'Bún đậu mắm tôm',        190,  10,   15, 10,   5),
    (49, N'Ức gà luộc',             165,  31,    0,  3,   5),
    (50, N'Thịt kho tàu',           230,  15,    8, 16,   5),
    (51, N'Cá kho tộ',              145,  16,    5,  7,   5),
    (52, N'Đậu hũ non',              55,   5,    2,  3,   5),
    (53, N'Chả lụa (Giò lụa)',      150,  14,    5,  8,   5),
    (54, N'Thịt bò xào rau cải',    140,  12,    5,  8,   5),
    (55, N'Gà kho gừng',            180,  18,    4, 10,   5),
    (56, N'Lẩu thái (nước lẩu)',     45,   3,    5,  2,   5),
    (57, N'Cá hồi áp chảo',         200,  20,    0, 13,   5),
    (58, N'Sườn xào chua ngọt',      200,  12,   15, 10,   5),
    (59, N'Thịt heo quay',           280,  18,    2, 22,   5),
    (60, N'Bò lúc lắc',             190,  20,    3, 11,   5),

    -- ══════════════ TRÁNG MIỆNG (cat=6) ══════════════
    (61, N'Chè đậu đen',            100,   2,   22,  0.5, 6),
    (62, N'Chè bưởi',                90,   1,   20,  1,   6),
    (63, N'Bánh flan (Caramen)',     140,   5,   18,  5,   6),
    (64, N'Sữa chua nếp cẩm',      120,   3,   22,  2.5, 6),
    (65, N'Chè trôi nước',          150,   2,   30,  3,   6),
    (66, N'Bánh chuối nướng',        180,   3,   28,  6,   6),
    (67, N'Rau câu dừa',             80,   1,   15,  2,   6),
    (68, N'Chè thái',               130,   2,   25,  3,   6),
    (69, N'Bánh da lợn',            160,   2,   30,  4,   6),
    (70, N'Kem dừa',                200,   3,   24, 10,   6),

    -- ══════════════ ĐỒ UỐNG (cat=7) ══════════════
    (71, N'Trà sữa trân châu',       80, 0.5,   15,  2,   7),
    (72, N'Cà phê sữa đá',           70, 0.5,   14,  1.5, 7),
    (73, N'Sinh tố bơ',             130,   2,   15,  7,   7),
    (74, N'Nước mía',                 75,   0,   19,  0,   7),
    (75, N'Nước dừa tươi',            20, 0.2,    4,  0.2, 7),
    (76, N'Trà đào cam sả',           50,   0,   12,  0,   7),
    (77, N'Sữa đậu nành',            45,   3,    5,  2,   7),
    (78, N'Nước chanh muối',          30,   0,    7,  0,   7),
    (79, N'Sinh tố xoài',           100,   1,   22,  1,   7),
    (80, N'Cà phê đen không đường',    2,   0,    0,  0,   7),

    -- ══════════════ RAU CỦ (cat=8) ══════════════
    (81, N'Rau muống xào tỏi',        45,   3,    4,  2,   8),
    (82, N'Bông cải xanh luộc',        35,   3,    7,  0.4, 8),
    (83, N'Cà rốt luộc',              41,   1,    9,  0.2, 8),
    (84, N'Bắp cải luộc',             25,   1,    6,  0.1, 8),
    (85, N'Rau cải thìa xào',         35,   2,    3,  2,   8),
    (86, N'Khoai lang luộc',          90,   2,   21,  0.1, 8),
    (87, N'Khoai tây chiên',         270,   3,   35, 14,   8),
    (88, N'Bí đỏ hấp',                26,   1,    6,  0.1, 8),
    (89, N'Đậu bắp luộc',             33,   2,    7,  0.2, 8),
    (90, N'Mướp đắng xào trứng',      80,   5,    4,  5,   8),

    -- ══════════════ TRÁI CÂY (cat=9) ══════════════
    (91, N'Chuối',                    89,   1,   23,  0.3, 9),
    (92, N'Xoài chín',                60,   1,   15,  0.4, 9),
    (93, N'Thanh long',                50,   1,   11,  0.4, 9),
    (94, N'Dưa hấu',                  30,   1,    8,  0.2, 9),
    (95, N'Bưởi',                     42,   1,   11,  0.1, 9),
    (96, N'Ổi',                       68,   3,   14,  1,   9),
    (97, N'Táo',                      52,   0,   14,  0.2, 9),
    (98, N'Cam',                      47,   1,   12,  0.1, 9),
    (99, N'Sầu riêng',              147,   2,   27,  5,   9),
    (100, N'Mít chín',                95,   2,   23,  0.6, 9),

    -- ══════════════ HẢI SẢN (cat=10) ══════════════
    (101, N'Tôm sú luộc',            99,  21,    0,  1,  10),
    (102, N'Cua biển hấp',            87,  18,    0,  1.1,10),
    (103, N'Mực xào sa tế',          130,  15,    5,  6,  10),
    (104, N'Nghêu hấp xả',            56,  10,    2,  1,  10),
    (105, N'Cá thu kho',             145,  18,    3,  7,  10),
    (106, N'Ốc hương luộc',           90,  18,    4,  1,  10),
    (107, N'Cá basa kho tộ',         120,  15,    3,  5,  10),
    (108, N'Tôm rang muối',          140,  20,    3,  6,  10),
    (109, N'Sò điệp nướng mỡ hành',  100,  14,    4,  3,  10),
    (110, N'Cá diêu hồng hấp',        95,  19,    0,  2,  10),

    -- ══════════════ THỊT (cat=11) ══════════════
    (111, N'Thịt ba chỉ luộc',       270,  16,    0, 23,  11),
    (112, N'Thịt bò bít tết',        170,  26,    0,  7,  11),
    (113, N'Thịt vịt quay',          240,  18,    0, 18,  11),
    (114, N'Đùi gà luộc',            180,  20,    0, 11,  11),
    (115, N'Thịt heo nạc vai',       143,  21,    0,  6,  11),
    (116, N'Lạp xưởng',              340,  16,    5, 28,  11),
    (117, N'Thịt bê hầm',            150,  22,    0,  7,  11),
    (118, N'Thịt dê tái chanh',      130,  20,    2,  5,  11),
    (119, N'Thịt cừu nướng',         250,  18,    0, 20,  11),
    (120, N'Ba chỉ bò Mỹ nướng',     290,  17,    0, 25,  11),

    -- ══════════════ TRỨNG/SỮA (cat=12) ══════════════
    (121, N'Trứng gà luộc',          155,  13,    1, 11,  12),
    (122, N'Trứng chiên',            190,  13,    1, 15,  12),
    (123, N'Trứng vịt lộn',          180,  14,    2, 13,  12),
    (124, N'Sữa tươi không đường',    60,   3,    5,  3,  12),
    (125, N'Sữa chua Vinamilk',       80,   3,   13,  2,  12),
    (126, N'Phô mai con bò cười',     250,  11,    8, 19,  12),
    (127, N'Trứng cút luộc',         160,  13,    0, 11,  12),
    (128, N'Sữa đặc pha',            130,   3,   22,  3,  12),
    (129, N'Trứng hấp (Chawanmushi)', 80,   6,    2,  5,  12),
    (130, N'Phô mai Mozzarella',     280,  22,    2, 17,  12)
) AS source (id, name, calories_per_100g, protein_per_100g, carb_per_100g, fat_per_100g, category_id)
ON target.id = source.id
WHEN MATCHED THEN UPDATE SET 
    name = source.name,
    calories_per_100g = source.calories_per_100g,
    protein_per_100g = source.protein_per_100g,
    carb_per_100g = source.carb_per_100g,
    fat_per_100g = source.fat_per_100g,
    category_id = source.category_id
WHEN NOT MATCHED THEN INSERT (id, name, calories_per_100g, protein_per_100g, carb_per_100g, fat_per_100g, category_id) 
    VALUES (source.id, source.name, source.calories_per_100g, source.protein_per_100g, source.carb_per_100g, source.fat_per_100g, source.category_id);

SET IDENTITY_INSERT food OFF;

-- ─── Kiểm tra kết quả ────────────────────────────────────────────────
SELECT COUNT(*) AS total_categories FROM food_category;
SELECT COUNT(*) AS total_foods FROM food;
SELECT f.id, f.name, f.calories_per_100g, f.protein_per_100g, f.carb_per_100g, f.fat_per_100g, c.name AS category
FROM food f LEFT JOIN food_category c ON f.category_id = c.id
ORDER BY f.id;
