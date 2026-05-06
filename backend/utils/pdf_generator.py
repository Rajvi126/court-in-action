from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import A4
from datetime import datetime
import uuid 


def generate_pdf(data, output_path):
    doc = SimpleDocTemplate(output_path, pagesize=A4)
    styles = getSampleStyleSheet()

    elements = []

    # 🏷 Title
    elements.append(Paragraph("<b>Court In Action - AI Report</b>", styles['Title']))
    elements.append(Spacer(1, 12))

    # 🆔 Report ID
    report_id = str(uuid.uuid4())[:8]
    elements.append(Paragraph(f"<b>Report ID:</b> {report_id}", styles['Normal']))

    # 🕒 Timestamp
    elements.append(Paragraph(f"<b>Generated On:</b> {datetime.now()}", styles['Normal']))
    elements.append(Spacer(1, 12))

    # 📌 Case Info
    elements.append(Paragraph(f"<b>Case Title:</b> {data.get('case_title', '')}", styles['Normal']))
    elements.append(Paragraph(f"<b>Date:</b> {data.get('date', '')}", styles['Normal']))
    elements.append(Spacer(1, 12))

    # 👥 Parties
    elements.append(Paragraph("<b>Parties:</b>", styles['Heading2']))
    for p in data.get("parties", []):
        elements.append(Paragraph(f"- {p}", styles['Normal']))
    elements.append(Spacer(1, 12))

    # 📜 Directives
    elements.append(Paragraph("<b>Key Directives:</b>", styles['Heading2']))
    for d in data.get("directives", []):
        elements.append(Paragraph(f"- {d}", styles['Normal']))
    elements.append(Spacer(1, 12))

    # ⚙️ Action Plan
    elements.append(Paragraph("<b>Action Plan:</b>", styles['Heading2']))
    for action in data.get("action_plan", []):
        elements.append(Paragraph(f"Task: {action['task']}", styles['Normal']))
        elements.append(Paragraph(f"Authority: {action['responsible_authority']}", styles['Normal']))
        elements.append(Paragraph(f"Deadline: {action['deadline']}", styles['Normal']))
        elements.append(Paragraph(f"Priority: {action['priority']}", styles['Normal']))
        elements.append(Spacer(1, 10))

    # 🔐 Footer
    elements.append(Spacer(1, 20))
    elements.append(Paragraph("<i>This is an AI-generated report. Verify before use.</i>", styles['Normal']))

    doc.build(elements)
