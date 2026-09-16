# Configuration de la base de donnees PostgreSQL - ACT'ERE
import os

DATABASE_URL = os.environ.get('DATABASE_URL')

DB_CONFIG = {
    'host': os.environ.get('DB_HOST', 'localhost'),
    'port': int(os.environ.get('DB_PORT', 5432)),
    'database': os.environ.get('DB_NAME', 'actere_db'),
    'user': os.environ.get('DB_USER', 'postgres'),
    'password': os.environ.get('DB_PASSWORD', 'Admin123')
}
