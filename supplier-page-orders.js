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
      const response = await fetch("https://natajbackend.onrender.com/orders");
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
          <td>$${order.amount}</td>
          <td class="status-clickable" data-order-id="${order.id}">${order.currentStatus}</td>
          <td><button class="chat-button" data-order-id="${order.id}"><img src="./public/bxschat.svg"/></button></td>
        `;
        tbody.appendChild(tr);
      });

      // Add event listeners to chat buttons after orders are fetched
      tbody.addEventListener("click", (e) => {
        if (e.target.closest(".chat-button")) {
          const orderId = e.target
            .closest(".chat-button")
            .getAttribute("data-order-id");
          openChatModal(orderId);
        }
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
      const response = await fetch("https://natajbackend.onrender.com/orders", {
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

  // Select chat modal elements
  const chatModal = document.getElementById("chatModal");
  const closeChatButton = document.querySelector(".close-chat-button");
  const chatForm = document.getElementById("chatForm");
  const chatMessages = document.getElementById("chatMessages");
  let currentOrderId = null;

  function openChatModal(orderId) {
    currentOrderId = orderId;
    chatModal.style.display = "block";
    loadChatMessages(orderId);
    const truncatedOrderId = orderId.toString().slice(-11);
    document.getElementById("chatOrderIdHeader").innerHTML = `
      <span style="font-size: smaller;">Order No.</span><br />
      <span style="font-size: larger;">#${truncatedOrderId}</span>
    `;
  }

  closeChatButton.addEventListener("click", () => {
    chatModal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target == chatModal) {
      chatModal.style.display = "none";
    }
  });

  // Function to load chat messages
  async function loadChatMessages(orderId) {
    try {
      const response = await fetch(
        `https://natajbackend.onrender.com/orders/${orderId}/chat`
      );
      const messages = await response.json();
      chatMessages.innerHTML = "";
      messages.forEach((msg) => {
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("chat-bubble");
        if (msg.sender === "supplier") {
          msgDiv.classList.add("chat-bubble-right");
        } else {
          msgDiv.classList.add("chat-bubble-left");
        }
        msgDiv.textContent = msg.content; // Only show message content
        chatMessages.appendChild(msgDiv);
      });
    } catch (error) {
      console.error("Error loading chat messages:", error);
    }
  }

  // Handle chat form submission
  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const message = chatForm.message.value;
    try {
      const response = await fetch(
        `https://natajbackend.onrender.com/orders/${currentOrderId}/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sender: "supplier", content: message }),
        }
      );
      if (response.ok) {
        chatForm.reset();
        loadChatMessages(currentOrderId);
      } else {
        console.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  // Get modal elements
  const statusModal = document.getElementById("statusModal");
  const statusCloseButton = document.querySelector(".close-button");
  const statusForm = document.getElementById("statusForm");

  // Function to open modal
  function openModal(orderId) {
    currentOrderId = orderId;
    statusModal.style.display = "block";
  }

  // Function to close modal
  function closeModal() {
    statusModal.style.display = "none";
    statusForm.reset();
    currentOrderId = null;
  }

  // Event listener for close button
  statusCloseButton.addEventListener("click", closeModal);

  // Event listener for clicks outside the modal content
  window.addEventListener("click", (event) => {
    if (event.target == statusModal) {
      closeModal();
    }
  });

  // Event listener for form submission
  statusForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!currentOrderId) return;

    const status = statusForm.status.value;
    const location = statusForm.location.value;
    const notes = statusForm.notes.value;
    const imageFile = statusForm.image.files[0];

    const data = {
      status: status,
      type: "bytea",
    };

    if (location) {
      data.location = location;
    }

    if (notes) {
      data.notes = notes;
    }

    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        data.image = reader.result.split(",")[1];

        try {
          const response = await fetch(
            `https://natajbackend.onrender.com/orders/${currentOrderId}/status-updates`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            }
          );

          if (response.ok) {
            // Optionally, update the status on the page
            const statusCell = document.querySelector(
              `.status-clickable[data-order-id="${currentOrderId}"]`
            );
            if (statusCell) {
              statusCell.textContent = status;
            }
            closeModal();
          } else {
            console.error("Failed to update status");
          }
        } catch (error) {
          console.error("Error updating status:", error);
        }
      };

      reader.readAsDataURL(imageFile);
    } else {
      // Send POST request without image
      fetch(
        `https://natajbackend.onrender.com/orders/${currentOrderId}/status-updates`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      )
        .then((response) => {
          if (response.ok) {
            // Optionally, update the status on the page
            const statusCell = document.querySelector(
              `.status-clickable[data-order-id="${currentOrderId}"]`
            );
            if (statusCell) {
              statusCell.textContent = status;
            }
            closeModal();
          } else {
            console.error("Failed to update status");
          }
        })
        .catch((error) => {
          console.error("Error updating status:", error);
        });
    }
  });

  // Event delegation for status clicks
  document.getElementById("ordersTable").addEventListener("click", (e) => {
    if (e.target && e.target.classList.contains("status-clickable")) {
      const orderId = e.target.getAttribute("data-order-id");
      openModal(orderId);
    }
  });

  document.getElementById("statusForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const selectedStatus = document.getElementById("statusSelect").value;
    // ...handle status update logic...
    closeStatusModal();
  });

  document.getElementById("closeStatusModal").addEventListener("click", () => {
    closeStatusModal();
  });

  function openStatusModal() {
    const modal = document.getElementById("statusModal");
    modal.style.display = "block";
  }
  function closeStatusModal() {
    const modal = document.getElementById("statusModal");
    modal.style.display = "none";
  }

  fetch("https://natajbackend.onrender.com/steps")
    .then((response) => response.json())
    .then((steps) => {
      const statusSelect = document.getElementById("statusSelect");
      statusSelect.innerHTML = "";
      steps.sort((a, b) => a.stepNumber - b.stepNumber);
      steps.forEach((step) => {
        const option = document.createElement("option");
        option.value = step.stepName; // Use stepName as the value
        option.textContent = `${step.stepNumber} - ${step.stepName}`;
        statusSelect.appendChild(option);
      });
    })
    .catch((error) => console.error("Error fetching steps:", error));
});
