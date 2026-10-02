function applyInline(text) {
  // Images must come before links to avoid conflict
  text = text.replace(/!\[([^\]]*)\]\(([^)]*)\)/g, '<img alt="$1" src="$2">');

  // Links
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Bold — double asterisks or double underscores (must come before italic)
  // Greedy match so nested italic markers inside bold are preserved correctly
  text = text.replace(/\*\*(.+)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/__(.+)__/g, "<strong>$1</strong>");

  // Italic — single asterisk or single underscore
  text = text.replace(/\*(.+?)\*/g, "<em>$1</em>");
  text = text.replace(/_(.+?)_/g, "<em>$1</em>");

  return text;
}

function convertMarkdown() {
  const input = document.getElementById("markdown-input").value;
  const lines = input.split("\n");

  const convertedLines = lines.map((line) => {
    // h3 — must start at beginning of line (only spaces allowed before #)
    const h3Match = line.match(/^(\s*)#{3} (.+)$/);
    if (h3Match) {
      return h3Match[1] + "<h3>" + applyInline(h3Match[2]) + "</h3>";
    }

    // h2
    const h2Match = line.match(/^(\s*)#{2} (.+)$/);
    if (h2Match) {
      return h2Match[1] + "<h2>" + applyInline(h2Match[2]) + "</h2>";
    }

    // h1
    const h1Match = line.match(/^(\s*)# (.+)$/);
    if (h1Match) {
      return h1Match[1] + "<h1>" + applyInline(h1Match[2]) + "</h1>";
    }

    // Blockquote — > must start at beginning of line
    const bqMatch = line.match(/^(\s*)> (.+)$/);
    if (bqMatch) {
      return (
        bqMatch[1] + "<blockquote>" + applyInline(bqMatch[2]) + "</blockquote>"
      );
    }

    // All other lines — apply inline conversions only
    return applyInline(line);
  });

  return convertedLines.join("");
}

// DOM references
const markdownInput = document.getElementById("markdown-input");
const htmlOutput = document.getElementById("html-output");
const preview = document.getElementById("preview");
const clearBtn = document.getElementById("clear-btn");
const copyBtn = document.getElementById("copy-btn");
const toast = document.getElementById("toast");

function updateOutput() {
  const html = convertMarkdown();
  htmlOutput.textContent = html;
  preview.innerHTML = html;
}

markdownInput.addEventListener("input", updateOutput);

clearBtn.addEventListener("click", () => {
  markdownInput.value = "";
  updateOutput();
  markdownInput.focus();
});

copyBtn.addEventListener("click", () => {
  const text = htmlOutput.textContent;
  if (!text) return;

  navigator.clipboard.writeText(text).then(() => {
    copyBtn.classList.add("copied");
    copyBtn.textContent = "\u2713 Copied!";
    showToast();

    setTimeout(() => {
      copyBtn.classList.remove("copied");
      copyBtn.innerHTML = "&#x2398; Copy";
    }, 2000);
  });
});

function showToast() {
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}
