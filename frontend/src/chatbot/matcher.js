import { INTENTS } from "./intents";

const KEYWORD_EXPANSIONS = {
  doctor: "doctor availability",
  doctors: "doctor availability",
  payment: "payment methods",
  pay: "payment methods",
  bed: "hospital bed",
  beds: "hospital bed",
  support: "support help",
  help: "support help",
  profile: "update profile",
  appointment: "book appointment",
};

export function matchIntent(userInput) {
  if (!userInput) return null;

  let input = userInput.toLowerCase().trim();

  // Expand short keywords
  if (KEYWORD_EXPANSIONS[input]) {
    input = KEYWORD_EXPANSIONS[input];
  }

  let bestMatch = null;
  let highestScore = 0;

  for (const intent of INTENTS) {
    let score = 0;

    for (const keyword of intent.keywords) {
      if (input.includes(keyword)) {
        score += keyword.length;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = intent;
    }
  }

  if (bestMatch && highestScore > 0) {
    return bestMatch.response;
  }

  return (
    "I’m here to help with your Medicare-related questions. Please ask about appointments, beds, doctors, payments, profile, or support."
  );
}
