export const aiCore = {
  name: "AI Core",
  languages: ["Urdu", "Sindhi", "English"],
  capabilities: ["intent extraction","command validation","task orchestration","memory access","automation coordination","review workflow","human confirmation for critical actions"],
  backend: {url: "http://localhost:8000", endpoint: "/api/command"}
};

export async function sendToAICore(command, language = null) {
  const response = await fetch(`${aiCore.backend.url}${aiCore.backend.endpoint}`, {
    method:"POST", headers:{"Content-Type":"application/json"},
    body:JSON.stringify({command, language})
  });
  if (!response.ok) throw new Error(`AI Core HTTP ${response.status}`);
  return response.json();
}
