const mongoose = require('mongoose');

const analysisResultSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
      unique: true,
      index: true
    },
    summary: {
      disputeType: { type: String, required: true },
      keyParties: [{ type: String }],
      factualBackground: [{ type: String }],
      legalIssues: [{ type: String }],
      rulingsOrObligations: [{ type: String }],
      plainLanguageSummary: { type: String, required: true }
    },
    faqs: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
        relevantClauseOrPage: { type: String }
      }
    ],
    timeline: [
      {
        date: { type: String, required: true },
        event: { type: String, required: true },
        sourcePage: { type: Number }
      }
    ],
    flowchart: [
      {
        stepNumber: { type: Number, required: true },
        stageName: { type: String, required: true },
        description: { type: String, required: true },
        actionRequired: { type: String },
        deadlineOrTimeframe: { type: String }
      }
    ],
    arguments: [
      {
        claim: { type: String, required: true },
        evidenceOrBasis: { type: String, required: true },
        counterArgument: { type: String }
      }
    ],
    actionItems: [
      {
        priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
        action: { type: String, required: true },
        responsibleParty: { type: String },
        deadline: { type: String }
      }
    ],
    disclaimer: {
      type: String,
      default: 'NyayaSetu provides informational assistance only and does not constitute formal legal counsel.'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('AnalysisResult', analysisResultSchema);

