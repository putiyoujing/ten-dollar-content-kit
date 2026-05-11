const form = document.querySelector("#order-form");
const statusEl = document.querySelector("#form-status");

const setStatus = (message, type = "idle") => {
  statusEl.textContent = message;
  statusEl.dataset.type = type;
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  setStatus("Sending your payment-link request...");

  const submitButton = form.querySelector("button[type='submit']");
  submitButton.disabled = true;

  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  try {
    const response = await fetch("/api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.error || "The order could not be submitted.");
    }

    form.reset();
    setStatus(
      `Request received. Reference #${result.orderNumber}. I will send the checkout/download link to your email.`,
      "success"
    );
  } catch (error) {
    setStatus(error.message, "error");
  } finally {
    submitButton.disabled = false;
  }
});
