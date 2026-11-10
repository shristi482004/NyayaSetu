const { z } = require('zod');

const askQuestionSchema = z.object({
  question: z
    .string({ required_error: 'Question is required' })
    .min(3, 'Question must be at least 3 characters long')
    .max(1000, 'Question cannot exceed 1000 characters')
});

module.exports = { askQuestionSchema };

