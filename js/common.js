document.addEventListener('DOMContentLoaded', function() {
    // 導覽列下拉選單功能 (統一管理)
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const dropbtn = dropdown.querySelector('.dropbtn');
        const dropdownContent = dropdown.querySelector('.dropdown-content');

        // 使用 click 事件來切換下拉選單，避免 hover 在手機上的問題
        dropbtn.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation(); // 阻止事件冒泡到 window，避免立即關閉
            dropdownContent.classList.toggle('show');

            // 關閉其他已開啟的下拉選單
            dropdowns.forEach(otherDropdown => {
                const otherDropdownContent = otherDropdown.querySelector('.dropdown-content');
                if (otherDropdown !== dropdown && otherDropdownContent.classList.contains('show')) {
                    otherDropdownContent.classList.remove('show');
                }
            });
        });
    });

    // 點擊下拉選單外部關閉
    window.addEventListener('click', function(event) {
        dropdowns.forEach(dropdown => {
            const dropdownContent = dropdown.querySelector('.dropdown-content');
            if (!event.target.matches('.dropbtn') && !event.target.closest('.dropdown-content')) {
                dropdownContent.classList.remove('show');
            }
        });
    });

    // 搜尋列功能 (統一管理)
    const searchToggle = document.querySelector('.search-toggle');
    const searchInput = document.querySelector('.search-input');

    if (searchToggle && searchInput) {
        searchToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // 阻止事件冒泡到 window
            searchInput.classList.toggle('hidden');
            if (!searchInput.classList.contains('hidden')) {
                searchInput.focus();
            } else {
                searchInput.value = '';
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
                hamburgerMenu.classList.remove('active');
                mainNav.classList.remove('open');
            });
        });
    }


    // 確保 cart-count.js 中的 updateCartCount 和 showToast 函式可用
    // 如果您將它們移入 common.js，這裡就不需要再特別檢查
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    } else {
        console.warn("updateCartCount function not found. Please ensure cart-count.js is loaded correctly, or its contents are merged into common.js.");
    }
    if (typeof showToast === 'function') {
        // showToast 可以在這裡初始化或測試
    } else {
        console.warn("showToast function not found. Please ensure cart-count.js is loaded correctly, or its contents are merged into common.js.");
    }
});