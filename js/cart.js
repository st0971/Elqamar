// cart.js

// 提示框顯示函數 (如果購物車頁面也可能需要顯示提示，例如結帳失敗，則可以保留)
function showToast(message) {
    const toast = document.getElementById('toast-notification');
    if (toast) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000); // 3 秒後自動消失
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // 移除了對 updateCartCount() 的呼叫，因為此頁面不再需要顯示購物車數量
    // updateCartCount(); // 這一行被移除了

    // 導覽列下拉選單 (保持不變)
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
                if (dropdownContent.classList.contains('show')) {
                    dropdownContent.classList.remove('show');
                }
            }
        });
    });


    const cartTableBody = document.querySelector('.cart-tbody');
    if (!cartTableBody) return;

    const totalPriceEl = document.querySelector('.total-price');
    const checkoutBtn = document.querySelector('.checkout-btn');

    let cart = JSON.parse(localStorage.getItem('cart-A')) || [];

    function renderCart() {
        cartTableBody.innerHTML = '';

        if (cart.length === 0) {
            cartTableBody.innerHTML = `<tr><td colspan="5">購物車是空的</td></tr>`;
            totalPriceEl.textContent = '$0';
            return;
        }

        let total = 0;

        cart.forEach(item => {
            const subtotal = item.price * item.quantity;
            total += subtotal;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="product-info">
                    <a href="product.html?id=${item.id}" class="cart-product-link">
                        <img src="${item.img}" alt="${item.name}" />
                        <span>${item.name}</span>
                    </a>
                </td>
                <td class="unit-price" data-price="${item.price}">$${item.price}</td>
                <td>
                    <select class="quantity-select">
                        ${[...Array(10).keys()].map(i => {
                            const val = i + 1;
                            return `<option value="${val}" ${val === item.quantity ? 'selected' : ''}>${val}</option>`;
                        }).join('')}
                    </select>
                </td>
                <td class="subtotal">$${subtotal}</td>
                <td><button class="btn remove-btn" data-id="${item.id}">刪除</button></td>
            `;

            // 數量變更事件
            tr.querySelector('.quantity-select').addEventListener('change', e => {
                const newQty = parseInt(e.target.value);
                item.quantity = newQty;
                localStorage.setItem('cart-A', JSON.stringify(cart));
                renderCart(); // 重新渲染以更新小計和總計
            });

            // 刪除事件
            tr.querySelector('.remove-btn').addEventListener('click', e => {
                const productIdToRemove = e.target.dataset.id;
                cart = cart.filter(i => i.id !== productIdToRemove);
                localStorage.setItem('cart-A', JSON.stringify(cart));
                renderCart(); // 重新渲染
            });

            cartTableBody.appendChild(tr);
        });

        totalPriceEl.textContent = `$${total}`;
    }

    renderCart(); // 初始渲染購物車

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('購物車是空的');
            return;
        }
        alert('請前往IG、FB喊單');
    });
});