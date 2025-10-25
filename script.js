const analyzeBtn = document.getElementById("analyzeBtn");
const receiptInput = document.getElementById("receiptInput");
const resultDiv = document.getElementById("result");
const loading = document.getElementById("loading");

const APP_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzaYxIdZEE7yKJsbb5-lY8IzHp5GzMF2VrYGBa_femWBUllg7FtjTxr33C8BLnh4F0q1w/exec";

analyzeBtn.addEventListener("click", async () => {
  const file = receiptInput.files[0];
  if (!file) return alert("Please upload a receipt!");

  loading.textContent = "Extracting text... ⏳";

  // OCR extraction client-side
  const { data: { text } } = await Tesseract.recognize(file, "eng");

  loading.textContent = "Sending text to AI and saving... 🤖";

  // Send the extracted text to Apps Script
  const response = await fetch(APP_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });

  const result = await response.json();

  resultDiv.textContent = JSON.stringify(result.analysis, null, 2);
  loading.textContent = "Done !";
});
