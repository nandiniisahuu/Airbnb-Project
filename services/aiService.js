const { askAI } = require("./openaiService");

async function generateHomeDescription(home) {
  const prompt = `
You are an AI assistant for a vacation rental platform.

Generate a professional and attractive property description for this home.

Home details:
Name: ${home.houseName}
Location: ${home.location}
Price: ₹${home.price} per night
Rating: ${home.rating}/5

Requirements:
- Write 80-120 words.
- Make it attractive for guests.
- Mention the location, comfort and overall experience.
- Do not invent facilities that are not provided.
- Return only the description.
`;

  return await askAI(prompt);
}

module.exports = {
  generateHomeDescription,
};