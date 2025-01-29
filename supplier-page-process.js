document.addEventListener("DOMContentLoaded", () => {
  const test = document.getElementById("add-step");
  test.addEventListener("click", () => {
    console.log("works");
  });

  // Get modal elements
  const addStepModal = document.getElementById("addStepModal");
  const addStepButton = document.getElementById("add-step");
  const addStepCloseButton = addStepModal.querySelector(".close-button");
  const addStepForm = document.getElementById("addStepForm");

  // Function to open the Add Step modal
  function openAddStepModal() {
    addStepModal.style.display = "block";
  }

  // Function to close the Add Step modal
  function closeAddStepModal() {
    addStepModal.style.display = "none";
    addStepForm.reset();
  }

  // Event listener for Add Step button
  addStepButton.addEventListener("click", openAddStepModal);

  // Event listener for close button
  addStepCloseButton.addEventListener("click", closeAddStepModal);

  // Event listener for clicks outside the modal content
  window.addEventListener("click", (event) => {
    if (event.target == addStepModal) {
      closeAddStepModal();
    }
  });

  // Event listener for Add Step form submission
  addStepForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const stepName = addStepForm.stepName.value;
    const stepDescription = addStepForm.stepDescription.value;
    const stepNumber = document.getElementById("step-number").value;

    const newStep = {
      stepName: stepName,
      stepNumber: stepNumber,
      stepDesc: stepDescription,
    };

    try {
      const response = await fetch("https://natajbackend.onrender.com/steps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStep),
      });

      if (response.ok) {
        closeAddStepModal();
        // Optionally, provide feedback to the user
        fetchAndRenderSteps(); // Add this line to refresh steps after adding a new one
      } else {
        console.error("Failed to add step");
      }
    } catch (error) {
      console.error("Error adding step:", error);
    }
  });

  // Function to fetch and render steps
  async function fetchAndRenderSteps() {
    try {
      const response = await fetch("https://natajbackend.onrender.com/steps");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const steps = await response.json();

      steps.sort((a, b) => parseInt(a.stepNumber) - parseInt(b.stepNumber));

      const stepsContainer = document.getElementById("stepsContainer");
      stepsContainer.innerHTML = ""; // Clear existing content

      steps.forEach((step) => {
        const stepDiv = document.createElement("div");
        stepDiv.className = "process-step-order-issuance";

        stepDiv.innerHTML = `
          <div class="order-issuance-content">
            <div class="order-issuance-content-child"></div>
            <div class="order-issuance-rows">
              <h2 class="order-issuance">
                <ol class="raw-material-reception-and-pre">
                  <li>${step.stepNumber}. ${step.stepName}</li>
                </ol>
              </h2>
              <div class="order-issuance-descriptions">
                <div class="starting-the-process">
                  ${step.stepDesc}
                </div>
              </div>
            </div>
            <button class="order-issuance-edit-buttons">
              <div class="group-div">
                <div class="frame-child1"></div>
                <a class="edit">Edit</a>
              </div>
            </button>
          </div>
        `;

        stepsContainer.appendChild(stepDiv);
      });
    } catch (error) {
      console.error("Error fetching steps:", error);
    }
  }

  fetchAndRenderSteps(); // Call the function after DOM content is loaded
});
