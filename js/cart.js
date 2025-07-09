// js/cart.js

document.addEventListener('DOMContentLoaded', function() {
    // 確保 allProductsData 已經被載入並可用
    if (typeof allProductsData === 'undefined' || !Array.isArray(allProductsData) || allProductsData.length === 0) {
        console.error("錯誤：allProductsData 未載入或為空！請檢查 allProductsData.js 檔案內容。");
        // 可以顯示錯誤訊息給用戶
        const cartItemsContainer = document.getElementById('cart-items-container');
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = '<tr><td colspan="5">商品資料載入失敗，無法顯示購物車內容。</td></tr>';
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

    // --- 購物車邏輯 ---
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-button');

    function loadCartItems() {
        // 從 localStorage 獲取購物車資料
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        return cart;
    }

    function saveCartItems(cart) {
        // 將購物車資料存儲到 localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount(); // 更新購物車小紅點數量
    }

    function renderCart() {
        const cart = loadCartItems();
        cartItemsContainer.innerHTML = ''; // 清空現有內容
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<tr><td colspan="5">您的購物車是空的。</td></tr>';
            checkoutButton.disabled = true; // 禁用結帳按鈕
            checkoutButton.classList.add('disabled-btn'); // 增加禁用樣式
        } else {
            checkoutButton.disabled = false; // 啟用結帳按鈕
            checkoutButton.classList.remove('disabled-btn'); // 移除禁用樣式
            cart.forEach(item => {
                const product = allProductsData.find(p => String(p.id) === String(item.id));
                if (product) {
                    const subtotal = product.price * item.quantity;
                    total += subtotal;

                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>
                            <a href="product.html?id=${product.id}" class="cart-product-link">
                                <img src="${product.img}" alt="${product.name}">
                                <span>${product.name}</span>
                            </a>
                        </td>
                        <td>$${product.price}</td>
                        <td>
                            <select class="quantity-select" data-id="${product.id}">
                                ${Array.from({ length: 10 }, (_, i) => i + 1).map(num => `
                                    <option value="${num}" ${num === item.quantity ? 'selected' : ''}>${num}</option>
                                `).join('')}
                            </select>
                        </td>
                        <td>$${subtotal.toFixed(2)}</td>
                        <td>
                            <button class="remove-btn" data-id="${product.id}">移除</button>
                        </td>
                    `;
                    cartItemsContainer.appendChild(row);
                }
            });
        }
        cartTotalElement.textContent = total.toFixed(2);

        attachEventListeners(); // 重新綁定事件監聽器
    }

    function attachEventListeners() {
        // 數量選擇器事件
        document.querySelectorAll('.quantity-select').forEach(select => {
            select.removeEventListener('change', handleQuantityChange); // 避免重複綁定
            select.addEventListener('change', handleQuantityChange);
        });

        // 移除按鈕事件
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.removeEventListener('click', handleRemoveItem); // 避免重複綁定
            btn.addEventListener('click', handleRemoveItem);
        });

        // 結帳按鈕事件
        if (checkoutButton) {
            checkoutButton.removeEventListener('click', handleCheckout); // 避免重複綁定
            checkoutButton.addEventListener('click', handleCheckout);
        }
    }

    function handleQuantityChange(event) {
        const productId = event.target.dataset.id;
        const newQuantity = parseInt(event.target.value, 10);
        let cart = loadCartItems();
        const itemIndex = cart.findIndex(item => String(item.id) === String(productId));

        if (itemIndex > -1) {
            cart[itemIndex].quantity = newQuantity;
            saveCartItems(cart);
            renderCart(); // 重新渲染購物車以更新小計和總計
            showToast('購物車數量已更新！');
        }
    }

    function handleRemoveItem(event) {
        const productId = event.target.dataset.id;
        let cart = loadCartItems();
        cart = cart.filter(item => String(item.id) !== String(productId)); // 過濾掉要移除的商品
        saveCartItems(cart);
        renderCart(); // 重新渲染購物車
        showToast('商品已從購物車移除！');
    }

    function handleCheckout() {
        const cart = loadCartItems();
        if (cart.length > 0) {
            // 在這裡可以加入實際的結帳邏輯，例如導向支付頁面或發送訂單資訊到後端
            // 目前只清空購物車並顯示提示訊息
            localStorage.removeItem('cart'); // 清空購物車
            renderCart(); // 重新渲染，顯示購物車為空
            showToast('感謝您的購買！您的訂單已送出，我們會盡快處理。', 6000);
            console.log('執行結帳，購物車內容:', cart);
        } else {
            showToast('您的購物車是空的，無法結帳。', 3000);
        }
    }

    // --- 頁面載入時的初始化 ---
    renderCart(); // 載入並渲染購物車內容
    updateCartCount(); // 更新購物車小紅點
});