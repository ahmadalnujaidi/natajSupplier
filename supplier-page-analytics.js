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
async function handleFormSubmit(event) {
  event.preventDefault();
  const form = document.getElementById("analysisForm");

  // Collect form data
  const formData = new FormData(form);
  const data = {};
  formData.forEach((value, key) => {
    if (key !== "orderID") {
      if (key === "defectPrediction") {
        data[key] = value; // string
      } else {
        data[key] = Number(value); // number
      }
    }
  });

  // Check if defectPrediction is empty
  if (data.defectPrediction === "") {
    alert("Defect Prediction cannot be empty.");
    return;
  }

  const orderID = formData.get("orderID");
  const url = `https://natajbackend.onrender.com/orders/${orderID}/data`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("Submit Response:", result);
  } catch (error) {
    console.error("Error during form submission:", error);
  }

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

// Function to handle analyze button click
async function handleAnalyze() {
  const form = document.getElementById("analysisForm");

  const weight = document.getElementById("weight").value;
  const temperature = document.getElementById("temperature").value;
  const speed = document.getElementById("speed").value;
  const processTime = document.getElementById("processTime").value;
  const components = document.getElementById("components").value;
  const efficiency = document.getElementById("efficiency").value;
  const quantity = document.getElementById("quantity").value;
  const defectPrediction = document.getElementById("defectPrediction");
  const delayPrediction = document.getElementById("delayPrediction");

  delayPrediction.textContent = "Calculating...";
  defectPrediction.textContent = "Calculating...";

  const data = {
    weight,
    temperature,
    speed,
    processTime,
    components,
    efficiency,
    quantity,
  };

  try {
    const response = await fetch("http://localhost:3000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("Analyze Response:", result);
    // we receive the result {delay_prediction: 5.45, defect_prediction: 0.5876}
    // now log the delay_prediction only
    console.log("Delay Prediction:", result.delay_prediction);
    delayPrediction.textContent = result.delay_prediction;

    // now log the defect_prediction only
    console.log("Defect Prediction:", result.defect_prediction * 100);
    defectPrediction.textContent = result.defect_prediction * 100 + "%";
  } catch (error) {
    console.error("Error during analysis:", error);
  }
}

// Function to validate form inputs
function validateForm() {
  const form = document.getElementById("analysisForm");
  const inputs = form.querySelectorAll("input[type='number']");
  let allFilled = true;

  inputs.forEach((input) => {
    if (input.value === "") {
      allFilled = false;
    }
  });

  const analyzeButton = document.getElementById("analyzeButton");
  analyzeButton.disabled = !allFilled;
}

// Chatbot Modal Functions
function openChatbot() {
  const modal = document.getElementById("chatbotModal");
  modal.style.display = "block";
  // Add initial bot message
  addMessage("Hello! How can I help you today?", "bot");
}

function closeChatbot() {
  const modal = document.getElementById("chatbotModal");
  modal.style.display = "none";
}

function addMessage(text, sender) {
  const messagesDiv = document.getElementById("chatMessages");
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", `${sender}-message`);
  messageElement.textContent = text;
  messagesDiv.appendChild(messageElement);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

async function handleChatSubmit() {
  const input = document.getElementById("chatInput");
  const message = input.value.trim();

  if (message) {
    // Add user message
    addMessage(message, "user");
    input.value = "";

    try {
      // Add loading message
      addMessage("Typing...", "bot");

      // Send message to backend
      const response = await fetch(
        "https://chatbotbackend-kjy5.onrender.com/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        }
      );

      const data = await response.json();

      console.log("Chatbot Response:", data);

      // Remove loading message and add bot response
      document.querySelector(".bot-message:last-child").remove();
      addMessage(data.response.content, "bot");
    } catch (error) {
      console.error("Error:", error);
      document.querySelector(".bot-message:last-child").remove();
      addMessage("Sorry, I'm having trouble connecting right now.", "bot");
    }
  }
}

// Add event listeners to inputs for real-time validation
document.addEventListener("DOMContentLoaded", () => {
  const inputs = document.querySelectorAll(
    "#analysisForm input[type='number']"
  );
  inputs.forEach((input) => {
    input.addEventListener("input", validateForm);
  });

  // Initial validation
  validateForm();

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

  // Add event listener for Analyze button
  const analyzeButton = document.querySelector('button[type="button"]');
  analyzeButton.addEventListener("click", handleAnalyze);

  // Add chatbot event listeners
  const chatbotButton = document.querySelector(".chatbot-background-parent");
  const closeChatbotButton = document.getElementById("closeChatbot");
  const sendButton = document.getElementById("sendMessage");
  const chatInput = document.getElementById("chatInput");

  chatbotButton.addEventListener("click", openChatbot);
  closeChatbotButton.addEventListener("click", closeChatbot);
  sendButton.addEventListener("click", handleChatSubmit);

  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleChatSubmit();
    }
  });

  // Close modal when clicking outside
  window.addEventListener("click", (event) => {
    const modal = document.getElementById("chatbotModal");
    if (event.target == modal) {
      closeChatbot();
    }
  });
});
