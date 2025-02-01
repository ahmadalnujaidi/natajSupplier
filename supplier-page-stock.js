document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("addStockModal");
  const addButton = document.querySelector(".rectangle-parent17");
  const closeButton = document.querySelector(".close-button");
  const form = document.getElementById("addStockForm");

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

  // Handle form submission
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = {
      materialName: form.materialName.value,
      weight: form.weight.value,
      place: form.place.value,
      quantity: form.quantity.value,
    };

    console.log("Stock data:", formData);
    // Here you would typically send the data to your backend

    // Clear form and close modal
    form.reset();
    modal.style.display = "none";
  });
});
