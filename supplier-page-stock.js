document.addEventListener("DOMContentLoaded", async function () {
  const modal = document.getElementById("addStockModal");
  const addButton = document.querySelector(".rectangle-parent17");
  const closeButton = document.querySelector(".close-button");
  const form = document.getElementById("addStockForm");
  const editModal = document.getElementById("editStockModal");
  const editCloseButton = document.querySelector(".edit-close-button");
  const editForm = document.getElementById("editStockForm");

  // Open modal when Add button is clicked
  addButton.addEventListener("click", function () {
    modal.style.display = "block";
  });

  // Close modal when X is clicked
  closeButton.addEventListener("click", function () {
    modal.style.display = "none";
  });

  // Close modal when clicking outside
  window.addEventListener("click", function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });

  // Function to render a single stock item
  function createStockElement(stock) {
    return `
      <div class="frame-parent23" data-stock-id="${stock.id}">
        <div class="checkbox-input-container">
          <input class="checkbox-input1" type="checkbox" />
        </div>
        <div class="iron-wrapper4">
          <div class="iron10">${stock.name}</div>
        </div>
        <div class="kg-wrapper">
          <div class="kg">${stock.weight ? stock.weight + "kg" : "N/A"}</div>
        </div>
        <div class="room1-wrapper">
          <div class="room1">${stock.place}</div>
        </div>
        <div class="wrapper20">
          <div class="room1">${stock.quantity || "N/A"}</div>
        </div>
        <div class="action-buttons">
          <button class="edit-btn" onclick="openEditModal('${
            stock.id
          }')">Edit</button>
          <button class="delete-btn" onclick="deleteStock('${
            stock.id
          }')">Delete</button>
        </div>
      </div>
    `;
  }

  // Function to fetch and render all stocks
  async function loadStocks() {
    try {
      const response = await fetch("http://localhost:3000/stocks");
      if (!response.ok) {
        throw new Error("Failed to fetch stocks");
      }

      const stocks = await response.json();

      // Get the container where stocks should be rendered
      const container = document.querySelector(".frame-wrapper22");
      const headerRow = container.querySelector(".header-row");

      // Clear existing content but preserve the header
      container.innerHTML = "";

      // Re-add the header row
      if (headerRow) {
        container.appendChild(headerRow);
      } else {
        // Create header row if it doesn't exist (fallback)
        container.innerHTML = `
          <div class="header-row">
            <div class="header-column" style="width: 30px"></div>
            <div class="header-column" style="width: 185.6px">Material Name</div>
            <div class="header-column" style="width: 164.5px">Weight</div>
            <div class="header-column" style="width: 142.8px">Place</div>
            <div class="header-column" style="width: 160.8px">Quantity</div>
            <div class="header-column" style="width: 78.3px">Actions</div>
          </div>
        `;
      }

      // Create and append stocks
      stocks.forEach((stock) => {
        container.innerHTML += createStockElement(stock);
      });
    } catch (error) {
      console.error("Error fetching stocks:", error);
      alert("Failed to load stocks. Please refresh the page.");
    }
  }

  // Add this function to handle stock deletion
  async function deleteStock(stockId) {
    if (!confirm("Are you sure you want to delete this item?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/stocks/${stockId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete stock");
      }

      // Reload the stocks list after successful deletion
      await loadStocks();
    } catch (error) {
      console.error("Error deleting stock:", error);
      alert("Failed to delete stock. Please try again.");
    }
  }

  // Make deleteStock available globally
  window.deleteStock = deleteStock;

  // Add these new functions for edit functionality
  async function openEditModal(stockId) {
    try {
      const response = await fetch(`http://localhost:3000/stocks/${stockId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch stock details");
      }
      const stock = await response.json();

      // Fill the form with current values
      document.getElementById("editStockId").value = stock.id;
      document.getElementById("editMaterialName").value = stock.name;
      document.getElementById("editWeight").value = stock.weight || "";
      document.getElementById("editPlace").value = stock.place;
      document.getElementById("editQuantity").value = stock.quantity || "";

      editModal.style.display = "block";
    } catch (error) {
      console.error("Error fetching stock details:", error);
      alert("Failed to load stock details. Please try again.");
    }
  }

  // Add event listeners for edit modal
  editCloseButton.addEventListener("click", function () {
    editModal.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target == editModal) {
      editModal.style.display = "none";
    }
  });

  // Handle edit form submission
  editForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const stockId = document.getElementById("editStockId").value;
    const formData = {
      name: editForm.materialName.value,
      place: editForm.place.value,
      weight: editForm.weight.value ? Number(editForm.weight.value) : null,
      quantity: editForm.quantity.value
        ? Number(editForm.quantity.value)
        : null,
    };

    try {
      const response = await fetch(`http://localhost:3000/stocks/${stockId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update stock");
      }

      const result = await response.json();
      console.log("Stock updated successfully:", result);

      // Close modal and reload the stocks
      editModal.style.display = "none";
      await loadStocks();
    } catch (error) {
      console.error("Error updating stock:", error);
      alert("Failed to update stock. Please try again.");
    }
  });

  // Make openEditModal available globally
  window.openEditModal = openEditModal;

  // Initial load of stocks
  await loadStocks();

  // Handle form submission
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = {
      name: form.materialName.value,
      place: form.place.value,
      weight: form.weight.value ? Number(form.weight.value) : null,
      quantity: form.quantity.value ? Number(form.quantity.value) : null,
    };

    try {
      const response = await fetch("http://localhost:3000/stocks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to add stock");
      }

      const result = await response.json();
      console.log("Stock added successfully:", result);

      // Clear form and close modal
      form.reset();
      modal.style.display = "none";

      // Reload the stocks to show the new item
      await loadStocks();
    } catch (error) {
      console.error("Error adding stock:", error);
      alert("Failed to add stock. Please try again.");
    }
  });
});
