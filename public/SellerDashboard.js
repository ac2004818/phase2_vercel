function convertISOTimeToAMPM(dateTimeString) {
  const date = new Date(dateTimeString);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const meridian = hours < 12 ? "AM" : "PM";
  hours = hours % 12 || 12;
  return `${dateTimeString.split("T")[0]} Time ${hours}:${minutes} ${meridian}`;
}

document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const currentUserdata = urlParams.get("seller");
  const currentSeller = JSON.parse(decodeURIComponent(currentUserdata)).key;
  console.log(currentSeller);
  let sellerId = currentSeller.id;

  // Fetch items from server
  fetch("/api/selleritemsbyid", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: sellerId }), // Replace 'your_seller_id_here' with the actual seller ID
  })
    .then((response) => response.json())
    .then((data) => {
      // Display items currently selling
      const sellingItemsList = document.getElementById("selling-items");
      const soldItemsList = document.getElementById("sold-items");
      sellingItemsList.innerHTML = "";
      soldItemsList.innerHTML = "";
      let itemHtml = "";
      data.forEach((item) => {
        soldItemsList.innerHTML += `
                <li class="nameitem">
                    ${item.name} - Price: ${item.price} QR
                    <div class="sale-history-container">
                    <h4>Sale History</h4>
                        <ul class="sale-history-list">
                        ${item.transactions
                          .map((transaction) => {
                            return `<li class="history_item">Buyer: ${
                              transaction.buyerId
                            }, Selling Price: ${
                              transaction.totalPrice
                            }, Quantity: ${
                              transaction.totalPrice
                            }, Date: ${convertISOTimeToAMPM(
                              transaction.date
                            )}</li>`;
                          })
                          .join("")}
                        </ul>
                    </div>
                </li>
                `;
        sellingItemsList.innerHTML += `
                <li class="nameitem">
                    ${item.name} - Price: ${item.price} QR
                </li>
                `;
        // if (item.quantity) sellingItemsList.innerHTML = itemHtml;
        // else soldItemsList.innerHTML = itemHtml;
      });
    })
    .catch((error) => console.error("Error fetching items:", error));

  // Handle form submission for uploading new item
  document
    .getElementById("button-back")
    .addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "login.html";
    });
  document
    .getElementById("upload-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const itemName = document.getElementById("item-name").value;
      const itemPrice = document.getElementById("item-price").value;
      const itemQuantity = document.getElementById("item-Quantity").value;
      const itemURL = document.getElementById("item-URL").value;
      const itemdescription = document.getElementById("item-description").value;
      sellerId = sellerId.toString();
      // Construct item object
      const newItem = {
        name: itemName,
        price: parseFloat(itemPrice),
        quantity: parseInt(itemQuantity),
        sellerId: sellerId,
        imageUrl: itemURL,
        description: itemdescription,
      };

      // Send POST request to add new item
      fetch("/api/additem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      })
        .then((response) => response.json())
        .then((data) => {
          // Refresh page to display updated item list
          location.reload();
        })
        .catch((error) => console.error("Error uploading item:", error));
    });
});
