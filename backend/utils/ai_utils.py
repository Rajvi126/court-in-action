import re
from unicodedata import category


# 🔐 Basic sanitization (security layer)
def sanitize_text(text):
    dangerous_patterns = ["ignore previous instructions", "system:", "assistant:"]
    for pattern in dangerous_patterns:
        text = text.replace(pattern, "")
    return text


# 📌 Extract Case Title
def extract_case_title(text):
    lines = text.split("\n")

    for line in lines[:20]:
        line = line.strip()
        if " v " in line.lower() or " vs " in line.lower():
            return line

    return "Not found"


# 📌 Extract Date
def extract_date(text):
    patterns = [
        r'\d{1,2}\s\w+\s\d{4}',   # 12 June 2023
        r'\d{2}/\d{2}/\d{4}',     # 12/06/2023
        r'\b\d{4}\b'              # fallback year
    ]

    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            return match.group(0)

    return "Not found"


# 📌 Extract Parties (cleaned)
def extract_parties(text):
    lines = text.split("\n")
    parties = []

    for line in lines[:50]:
        if "appellant" in line.lower() or "respondent" in line.lower():
            clean_line = line.strip()

            if 5 < len(clean_line) < 100:
                parties.append(clean_line)

    # remove duplicates
    parties = list(set(parties))

    return parties[:5] if parties else ["Not clearly identified"]


# 📌 Extract Directives
def extract_directives(text):
    sentences = re.split(r'[.;]', text)

    keywords = [
        "is directed to",
        "is ordered to",
        "shall",
        "must",
        "is hereby directed",
        "ordered that"
    ]

    directives = []

    for sentence in sentences:
        for word in keywords:
            if word in sentence.lower():
                clean = sentence.strip()

                if len(clean) > 30:
                    directives.append(clean)
                break

    return directives[:5] if directives else ["No clear directives found"]


# 📌 Generate Action Plan
def generate_action_plan(directives):
    action_plan = []

    for d in directives:
        action_plan.append({
            "task": d,
            "responsible_authority": "Concerned Authority",
            "deadline": "Not specified",
            "priority": "High"
        })

    return action_plan


# 🧠 NEW: Generate Summary (IMPORTANT for demo quality)
def generate_summary(text):
    lines = text.split("\n")

    # Take first meaningful lines
    clean_lines = [line.strip() for line in lines if len(line.strip()) > 30]

    summary = " ".join(clean_lines[:3])

    return summary[:300] if summary else "Summary not available"


# 🚀 MAIN FUNCTION
def analyze_text(text, category="General"): 
    text = sanitize_text(text)

    case_title = extract_case_title(text)
    date = extract_date(text)
    parties = extract_parties(text)
    directives = extract_directives(text)
    # 🧠 Category-specific tweaks
    if category == "Criminal":
        directives.append("Review charges and applicable IPC sections")
    elif category == "Property":
        directives.append("Verify ownership and title documents")
    elif category == "Family":
        directives.append("Check custody and settlement terms") 
    action_plan = generate_action_plan(directives)
    summary = generate_summary(text)

    return {
        "case_title": case_title,
        "parties": parties,
        "date": date,
        "summary": summary,
        "directives": directives,
        "action_plan": action_plan
    } 