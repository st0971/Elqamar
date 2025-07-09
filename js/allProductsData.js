// js/allProductsData.js

const allProductsData = [
    // 熱門商品 (假設 P 開頭為預購商品)
    { id: "P001", name: "第五人格 攝影師 JOJO 立牌", price: 580, img: "images/第五魔幻徽章.png", description: "第五人格與 JOJO 聯動限定款，精美攝影師角色立牌，收藏必備。" },
    { id: "P002", name: "第五人格 勘探員 史蒂芬 壓克力鑰匙圈", price: 320, img: "images/第五魔幻徽章.png", description: "勘探員稀有時裝史蒂芬，壓克力材質，質感優良。" },
    { id: "P003", name: "第五人格 慈善家 蝙蝠 立牌", price: 450, img: "images/第五魔幻徽章.png", description: "慈善家哥特風蝙蝠造型立牌，細節滿滿。" },
    { id: "P004", name: "第五人格 紅蝶 白無垢 徽章", price: 200, img: "images/第五魔幻徽章.png", description: "紅蝶經典時裝白無垢，精緻金屬徽章。" },
    // 更多預購商品
    { id: "P005", name: "第五人格 園丁 羅剎 吊飾", price: 280, img: "images/products/P005.png", description: "園丁羅剎時裝，迷你吊飾，可愛實用。" },
    { id: "P006", name: "第五人格 醫生 浴袍 周邊", price: 700, img: "images/products/P006.png", description: "醫生角色浴袍，舒適柔軟，居家必備。" },
    { id: "P007", name: "第五人格 機械師 小紅帽 撲克牌", price: 350, img: "images/products/P007.png", description: "機械師小紅帽主題撲克牌，限定發售。" },
    { id: "P008", name: "第五人格 祭司 夢之使者 畫冊", price: 990, img: "images/products/P008.png", description: "祭司夢之使者設定畫冊，收錄大量精美原畫。" },
    { id: "P009", name: "第五人格 舞女 金 玻璃杯", price: 480, img: "images/products/P009.png", description: "舞女金色主題玻璃杯，飲水也能有儀式感。" },
    { id: "P010", name: "第五人格 宿傘之魂 神眷 抱枕", price: 850, img: "images/products/P010.png", description: "宿傘之魂神眷造型抱枕，超柔軟材質，送禮自用兩相宜。" },
    { id: "P011", name: "第五人格 囚徒 角色海報組", price: 300, img: "images/products/P011.png", description: "囚徒系列主題海報，高清印刷，裝飾房間。" },
    { id: "P012", name: "第五人格 心理學家 日暮裏 擺件", price: 620, img: "images/products/P012.png", description: "心理學家日暮裏主題桌面擺件，精緻模型。" },
    { id: "P013", name: "第五人格 病患 孤獨的真相 漫畫", price: 550, img: "images/products/P013.png", description: "病患主題官方漫畫，深入了解角色故事。" },
    { id: "P014", name: "第五人格 記者 虛妄之言 筆記本", price: 250, img: "images/products/P014.png", description: "記者虛妄之言主題筆記本，記錄靈感。" },
    { id: "P015", name: "第五人格 律師 麥克風 藍芽耳機", price: 1200, img: "images/products/P015.png", description: "律師主題無線藍芽耳機，音質清晰，佩戴舒適。" },
    { id: "P016", name: "第五人格 傑克 夜行梟 文件夾", price: 150, img: "images/products/P016.png", description: "傑克夜行梟主題文件夾，辦公學習好幫手。" },
    { id: "P017", name: "第五人格 宿傘之魂 霜降 徽章", price: 200, img: "images/products/P017.png", description: "宿傘之魂霜降系列金屬徽章，質感上乘。" },
    { id: "P018", name: "第五人格 囚徒 靈感 立牌", price: 580, img: "images/products/P018.png", description: "囚徒靈感時裝立牌，桌面裝飾。" },
    { id: "P019", name: "第五人格 紅蝶 仙鶴 黏土人", price: 1800, img: "images/products/P019.png", description: "紅蝶仙鶴黏土人，可動關節，多種表情。" },
    { id: "P020", name: "第五人格 醫生 甜點師 冰箱貼", price: 120, img: "images/products/P020.png", description: "醫生甜點師主題冰箱貼，可愛實用。" },

    // 現貨商品 (假設 ID 為數字為現貨商品)
    { id: "901", name: "第五人格 空軍 懷古 吊飾", price: 280, img: "images/products/S001.png", description: "空軍懷古時裝，迷你吊飾，精緻可愛。" },
    { id: "902", name: "第五人格 佣兵 柴郡貓 手辦", price: 1500, img: "images/products/S002.png", description: "佣兵柴郡貓主題手辦，造型獨特，做工精細。" },
    { id: "903", name: "第五人格 畫家 黃金比例 鑰匙圈", price: 300, img: "images/products/S003.png", description: "畫家黃金比例限定鑰匙圈，時尚設計。" },
    { id: "904", name: "第五人格 守墓人 聖甲蟲 漫畫", price: 400, img: "images/products/S004.png", description: "守墓人聖甲蟲主題漫畫，限量發售。" },
    { id: "905", name: "第五人格 紅夫子 瑪麗皇后 盲盒", price: 250, img: "images/products/S005.png", description: "紅夫子瑪麗皇后系列盲盒，隨機款式，驚喜連連。" },
    { id: "906", name: "第五人格 調香師 籠中之蝶 抱枕", price: 750, img: "images/products/S006.png", description: "調香師籠中之蝶主題抱枕，親膚材質，抱感舒適。" },
    { id: "907", name: "第五人格 雜技演員 尋寶者 海報", price: 180, img: "images/products/S007.png", description: "雜技演員尋寶者主題海報，高清印刷。" },
    { id: "908", name: "第五人格 勘探員 熔岩派對 立牌", price: 500, img: "images/products/S008.png", description: "勘探員熔岩派對主題立牌，造型酷炫。" },
    { id: "909", name: "第五人格 教授 角色徽章套裝", price: 600, img: "images/products/S009.png", description: "教授系列角色徽章套裝，質感上乘，收藏佳品。" },
    { id: "910", name: "第五人格 破輪 囚徒之椅 玩偶", price: 800, img: "images/products/S010.png", description: "破輪囚徒之椅主題玩偶，可愛造型，手感柔軟。" },
];
