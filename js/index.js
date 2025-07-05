document.addEventListener('DOMContentLoaded', function () {
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        const dropbtn = dropdown.querySelector('.dropbtn');
        const dropdownContent = dropdown.querySelector('.dropdown-content');

        dropbtn.addEventListener('click', function (event) {
            event.preventDefault();
            dropdownContent.classList.toggle('show');
        });
    });

    // 點擊外部收起 dropdown
    window.addEventListener('click', function (event) {
        dropdowns.forEach(dropdown => {
            const dropdownContent = dropdown.querySelector('.dropdown-content');
            // 確保點擊的不是下拉按鈕本身，也不是下拉選單內的項目
            if (!event.target.matches('.dropbtn') && !event.target.closest('.dropdown-content')) {
                if (dropdownContent.classList.contains('show')) {
                    dropdownContent.classList.remove('show');
                }
            }
        });
    });

    // 搜尋欄顯示／隱藏切換
    const searchToggle = document.querySelector('.search-toggle');
    const searchInput = document.querySelector('.search-input');

    if (searchToggle && searchInput) {
        searchToggle.addEventListener('click', function (e) {
            e.preventDefault();
            searchInput.classList.toggle('hidden');
            if (!searchInput.classList.contains('hidden')) {
                searchInput.focus();
            } else {
                // 當搜尋欄隱藏時，清空搜尋框並顯示所有商品
                searchInput.value = '';
                filterProducts(''); // 呼叫篩選函數，傳入空字串表示顯示所有
            }
        });

        // 點擊其他地方時收起搜尋欄
        window.addEventListener('click', function (event) {
            if (
                !event.target.closest('.search-container') &&
                !searchInput.classList.contains('hidden')
            ) {
                searchInput.classList.add('hidden');
                searchInput.value = ''; // 隱藏時清空搜尋框
                filterProducts(''); // 隱藏時顯示所有商品
            }
        });
    }

    // 簡單圖片輪播
    const track = document.querySelector('.carousel-track');
    const images = track.querySelectorAll('img');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');

    let currentIndex = 0;

    function updateCarousel() {
        if (images.length === 0) return; // 避免沒有圖片時出錯
        const slideWidth = images[0].clientWidth;
        track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    }

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % images.length;
        updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateCarousel();
    });

    // 可選：視窗縮放時重新調整位置
    window.addEventListener('resize', updateCarousel);

    // 初始定位
    updateCarousel();

    // 商品分頁功能
    const products = document.querySelectorAll('.product-card');
    const pageButtons = document.querySelectorAll('.page-btn');
    const productsPerPage = 12; // 每頁顯示 12 個商品

    // 計算總頁數
    const totalPages = Math.ceil(products.length / productsPerPage);
    const paginationContainer = document.querySelector('.pagination'); // 確保 HTML 中有這個元素
    
    // 如果分頁區塊被註解掉，需要先解開註解
    if (paginationContainer && totalPages > 1) { // 只有當商品多於一頁時才顯示分頁
        // 動態生成分頁按鈕
        paginationContainer.innerHTML = ''; // 清空現有的分頁按鈕
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.classList.add('page-btn');
            button.setAttribute('data-page', i);
            button.textContent = i;
            paginationContainer.appendChild(button);
        }
        // 重新獲取分頁按鈕，因為它們是動態生成的
        const updatedPageButtons = document.querySelectorAll('.page-btn');

        function showPage(page) {
            const start = (page - 1) * productsPerPage;
            const end = start + productsPerPage;

            products.forEach((product, index) => {
                // 這裡需要注意，如果商品被搜尋隱藏，則不應該被分頁顯示
                // 應只處理可見商品的分頁
                if (product.style.display !== 'none') { // 檢查商品是否未被搜尋功能隱藏
                    if (index >= start && index < end) {
                        product.style.display = 'block';
                    } else {
                        product.style.display = 'none';
                    }
                }
            });

            // 高亮目前頁碼
            updatedPageButtons.forEach(btn => btn.classList.remove('active'));
            const activeBtn = document.querySelector(`.page-btn[data-page="${page}"]`);
            if (activeBtn) activeBtn.classList.add('active');
        }

        // 初始顯示第 1 頁
        showPage(1);

        // 分頁按鈕監聽
        updatedPageButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const page = parseInt(btn.getAttribute('data-page'));
                showPage(page);
            });
        });
    }


    // 新增的搜尋功能邏輯
    const productGrid = document.querySelector('.product-grid'); // 獲取商品網格容器
    const allProducts = Array.from(document.querySelectorAll('.product-card')); // 獲取所有商品卡片

    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.toLowerCase(); // 獲取搜尋關鍵字並轉為小寫
        filterProducts(searchTerm);
    });

    function filterProducts(searchTerm) {
        let visibleProductsCount = 0;
        allProducts.forEach(product => {
            const productName = product.querySelector('h3').textContent.toLowerCase();
            if (productName.includes(searchTerm)) {
                product.style.display = 'block'; // 顯示符合條件的商品
                visibleProductsCount++;
            } else {
                product.style.display = 'none'; // 隱藏不符合條件的商品
            }
        });

        // 重新調整分頁 (如果需要的話，這部分會更複雜，因為分頁現在會受搜尋影響)
        // 為了簡化，這裡暫時在搜尋時禁用分頁或只顯示所有符合的商品
        // 如果要讓分頁在搜尋後仍然有效，需要重新計算分頁按鈕和顯示邏輯
        // 在這個例子中，當搜尋時，分頁功能將暫時「失效」，直到搜尋框清空
        if (searchTerm !== '' && paginationContainer) {
            paginationContainer.style.display = 'none'; // 搜尋時隱藏分頁
        } else if (paginationContainer && totalPages > 1) {
            paginationContainer.style.display = 'flex'; // 無搜尋時顯示分頁
            showPage(1); // 搜尋清空後回到第一頁
        }
    }

    if (productId) { // 只有當有 productId 時才執行以下代碼，避免在 index.html 報錯
        const data = fakeData[productId];

        if (data) {
            // 檢查這些元素是否存在於當前頁面
            const productNameElement = document.getElementById('product-name');
            const productImgElement = document.getElementById('product-img');
            const productDescriptionElement = document.getElementById('product-description');
            const productPriceElement = document.getElementById('product-price');

            if (productNameElement) productNameElement.textContent = data.name;
            if (productImgElement) productImgElement.src = data.img;
            if (productDescriptionElement) productDescriptionElement.textContent = data.description;
            if (productPriceElement) productPriceElement.textContent = '價格：$' + data.price;
            
            document.title = data.name + ' - 商品頁'; // 更新頁面標題
        } else {
            const productNameElement = document.getElementById('product-name');
            if (productNameElement) productNameElement.textContent = '查無此商品';
            document.title = '查無此商品 - 商品頁';
        }
    }
});
