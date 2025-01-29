document.addEventListener("DOMContentLoaded", () => {
  fetch("https://natajbackend.onrender.com/orders")
    .then((response) => response.json())
    .then((orders) => {
      const tbody = document.querySelector("#homeOrdersTable tbody");
      tbody.innerHTML = "";
      orders.forEach((order) => {
        const tr = document.createElement("tr");
        const truncatedId = order.id.toString().slice(-6);
        tr.innerHTML = `
          <td class="underline">${truncatedId}</td>
          <td>${order.buyerName}</td>
          <td>${order.orderName}</td>
          <td>${order.quantity}</td>
          <td>${order.deadline}</td>
          <td>$${order.amount}</td>
          <td class="underline">${order.currentStatus}</td>
        `;
        tbody.appendChild(tr);
      });
      const activeOrdersCount = orders.filter(
        (order) =>
          order.currentStatus !== "Received" &&
          order.currentStatus !== "Delivered"
      ).length;
      document.querySelector(".data .k").textContent = activeOrdersCount;

      // Calculate pending count
      const pendingCount = orders.filter(
        (o) => o.currentStatus === "Received"
      ).length;
      document.getElementById("pendingCount").textContent = pendingCount;

      // Calculate completed count
      const completedCount = orders.filter(
        (o) => o.currentStatus === "Delivered"
      ).length;
      document.getElementById("completedCount").textContent = completedCount;

      // Calculate delayed count
      const delayedCount = orders.filter(
        (o) =>
          new Date() > new Date(o.deadline) && o.currentStatus !== "Delivered"
      ).length;
      document.getElementById("delayedCount").textContent = delayedCount;
    })
    .catch((error) => console.error("Error fetching orders:", error));
});
