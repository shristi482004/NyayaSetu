const { ZodError } = require('zod');

/**
 * Middleware factory for validating incoming request payloads against Zod schemas.
 * @param {import('zod').ZodSchema} schema
 * @param {'body'|'query'|'params'} source
 */
const validateRequest = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      req[source] = schema.parse(req[source]);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errorDetails = err.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message
        }));
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: 'Request payload failed schema validation.',
          details: errorDetails
        });
      }
      next(err);
    }
  };
};

module.exports = { validateRequest };

