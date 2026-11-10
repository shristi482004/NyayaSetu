# Maintenance Plan — NyayaSetu

## 1. Overview and Maintenance Categories
The maintenance plan ensures the long-term operational health, security, accuracy, and compliance of the **NyayaSetu** legal document intelligence platform. Maintenance operations are structured across four standard disciplines:

1. **Corrective Maintenance:** Diagnosing, patching, and resolving defects reported in production or identified during automated health probes.
2. **Adaptive Maintenance:** Accommodating updates to external systems, such as Google Gemini API version upgrades (e.g. Gemini 2.0 to future versions), new MongoDB releases, or evolving operating systems.
3. **Perfective Maintenance:** Refining system performance, reducing Gemini token overhead, enhancing OCR accuracy, and improving query latency.
4. **Preventive Maintenance:** Routine dependency updates, security vulnerability scanning (`npm audit`, `pip-audit`), rotating secrets, and verifying database backups.

## 2. Gemini Model Maintenance and Prompt Drift Management
As Google regularly upgrades Generative AI foundation models, prompt tuning must be systematically audited:
- **Prompt Freezing:** Prompt templates are strictly version-controlled within `ai_service/services/prompts.py` and `docs/AI_Prompts.md`.
- **Regression Evaluation Suite:** A standardized benchmark test dataset of legal documents with verified ground-truth summaries and flowchart outputs must be run against any prospective Gemini model update.
- **Model Switch Procedure:**
  1. Update `GEMINI_MODEL` environment variable in staging environment.
  2. Execute automated evaluation suite (`pytest tests/ai_service/test_evaluation.py`).
  3. Validate that ROUGE scores, placeholder compliance (`[UNKNOWN]`, `[CITE]`), and Pydantic schema validation meet baseline thresholds (>= 90% compliance).
  4. Promote model update to production.

## 3. Database Maintenance and Backup Strategy
- **Automated Snapshots:** MongoDB Atlas is configured for automated daily snapshots with a 7-day retention window.
- **Index Health Audits:** Periodic inspection of slow query logs (`explain('executionStats')`) to detect unindexed queries in `Documents` or `ChatMessages`.
- **Orphan Data Sweeping:** Routine cron tasks purge incomplete uploads or unreferenced temporary files older than 48 hours.

## 4. Operational Monitoring and Log Rotation
- **Structured Logging:** All backend events are processed via `winston` in JSON format, capturing timestamp, user ID, endpoint, response status, and duration.
- **Log Archiving:** Console logs are ingested by cloud runtime logging (Render / CloudWatch / GCP Cloud Logging).
- **Heartbeat Checks:** External uptime monitors poll `/api/health` at 60-second intervals. Unresponsive states trigger automated alerts.

## 5. Rollback and Incident Recovery Protocol
- In the event of a breaking regression or severe error:
  1. Redeploy the last verified stable Git commit tag on Render/GCP.
  2. Revert any failing database schema migrations using automated rollback scripts.
  3. If MongoDB data corruption occurs, restore the most recent daily snapshot from MongoDB Atlas.
  4. Conduct a root-cause analysis and file an incident ticket in GitHub Issues.

