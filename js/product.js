document.addEventListener('DOMContentLoaded', function () {
    // 下拉選單和搜尋欄切換 (這部分也可以考慮抽成 common.js)
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

    const searchToggle = document.querySelector('.search-toggle');
    const searchInput = document.querySelector('.search-input');

    if (searchToggle && searchInput) {
        searchToggle.addEventListener('click', function (e) {
            e.preventDefault();
            searchInput.classList.toggle('hidden');
            if (!searchInput.classList.contains('hidden')) {
                searchInput.focus();
            } else {
                searchInput.value = ''; // 清空搜尋框
            }
        });

        window.addEventListener('click', function (event) {
            if (!event.target.closest('.search-container') && !searchInput.classList.contains('hidden')) {
                searchInput.classList.add('hidden');
                searchInput.value = '';
            }
        });
        // product.js 不會有商品列表顯示，所以不需要搜尋 input 監聽器觸發 renderProducts
        // 這裡的搜尋框只是顯示/隱藏，如果需要實際搜尋跳轉，則需要額外邏輯
    }

    // 取得網址參數中的商品 ID
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    // *** 關鍵修改：直接從 allProductsData 中查找商品 ***
    const data = allProductsData.find(product => product.id === productId);

    if (data) {
        document.title = data.name + ' - 商品頁';
        document.getElementById('product-name').textContent = data.name;
        document.getElementById('product-img').src = data.img;
        // 文字換行
        document.getElementById('product-description').innerHTML = data.description.replace(/\n/g, '<br>');
        document.getElementById('product-price').textContent = '價格：$' + data.price;
    } else {
        document.title = '查無此商品 - 商品頁';
        document.getElementById('product-name').textContent = '查無此商品';
        document.getElementById('product-price').textContent = '';
        document.getElementById('product-img').src = '';
        document.getElementById('product-description').innerHTML = '很抱歉，找不到您查詢的商品資訊。';
    }
});
