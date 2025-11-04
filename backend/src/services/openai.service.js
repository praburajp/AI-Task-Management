const OpenAI = require('openai');

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
}) : null;

exports.analyzeTaskWithAI = async (task) => {
  if (!openai) {
    return null;
  }

  try {
    const prompt = `Analyze this task and provide a brief priority recommendation and tips:

Title: ${task.title}
Description: ${task.description}
Current Priority: ${task.priority}
Due Date: ${new Date(task.dueDate).toLocaleDateString()}

Provide a concise analysis (max 100 words) with:
1. Priority recommendation (low/medium/high/urgent)
2. Key considerations
3. One actionable tip`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a task management assistant that helps prioritize work effectively.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 150,
      temperature: 0.7
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI API Error:', error.message);
    return null;
  }
};