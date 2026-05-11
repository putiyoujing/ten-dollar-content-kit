const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });

const clean = (value, max = 800) =>
  String(value || "")
    .replace(/\r/g, "")
    .trim()
    .slice(0, max);

const requiredFields = ["email", "package", "payment", "stage"];

export async function onRequestPost({ request, env }) {
  let data;

  try {
    data = await request.json();
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  if (clean(data.website, 120)) {
    return json({ ok: true, orderNumber: "queued" });
  }

  const order = {
    email: clean(data.email, 180),
    package: clean(data.package, 140),
    payment: clean(data.payment, 80),
    stage: clean(data.stage, 120),
    notes: clean(data.notes, 700),
  };

  const missing = requiredFields.filter((field) => !order[field]);
  if (missing.length) {
    return json({ error: `Missing required field: ${missing.join(", ")}` }, 400);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(order.email)) {
    return json({ error: "Please enter a valid email address." }, 400);
  }

  if (!env.GITHUB_TOKEN) {
    return json({ error: "Order backend is not configured yet." }, 503);
  }

  const owner = env.GITHUB_OWNER || "putiyoujing";
  const repo = env.ORDER_REPO || "ten-dollar-content-orders";
  const now = new Date().toISOString();
  const title = `[Job Search Kit] ${order.email}`.slice(0, 100);
  const body = [
    `Received: ${now}`,
    "",
    "## Customer",
    "",
    `Email: ${order.email}`,
    "",
    "## Product Request",
    "",
    `Package: ${order.package}`,
    `Payment preference: ${order.payment}`,
    `Job-search stage: ${order.stage}`,
    "",
    "## Optional Notes",
    "",
    order.notes || "None",
    "",
    "## Fulfillment Checklist",
    "",
    "- [ ] Send checkout/payment link",
    "- [ ] Confirm payment received",
    "- [ ] Send Payhip/Gumroad download link or attach private ZIP manually",
    "- [ ] Confirm customer received the download",
  ].join("\n");

  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      "Content-Type": "application/json",
      "User-Agent": "job-search-kit-order-form",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({
      title,
      body,
      labels: ["job-search-kit", "new"],
    }),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    return json({ error: result.message || "Order storage failed." }, 502);
  }

  return json({
    ok: true,
    orderNumber: result.number,
  });
}

export function onRequestOptions() {
  return new Response(null, { status: 204 });
}
