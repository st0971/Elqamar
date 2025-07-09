// js/product.js

document.addEventListener('DOMContentLoaded', function() {
    // 確保 allProductsData 已經被載入並可用
    if (typeof allProductsData === 'undefined' || !Array.isArray(allProductsData) || allProductsData.length === 0) {
        console.error("錯誤：allProductsData 未載入或為空！請檢查 allProductsData.js 檔案內容。");
        const productDetailSection = document.getElementById('product-detail-section');
        if (productDetailSection) {
            productDetailSection.innerHTML = '<p>抱歉，商品資料載入失敗。</p>';
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

    if (searchToggle && searchInput) {
        searchToggle.addEventListener('click', function(e) {
            e.preventDefault();
            searchInput.classList.toggle('hidden');
            if (!searchInput.classList.contains('hidden')) {
                searchInput.focus();
            } else {
                searchInput.value = ''; // 清空搜尋框內容
            }
        });

        // 點擊搜尋框外區域時隱藏搜尋框
        window.addEventListener('click', function(event) {
            if (!event.target.closest('.search-container') && !searchInput.classList.contains('hidden')) {
                searchInput.classList.add('hidden');
                searchInput.value = '';
            }
        });
    }


    // --- 商品詳情載入功能 ---
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const productDetailSection = document.getElementById('product-detail-section');

    if (productId) {
        const product = allProductsData.find(p => String(p.id) === String(productId));

        if (product) {
            productDetailSection.innerHTML = `
                <div class="product-wrapper">
                    <div class="product-image">
                        <img src="${product.img}" alt="${product.name}">
                    </div>
                    <div class="product-info">
                        <h1>${product.name}</h1>
                        <p class="price">$${product.price}</p>
                        <p class="description">${product.description || '暫無商品描述。'}</p>
                        <div class="quantity-and-favorite">
                            <div class="quantity-selector">
                                <label for="quantity">數量：</label>
                                <input type="number" id="quantity" value="1" min="1" class="quantity-input">
                            </div>
                            <button class="favorite-btn">
                                <img src="images/heart.png" alt="收藏">
                            </button>
                        </div>
                        <button class="btn add-to-cart-btn" data-id="${product.id}">加入購物車</button>
                    </div>
                </div>
            `;

            // 綁定加入購物車按鈕事件
            const addToCartBtn = productDetailSection.querySelector('.add-to-cart-btn');
            if (addToCartBtn) {
                addToCartBtn.addEventListener('click', function() {
                    const quantityInput = productDetailSection.querySelector('#quantity');
                    const quantity = parseInt(quantityInput.value, 10);
                    if (addToCart(productId, quantity, product)) {
                        showToast('商品已加入購物車！');
                    } else {
                        showToast('無法加入購物車，請稍後再試。', 5000);
                    }
                });
            }

            // 收藏按鈕功能 (如果需要)
            const favoriteBtn = productDetailSection.querySelector('.favorite-btn');
            if (favoriteBtn) {
                favoriteBtn.addEventListener('click', function() {
                    // 這裡可以加入收藏功能的邏輯
                    showToast('商品已收藏！');
                });
            }

        } else {
            productDetailSection.innerHTML = '<p>找不到該商品。</p>';
        }
    } else {
        productDetailSection.innerHTML = '<p>請選擇一個商品查看詳情。</p>';
    }

    // --- 購物車小紅點更新 (從 cart-count.js 導入) ---
    // 確保 updateCartCount 函式已在 cart-count.js 中定義並載入
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    } else {
        console.warn("updateCartCount function not found. Please ensure cart-count.js is loaded correctly.");
    }
});