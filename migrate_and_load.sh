#!/bin/bash
echo "Running migrations..."
python manage.py migrate --noinput
echo "Loading data..."
python manage.py loaddata datadump.json
echo "Done!"
