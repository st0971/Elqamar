// js/qa.js

document.addEventListener('DOMContentLoaded', function() {
    // --- 導覽列下拉選單功能 ---
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const dropbtn = dropdown.querySelector('.dropbtn');
        const dropdownContent = dropdown.querySelector('.dropdown-content');

        dropbtn.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation(); // 阻止事件冒泡到 window，避免立即關閉
            dropdownContent.classList.toggle('show');

            // 如果在手機模式下，確保下拉選單能自動調整 max-height
            if (dropdownContent.classList.contains('show')) {
                dropdownContent.style.maxHeight = dropdownContent.scrollHeight + "px";
            } else {
                dropdownContent.style.maxHeight = "0";
            }

            // 關閉其他已開啟的下拉選單 (避免多個下拉選單同時開啟)
            dropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    const otherDropdownContent = otherDropdown.querySelector('.dropdown-content');
                    otherDropdownContent.classList.remove('show');
                    otherDropdownContent.style.maxHeight = "0";
                }
            });
        });
    });

    window.addEventListener('click', function(event) {
        dropdowns.forEach(dropdown => {
            const dropdownContent = dropdown.querySelector('.dropdown-content');
            // 檢查點擊的目標是否在 dropdown 內部，或者是否為 .dropbtn 本身
            if (!event.target.matches('.dropbtn') && !event.target.closest('.dropdown')) {
                dropdownContent.classList.remove('show');
                dropdownContent.style.maxHeight = "0"; // 隱藏時重設高度
            }
        });
    });

    // --- 搜尋列功能 ---
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
            if (!event.target.closest('.search-container') && !event.target.matches('.search-toggle') && !searchInput.classList.contains('hidden')) {
                searchInput.classList.add('hidden');
                searchInput.value = '';
            }
        });
    }


    // --- 新增：漢堡選單功能 ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.navbar nav'); // 選擇 nav 元素，因為 max-height 會應用在它上面

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // 阻止事件冒泡到 window
            this.classList.toggle('active'); // 切換漢堡選單圖示的動畫
            navMenu.classList.toggle('show'); // 切換導覽選單的顯示/隱藏

            if (navMenu.classList.contains('show')) {
                // 展開選單時，設定 max-height 為其內容的實際高度 (ul 的 scrollHeight)
                // 這裡需要找到 nav 內部的 ul 才能正確計算
                const ulElement = navMenu.querySelector('ul');
                if (ulElement) {
                    navMenu.style.maxHeight = ulElement.scrollHeight + 20 + "px"; // 增加一些 padding 的高度
                }
            } else {
                // 收合選單時，設定 max-height 為 0
                navMenu.style.maxHeight = "0";
                // 同時關閉所有下拉選單
                dropdowns.forEach(dropdown => {
                    const dropdownContent = dropdown.querySelector('.dropdown-content');
                    dropdownContent.classList.remove('show');
                    dropdownContent.style.maxHeight = "0";
                });
            }
        });

        // 點擊導覽選單外側時收合漢堡選單
        window.addEventListener('click', function(event) {
            // 檢查點擊是否在 navbar 外部，並且漢堡選單是展開的
            if (!event.target.closest('.navbar') && navMenu.classList.contains('show')) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('show');
                navMenu.style.maxHeight = "0";
                // 同時關閉所有下拉選單
                dropdowns.forEach(dropdown => {
                    const dropdownContent = dropdown.querySelector('.dropdown-content');
                    dropdownContent.classList.remove('show');
                    dropdownContent.style.maxHeight = "0";
                });
            }
        });
    }


    // --- FAQ 手風琴功能 ---
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const item = this.closest('.accordion-item');
            const content = item.querySelector('.accordion-content');

            this.classList.toggle('active');
            content.classList.toggle('show');

            if (content.classList.contains('show')) {
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = "0";
            }

            // (可選) 關閉其他已展開的手風琴項目
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== this) {
                    otherHeader.classList.remove('active');
                    const otherContent = otherHeader.closest('.accordion-item').querySelector('.accordion-content');
                    otherContent.classList.remove('show');
                    otherContent.style.maxHeight = "0";
                }
            });
        });
    });


    // --- 聯絡表單送出功能 ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // 阻止表單的預設提交行為

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value; // 假設 subject 已經被移除

            console.log('表單數據:', { name, email, message });

            if (typeof showToast === 'function') {
                showToast('您的訊息已送出，我們會盡快回覆您！', 4000);
            } else {
                alert('您的訊息已送出，我們會盡快回覆您！');
            }
            
            contactForm.reset();
        });
    }

    // --- 購物車小紅點更新 (從 cartUtils.js 導入) ---
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    } else {
        console.warn("updateCartCount function not found. Please ensure cartUtils.js is loaded correctly.");
    }
});
