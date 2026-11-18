`use strict`;

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function parseMealInstructions(text) {
  const lines = String(text || "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const numberOnly = /^(?:step\s*)?(\d+)\.?$/i;
  const numberedLine = /^(?:step\s*)?(\d+)[.)]\s+(.+)$/i;
  const items = [];
  let pendingNumber = null;

  lines.forEach((line) => {
    const only = line.match(numberOnly);
    if (only) {
      pendingNumber = Number(only[1]);
      return;
    }

    const inline = line.match(numberedLine);
    if (inline) {
      items.push({ number: Number(inline[1]), text: inline[2].trim() });
      pendingNumber = null;
      return;
    }

    if (pendingNumber != null) {
      items.push({ number: pendingNumber, text: line });
      pendingNumber = null;
      return;
    }

    items.push({ number: null, text: line });
  });

  const firstNumbered = items.findIndex((item) => item.number != null);
  if (firstNumbered === -1) {
    return { notes: [], steps: items.map((item) => item.text) };
  }

  const firstNumber = items[firstNumbered].number;
  const lead = items.slice(0, firstNumbered);
  const rest = items.slice(firstNumbered).map((item) => item.text);
  const notes = [];
  let leadingSteps = [];

  if (firstNumber <= 1) {
    lead.forEach((item) => notes.push(item.text));
  } else {
    const impliedStepCount = firstNumber - 1;
    const leadText = lead.map((item) => item.text);
    if (leadText.length <= impliedStepCount) {
      leadingSteps = leadText;
    } else {
      notes.push(...leadText.slice(0, leadText.length - impliedStepCount));
      leadingSteps = leadText.slice(leadText.length - impliedStepCount);
    }
  }

  return { notes, steps: leadingSteps.concat(rest) };
}

function renderMealInstructions(parsed) {
  const notes = parsed.notes
    .map((text) => `<p class="mb-4">${escapeHtml(text)}</p>`)
    .join("");
  const steps = parsed.steps
    .map((text) => `<li>${escapeHtml(text)}</li>`)
    .join("");

  if (!steps) {
    return notes;
  }

  return `${notes}<ol class="uk-list uk-list-decimal">${steps}</ol>`;
}
