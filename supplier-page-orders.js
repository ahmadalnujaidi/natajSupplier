document.addEventListener("DOMContentLoaded", () => {
  const newOrderButton = document.querySelector(".new-order");
  const modal = document.getElementById("newOrderModal");
  const closeButton = document.querySelector(".close-button");
  const form = document.getElementById("newOrderForm");

  newOrderButton.addEventListener("click", () => {
    modal.style.display = "block";
  });

  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });

  // Function to fetch and display orders
  async function fetchOrders() {
    try {
      const response = await fetch("http://localhost:3000/orders");
      const orders = await response.json();
      const tbody = document.querySelector("#ordersTable tbody");
      tbody.innerHTML = ""; // Clear existing rows

      orders.forEach((order) => {
        const tr = document.createElement("tr");
        const truncatedId = order.id.toString().slice(-6); // Get last 6 digits of ID
        tr.innerHTML = `
          <td>${truncatedId}</td>
          <td>${order.buyerName}</td>
          <td>${order.orderName}</td>
          <td>${order.quantity}</td>
          <td>${order.deadline}</td>
          <td>${order.amount}</td>
          <td>${order.currentStatus}</td>
        `;
        tbody.appendChild(tr);
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }

  // Call fetchOrders on page load
  fetchOrders();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const orderData = {
      orderName: form.orderName.value,
      buyerName: form.buyerName.value,
      quantity: form.quantity.value,
      deadline: form.deadline.value,
      amount: form.amount.value,
    };

    try {
      const response = await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        // Handle successful response
        modal.style.display = "none";
        form.reset();
        fetchOrders(); // Refresh the table with new data
      } else {
        // Handle errors
        console.error("Failed to submit order");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });
});
