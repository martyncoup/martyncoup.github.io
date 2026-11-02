import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";

mermaid.initialize({
  startOnLoad: false,
  securityLevel: "strict",
});

document.querySelectorAll(".language-mermaid").forEach((block) => {
  const code = block.matches("code") ? block : block.querySelector("code");
  if (!code) return;

  const diagram = document.createElement("div");
  diagram.className = "mermaid";
  diagram.textContent = code.textContent ?? "";
  const container = block.matches("code") ? block.closest("pre") : block;
  container?.replaceWith(diagram);
});

await mermaid.run({ querySelector: ".mermaid" });
