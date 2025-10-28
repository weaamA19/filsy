const analyzeBtn = document.getElementById("analyzeBtn");
const receiptInput = document.getElementById("receiptInput");
const resultDiv = document.getElementById("result");
const loading = document.getElementById("loading");

const modal = document.getElementById("reviewModal");
const modalText = document.getElementById("modalText");
const confirmBtn = document.getElementById("confirmBtn");
const editBtn = document.getElementById("editBtn");
const closeBtn = document.getElementById("closeModal");

const APP_PROXY_URL = "https://filsy.vercel.app/api/proxy";

analyzeBtn.addEventListener("click", async () => {
  const file = receiptInput.files[0];
  if (!file) return alert("Please upload a receipt!");

  loading.textContent = "Extracting text...";
  resultDiv.textContent = "";

  const { data: { text } } = await Tesseract.recognize(file, "eng");

  // Show modal with recognize text for the user to confirm
  modal.style.display = "flex";
  modalText.value = text.trim();
  modalText.setAttribute("readonly", true);
  loading.textContent = "";
});


confirmBtn.addEventListener("click", async () => {
  const userText = modalText.value.trim();
  if (!userText) return alert("Text cannot be empty!");

  modal.style.display = "none";
  loading.textContent = "Sending text to AI and saving...";

  try {
    const response = await fetch(APP_PROXY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: userText }),
    });

    const result = await response.json();
    resultDiv.textContent = JSON.stringify(result.analysis, null, 2);
    loading.textContent = "Receipt successfully saved!";
  } catch (err) {
    console.error(err);
    loading.textContent = "Error sending data.";
  }

  receiptInput.value = "";
});


editBtn.addEventListener("click", () => {
  modalText.removeAttribute("readonly");
  modalText.focus();
});


closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
  loading.textContent = "";
});