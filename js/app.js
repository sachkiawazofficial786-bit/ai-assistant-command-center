import { processCommand } from "./command-engine.js";

const input = document.querySelector("#commandInput");
const send = document.querySelector("#sendCommand");
const response = document.querySelector("#response");

function runCommand(command) {
  const result = processCommand(command);
  response.textContent = result.message;
}

send.addEventListener("click", () => runCommand(input.value.trim()));
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") runCommand(input.value.trim());
});

document.querySelectorAll("[data-command]").forEach((button) => {
  button.addEventListener("click", () => {
    input.value = button.dataset.command;
    runCommand(input.value);
  });
});

document.querySelectorAll(".module").forEach((module) => {
  module.addEventListener("click", () => {
    document.querySelectorAll(".module").forEach((item) => item.classList.remove("active"));
    module.classList.add("active");
    response.textContent = module.querySelector("strong").textContent + " selected. AI Core is ready for your command.";
  });
});
