from django.core.mail import send_mail
from django.template.loader import render_to_string
from reportlab.lib.pagesizes import letter
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from django.http import HttpResponse
from io import BytesIO
import os


def send_notification_email(user_email, application_name, document_name):
    subject = 'Добавлен новый документ в заявку'
    message = f'В заявку "{application_name}" добавлен новый документ: "{document_name}".'
    send_mail(subject, message, 'from@example.com', [user_email])


def generate_pdf(report):
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="report_{report.id}.pdf"'

    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    elements = []

    # Определите путь к шрифту
    font_path = os.path.join('fonts', 'DejaVuSans.ttf')

    # Проверка на существование файла шрифта
    if not os.path.exists(font_path):
        raise FileNotFoundError(f"Файл шрифта не найден: {font_path}")

    # Зарегистрировать шрифт DejaVu Sans
    pdfmetrics.registerFont(TTFont('DejaVuSans', font_path))

    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name='DejaVuSans', fontName='DejaVuSans', fontSize=12))
    heading_style = ParagraphStyle('Heading1', parent=styles['Heading1'], fontName='DejaVuSans', fontSize=12)
    normal_style = ParagraphStyle('Normal', parent=styles['Normal'], fontName='DejaVuSans', fontSize=12)
    table_cell_style = ParagraphStyle('TableCell', parent=styles['Normal'], fontName='DejaVuSans', fontSize=12,
                                      wordWrap='CJK')

    # Номер отчета и дата создания в одной строке с отступами
    header_data = [
        [Paragraph(f"Отчет № {report.id}", heading_style),
         Paragraph(f"Дата создания: {report.createdAt}", heading_style)],
        [Paragraph(f"  Период поиска заявок: {report.periodStart} - {report.periodEnd}", heading_style),
         Paragraph(f"  Последняя дата изменения: {report.updatedAt}", heading_style)]
    ]
    header_table = Table(header_data, colWidths=[5.5 * inch, 2 * inch])
    header_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (0, 0), 'LEFT'),
        ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
        ('FONTNAME', (0, 0), (-1, -1), 'DejaVuSans'),
    ]))
    elements.append(header_table)
    elements.append(Spacer(1, 0.5 * inch))

    # Данные для таблицы
    data = [
        ["Приоритет", report.get_priority_display()],
        ["Описание", report.description],
        ["Статус отчета", 'Активен' if report.status else 'Неактивен'],
        ["Заказчик", str(report.legalEntity) if report.legalEntity else ''],
        ["Сотрудник, создавший отчет", str(report.creator) if report.creator else ''],
        ["Группа рабочих объектов", str(report.workObjectsGroup) if report.workObjectsGroup else ''],
        ["Рабочий объект", str(report.workObject) if report.workObject else ''],
        ["Найденные заявки", ", ".join([str(app) for app in report.foundedApllications.all()])],
        ["Статус заявки", report.application_status if report.application_status else ''],
    ]

    # Преобразование данных в параграфы
    data = [[Paragraph(str(cell), table_cell_style) for cell in row] for row in data]

    # Создание таблицы
    table = Table(data, colWidths=[150, 400])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, -1), 'DejaVuSans'),
        ('FONTSIZE', (0, 0), (-1, -1), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),  # Верхнее выравнивание текста
    ]))
    elements.append(table)

    elements.append(Spacer(1, 0.2 * inch))

    # Создание PDF
    doc.build(elements)

    response.write(buffer.getvalue())
    buffer.close()

    return response