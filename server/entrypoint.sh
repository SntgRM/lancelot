#!/bin/sh

echo "Esperando a que la base de datos esté lista..."
while ! python -c "
import MySQLdb
MySQLdb.connect(
    host='db',
    user='root',
    passwd='root',
    db='todo_db'
)
" 2>/dev/null; do
    echo "Base de datos no disponible, reintentando en 2 segundos..."
    sleep 2
done

echo "Base de datos lista."

echo "Aplicando migraciones..."
python manage.py migrate

echo "Cargando datos de muestra..."
python manage.py loaddata initial_data.json

echo "Iniciando servidor..."
python manage.py runserver 0.0.0.0:8000