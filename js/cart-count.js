// js/cart-count.js

// 顯示 Toast 通知
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast-notification');
    if (!toast) {
        console.error("Toast notification element not found!");
        return;
    }
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// 將商品加入購物車
function addToCart(productId, quantity, productDetails) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = cart.findIndex(item => String(item.id) === String(productId));

    if (existingItemIndex > -1) {
        // 如果商品已存在，增加數量
        cart[existingItemIndex].quantity += quantity;
    } else {
        // 如果商品不存在，新增
        // 確保 productDetails 包含 ID 和必要的資訊，如 name 和 img
        if (!productDetails || !productDetails.name || !productDetails.img || !productDetails.price) {
            console.error("商品詳細資訊不足，無法加入購物車。", productDetails);
            return false;
        }
        cart.push({
            id: productId,
            quantity: quantity,
            name: productDetails.name,
            img: productDetails.img,
            price: productDetails.price // 添加價格，方便在購物車頁面計算小計
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount(); // 更新購物車小紅點
    return true;
}

// 更新購物車小紅點數量
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartCountElement = document.querySelector('.cart-count');

    if (cartCountElement) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (totalItems > 0) {
            cartCountElement.textContent = totalItems;
            cartCountElement.style.display = 'block';
        } else {
            cartCountElement.style.display = 'none';
        }
    }
}

// 在 DOM 載入後立即更新購物車計數
document.addEventListener('DOMContentLoaded', updateCartCount);