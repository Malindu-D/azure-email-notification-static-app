/**
 * Email Notification Static App
 * Main application logic
 */

// Get configuration
const config = window.APP_CONFIG;

// DOM Elements
const testConnectionBtn = document.getElementById("testConnectionBtn");
const testResult = document.getElementById("testResult");
const notificationForm = document.getElementById("notificationForm");
const submitBtn = document.getElementById("submitBtn");
const formResult = document.getElementById("formResult");

/**
 * Test API Connection
 * Calls the health check endpoint to verify API is accessible
 */
async function testConnection() {
  const btnText = testConnectionBtn.querySelector(".btn-text");
  const spinner = testConnectionBtn.querySelector(".spinner");

  // Update UI
  testConnectionBtn.disabled = true;
  btnText.style.display = "none";
  spinner.style.display = "inline";
  testResult.style.display = "none";

  try {
    if (config.DEBUG) {
      console.log("Testing connection to:", config.API_HEALTH_ENDPOINT);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.TIMEOUT);

    const response = await fetch(config.API_HEALTH_ENDPOINT, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (config.DEBUG) {
      console.log("Health check response:", data);
    }

    // Show success result
    testResult.className = "result-box success";
    testResult.innerHTML = `
            <strong>✅ Connection Successful!</strong>
            <div class="detail-item">
                <span class="label">Status:</span> 
                <span class="status-indicator status-online"></span>
                ${data.status || "Healthy"}
            </div>
            <div class="detail-item">
                <span class="label">Service:</span> ${
                  data.service || "NotificationApi"
                }
            </div>
            <div class="detail-item">
                <span class="label">Connection Type:</span> ${
                  data.connectionType || "Direct HTTP"
                }
            </div>
            <div class="detail-item">
                <span class="label">Timestamp:</span> ${new Date(
                  data.timestamp
                ).toLocaleString()}
            </div>
            <div class="detail-item">
                <span class="label">Endpoint:</span> ${
                  config.API_HEALTH_ENDPOINT
                }
            </div>
        `;
    testResult.style.display = "block";
  } catch (error) {
    if (config.DEBUG) {
      console.error("Connection test failed:", error);
    }

    let errorMessage = "Unknown error";
    if (error.name === "AbortError") {
      errorMessage = "Request timeout - API took too long to respond";
    } else if (error.message.includes("Failed to fetch")) {
      errorMessage =
        "Cannot reach API - Check if the API is running and CORS is configured";
    } else {
      errorMessage = error.message;
    }

    // Show error result
    testResult.className = "result-box error";
    testResult.innerHTML = `
            <strong>❌ Connection Failed</strong>
            <div class="detail-item">
                <span class="label">Status:</span> 
                <span class="status-indicator status-offline"></span>
                Offline
            </div>
            <div class="detail-item">
                <span class="label">Error:</span> ${errorMessage}
            </div>
            <div class="detail-item">
                <span class="label">Endpoint:</span> ${config.API_HEALTH_ENDPOINT}
            </div>
            <div style="margin-top: 10px;">
                <strong>Troubleshooting:</strong>
                <ul style="margin-left: 20px; margin-top: 5px;">
                    <li>Verify the API_HEALTH_ENDPOINT in config.js is correct</li>
                    <li>Check if the API app is deployed and running</li>
                    <li>Ensure CORS is configured to allow requests from this domain</li>
                </ul>
            </div>
        `;
    testResult.style.display = "block";
  } finally {
    // Reset button
    testConnectionBtn.disabled = false;
    btnText.style.display = "inline";
    spinner.style.display = "none";
  }
}

/**
 * Send Email Notification
 * Submits the notification request to the API
 */
async function sendNotification(event) {
  event.preventDefault();

  const btnText = submitBtn.querySelector(".btn-text");
  const spinner = submitBtn.querySelector(".spinner");

  // Update UI
  submitBtn.disabled = true;
  btnText.style.display = "none";
  spinner.style.display = "inline";
  formResult.style.display = "none";

  // Prepare data
  const formData = {
    recipientEmail: document.getElementById("recipientEmail").value.trim(),
  };

  const templateId = document.getElementById("templateId").value.trim();
  if (templateId) {
    formData.templateId = templateId;
  }

  const dataId = document.getElementById("dataId").value.trim();
  if (dataId) {
    formData.dataId = dataId;
  }

  try {
    if (config.DEBUG) {
      console.log("Sending notification:", formData);
      console.log("To endpoint:", config.API_ENDPOINT);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.TIMEOUT);

    const response = await fetch(config.API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(formData),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const result = await response.json();

    if (config.DEBUG) {
      console.log("API response:", result);
    }

    if (response.ok) {
      // Show success result
      formResult.className = "result-box success";
      formResult.innerHTML = `
                <strong>✅ ${
                  result.message || "Notification sent successfully!"
                }</strong>
                <div class="detail-item">
                    <span class="label">Recipient:</span> ${
                      result.recipient || formData.recipientEmail
                    }
                </div>
                <div class="detail-item">
                    <span class="label">Status:</span> ${
                      result.status || "Forwarded"
                    }
                </div>
                <div class="detail-item">
                    <span class="label">Correlation ID:</span> ${
                      result.correlationId || "N/A"
                    }
                </div>
                <div class="detail-item">
                    <span class="label">Received At:</span> ${new Date(
                      result.receivedAt
                    ).toLocaleString()}
                </div>
                ${
                  result.templateId
                    ? `<div class="detail-item"><span class="label">Template ID:</span> ${result.templateId}</div>`
                    : ""
                }
                ${
                  result.dataId
                    ? `<div class="detail-item"><span class="label">Data ID:</span> ${result.dataId}</div>`
                    : ""
                }
            `;
      formResult.style.display = "block";

      // Reset form
      notificationForm.reset();
    } else {
      // Show error result
      formResult.className = "result-box error";
      formResult.innerHTML = `
                <strong>❌ ${
                  result.message || "Failed to send notification"
                }</strong>
                <div class="detail-item">
                    <span class="label">Status Code:</span> ${response.status}
                </div>
                ${
                  result.correlationId
                    ? `<div class="detail-item"><span class="label">Correlation ID:</span> ${result.correlationId}</div>`
                    : ""
                }
                <pre>${JSON.stringify(result, null, 2)}</pre>
            `;
      formResult.style.display = "block";
    }
  } catch (error) {
    if (config.DEBUG) {
      console.error("Send notification failed:", error);
    }

    let errorMessage = "Unknown error";
    if (error.name === "AbortError") {
      errorMessage = "Request timeout - API took too long to respond";
    } else if (error.message.includes("Failed to fetch")) {
      errorMessage =
        "Cannot reach API - Check if the API is running and CORS is configured";
    } else {
      errorMessage = error.message;
    }

    // Show error result
    formResult.className = "result-box error";
    formResult.innerHTML = `
            <strong>❌ Network Error</strong>
            <div class="detail-item">
                <span class="label">Error:</span> ${errorMessage}
            </div>
            <div style="margin-top: 10px;">
                <strong>Troubleshooting:</strong>
                <ul style="margin-left: 20px; margin-top: 5px;">
                    <li>Verify the API_ENDPOINT in config.js is correct</li>
                    <li>Check if the API app is deployed and running</li>
                    <li>Test the connection using the "Test Connection" button above</li>
                    <li>Ensure CORS is configured to allow requests from this domain</li>
                </ul>
            </div>
        `;
    formResult.style.display = "block";
  } finally {
    // Reset button
    submitBtn.disabled = false;
    btnText.style.display = "inline";
    spinner.style.display = "none";
  }
}

// Event Listeners
testConnectionBtn.addEventListener("click", testConnection);
notificationForm.addEventListener("submit", sendNotification);

// Log ready state
if (config.DEBUG) {
  console.log("Email Notification App initialized");
}
