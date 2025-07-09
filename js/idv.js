// js/idv.js

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

    // 導覽列下拉選單功能
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

    // --- 搜尋列功能 ---
    const searchToggle = document.querySelector('.search-toggle');
    const searchInput = document.querySelector('.search-input');
    const productGrid = document.querySelector('.product-grid');
    const paginationContainer = document.querySelector('.pagination');
    const pageTitle = document.querySelector('.product-section h2'); // 取得頁面標題元素

    const productsPerPage = 12; // 每頁顯示 12 個商品
    let currentPage = 1;
    let currentDisplayedProducts = []; // 儲存目前顯示/篩選的商品數據對象

    // 定義此頁面 (第五人格) 預設顯示的商品
    // 假設 allProductsData 中的商品會有 'tags' 或 'category' 屬性來識別
    const initialProductsForThisPage = allProductsData.filter(product => {
        // 這裡需要根據你的實際 allProductsData 結構來定義 '第五人格' 的判斷邏輯
        // 例如：product.category === '第五人格' 或 product.tags.includes('第五人格')
        // 這裡假設所有 ID 從 100 開始的商品都是第五人格預購商品
        // 請務必調整為你實際的分類邏輯
        return product.id >= 100 && product.id <= 199; // 示例：ID 100-199 為第五人格商品
    });

    // 檢查初始商品是否為空，若為空則顯示提示
    if (initialProductsForThisPage.length === 0) {
        if (productGrid) {
            productGrid.innerHTML = '<p>抱歉，目前此分類暫無商品可顯示。</p>';
        }
        if (paginationContainer) {
            paginationContainer.style.display = 'none'; // 隱藏分頁
        }
    }

    // 搜尋開關和輸入框事件監聽器
    if (searchToggle && searchInput) {
        searchToggle.addEventListener('click', function(e) {
            e.preventDefault();
            searchInput.classList.toggle('hidden');
            if (!searchInput.classList.contains('hidden')) {
                searchInput.focus();
            } else {
                searchInput.value = '';
                // 當搜尋框隱藏時，恢復顯示此頁面預設的商品
                filterAndRenderProducts('', initialProductsForThisPage);
            }
        });

        window.addEventListener('click', function(event) {
            if (!event.target.closest('.search-container') && !searchInput.classList.contains('hidden')) {
                searchInput.classList.add('hidden');
                searchInput.value = '';
                // 當點擊搜尋框外部時，恢復顯示此頁面預設的商品
                filterAndRenderProducts('', initialProductsForThisPage);
            }
        });

        // 搜尋輸入事件監聽器
        searchInput.addEventListener('input', () => {
            // 在此頁面進行搜尋時，搜尋範圍是全站商品 (allProductsData)
            filterAndRenderProducts(searchInput.value, allProductsData);
        });
    }

    // 篩選商品並渲染到網格，同時處理分頁
    function filterAndRenderProducts(searchTerm, dataSource) {
        const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();

        if (lowerCaseSearchTerm !== '') {
            // 如果有搜尋詞，從提供的數據源（通常是 allProductsData）中篩選
            currentDisplayedProducts = dataSource.filter(product =>
                (product.name ? product.name.toLowerCase().includes(lowerCaseSearchTerm) : false)
            );
            // 更新頁面標題為搜尋結果
            if (pageTitle) {
                pageTitle.textContent = `搜尋結果："${searchTerm}"`;
            }
        } else {
            // 如果沒有搜尋詞，使用此頁面預設的商品
            currentDisplayedProducts = dataSource;
            // 恢復頁面原始標題
            if (pageTitle) {
                pageTitle.textContent = '預購商品 - 第五人格'; // 這是此頁面固定的預設標題
            }
        }

        currentPage = 1; // 篩選後重置到第一頁
        renderProductCards(currentDisplayedProducts, currentPage);
        setupPaginationButtons(currentDisplayedProducts);
    }

    // 將商品卡片渲染到網格
    function renderProductCards(productsToDisplay, page = 1) {
        if (!productGrid) return;
        productGrid.innerHTML = ''; // 清空現有商品

        const start = (page - 1) * productsPerPage;
        const end = start + productsPerPage;
        const productsForCurrentPage = productsToDisplay.slice(start, end);

        if (productsForCurrentPage.length === 0) {
            productGrid.innerHTML = '<p>找不到符合條件的商品。</p>';
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

        // 重新綁定加入購物車按鈕的事件監聽器
        attachAddToCartListeners();
    }

    // 設定分頁按鈕
    function setupPaginationButtons(products) {
        if (!paginationContainer) return;

        const totalPages = Math.ceil(products.length / productsPerPage);
        paginationContainer.innerHTML = ''; // 清空現有按鈕

        if (totalPages <= 1) {
            paginationContainer.style.display = 'none'; // 如果只有一頁或無商品，則隱藏分頁
            return;
        }

        paginationContainer.style.display = 'flex'; // 顯示分頁

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
                // 更新按鈕的活躍狀態
                paginationContainer.querySelectorAll('.page-btn').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
            paginationContainer.appendChild(button);
        }
    }

    // --- 加入購物車功能 (假設使用 cartUtils.js 中的 addToCart 和 showToast) ---
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
    // 初始載入：渲染此頁面預設的商品並設定分頁
    filterAndRenderProducts('', initialProductsForThisPage);

    // 頁面載入時更新購物車小紅點 (假設 updateCartCount 在 cartUtils.js 中)
    updateCartCount();
});