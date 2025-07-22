document.addEventListener('DOMContentLoaded', function () {
    // 確認 allProductsData 已載入
    if (typeof allProductsData === 'undefined') {
        console.error("allProductsData.js not loaded!");
        return;
    }

    // 取得網址參數中的商品 ID
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // 找到對應商品
    const product = allProductsData.find(p => String(p.id) === String(productId));

    if (product) {
        document.getElementById('product-name').textContent = product.name;
        document.getElementById('product-img').src = product.img;
        document.getElementById('product-description').innerHTML = product.description.replace(/\n/g, '<br>');
        document.getElementById('product-price').textContent = `價格：$${product.price}`;

        // 動態生成數量選單
        const qtySelect = document.getElementById('quantity-select');
        qtySelect.innerHTML = "";

        if (product.stock > 0) {
            for (let i = 1; i <= product.stock; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = i;
                qtySelect.appendChild(option);
            }
        } else {
            qtySelect.innerHTML = '<option value="0">無庫存</option>';
            document.getElementById('add-to-cart-btn').disabled = true;
            document.getElementById('add-to-cart-btn').textContent = '已售完';
        }

        // 設定加入購物車按鈕的 data-id 屬性
        const addToCartBtn = document.querySelector('.add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.dataset.id = product.id;
        }

        document.title = `${product.name} - 商品頁`;
    } else {
        document.getElementById('product-name').textContent = '查無此商品';
        document.title = '查無此商品 - 商品頁';
        return; // 停止執行後續
    }

    // 更新購物車小紅點函式
    function updateCartCount() {
        const cartCountElem = document.querySelector('.cart-count');
        let cart = JSON.parse(localStorage.getItem('cart-A')) || [];
        let totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

        if (totalQuantity > 0) {
            cartCountElem.textContent = totalQuantity > 99 ? '99+' : totalQuantity;
            cartCountElem.style.display = 'inline-block';
        } else {
            cartCountElem.style.display = 'none';
        }
    }

    // 頁面一載入就更新小紅點
    updateCartCount();

    // 加入購物車按鈕事件
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function () {
            const idToAdd = this.dataset.id;
            const quantity = parseInt(document.getElementById('quantity-select').value, 10);

            let cart = JSON.parse(localStorage.getItem('cart-A')) || [];
            const existingItemIndex = cart.findIndex(item => String(item.id) === String(idToAdd));

            if (existingItemIndex > -1) {
                cart[existingItemIndex].quantity += quantity;
            } else {
                const productDetails = allProductsData.find(p => String(p.id) === String(idToAdd));
                if (productDetails) {
                    cart.push({
                        id: String(idToAdd),
                        name: productDetails.name,
                        price: productDetails.price,
                        img: productDetails.img,
                        quantity: quantity
                    });
                } else {
                    console.error('Product data not found for ID:', idToAdd);
                    alert('無法將商品加入購物車：商品資料不存在！');
                    return;
                }
            }

            localStorage.setItem("cart-A", JSON.stringify(cart));

            if (typeof showToast === 'function') {
                showToast('商品已加入購物車！');
            } else {
                alert('商品已加入購物車！');
            }

            updateCartCount();
        });
    }
});
