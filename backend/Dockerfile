FROM python:3.12

COPY . .

RUN pip3 install -r requirements.txt

CMD ["python3", "notesApp/manage.py", "runserver", "0.0.0.0:8005"]
