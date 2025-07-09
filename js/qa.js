// js/qa.js

document.addEventListener('DOMContentLoaded', function() {
    // --- 導覽列下拉選單功能 (從 index.js 或 common.js 複製過來，確保每個頁面都有此功能) ---
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

    // --- 搜尋列功能 (僅用於切換顯示/隱藏，實際搜尋行為不在 Q&A 頁面進行) ---
    // Q&A 頁面的搜尋列通常不進行商品搜尋，只是單純的顯示切換
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


    // --- FAQ 手風琴功能 ---
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            // 找到當前的 accordion-item
            const item = this.closest('.accordion-item');
            // 找到這個 item 裡的 content
            const content = item.querySelector('.accordion-content');

            // 切換 active class
            this.classList.toggle('active');
            content.classList.toggle('show');

            // 為了實現平滑展開/收合動畫，手動設定 max-height
            // 如果 content 展開，設定為其scrollHeight；如果收合，設定為 0
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

            // 在這裡可以取得表單的數據
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // 實際情況下，你會在這裡使用 Fetch API 或 XMLHttpRequest
            // 將這些數據發送到你的後端伺服器 (例如 PHP, Node.js, Python Flask/Django 等)
            // 讓後端處理發送郵件等操作。
            console.log('表單數據:', { name, email, subject, message });

            // 這裡我們只顯示一個提示訊息，模擬表單送出成功
            // 假設 showToast 函式在 cartUtils.js 中
            if (typeof showToast === 'function') {
                showToast('您的訊息已送出，我們會盡快回覆您！', 4000);
            } else {
                alert('您的訊息已送出，我們會盡快回覆您！');
            }
            
            // 清空表單
            contactForm.reset();
        });
    }

    // --- 購物車小紅點更新 (從 cartUtils.js 導入) ---
    // 確保 updateCartCount 函式已在 cartUtils.js 中定義並載入
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    } else {
        console.warn("updateCartCount function not found. Please ensure cartUtils.js is loaded correctly.");
    }
});