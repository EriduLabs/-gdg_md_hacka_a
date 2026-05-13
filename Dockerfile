FROM python:3.13-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install system dependencies (needed for mysqlclient if used, but PyMySQL is pure python)
# RUN apt-get update && apt-get install -y default-libmysqlclient-dev build-essential

# Install dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . /app/

# Collect static files
# We set a dummy SECRET_KEY so collectstatic can run
RUN SECRET_KEY="dummy" python manage.py collectstatic --noinput

# Run gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "mysite.wsgi:application"]
