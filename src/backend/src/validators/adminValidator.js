const { z } = require('zod');

const updateUserStatusSchema = z.object({
  status: z.enum(['active', 'suspended', 'pending'], {
    required_error: 'Status is required'
  })
});

module.exports = { updateUserStatusSchema };

