from app.ai.schemas import Classification, Issue, Section

# Steps where the reply goes to the customer, because they have to check or send something first.
CUSTOMER_STEPS = {"valve-check", "ask-details"}

# Section for each product the issue schema can name. A product problem stays on that
# section even when the remedy is an exchange, a replacement, or a shipment.
PRODUCT_SECTIONS = {
    "paddle-board": "paddle-boards",
    "shelving": "shelving",
}


def section_for_issue(issue: Issue) -> str | None:
    """Knowledge-base section for a reported product problem, if we know the product."""
    return PRODUCT_SECTIONS.get(issue.product)


def section_for_classification(classification: Classification) -> Section:
    """Pick the section from what the customer asked for, then which product it concerns.

    A refund or a return question stays on returns even when a product is named.
    A delivery question stays on shipping even when the parcel is a product we sell.
    A product question or a product problem uses that product's section, including when
    the remedy is an exchange, a replacement, or a shipment.
    """
    if classification.request == "refund" or "refund" in classification.triggers:
        return "returns-and-warranty"
    if classification.request == "return-or-warranty":
        return "returns-and-warranty"
    if classification.request == "shipping":
        return "shipping"
    if classification.product == "paddle-board":
        return "paddle-boards"
    if classification.product == "shelving":
        return "shelving"
    return "other"


def requires_human(classification: Classification) -> bool:
    """True when a person must answer. A refund or an unrecognized request always does."""
    if classification.triggers:
        return True
    return classification.request in {"refund", "other"}


def customer_wants_refund(classification: Classification) -> bool:
    return classification.request == "refund" or "refund" in classification.triggers


def resolve_issue(issue: Issue) -> str:
    """Decide the next step for a reported problem. The model reports, Python decides."""
    step = next_step(issue)
    if step not in CUSTOMER_STEPS | {"escalate"} and not issue.order_number:
        return "ask-details"
    return step


def next_step(issue: Issue) -> str:
    if issue.product == "paddle-board":
        if issue.problem == "missing-accessory":
            return "ship-part"
        if issue.problem == "slow-leak":
            if not issue.valve_checked:
                return "valve-check"
            if issue.days_since_delivery is None:
                return "ask-details"
            return "new-board" if issue.days_since_delivery <= 30 else "patch-kit"
    if issue.product == "shelving":
        if issue.problem == "missing-hardware":
            return "ship-hardware-kit"
        if issue.problem == "wrong-finish":
            return "exchange"
        if issue.problem == "damaged-frame":
            return "full-replacement"
        if issue.problem == "damaged-panels":
            if not issue.part_numbers:
                return "ask-details"
            return "ship-panels" if len(issue.part_numbers) <= 2 else "full-replacement"
    # Seam splits and anything unexpected go to a person.
    return "escalate"