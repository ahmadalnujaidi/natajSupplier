// Function to open the modal
function openModal() {
  fetchOrders();
  const modal = document.getElementById("newAnalysisModal");
  modal.style.display = "block";
}

// Function to close the modal
function closeModal() {
  const modal = document.getElementById("newAnalysisModal");
  modal.style.display = "none";
}

// Function to handle form submission
function handleFormSubmit(event) {
  event.preventDefault();
  const form = document.getElementById("analysisForm");

  // Collect form data
  const formData = new FormData(form);
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });

  // TODO: Add your form submission logic here (e.g., send data to the server)

  console.log("Form Submitted:", data);
  form.reset(); // Clear the form inputs
  // Close the modal after submission
  closeModal();
}

// Function to fetch orders and populate the dropdown
async function fetchOrders() {
  try {
    const response = await fetch("https://natajbackend.onrender.com/orders");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const orders = await response.json();
    const orderSelect = document.getElementById("orderID");

    // Clear existing options except the first placeholder
    orderSelect.innerHTML = '<option value="">Select an option</option>';

    orders.forEach((order) => {
      const option = document.createElement("option");
      option.value = order.id;
      option.textContent = order.id;
      orderSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  const newAnalysisButton = document.querySelector(".new-analysis-button");
  const closeModalButton = document.getElementById("closeModal");
  const analysisForm = document.getElementById("analysisForm");

  newAnalysisButton.addEventListener("click", openModal);
  closeModalButton.addEventListener("click", closeModal);
  window.addEventListener("click", (event) => {
    const modal = document.getElementById("newAnalysisModal");
    if (event.target == modal) {
      closeModal();
    }
  });
  analysisForm.addEventListener("submit", handleFormSubmit);
});
