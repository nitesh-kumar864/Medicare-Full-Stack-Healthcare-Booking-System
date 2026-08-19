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
  if (!userInput) {
    return {
      matched: false,
      response: null,
      intent: null,
      score: 0,
    };
  }

  let input = userInput.toLowerCase().trim();

  // Check whether user entered a short keyword
  const wasExpanded = Boolean(KEYWORD_EXPANSIONS[input]);

  // Expand short keywords
  if (wasExpanded) {
    input = KEYWORD_EXPANSIONS[input];
  }

  let bestMatch = null;
  let highestScore = 0;
  let highestKeywordCount = 0;

  for (const intent of INTENTS) {
    let score = 0;
    let keywordCount = 0;

    for (const keyword of intent.keywords) {
      if (input.includes(keyword)) {
        score += keyword.length;
        keywordCount++;
      }
    }

    if (
      score > highestScore ||
      (score === highestScore && keywordCount > highestKeywordCount)
    ) {
      highestScore = score;
      highestKeywordCount = keywordCount;
      bestMatch = intent;
    }
  }

  const isConfidentMatch =
    highestKeywordCount >= 2 ||
    wasExpanded ||
    highestScore >= 10;

  if (bestMatch && isConfidentMatch) {
    return {
      matched: true,
      response: bestMatch.response,
      intent: bestMatch.name,
      score: highestScore,
    };
  }

  return {
    matched: false,
    response: null,
    intent: null,
    score: highestScore,
  };
}