// js/notice.js

document.addEventListener('DOMContentLoaded', function() {
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

    // --- 購物車小紅點更新 (從 cart-count.js 導入) ---
    // 確保 updateCartCount 函式已在 cart-count.js 中定義並載入
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    } else {
        console.warn("updateCartCount function not found. Please ensure cart-count.js is loaded correctly.");
    }
});