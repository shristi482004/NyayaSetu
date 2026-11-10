from pydantic import BaseModel, Field
from typing import List, Optional

class SummarySchema(BaseModel):
    disputeType: str = Field(..., description="Classification of the legal dispute")
    keyParties: List[str] = Field(default_factory=list, description="Parties, petitioners, respondents")
    factualBackground: List[str] = Field(default_factory=list, description="Core undisputed factual points")
    legalIssues: List[str] = Field(default_factory=list, description="Core legal issues or claims in contest")
    rulingsOrObligations: List[str] = Field(default_factory=list, description="Court rulings, directions, or party obligations")
    plainLanguageSummary: str = Field(..., description="Simplified explanation accessible to non-lawyers")

class FAQItem(BaseModel):
    question: str = Field(..., description="Frequently asked practical legal question")
    answer: str = Field(..., description="Direct, grounded answer based on document text")
    relevantClauseOrPage: Optional[str] = Field(None, description="Clause number or page citation")

class TimelineEvent(BaseModel):
    date: str = Field(..., description="Event date or relative timeframe")
    event: str = Field(..., description="Description of the historical or future event")
    sourcePage: Optional[int] = Field(None, description="Source page number in PDF")

class FlowchartStep(BaseModel):
    stepNumber: int = Field(..., description="Sequential step number starting at 1")
    stageName: str = Field(..., description="Short title for procedural stage")
    description: str = Field(..., description="Details of procedural requirements")
    actionRequired: Optional[str] = Field(None, description="Action needed from the citizen/advocate")
    deadlineOrTimeframe: Optional[str] = Field(None, description="Statutory limit or notice deadline")

class ArgumentItem(BaseModel):
    claim: str = Field(..., description="Primary legal contention or allegation")
    evidenceOrBasis: str = Field(..., description="Documentary or statutory proof cited")
    counterArgument: Optional[str] = Field(None, description="Anticipated or raised counter-argument")

class ActionItem(BaseModel):
    priority: str = Field("Medium", description="Priority level: High, Medium, or Low")
    action: str = Field(..., description="Specific action to execute")
    responsibleParty: Optional[str] = Field(None, description="Party responsible for executing the action")
    deadline: Optional[str] = Field(None, description="Deadline for execution")

class AnalysisRequest(BaseModel):
    document_id: str = Field(..., description="MongoDB Document ObjectId")
    document_text: str = Field(..., description="Combined cleaned document text")
    pages_data: Optional[List[dict]] = Field(default=None, description="Optional per-page chunk details")

class DocumentAnalysisResponse(BaseModel):
    success: bool = True
    document_id: str
    summary: SummarySchema
    faqs: List[FAQItem] = Field(default_factory=list)
    timeline: List[TimelineEvent] = Field(default_factory=list)
    flowchart: List[FlowchartStep] = Field(default_factory=list)
    arguments: List[ArgumentItem] = Field(default_factory=list)
    actionItems: List[ActionItem] = Field(default_factory=list)
    disclaimer: str = Field(
        "NyayaSetu provides informational assistance only and does not constitute formal legal counsel.",
        description="Mandatory legal disclaimer"
    )

