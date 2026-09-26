/* =====================================
   STOCKSENSE DATA
===================================== */

let products = JSON.parse(
    localStorage.getItem("stocksense_products")
) || [

    {
        name: "Wireless Mouse",
        sku: "WM-001",
        category: "Electronics",
        location: "Main Warehouse",
        stock: 12
    },

    {
        name: "Mechanical Keyboard",
        sku: "KB-002",
        category: "Electronics",
        location: "Main Warehouse",
        stock: 45
    },

    {
        name: "Office Chair",
        sku: "OC-003",
        category: "Furniture",
        location: "Warehouse 2",
        stock: 6
    },

    {
        name: "A4 Paper",
        sku: "AP-004",
        category: "Office Supplies",
        location: "Main Warehouse",
        stock: 100
    },

    {
        name: "Steel",
        sku: "ST-005",
        category: "Raw Materials",
        location: "Production Rack",
        stock: 80
    }

];


let movements = JSON.parse(
    localStorage.getItem("stocksense_movements")
) || [

    {
        product: "Steel",
        operation: "Receipt",
        quantity: "+100",
        location: "Main Warehouse",
        status: "Done"
    },

    {
        product: "Steel",
        operation: "Internal Transfer",
        quantity: "20",
        location: "Production Rack",
        status: "Done"
    },

    {
        product: "Wireless Mouse",
        operation: "Delivery",
        quantity: "-8",
        location: "Main Warehouse",
        status: "Done"
    }

];


/* =====================================
   SAVE DATA
===================================== */

function saveData() {

    localStorage.setItem(
        "stocksense_products",
        JSON.stringify(products)
    );

    localStorage.setItem(
        "stocksense_movements",
        JSON.stringify(movements)
    );
}


/* =====================================
   LOGIN
===================================== */

function loginUser(event) {

    event.preventDefault();

    const email =
        document.getElementById("email").value;

    localStorage.setItem(
        "stocksense_user",
        email
    );

    window.location.href = "dashboard.html";
}


/* =====================================
   LOGOUT
===================================== */

function logoutUser() {

    localStorage.removeItem(
        "stocksense_user"
    );

    window.location.href = "index.html";
}


/* =====================================
   DASHBOARD
===================================== */

function loadDashboard() {

    const totalProducts =
        document.getElementById("totalProducts");

    if (!totalProducts) return;


    totalProducts.textContent =
        products.length;


    const lowStockProducts =
        products.filter(
            product => product.stock <= 10
        );


    document.getElementById(
        "lowStock"
    ).textContent =
        lowStockProducts.length;


    renderLowStock();

    renderMovements();
}


/* =====================================
   LOW STOCK
===================================== */

function renderLowStock() {

    const container =
        document.getElementById(
            "lowStockList"
        );

    if (!container) return;


    const lowStockProducts =
        products.filter(
            product => product.stock <= 10
        );


    if (lowStockProducts.length === 0) {

        container.innerHTML = `
            <p class="muted">
                No low-stock products 🎉
            </p>
        `;

        return;
    }


    container.innerHTML =
        lowStockProducts.map(product => `

            <div class="low-stock-item">

                <div>

                    <strong>
                        ${product.name}
                    </strong>

                    <span>
                        ${product.sku}
                    </span>

                </div>

                <span class="stock-warning">
                    ${product.stock} left
                </span>

            </div>

        `).join("");
}


/* =====================================
   MOVEMENT TABLE
===================================== */

function renderMovements() {

    const table =
        document.getElementById(
            "movementTable"
        );

    if (!table) return;


    table.innerHTML =
        movements.slice(-6).reverse().map(move => `

            <tr>

                <td>
                    ${move.product}
                </td>

                <td>
                    ${move.operation}
                </td>

                <td>
                    ${move.quantity}
                </td>

                <td>
                    ${move.location}
                </td>

                <td>

                    <span class="status done">
                        ${move.status}
                    </span>

                </td>

            </tr>

        `).join("");
}


/* =====================================
   PRODUCTS PAGE
===================================== */

function renderProducts() {

    const table =
        document.getElementById(
            "productsTable"
        );

    if (!table) return;


    const search =
        document.getElementById(
            "productSearch"
        ).value.toLowerCase();


    const category =
        document.getElementById(
            "categoryFilter"
        ).value;


    const filtered =
        products.filter(product => {

            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(search)
                ||
                product.sku
                    .toLowerCase()
                    .includes(search);


            const matchesCategory =
                category === "all"
                ||
                product.category === category;


            return matchesSearch &&
                   matchesCategory;
        });


    table.innerHTML =
        filtered.map(product => {

            const low =
                product.stock <= 10;


            return `

                <tr>

                    <td>
                        <strong>
                            ${product.name}
                        </strong>
                    </td>

                    <td>
                        ${product.sku}
                    </td>

                    <td>
                        ${product.category}
                    </td>

                    <td>
                        ${product.location}
                    </td>

                    <td>
                        ${product.stock}
                    </td>

                    <td>

                        <span class="status ${
                            low ? "low" : "done"
                        }">

                            ${
                                low
                                ? "Low Stock"
                                : "In Stock"
                            }

                        </span>

                    </td>

                </tr>

            `;

        }).join("");
}


/* =====================================
   PRODUCT MODAL
===================================== */

function openProductModal() {

    document
        .getElementById("productModal")
        .classList.add("show");
}


function closeProductModal() {

    document
        .getElementById("productModal")
        .classList.remove("show");
}


/* =====================================
   ADD PRODUCT
===================================== */

function addProduct(event) {

    event.preventDefault();


    const product = {

        name:
            document.getElementById(
                "productName"
            ).value,

        sku:
            document.getElementById(
                "productSKU"
            ).value,

        category:
            document.getElementById(
                "productCategory"
            ).value,

        stock:
            Number(
                document.getElementById(
                    "productStock"
                ).value
            ),

        location:
            document.getElementById(
                "productLocation"
            ).value

    };


    products.push(product);

    saveData();

    closeProductModal();

    event.target.reset();

    renderProducts();

    alert(
        "Product created successfully!"
    );
}


/* =====================================
   RECEIVE STOCK
===================================== */

function receiveStock() {

    const name =
        prompt(
            "Enter product name:"
        );

    if (!name) return;


    const quantity =
        Number(
            prompt(
                "Enter quantity received:"
            )
        );


    if (!quantity || quantity <= 0) {

        alert(
            "Enter a valid quantity."
        );

        return;
    }


    const product =
        products.find(
            p =>
                p.name.toLowerCase()
                === name.toLowerCase()
        );


    if (!product) {

        alert(
            "Product not found."
        );

        return;
    }


    product.stock += quantity;


    movements.push({

        product: product.name,

        operation: "Receipt",

        quantity: "+" + quantity,

        location: product.location,

        status: "Done"

    });


    saveData();

    alert(
        "Stock received successfully!"
    );

    loadDashboard();
}


/* =====================================
   DELIVERY
===================================== */

function deliverStock() {

    const name =
        prompt(
            "Enter product name:"
        );

    if (!name) return;


    const quantity =
        Number(
            prompt(
                "Enter quantity delivered:"
            )
        );


    const product =
        products.find(
            p =>
                p.name.toLowerCase()
                === name.toLowerCase()
        );


    if (!product) {

        alert(
            "Product not found."
        );

        return;
    }


    if (
        !quantity ||
        quantity <= 0 ||
        quantity > product.stock
    ) {

        alert(
            "Invalid quantity or insufficient stock."
        );

        return;
    }


    product.stock -= quantity;


    movements.push({

        product: product.name,

        operation: "Delivery",

        quantity: "-" + quantity,

        location: product.location,

        status: "Done"

    });


    saveData();

    alert(
        "Delivery completed!"
    );

    loadDashboard();
}


/* =====================================
   INTERNAL TRANSFER
===================================== */

function transferStock() {

    const name =
        prompt(
            "Enter product name:"
        );

    if (!name) return;


    const product =
        products.find(
            p =>
                p.name.toLowerCase()
                === name.toLowerCase()
        );


    if (!product) {

        alert(
            "Product not found."
        );

        return;
    }


    const newLocation =
        prompt(
            "Enter destination location:"
        );


    if (!newLocation) return;


    const oldLocation =
        product.location;


    product.location =
        newLocation;


    movements.push({

        product: product.name,

        operation:
            "Internal Transfer",

        quantity:
            product.stock,

        location:
            `${oldLocation} → ${newLocation}`,

        status: "Done"

    });


    saveData();

    alert(
        "Stock transferred successfully!"
    );

    loadDashboard();
}


/* =====================================
   STOCK ADJUSTMENT
===================================== */

function adjustStock() {

    const name =
        prompt(
            "Enter product name:"
        );

    if (!name) return;


    const product =
        products.find(
            p =>
                p.name.toLowerCase()
                === name.toLowerCase()
        );


    if (!product) {

        alert(
            "Product not found."
        );

        return;
    }


    const newQuantity =
        Number(
            prompt(
                "Enter physical counted quantity:"
            )
        );


    if (
        isNaN(newQuantity) ||
        newQuantity < 0
    ) {

        alert(
            "Invalid quantity."
        );

        return;
    }


    const difference =
        newQuantity -
        product.stock;


    product.stock =
        newQuantity;


    movements.push({

        product: product.name,

        operation:
            "Stock Adjustment",

        quantity:
            difference >= 0
            ? "+" + difference
            : difference,

        location:
            product.location,

        status:
            "Done"

    });


    saveData();

    alert(
        "Stock adjustment completed!"
    );

    loadDashboard();
}


/* =====================================
   HISTORY
===================================== */

function renderHistory() {

    const table =
        document.getElementById(
            "historyTable"
        );

    if (!table) return;


    table.innerHTML =
        movements
        .slice()
        .reverse()
        .map(move => `

            <tr>

                <td>
                    ${new Date()
                        .toLocaleDateString()}
                </td>

                <td>
                    ${move.product}
                </td>

                <td>
                    ${move.operation}
                </td>

                <td>
                    ${move.quantity}
                </td>

                <td>

                    <span class="status done">
                        ${move.status}
                    </span>

                </td>

            </tr>

        `).join("");
}


/* =====================================
   PAGE INITIALIZATION
===================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadDashboard();

        renderProducts();

        renderHistory();

    }
);