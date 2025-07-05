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
            if (!event.target.matches('.dropbtn')) {
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
            }
        });

        // 點擊其他地方時收起搜尋欄
        window.addEventListener('click', function (event) {
            if (
                !event.target.closest('.search-container') &&
                !searchInput.classList.contains('hidden')
            ) {
                searchInput.classList.add('hidden');
            }
        });
    }

    // 取得網址參數中的商品 ID
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // 商品資料
    const fakeData = {
        1: {
            // name為在最上方的網頁名稱跟商品名稱
            name: '商品名稱1',
            price: 399,
            img: 'images/samplephoto.png',
            description: '【尺寸】XX約XXXmm <br>【材質】XXX'
        },
        2: {
            name: '商品名稱2',
            price: 499,
            img: 'images/samplephoto.png',
            description: '風格獨特、限量發售。'
        },
        3: {
            // name為在最上方的網頁名稱跟商品名稱
            name: '商品名稱3',
            price: 399,
            img: 'images/samplephoto.png',
            description: '【尺寸】XX約XXXmm <br>【材質】XXX'
        },
        4: {
            name: '商品名稱4',
            price: 499,
            img: 'images/samplephoto.png',
            description: '風格獨特、限量發售。'
        }
        // ...可以擴充更多商品
    };


    const data = fakeData[productId];

    if (data) {
        document.title = data.name + ' - 商品頁';
        document.getElementById('product-name').textContent = data.name;
        document.getElementById('product-img').src = data.img;
        // 文字可以換行
        document.getElementById('product-description').innerHTML = data.description;
        document.getElementById('product-price').textContent = '價格：$' + data.price;
    } else {
        document.getElementById('product-name').textContent = '查無此商品';
    }
});
