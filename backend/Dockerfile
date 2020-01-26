FROM python:3.7-alpine

RUN apk add --update git bash
RUN adduser -D flask-app

WORKDIR /home/flask-app

COPY requirements.txt requirements.txt

RUN pip install -r requirements.txt
RUN pip install gunicorn

COPY app app
COPY migrations migrations
COPY runserver.py run.gunicorn.sh config.py ./
RUN chmod +x run.gunicorn.sh

ENV FLASK_APP runserver.py

RUN chown -R flask-app:flask-app /home/flask-app
USER flask-app

EXPOSE 5000
CMD ["./run.gunicorn.sh"]
