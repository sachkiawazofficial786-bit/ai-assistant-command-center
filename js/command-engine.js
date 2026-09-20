const responses = {
  task: "Task Engine activated. A task workflow can be created from your command.",
  review: "Review Center activated. Generated content should be reviewed before publishing.",
  website: "Website Engine activated. The next stage will connect design, page, code, SEO, testing, and publishing workflows.",
  status: "System status: AI Core online. Command interface ready.",
  default: "Command received. The foundation is ready; the AI Core and backend engines will be connected in the next development stage."
};

export function processCommand(command) {
  if (!command) return { message: "براہِ کرم کوئی command لکھیں۔" };

  const text = command.toLowerCase();

  if (text.includes("review") || text.includes("ریویو")) return { message: responses.review };
  if (text.includes("website") || text.includes("ویب")) return { message: responses.website };
  if (text.includes("task") || text.includes("کام")) return { message: responses.task };
  if (text.includes("status") || text.includes("حالت")) return { message: responses.status };

  return { message: responses.default };
}
