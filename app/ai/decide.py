from app.ai.agent import write_reply
from app.ai.classifier import classify
from app.ai.rules import (
    CUSTOMER_STEPS,
    customer_wants_refund,
    requires_human,
    resolve_issue,
    section_for_classification,
    section_for_issue,
)
from app.ai.schemas import Decision


def decide(thread: str, has_attachments: bool = False) -> Decision:
    """Run the AI steps for one email thread. The models propose, this function decides."""
    classification = classify(thread)
    section = section_for_classification(classification)

    def escalate(reason: str, proposed_action: str | None = None) -> Decision:
        return Decision(
            action="escalate",
            section=section,
            reply=classification.acknowledgement,
            reason=reason,
            proposed_action=proposed_action,
        )

    if has_attachments:
        return escalate("The email has attachments")
    if requires_human(classification):
        return escalate(classification.reason)

    answer = write_reply(thread, section)
    # A reported product problem is more specific than a process label, so a wrong finish
    # stays on the product section. A refund demand is not overridden.
    if answer.issue and not customer_wants_refund(classification):
        section = section_for_issue(answer.issue) or section
    if answer.action == "escalate":
        return escalate(answer.reasoning)
    if not answer.enough_information:
        return escalate("The knowledge base does not answer this")
    if answer.issue:
        step = resolve_issue(answer.issue)
        if step not in CUSTOMER_STEPS:
            return escalate(f"Next step: {step}", proposed_action=step)
    if answer.promises_an_action:
        return escalate("The reply promises an action")

    return Decision(
        action="reply",
        section=section,
        reply=answer.reply,
        reason=answer.reasoning,
    )