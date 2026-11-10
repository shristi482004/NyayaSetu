const LEGAL_DISCLAIMER =
  'NyayaSetu provides informational assistance only and does not constitute formal legal counsel.';

const attachLegalDisclaimer = (req, res, next) => {
  const originalJson = res.json;

  res.json = function (data) {
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      if (data.data && typeof data.data === 'object' && !Array.isArray(data.data)) {
        if (!data.data.disclaimer) {
          data.data.disclaimer = LEGAL_DISCLAIMER;
        }
      } else if (!data.disclaimer && data.success !== false) {
        data.disclaimer = LEGAL_DISCLAIMER;
      }
    }
    return originalJson.call(this, data);
  };

  next();
};

module.exports = { attachLegalDisclaimer, LEGAL_DISCLAIMER };

