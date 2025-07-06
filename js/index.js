document.addEventListener('DOMContentLoaded', function () {
    // 下拉選單功能
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const dropbtn = dropdown.querySelector('.dropbtn');
        const dropdownContent = dropdown.querySelector('.dropdown-content');

        dropbtn.addEventListener('click', function (event) {
            event.preventDefault();
            dropdownContent.classList.toggle('show');
        });
    });

    window.addEventListener('click', function (event) {
        dropdowns.forEach(dropdown => {
            const dropdownContent = dropdown.querySelector('.dropdown-content');
            if (!event.target.matches('.dropbtn') && !event.target.closest('.dropdown-content')) {
                dropdownContent.classList.remove('show');
            }
        });
    });

    // 搜尋欄功能相關元素
    const searchToggle = document.querySelector('.search-toggle');
    const searchInput = document.querySelector('.search-input');
    const paginationContainer = document.querySelector('.pagination');
    const productGrid = document.querySelector('.product-grid');
    const productsPerPage = 12; // 每頁顯示的商品數量

    let currentPage = 1;

    // *** 關鍵修改：所有頁面都從 allProductsData 中搜尋 ***
    // 但在 index.html 初始顯示時，我們只顯示預購商品（例如 ID 1-12）
    // 當用戶進行搜尋時，才去 allProductsData 中找
    const initialIndexProducts = allProductsData.filter(product => product.id >= 1 && product.id <= 12);
    let currentProducts = initialIndexProducts; // 頁面初始顯示的商品

    let filteredProducts = currentProducts; // 初始篩選的商品就是首頁的商品

    if (searchToggle && searchInput) {
        searchToggle.addEventListener('click', function (e) {
            e.preventDefault();
            searchInput.classList.toggle('hidden');
            if (!searchInput.classList.contains('hidden')) {
                searchInput.focus();
            } else {
                searchInput.value = '';
                // 隱藏時清空搜尋，並**恢復顯示初始的首頁商品**
                filteredProducts = initialIndexProducts;
                currentPage = 1;
                renderProducts(filteredProducts, currentPage);
                setupPagination(filteredProducts);
            }
        });

        window.addEventListener('click', function (event) {
            if (!event.target.closest('.search-container') && !searchInput.classList.contains('hidden')) {
                searchInput.classList.add('hidden');
                searchInput.value = '';
                // 點擊外部清空搜尋，並**恢復顯示初始的首頁商品**
                filteredProducts = initialIndexProducts;
                currentPage = 1;
                renderProducts(filteredProducts, currentPage);
                setupPagination(filteredProducts);
            }
        });

        searchInput.addEventListener('input', () => {
            // *** 關鍵修改：搜尋時，從 allProductsData 中進行篩選 ***
            filterProducts(searchInput.value, allProductsData);
            console.log("搜尋輸入框正在輸入:", searchInput.value);
        });
    }

    function renderProducts(products, page = 1) {
        if (!productGrid) return;
        productGrid.innerHTML = '';

        if (products.length === 0) {
            productGrid.innerHTML = '<p>找不到符合條件的商品</p>';
            if (paginationContainer) {
                paginationContainer.style.display = 'none';
            }
            return;
        }

        let displayProducts;
        if (searchInput && searchInput.value.trim() !== '') {
            displayProducts = products;
        } else {
            const start = (page - 1) * productsPerPage;
            const end = start + productsPerPage;
            displayProducts = products.slice(start, end);
        }

        displayProducts.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <a href="product.html?id=${product.id}">
                    <img src="${product.img}" alt="${product.name}">
                </a>
                <h3>${product.name}</h3>
                <p>$${product.price}</p>
            `;
            productGrid.appendChild(card);
        });
    }

    function setupPagination(products) {
        if (!paginationContainer) return;
        if (searchInput && searchInput.value.trim() !== '') {
            paginationContainer.style.display = 'none';
            return;
        }

        const totalPages = Math.ceil(products.length / productsPerPage);
        if (totalPages <= 1) {
            paginationContainer.style.display = 'none';
            return;
        }

        paginationContainer.style.display = 'flex';
        paginationContainer.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.className = 'page-btn';
            btn.textContent = i;
            btn.dataset.page = i;
            if (i === currentPage) btn.classList.add('active');
            paginationContainer.appendChild(btn);
        }

        paginationContainer.querySelectorAll('.page-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                currentPage = parseInt(btn.dataset.page);
                renderProducts(filteredProducts, currentPage);
                paginationContainer.querySelectorAll('.page-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    // *** 關鍵修改：filterProducts 接受一個 optional 的 dataSource 參數 ***
    function filterProducts(searchTerm, dataSource = currentProducts) {
        console.log("篩選前的資料來源 (index.js):", dataSource); // 確認當前用來篩選的資料
        console.log("搜尋詞 (index.js):", searchTerm);

        filteredProducts = dataSource.filter(product => { // 從 dataSource 篩選
            const productName = product.name ? product.name.toLowerCase() : '';
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            const isMatch = productName.includes(lowerCaseSearchTerm);
            console.log(`在 index.js 中搜尋 "${lowerCaseSearchTerm}" 於 "${productName}". 匹配: ${isMatch}`);
            return isMatch;
        });

        console.log("篩選後的 filteredProducts 數量 (index.js):", filteredProducts.length);
        console.log("篩選後的 filteredProducts 內容 (index.js):", filteredProducts);

        currentPage = 1;
        renderProducts(filteredProducts, currentPage);
        setupPagination(filteredProducts);
    }

    // 頁面載入時的初始渲染
    filterProducts('', initialIndexProducts); // 初始時只渲染預購商品

    // 圖片輪播功能
    const carouselTrack = document.querySelector('.carousel-track');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const carouselImages = document.querySelectorAll('.carousel-track img');
    let currentIndex = 0; // 確保在輪播範圍內定義，避免衝突
    let carouselInterval;

    function moveCarousel() {
        if (!carouselImages || carouselImages.length === 0 || !carouselTrack || !carouselImages[0]) return;
        const imageWidth = carouselImages[0].clientWidth;
        carouselTrack.style.transform = `translateX(-${currentIndex * imageWidth}px)`;
    }

    function startCarousel() {
        stopCarousel();
        carouselInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % carouselImages.length;
            moveCarousel();
        }, 3000); // 3 秒間隔
    }

    function stopCarousel() {
        clearInterval(carouselInterval);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            stopCarousel();
            currentIndex = (currentIndex - 1 + carouselImages.length) % carouselImages.length;
            moveCarousel();
            startCarousel();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            stopCarousel();
            currentIndex = (currentIndex + 1) % carouselImages.length;
            moveCarousel();
            startCarousel();
        });
    }

    if (carouselTrack && carouselImages.length > 1) {
        moveCarousel();
        startCarousel();
    }

    window.addEventListener('resize', () => {
        moveCarousel();
    });
});
