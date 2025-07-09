// js/index.js

document.addEventListener('DOMContentLoaded', function () {
    // 確保 allProductsData 已經被載入並可用
    if (typeof allProductsData === 'undefined' || !Array.isArray(allProductsData) || allProductsData.length === 0) {
        console.error("錯誤：allProductsData 未載入或為空！請檢查 allProductsData.js 檔案內容。");
        const productGrid = document.querySelector('.product-grid');
        if (productGrid) {
            productGrid.innerHTML = '<p>抱歉，商品資料載入失敗或無商品可顯示。</p>';
        }
        return; // 中止函式執行
    }
    
    window.addEventListener('click', function (event) {
        // 如果點擊的不是下拉按鈕、也不是下拉選單內容，且不是漢堡選單、也不是導覽列本身
        if (!event.target.matches('.dropbtn') && !event.target.closest('.dropdown-content') &&
            !event.target.closest('.hamburger-menu') && !event.target.closest('.navbar nav')) {
            dropdowns.forEach(dropdown => {
                const dropdownContent = dropdown.querySelector('.dropdown-content');
                dropdownContent.classList.remove('show');
            });
            // 點擊外面也收起漢堡選單
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburgerMenu.classList.remove('active');
            }
        }
    });

    window.addEventListener('click', function (event) {
        dropdowns.forEach(dropdown => {
            const dropdownContent = dropdown.querySelector('.dropdown-content');
            if (!event.target.matches('.dropbtn') && !event.target.closest('.dropdown-content')) {
                dropdownContent.classList.remove('show');
            }
        });
    });

    // --- 搜尋列功能 ---
    const searchToggle = document.querySelector('.search-toggle');
    const searchInput = document.querySelector('.search-input');
    const productGrid = document.querySelector('.product-grid');
    const paginationContainer = document.querySelector('.pagination');
    const pageTitle = document.querySelector('.product-section h2'); // 取得首頁標題元素

    const productsPerPage = 12;
    let currentPage = 1;
    let currentDisplayedProducts = []; // 儲存目前顯示/篩選的商品數據對象

    // 定義 index 頁面專屬的商品 (例如：從 allProductsData 中 ID 1-12 的商品，假設這些是「限時開團」商品)
    const initialProductsForThisPage = allProductsData.filter(product => product.id >= 1 && product.id <= 12);

    // Event listeners for search toggle and input
    // Event listeners for search toggle and input
    if (searchToggle && searchInput) {
        searchToggle.addEventListener('click', function (e) {
            e.preventDefault();
            // 將這裡的 classList.toggle('hidden') 改為 classList.toggle('active')
            searchInput.classList.toggle('active');
            if (searchInput.classList.contains('active')) {
                searchInput.focus();
            } else {
                searchInput.value = '';
                // 當搜尋框收起時，恢復顯示首頁預設的商品
                filterAndRenderProducts('', initialProductsForThisPage);
            }
        });

        window.addEventListener('click', function (event) {
            if (!event.target.closest('.search-container') && searchInput.classList.contains('active')) {
                // 將這裡的 classList.add('hidden') 改為 classList.remove('active')
                searchInput.classList.remove('active');
                searchInput.value = '';
                // 當點擊搜尋框外部時，恢復顯示首頁預設的商品
                filterAndRenderProducts('', initialProductsForThisPage);
            }
        });

        // ... (searchInput.addEventListener('input', ...)) ...
    }

    // Function to filter products and then render them with pagination
    function filterAndRenderProducts(searchTerm, dataSource) {
        const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();

        if (lowerCaseSearchTerm !== '') {
            // If there's a search term, filter from the provided dataSource (which will be allProductsData)
            currentDisplayedProducts = dataSource.filter(product =>
                (product.name ? product.name.toLowerCase().includes(lowerCaseSearchTerm) : false)
            );
            // 更新頁面標題為搜尋結果
            if (pageTitle) {
                pageTitle.textContent = `搜尋結果："${searchTerm}"`;
            }
        } else {
            // If no search term, use the initial products for this specific page
            currentDisplayedProducts = dataSource; // 這是首頁「限時開團」的商品
            // 恢復頁面原始標題
            if (pageTitle) {
                pageTitle.textContent = '限時開團'; // 這是首頁固定的預設標題
            }
        }

        currentPage = 1; // Reset to first page after filtering
        renderProductCards(currentDisplayedProducts, currentPage);
        setupPaginationButtons(currentDisplayedProducts);
    }

    // Function to render product cards onto the grid
    function renderProductCards(productsToDisplay, page = 1) {
        if (!productGrid) return; // Exit if product grid is not found
        productGrid.innerHTML = ''; // Clear existing products

        const start = (page - 1) * productsPerPage;
        const end = start + productsPerPage;
        const productsForCurrentPage = productsToDisplay.slice(start, end);

        if (productsForCurrentPage.length === 0) {
            productGrid.innerHTML = '<p>找不到符合條件的商品</p>';
            return;
        }

        productsForCurrentPage.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <a href="product.html?id=${product.id}">
                    <img src="${product.img}" alt="${product.name}">
                </a>
                <h3>${product.name}</h3>
                <p>$${product.price}</p>
                <button class="btn add-to-cart-btn" data-id="${product.id}">加入購物車</button>
            `;
            productGrid.appendChild(card);
        });

        // Re-attach add-to-cart listeners after rendering new cards
        attachAddToCartListeners();
    }

    // Function to setup pagination buttons
    function setupPaginationButtons(products) {
        if (!paginationContainer) return; // Exit if pagination container is not found

        const totalPages = Math.ceil(products.length / productsPerPage);
        paginationContainer.innerHTML = ''; // Clear existing buttons

        if (totalPages <= 1) {
            paginationContainer.style.display = 'none'; // Hide if only one page or no products
            return;
        }

        paginationContainer.style.display = 'flex'; // Show pagination

        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.classList.add('page-btn');
            button.dataset.page = i;
            button.textContent = i;
            if (i === currentPage) {
                button.classList.add('active');
            }
            button.addEventListener('click', () => {
                currentPage = i;
                renderProductCards(products, currentPage);
                // Update active state for buttons
                paginationContainer.querySelectorAll('.page-btn').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
            paginationContainer.appendChild(button);
        }
    }

    // --- 輪播功能 ---
    const carouselTrack = document.querySelector('.carousel-track');
    const carouselImages = carouselTrack.querySelectorAll('img');
    const carouselPrevBtn = document.querySelector('.carousel-btn.prev');
    const carouselNextBtn = document.querySelector('.carousel-btn.next');

    let currentCarouselIndex = 0;

    function updateCarousel() {
        if (carouselImages.length === 0) return;
        const slideWidth = carouselImages[0].clientWidth;
        carouselTrack.style.transform = `translateX(-${currentCarouselIndex * slideWidth}px)`;
    }

    if (carouselPrevBtn && carouselNextBtn) {
        carouselNextBtn.addEventListener('click', () => {
            currentCarouselIndex = (currentCarouselIndex + 1) % carouselImages.length;
            updateCarousel();
        });

        carouselPrevBtn.addEventListener('click', () => {
            currentCarouselIndex = (currentCarouselIndex - 1 + carouselImages.length) % carouselImages.length;
            updateCarousel();
        });
    }

    window.addEventListener('resize', updateCarousel);
    updateCarousel(); // Initial carousel positioning
    let carouselInterval = setInterval(nextSlide, 3000);

    function nextSlide() {
        currentCarouselIndex = (currentCarouselIndex + 1) % carouselImages.length;
        updateCarousel();
    }

    // 滑入暫停
    carouselTrack.addEventListener('mouseenter', () => clearInterval(carouselInterval));

    // 滑出繼續
    carouselTrack.addEventListener('mouseleave', () => {
        carouselInterval = setInterval(nextSlide, 3000);
    });

    // --- 加入購物車功能 (假設使用 cartUtils.js 中的 addToCart 和 showToast) ---
    function attachAddToCartListeners() {
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            // 移除舊的監聽器以避免重複綁定
            btn.removeEventListener('click', handleAddToCart);
            btn.addEventListener('click', handleAddToCart);
        });
    }

    function handleAddToCart(e) {
        const productId = e.currentTarget.dataset.id;
        const quantity = 1; // 從商品列表頁加入購物車預設數量為 1

        const productData = allProductsData.find(p => String(p.id) === String(productId));

        if (productData) {
            // 呼叫 cartUtils.js 中的 addToCart 函式
            if (addToCart(productId, quantity, productData)) {
                // 呼叫 cartUtils.js 中的 showToast 函式
                showToast('商品已加入購物車！');
            } else {
                showToast('無法加入購物車，請稍後再試。', 5000);
            }
        } else {
            console.error('商品資料未找到，ID:', productId);
            showToast('無法將商品加入購物車：商品資料不存在！', 5000);
        }
    }

    // --- 頁面載入時的初始化 ---
    // 初始載入：渲染首頁預設的商品並設定分頁
    filterAndRenderProducts('', initialProductsForThisPage);

    // 頁面載入時更新購物車小紅點 (假設 updateCartCount 在 cartUtils.js 中)
    updateCartCount();
});
