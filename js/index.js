// js/index.js

document.addEventListener('DOMContentLoaded', function() {
    // 確保 allProductsData 已經被載入並可用
    if (typeof allProductsData === 'undefined' || !Array.isArray(allProductsData) || allProductsData.length === 0) {
        console.error("錯誤：allProductsData 未載入或為空！請檢查 allProductsData.js 檔案內容。");
        const productGrid = document.querySelector('.product-grid');
        if (productGrid) {
            productGrid.innerHTML = '<p>抱歉，商品資料載入失敗或無商品可顯示。</p>';
        }
        return; // 中止函式執行
    }

    // --- 導覽列下拉選單功能 ---
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const dropbtn = dropdown.querySelector('.dropbtn');
        const dropdownContent = dropdown.querySelector('.dropdown-content');

        dropbtn.addEventListener('click', function(event) {
            event.preventDefault();
            dropdownContent.classList.toggle('show');
        });
    });

    window.addEventListener('click', function(event) {
        dropdowns.forEach(dropdown => {
            const dropdownContent = dropdown.querySelector('.dropdown-content');
            if (!event.target.matches('.dropbtn') && !event.target.closest('.dropdown-content')) {
                dropdownContent.classList.remove('show');
            }
        });
    });

    // --- 漢堡選單功能 ---
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mainNav = document.querySelector('.navbar nav');

    if (hamburgerMenu && mainNav) {
        hamburgerMenu.addEventListener('click', function() {
            this.classList.toggle('active'); // 切換漢堡選單圖標的動畫
            mainNav.classList.toggle('open'); // 切換導航選單的顯示/隱藏
        });

        // 點擊導覽列連結後收起選單 (可選)
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                // 確保只有在導覽列打開時才關閉
                if (mainNav.classList.contains('open')) {
                    hamburgerMenu.classList.remove('active');
                    mainNav.classList.remove('open');
                }
            });
        });
    }

    // --- 搜尋列功能 ---
    const searchToggle = document.querySelector('.search-toggle');
    const searchInput = document.querySelector('.search-input');
    const productGrid = document.querySelector('.product-grid');
    const productSectionTitle = document.querySelector('.product-section h2');

    if (searchToggle && searchInput) {
        searchToggle.addEventListener('click', function(e) {
            e.preventDefault();
            searchInput.classList.toggle('hidden');
            if (!searchInput.classList.contains('hidden')) {
                searchInput.focus();
            } else {
                searchInput.value = '';
                // 當搜尋框隱藏時，恢復顯示熱門商品
                renderPopularProducts();
                productSectionTitle.textContent = '熱門商品';
            }
        });

        window.addEventListener('click', function(event) {
            if (!event.target.closest('.search-container') && !searchInput.classList.contains('hidden')) {
                searchInput.classList.add('hidden');
                searchInput.value = '';
                // 當點擊搜尋框外部時，恢復顯示熱門商品
                renderPopularProducts();
                productSectionTitle.textContent = '熱門商品';
            }
        });

        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase().trim();
            if (searchTerm !== '') {
                const filteredProducts = allProductsData.filter(product =>
                    (product.name ? product.name.toLowerCase().includes(searchTerm) : false)
                );
                renderProductCards(filteredProducts);
                productSectionTitle.textContent = `搜尋結果："${searchInput.value}"`;
            } else {
                renderPopularProducts();
                productSectionTitle.textContent = '熱門商品';
            }
        });
    }

    // --- 輪播圖功能 ---
    const carousel = document.querySelector('.carousel');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;
    let autoSlideInterval;

    if (carousel && slides.length > 0) {
        // 建立輪播點
        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetAutoSlide();
            });
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.dot');

        function goToSlide(index) {
            if (index < 0) {
                index = slides.length - 1;
            } else if (index >= slides.length) {
                index = 0;
            }
            carousel.style.transform = `translateX(-${index * 100}%)`;
            currentIndex = index;
            updateDots();
        }

        function updateDots() {
            dots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        prevButton.addEventListener('click', () => {
            goToSlide(currentIndex - 1);
            resetAutoSlide();
        });

        nextButton.addEventListener('click', () => {
            goToSlide(currentIndex + 1);
            resetAutoSlide();
        });

        function startAutoSlide() {
            autoSlideInterval = setInterval(() => {
                goToSlide(currentIndex + 1);
            }, 5000); // 每 5 秒自動切換
        }

        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }

        goToSlide(0); // 初始顯示第一張
        startAutoSlide(); // 啟動自動輪播
    } else {
        console.warn("輪播圖元素未找到或沒有幻燈片。");
    }

    // --- 商品顯示功能 (熱門商品) ---
    const popularProductIDs = ["P001", "P002", "P003", "P004"]; // 示例：您的熱門商品 ID

    function renderPopularProducts() {
        const popularProducts = allProductsData.filter(product =>
            popularProductIDs.includes(product.id)
        );
        renderProductCards(popularProducts);
    }

    function renderProductCards(products) {
        if (!productGrid) return; // 確保 productGrid 存在
        productGrid.innerHTML = ''; // 清空現有商品

        if (products.length === 0) {
            productGrid.innerHTML = '<p>抱歉，目前無相關商品。</p>';
            return;
        }

        products.forEach(product => {
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
        attachAddToCartListeners(); // 重新綁定事件監聽器
    }

    // --- 加入購物車功能 (假設使用 cart-count.js 中的 addToCart 和 showToast) ---
    function attachAddToCartListeners() {
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            // 先移除之前的監聽器以避免重複綁定
            btn.removeEventListener('click', handleAddToCart);
            btn.addEventListener('click', handleAddToCart);
        });
    }

    function handleAddToCart(e) {
        const productId = e.currentTarget.dataset.id;
        const quantity = 1; // 從商品列表頁加入購物車預設數量為 1

        const productData = allProductsData.find(p => String(p.id) === String(productId));

        if (productData) {
            // 呼叫 cart-count.js 中的 addToCart 函式
            if (addToCart(productId, quantity, productData)) {
                // 呼叫 cart-count.js 中的 showToast 函式
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
    renderPopularProducts(); // 初始載入熱門商品
    updateCartCount(); // 更新購物車小紅點 (假設 updateCartCount 在 cart-count.js 中)
});