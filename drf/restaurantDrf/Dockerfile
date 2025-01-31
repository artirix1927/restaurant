FROM python:3.12-slim

# Set the working directory for the shop app
WORKDIR /drf/restaurantDrf

# Install required system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libffi-dev \
    && apt-get clean

# Copy the requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the shop source code
COPY . .

# Expose the port for the shop app
EXPOSE 8000

CMD ["python", "manage.py runserver localhost:8000"]

