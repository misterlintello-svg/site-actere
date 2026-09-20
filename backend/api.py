# -*- coding: utf-8 -*-
"""
ACT'ERE - Backend API Flask
Gestion des inscriptions et des messages de contact avec PostgreSQL (psycopg3)
"""
from flask import Flask, request, jsonify, send_file, send_from_directory, redirect
from flask_cors import CORS
import psycopg
import psycopg.rows
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
import io
import datetime
import sys
import os
import json
import urllib.request

sys.path.insert(0, os.path.dirname(__file__))
from config import DB_CONFIG, DATABASE_URL

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

app = Flask(__name__, static_folder=BASE_DIR, static_url_path='')
CORS(app)

# ─────────────────────────────────────────────
# GÉOLOCALISATION IP (ANALYTICS & STATISTIQUES)
# ─────────────────────────────────────────────
GEO_IP_CACHE = {}

TIMEZONE_GEO_FALLBACK = {
    'Africa/Abidjan': {'country': "Côte d'Ivoire", 'country_code': 'CI', 'city': 'Abidjan / Bouaké', 'region': 'Gbêkê / Lagunes'},
    'Africa/Dakar': {'country': 'Sénégal', 'country_code': 'SN', 'city': 'Dakar', 'region': 'Dakar'},
    'Africa/Bamako': {'country': 'Mali', 'country_code': 'ML', 'city': 'Bamako', 'region': 'Bamako'},
    'Africa/Ouagadougou': {'country': 'Burkina Faso', 'country_code': 'BF', 'city': 'Ouagadougou', 'region': 'Centre'},
    'Africa/Lome': {'country': 'Togo', 'country_code': 'TG', 'city': 'Lomé', 'region': 'Maritime'},
    'Africa/Cotonou': {'country': 'Bénin', 'country_code': 'BJ', 'city': 'Cotonou', 'region': 'Littoral'},
    'Africa/Accra': {'country': 'Ghana', 'country_code': 'GH', 'city': 'Accra', 'region': 'Greater Accra'},
    'Africa/Lagos': {'country': 'Nigéria', 'country_code': 'NG', 'city': 'Lagos', 'region': 'Lagos'},
    'Africa/Douala': {'country': 'Cameroun', 'country_code': 'CM', 'city': 'Douala', 'region': 'Littoral'},
    'Africa/Kinshasa': {'country': 'RD Congo', 'country_code': 'CD', 'city': 'Kinshasa', 'region': 'Kinshasa'},
    'Africa/Casablanca': {'country': 'Maroc', 'country_code': 'MA', 'city': 'Casablanca', 'region': 'Casablanca-Settat'},
    'Africa/Tunis': {'country': 'Tunisie', 'country_code': 'TN', 'city': 'Tunis', 'region': 'Tunis'},
    'Africa/Algiers': {'country': 'Algérie', 'country_code': 'DZ', 'city': 'Alger', 'region': 'Alger'},
    'Europe/Paris': {'country': 'France', 'country_code': 'FR', 'city': 'Paris', 'region': 'Île-de-France'},
    'Europe/Brussels': {'country': 'Belgique', 'country_code': 'BE', 'city': 'Bruxelles', 'region': 'Bruxelles'},
    'Europe/Geneva': {'country': 'Suisse', 'country_code': 'CH', 'city': 'Genève', 'region': 'Genève'},
    'Europe/Zurich': {'country': 'Suisse', 'country_code': 'CH', 'city': 'Zurich', 'region': 'Zurich'},
    'Europe/London': {'country': 'Royaume-Uni', 'country_code': 'GB', 'city': 'Londres', 'region': 'England'},
    'Europe/Madrid': {'country': 'Espagne', 'country_code': 'ES', 'city': 'Madrid', 'region': 'Madrid'},
    'Europe/Rome': {'country': 'Italie', 'country_code': 'IT', 'city': 'Rome', 'region': 'Lazio'},
    'Europe/Berlin': {'country': 'Allemagne', 'country_code': 'DE', 'city': 'Berlin', 'region': 'Berlin'},
    'America/New_York': {'country': 'États-Unis', 'country_code': 'US', 'city': 'New York', 'region': 'New York'},
    'America/Chicago': {'country': 'États-Unis', 'country_code': 'US', 'city': 'Chicago', 'region': 'Illinois'},
    'America/Los_Angeles': {'country': 'États-Unis', 'country_code': 'US', 'city': 'Los Angeles', 'region': 'California'},
    'America/Montreal': {'country': 'Canada', 'country_code': 'CA', 'city': 'Montréal', 'region': 'Québec'},
    'America/Toronto': {'country': 'Canada', 'country_code': 'CA', 'city': 'Toronto', 'region': 'Ontario'},
}

def is_private_ip(ip):
    if not ip or ip in ('127.0.0.1', '::1', 'localhost', '0.0.0.0'):
        return True
    if ip.startswith(('10.', '192.168.', '172.16.', '172.17.', '172.18.', '172.19.', '172.20.', '172.21.', '172.22.', '172.23.', '172.24.', '172.25.', '172.26.', '172.27.', '172.28.', '172.29.', '172.30.', '172.31.', 'fc00:', 'fe80:')):
        return True
    return False

def get_client_ip():
    headers = [
        'CF-Connecting-IP',
        'X-Forwarded-For',
        'X-Real-IP'
    ]
    for h in headers:
        val = request.headers.get(h)
        if val:
            ip = val.split(',')[0].strip()
            if ip:
                return ip
    return (request.remote_addr or '').strip()

def resolve_geoip(ip, client_tz=''):
    geo = {
        'country': '',
        'country_code': '',
        'city': '',
        'region': '',
        'timezone': client_tz or ''
    }
    
    if is_private_ip(ip):
        if client_tz and client_tz in TIMEZONE_GEO_FALLBACK:
            fb = TIMEZONE_GEO_FALLBACK[client_tz]
            geo['country'] = fb['country']
            geo['country_code'] = fb['country_code']
            geo['city'] = fb['city']
            geo['region'] = fb['region']
        elif client_tz and '/' in client_tz:
            geo['country'] = client_tz.split('/')[0].replace('_', ' ')
            geo['city'] = client_tz.split('/')[1].replace('_', ' ')
        return geo

    if ip in GEO_IP_CACHE:
        return GEO_IP_CACHE[ip]

    try:
        url = f"http://ip-api.com/json/{ip}?fields=status,message,country,countryCode,regionName,city,timezone"
        req = urllib.request.Request(url, headers={'User-Agent': 'ACTERE-Analytics/1.0'})
        with urllib.request.urlopen(req, timeout=1.5) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            if data.get('status') == 'success':
                geo['country'] = data.get('country') or ''
                geo['country_code'] = data.get('countryCode') or ''
                geo['city'] = data.get('city') or ''
                geo['region'] = data.get('regionName') or ''
                if not geo['timezone']:
                    geo['timezone'] = data.get('timezone') or ''
                GEO_IP_CACHE[ip] = geo
                return geo
    except Exception as e:
        print(f"[GEOIP WARNING] Erreur résolution IP {ip} : {e}")

    # Fallback sur le timezone client si l'API externe échoue
    if client_tz and client_tz in TIMEZONE_GEO_FALLBACK:
        fb = TIMEZONE_GEO_FALLBACK[client_tz]
        geo['country'] = fb['country']
        geo['country_code'] = fb['country_code']
        geo['city'] = fb['city']
        geo['region'] = fb['region']
    elif client_tz and '/' in client_tz:
        geo['country'] = client_tz.split('/')[0].replace('_', ' ')
        geo['city'] = client_tz.split('/')[1].replace('_', ' ')

    GEO_IP_CACHE[ip] = geo
    return geo

# ─────────────────────────────────────────────
# ROUTAGE & SÉCURISATION DES URLS ADMIN
# ─────────────────────────────────────────────
@app.before_request
def block_public_admin_access():
    """Redirige les curieux qui essaient de deviner /admin ou /admin.html vers l'accueil."""
    path = request.path.lower()
    if path in ['/admin.html', '/admin', '/admin/', '/administration', '/admin-login']:
        return redirect('/', code=302)

@app.route('/')
def index():
    """Sert la page d'accueil principale."""
    return send_from_directory(BASE_DIR, 'index.html')

@app.route('/portail-prive-actere')
@app.route('/espace-gestion-actere')
@app.route('/portail-prive-actere.html')
def serve_secret_admin():
    """Lien secret d'accès au tableau de bord administrateur (protégé par mot de passe)."""
    return send_from_directory(BASE_DIR, 'admin.html')

def get_db():
    """Connexion a la base de donnees PostgreSQL (psycopg3). Compatible avec Supabase, Neon et Render."""
    if DATABASE_URL:
        url = DATABASE_URL.strip()
        if url.startswith('postgres://'):
            url = url.replace('postgres://', 'postgresql://', 1)
        return psycopg.connect(url)
    return psycopg.connect(
        host=DB_CONFIG['host'],
        port=DB_CONFIG['port'],
        dbname=DB_CONFIG['database'],
        user=DB_CONFIG['user'],
        password=DB_CONFIG['password']
    )

UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/uploads/<path:filename>')
def serve_uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

def init_db():
    """Cree la base de donnees actere_db et les tables necessaires."""
    if not DATABASE_URL:
        cfg = DB_CONFIG.copy()
        try:
            conn = psycopg.connect(
                host=cfg['host'], port=cfg['port'],
                dbname='postgres',
                user=cfg['user'], password=cfg['password'],
                autocommit=True
            )
            cur = conn.cursor()
            cur.execute("SELECT 1 FROM pg_database WHERE datname = 'actere_db'")
            if not cur.fetchone():
                cur.execute("CREATE DATABASE actere_db ENCODING 'UTF8'")
                print("[OK] Base de donnees 'actere_db' creee.")
            else:
                print("[OK] Base 'actere_db' deja existante.")
            cur.close()
            conn.close()
        except Exception as e:
            print(f"[AVERTISSEMENT] Verification base postgres : {e}")

    conn = get_db()
    cur = conn.cursor()

    # 1. Table des inscriptions
    cur.execute("""
        CREATE TABLE IF NOT EXISTS inscriptions (
            id SERIAL PRIMARY KEY,
            nom VARCHAR(100) NOT NULL,
            prenom VARCHAR(100) NOT NULL,
            email_gmail VARCHAR(200) NOT NULL UNIQUE,
            date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            motif VARCHAR(50) CHECK (motif IN ('Sponsoring', 'Benevole', 'Partenariat')) NOT NULL
        )
    """)
    cur.execute("CREATE INDEX IF NOT EXISTS idx_inscriptions_email ON inscriptions(email_gmail)")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_inscriptions_motif ON inscriptions(motif)")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_inscriptions_date ON inscriptions(date_inscription DESC)")

    # 2. Table des messages de contact
    cur.execute("""
        CREATE TABLE IF NOT EXISTS contact_messages (
            id SERIAL PRIMARY KEY,
            name VARCHAR(150) NOT NULL,
            email VARCHAR(150) NOT NULL,
            phone VARCHAR(50),
            subject VARCHAR(200) NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            status VARCHAR(50) DEFAULT 'non_lu'
        )
    """)
    cur.execute("CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_messages(created_at DESC)")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_messages(status)")

    # 3. Table des visites du site (Analytics / Trafic & Géolocalisation)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS site_visits (
            id SERIAL PRIMARY KEY,
            visitor_id VARCHAR(64) NOT NULL,
            session_id VARCHAR(64) NOT NULL,
            page_url VARCHAR(255) NOT NULL,
            page_title VARCHAR(255),
            referrer VARCHAR(255),
            device_type VARCHAR(50) DEFAULT 'Desktop',
            browser VARCHAR(50) DEFAULT 'Autre',
            os VARCHAR(50) DEFAULT 'Autre',
            screen_resolution VARCHAR(30),
            ip_address VARCHAR(45),
            country VARCHAR(100),
            country_code VARCHAR(10),
            city VARCHAR(100),
            region VARCHAR(100),
            timezone VARCHAR(100),
            visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cur.execute("CREATE INDEX IF NOT EXISTS idx_visits_date ON site_visits(visited_at DESC)")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_visits_visitor ON site_visits(visitor_id)")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_visits_page ON site_visits(page_url)")

    # Migrations de colonnes de géolocalisation si la table existait déjà
    cur.execute("ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS ip_address VARCHAR(45)")
    cur.execute("ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS country VARCHAR(100)")
    cur.execute("ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS country_code VARCHAR(10)")
    cur.execute("ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS city VARCHAR(100)")
    cur.execute("ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS region VARCHAR(100)")
    cur.execute("ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS timezone VARCHAR(100)")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_visits_country ON site_visits(country)")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_visits_city ON site_visits(city)")

    # 4. Table des clics et interactions du site
    cur.execute("""
        CREATE TABLE IF NOT EXISTS site_clicks (
            id SERIAL PRIMARY KEY,
            visitor_id VARCHAR(64) NOT NULL,
            session_id VARCHAR(64) NOT NULL,
            page_url VARCHAR(255) NOT NULL,
            element_tag VARCHAR(50),
            element_id VARCHAR(100),
            element_class VARCHAR(150),
            element_text VARCHAR(255),
            target_href VARCHAR(255),
            clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cur.execute("CREATE INDEX IF NOT EXISTS idx_clicks_date ON site_clicks(clicked_at DESC)")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_clicks_text ON site_clicks(element_text)")

    # 5. Table des articles / actualités
    cur.execute("""
        CREATE TABLE IF NOT EXISTS articles (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            slug VARCHAR(255),
            category VARCHAR(100) NOT NULL,
            author VARCHAR(100) DEFAULT 'Équipe ACT''ERE',
            excerpt TEXT NOT NULL,
            content TEXT NOT NULL,
            image TEXT NOT NULL,
            published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cur.execute("CREATE INDEX IF NOT EXISTS idx_articles_date ON articles(published_at DESC)")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_articles_cat ON articles(category)")

    # Seeding initial des articles si la table est vide
    cur.execute("SELECT COUNT(*) FROM articles")
    if cur.fetchone()[0] == 0:
        cur.execute("""
            INSERT INTO articles (title, slug, category, author, excerpt, content, image, published_at)
            VALUES 
            (
                'L''énergie solaire, un levier d''autonomie pour nos terroirs',
                'energie-solaire-levier-autonomie',
                'Énergies renouvelables',
                'Kouamé Jean-Marc',
                'Comment les micro-réseaux et kits photovoltaïques revitalisent l''économie locale et la scolarisation.',
                'L''énergie solaire représente bien plus qu''une simple alternative énergétique : elle constitue le moteur d''une transformation sociale sans précédent. En équipant les centres communautaires, nous permettons aux femmes de prolonger leurs activités et aux élèves d''étudier sereinement.',
                'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1200&q=80',
                CURRENT_TIMESTAMP - INTERVAL '2 days'
            ),
            (
                'On ne va pas seulement parler environnement : on agit concrètement',
                'agir-concretement-pour-environnement',
                'Éco-citoyenneté',
                'Aïssatou Diallo',
                'Retour sur notre dernière grande opération ''Quartier Propre'' qui a réuni 200 volontaires motivés.',
                'Le temps des discours est révolu, place à l''impact concret. Notre démarche allie sensibilisation porte-à-porte, collecte participative et valorisation des déchets en partenariat avec les artisans recycleurs locaux.',
                'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80',
                CURRENT_TIMESTAMP - INTERVAL '14 days'
            ),
            (
                'Pourquoi reboiser nos villes est une urgence climatique locale',
                'pourquoi-reboiser-villes-urgence',
                'Protection environnementale',
                'Stéphane Koffi',
                'Face aux îlots de chaleur et à l''érosion pluviale, la plantation d''arbres indigènes est une solution vitale.',
                'Les arbres rafraîchissent l''atmosphère jusqu''à 4°C et absorbent l''eau de ruissellement lors des fortes pluies tropicales. Découvrez notre plan Ceinture Verte 2025 pour revitaliser nos quartiers.',
                'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
                CURRENT_TIMESTAMP - INTERVAL '25 days'
            )
        """)
        print("[OK] Articles par defaut inseres dans la base.")

    conn.commit()
    cur.close()
    conn.close()
    print("[OK] Tables 'inscriptions', 'contact_messages', 'site_visits', 'site_clicks' et 'articles' pretes.")

# ─────────────────────────────────────────────
# ENDPOINT : AUTHENTIFICATION ADMIN
# ─────────────────────────────────────────────
ADMIN_PASSWORD = "ACTEREADMIN"

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json() or {}
    password = data.get('password', '')
    if password == ADMIN_PASSWORD:
        return jsonify({'success': True, 'message': 'Authentification reussie !', 'token': 'ACTERE_AUTH_SECURE_TOKEN'}), 200
    return jsonify({'success': False, 'message': 'Mot de passe incorrect.'}), 401

# ─────────────────────────────────────────────
# ENDPOINTS : INSCRIPTIONS
# ─────────────────────────────────────────────
@app.route('/api/inscriptions', methods=['POST'])
def create_inscription():
    data = request.get_json() or {}
    nom = (data.get('nom') or '').strip()
    prenom = (data.get('prenom') or '').strip()
    email = (data.get('email') or '').strip().lower()
    motif = (data.get('motif') or '').strip()

    if not all([nom, prenom, email, motif]):
        return jsonify({'success': False, 'message': 'Tous les champs sont obligatoires.'}), 400

    motifs_valides = ['Sponsoring', 'Benevole', 'Partenariat']
    if motif not in motifs_valides:
        return jsonify({'success': False, 'message': f'Motif invalide. Choisissez parmi : {", ".join(motifs_valides)}'}), 400

    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO inscriptions (nom, prenom, email_gmail, motif) VALUES (%s, %s, %s, %s) RETURNING id, date_inscription",
            (nom, prenom, email, motif)
        )
        result = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({
            'success': True,
            'message': 'Inscription enregistree avec succes !',
            'id': result[0],
            'date_inscription': result[1].isoformat()
        }), 201
    except psycopg.errors.UniqueViolation:
        return jsonify({'success': False, 'message': 'Cet email est deja inscrit.'}), 409
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/inscriptions', methods=['GET'])
def list_inscriptions():
    try:
        conn = get_db()
        cur = conn.cursor(row_factory=psycopg.rows.dict_row)
        cur.execute("SELECT * FROM inscriptions ORDER BY date_inscription DESC")
        rows = cur.fetchall()
        cur.close()
        conn.close()
        result = []
        for row in rows:
            r = dict(row)
            r['date_inscription'] = r['date_inscription'].isoformat() if r['date_inscription'] else None
            result.append(r)
        return jsonify({'success': True, 'total': len(result), 'inscriptions': result})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/inscriptions/export', methods=['GET'])
def export_inscriptions_excel():
    try:
        conn = get_db()
        cur = conn.cursor(row_factory=psycopg.rows.dict_row)
        cur.execute("SELECT * FROM inscriptions ORDER BY date_inscription DESC")
        rows = cur.fetchall()
        cur.close()
        conn.close()

        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Inscriptions"

        green_dark = "0D2818"
        green_light = "52B75A"
        white = "FFFFFF"
        grey_row = "F0F7F0"

        ws.merge_cells('A1:F1')
        title_cell = ws['A1']
        title_cell.value = "ACT'ERE - Liste des Inscriptions"
        title_cell.font = Font(name='Calibri', bold=True, size=16, color=white)
        title_cell.fill = PatternFill("solid", fgColor=green_dark)
        title_cell.alignment = Alignment(horizontal='center', vertical='center')
        ws.row_dimensions[1].height = 35

        ws.merge_cells('A2:F2')
        subtitle = ws['A2']
        subtitle.value = f"Exporte le {datetime.datetime.now().strftime('%d/%m/%Y a %H:%M')}"
        subtitle.font = Font(name='Calibri', italic=True, size=10, color="666666")
        subtitle.fill = PatternFill("solid", fgColor="E8F5E9")
        subtitle.alignment = Alignment(horizontal='center')

        headers = ['ID', 'Nom', 'Prenom', 'Email Gmail', "Date d'inscription", 'Motif']
        for col_idx, header in enumerate(headers, 1):
            cell = ws.cell(row=3, column=col_idx, value=header)
            cell.font = Font(name='Calibri', bold=True, size=11, color=white)
            cell.fill = PatternFill("solid", fgColor=green_light)
            cell.alignment = Alignment(horizontal='center', vertical='center')
            thin = Side(style='thin', color='FFFFFF')
            cell.border = Border(left=thin, right=thin, top=thin, bottom=thin)
        ws.row_dimensions[3].height = 22

        for row_idx, row in enumerate(rows, 4):
            is_even = (row_idx % 2 == 0)
            bg_color = grey_row if is_even else white
            date_str = row['date_inscription'].strftime('%d/%m/%Y %H:%M') if row['date_inscription'] else ''
            values = [row['id'], row['nom'], row['prenom'], row['email_gmail'], date_str, row['motif']]
            for col_idx, val in enumerate(values, 1):
                cell = ws.cell(row=row_idx, column=col_idx, value=val)
                cell.fill = PatternFill("solid", fgColor=bg_color)
                cell.font = Font(name='Calibri', size=10)
                cell.alignment = Alignment(horizontal='center' if col_idx in [1, 5, 6] else 'left', vertical='center')
                thin_g = Side(style='thin', color='CCDDCC')
                cell.border = Border(left=thin_g, right=thin_g, top=thin_g, bottom=thin_g)
            ws.row_dimensions[row_idx].height = 18

        col_widths = [6, 18, 18, 30, 20, 16]
        for i, width in enumerate(col_widths, 1):
            ws.column_dimensions[get_column_letter(i)].width = width

        ws.freeze_panes = 'A4'

        total_row = max(len(rows) + 4, 5)
        ws.merge_cells(f'A{total_row}:F{total_row}')
        total_cell = ws[f'A{total_row}']
        total_cell.value = f"TOTAL : {len(rows)} inscription(s)"
        total_cell.font = Font(name='Calibri', bold=True, size=10, color=white)
        total_cell.fill = PatternFill("solid", fgColor=green_dark)
        total_cell.alignment = Alignment(horizontal='right', vertical='center')
        ws.row_dimensions[total_row].height = 20

        output = io.BytesIO()
        wb.save(output)
        output.seek(0)

        filename = f"actere_inscriptions_{datetime.datetime.now().strftime('%Y%m%d_%H%M')}.xlsx"
        return send_file(
            output,
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            as_attachment=True,
            download_name=filename
        )
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# ─────────────────────────────────────────────
# ENDPOINTS : MESSAGES DE CONTACT
# ─────────────────────────────────────────────
@app.route('/api/contact', methods=['POST'])
def create_contact():
    data = request.get_json() or {}
    name = (data.get('name') or '').strip()
    email = (data.get('email') or '').strip().lower()
    phone = (data.get('phone') or '').strip()
    subject = (data.get('subject') or 'Demande d\'information').strip()
    message = (data.get('message') or '').strip()

    if not all([name, email, message]):
        return jsonify({'success': False, 'message': 'Le nom, l\'email et le message sont obligatoires.'}), 400

    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            """INSERT INTO contact_messages (name, email, phone, subject, message)
               VALUES (%s, %s, %s, %s, %s)
               RETURNING id, created_at, status""",
            (name, email, phone, subject, message)
        )
        result = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({
            'success': True,
            'message': 'Votre message a ete enregistre avec succes ! L\'equipe ACT\'ERE vous repondra rapidement.',
            'id': result[0],
            'created_at': result[1].isoformat(),
            'status': result[2]
        }), 201
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/contact', methods=['GET'])
def list_contacts():
    try:
        conn = get_db()
        cur = conn.cursor(row_factory=psycopg.rows.dict_row)
        cur.execute("SELECT * FROM contact_messages ORDER BY created_at DESC")
        rows = cur.fetchall()
        cur.close()
        conn.close()
        result = []
        for row in rows:
            r = dict(row)
            r['created_at'] = r['created_at'].isoformat() if r['created_at'] else None
            result.append(r)
        return jsonify({'success': True, 'total': len(result), 'messages': result})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/contact/<int:msg_id>/status', methods=['PATCH'])
def update_contact_status(msg_id):
    data = request.get_json() or {}
    new_status = data.get('status', '').strip()
    if new_status not in ['non_lu', 'en_cours', 'traite']:
        return jsonify({'success': False, 'message': 'Statut invalide (choix: non_lu, en_cours, traite)'}), 400

    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute("UPDATE contact_messages SET status = %s WHERE id = %s RETURNING id", (new_status, msg_id))
        row = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        if not row:
            return jsonify({'success': False, 'message': 'Message introuvable.'}), 404
        return jsonify({'success': True, 'message': f'Statut mis a jour ({new_status})'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/contact/export', methods=['GET'])
def export_contact_excel():
    try:
        conn = get_db()
        cur = conn.cursor(row_factory=psycopg.rows.dict_row)
        cur.execute("SELECT * FROM contact_messages ORDER BY created_at DESC")
        rows = cur.fetchall()
        cur.close()
        conn.close()

        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Messages de Contact"

        green_dark = "0D2818"
        green_light = "52B75A"
        white = "FFFFFF"
        grey_row = "F0F7F0"

        ws.merge_cells('A1:G1')
        title_cell = ws['A1']
        title_cell.value = "ACT'ERE - Messages & Demandes de Contact"
        title_cell.font = Font(name='Calibri', bold=True, size=16, color=white)
        title_cell.fill = PatternFill("solid", fgColor=green_dark)
        title_cell.alignment = Alignment(horizontal='center', vertical='center')
        ws.row_dimensions[1].height = 35

        ws.merge_cells('A2:G2')
        subtitle = ws['A2']
        subtitle.value = f"Exporte le {datetime.datetime.now().strftime('%d/%m/%Y a %H:%M')}"
        subtitle.font = Font(name='Calibri', italic=True, size=10, color="666666")
        subtitle.fill = PatternFill("solid", fgColor="E8F5E9")
        subtitle.alignment = Alignment(horizontal='center')

        headers = ['ID', 'Nom & Prénoms', 'Email', 'Téléphone', 'Objet', 'Message', 'Date & Heure', 'Statut']
        for col_idx, header in enumerate(headers, 1):
            cell = ws.cell(row=3, column=col_idx, value=header)
            cell.font = Font(name='Calibri', bold=True, size=11, color=white)
            cell.fill = PatternFill("solid", fgColor=green_light)
            cell.alignment = Alignment(horizontal='center', vertical='center')
            thin = Side(style='thin', color='FFFFFF')
            cell.border = Border(left=thin, right=thin, top=thin, bottom=thin)
        ws.row_dimensions[3].height = 22

        for row_idx, row in enumerate(rows, 4):
            is_even = (row_idx % 2 == 0)
            bg_color = grey_row if is_even else white
            date_str = row['created_at'].strftime('%d/%m/%Y %H:%M') if row['created_at'] else ''
            values = [
                row['id'],
                row['name'],
                row['email'],
                row['phone'] or '',
                row['subject'],
                row['message'],
                date_str,
                row['status']
            ]
            for col_idx, val in enumerate(values, 1):
                cell = ws.cell(row=row_idx, column=col_idx, value=val)
                cell.fill = PatternFill("solid", fgColor=bg_color)
                cell.font = Font(name='Calibri', size=10)
                cell.alignment = Alignment(horizontal='center' if col_idx in [1, 4, 7, 8] else 'left', vertical='center')
                thin_g = Side(style='thin', color='CCDDCC')
                cell.border = Border(left=thin_g, right=thin_g, top=thin_g, bottom=thin_g)
            ws.row_dimensions[row_idx].height = 22

        col_widths = [6, 22, 28, 18, 25, 45, 18, 14]
        for i, width in enumerate(col_widths, 1):
            ws.column_dimensions[get_column_letter(i)].width = width

        ws.freeze_panes = 'A4'

        total_row = max(len(rows) + 4, 5)
        ws.merge_cells(f'A{total_row}:H{total_row}')
        total_cell = ws[f'A{total_row}']
        total_cell.value = f"TOTAL : {len(rows)} message(s) de contact"
        total_cell.font = Font(name='Calibri', bold=True, size=10, color=white)
        total_cell.fill = PatternFill("solid", fgColor=green_dark)
        total_cell.alignment = Alignment(horizontal='right', vertical='center')
        ws.row_dimensions[total_row].height = 20

        output = io.BytesIO()
        wb.save(output)
        output.seek(0)

        filename = f"actere_messages_contact_{datetime.datetime.now().strftime('%Y%m%d_%H%M')}.xlsx"
        return send_file(
            output,
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            as_attachment=True,
            download_name=filename
        )
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# ─────────────────────────────────────────────
# ENDPOINTS : ANALYTICS & SUIVI DU TRAFIC
# ─────────────────────────────────────────────
@app.route('/api/analytics/visit', methods=['POST'])
def track_visit():
    data = request.get_json(silent=True) or request.get_json(force=True, silent=True) or {}
    visitor_id = (data.get('visitor_id') or 'anon').strip()[:64]
    session_id = (data.get('session_id') or 'anon').strip()[:64]
    page_url = (data.get('page_url') or request.path).strip()[:255]
    page_title = (data.get('page_title') or '').strip()[:255]
    referrer = (data.get('referrer') or '').strip()[:255]
    device_type = (data.get('device_type') or 'Desktop').strip()[:50]
    browser = (data.get('browser') or 'Autre').strip()[:50]
    os_name = (data.get('os') or 'Autre').strip()[:50]
    screen_resolution = (data.get('screen_resolution') or '').strip()[:30]
    client_tz = (data.get('timezone') or '').strip()[:100]

    client_ip = get_client_ip()[:45]
    geo = resolve_geoip(client_ip, client_tz)

    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO site_visits 
            (visitor_id, session_id, page_url, page_title, referrer, device_type, browser, os, screen_resolution, ip_address, country, country_code, city, region, timezone)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
        """, (
            visitor_id, session_id, page_url, page_title, referrer,
            device_type, browser, os_name, screen_resolution,
            client_ip, geo.get('country') or '', geo.get('country_code') or '',
            geo.get('city') or '', geo.get('region') or '', geo.get('timezone') or client_tz
        ))
        visit_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'success': True, 'visit_id': visit_id, 'geo': geo}), 201
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/analytics/click', methods=['POST'])
def track_click():
    data = request.get_json(silent=True) or request.get_json(force=True, silent=True) or {}
    visitor_id = (data.get('visitor_id') or 'anon').strip()[:64]
    session_id = (data.get('session_id') or 'anon').strip()[:64]
    page_url = (data.get('page_url') or '').strip()[:255]
    element_tag = (data.get('element_tag') or '').strip()[:50]
    element_id = (data.get('element_id') or '').strip()[:100]
    element_class = (data.get('element_class') or '').strip()[:150]
    element_text = (data.get('element_text') or '').strip()[:255]
    target_href = (data.get('target_href') or '').strip()[:255]

    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO site_clicks 
            (visitor_id, session_id, page_url, element_tag, element_id, element_class, element_text, target_href)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
        """, (visitor_id, session_id, page_url, element_tag, element_id, element_class, element_text, target_href))
        click_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'success': True, 'click_id': click_id}), 201
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/analytics/stats', methods=['GET'])
def get_analytics_stats():
    try:
        conn = get_db()
        cur = conn.cursor(row_factory=psycopg.rows.dict_row)

        # 1. Totaux globaux
        cur.execute("""
            SELECT 
                COUNT(*) as total_visits,
                COUNT(DISTINCT visitor_id) as total_unique_visitors,
                COUNT(*) FILTER (WHERE visited_at::date = CURRENT_DATE) as today_visits,
                COUNT(DISTINCT visitor_id) FILTER (WHERE visited_at::date = CURRENT_DATE) as today_unique_visitors,
                COUNT(*) FILTER (WHERE date_trunc('month', visited_at) = date_trunc('month', CURRENT_DATE)) as month_visits,
                COUNT(DISTINCT visitor_id) FILTER (WHERE date_trunc('month', visited_at) = date_trunc('month', CURRENT_DATE)) as month_unique_visitors
            FROM site_visits
        """)
        totals = dict(cur.fetchone() or {})

        # Total clicks
        cur.execute("SELECT COUNT(*) as total_clicks FROM site_clicks")
        totals['total_clicks'] = cur.fetchone()['total_clicks']

        # 2. Visites par jour (30 derniers jours)
        cur.execute("""
            SELECT 
                visited_at::date as day,
                COUNT(*) as visits,
                COUNT(DISTINCT visitor_id) as unique_visitors
            FROM site_visits
            WHERE visited_at >= CURRENT_DATE - INTERVAL '30 days'
            GROUP BY visited_at::date
            ORDER BY visited_at::date ASC
        """)
        daily_raw = cur.fetchall()
        daily = [{'day': r['day'].strftime('%d/%m'), 'raw_date': r['day'].isoformat(), 'visits': r['visits'], 'unique_visitors': r['unique_visitors']} for r in daily_raw]

        # 3. Visites par mois (12 derniers mois)
        cur.execute("""
            SELECT 
                to_char(visited_at, 'YYYY-MM') as month_key,
                to_char(visited_at, 'TMMonth YYYY') as month_label,
                COUNT(*) as visits,
                COUNT(DISTINCT visitor_id) as unique_visitors
            FROM site_visits
            WHERE visited_at >= CURRENT_DATE - INTERVAL '12 months'
            GROUP BY to_char(visited_at, 'YYYY-MM'), to_char(visited_at, 'TMMonth YYYY')
            ORDER BY month_key ASC
        """)
        monthly_raw = cur.fetchall()
        monthly = [{'month_key': r['month_key'], 'month_label': r['month_label'], 'visits': r['visits'], 'unique_visitors': r['unique_visitors']} for r in monthly_raw]

        # 4. Top pages
        cur.execute("""
            SELECT page_url, COALESCE(NULLIF(page_title, ''), page_url) as page_title, COUNT(*) as visits
            FROM site_visits
            GROUP BY page_url, page_title
            ORDER BY visits DESC
            LIMIT 8
        """)
        top_pages = [dict(r) for r in cur.fetchall()]

        # 5. Top clics / interactions
        cur.execute("""
            SELECT 
                element_text, 
                element_tag, 
                page_url, 
                COUNT(*) as clicks
            FROM site_clicks
            WHERE element_text IS NOT NULL AND element_text != ''
            GROUP BY element_text, element_tag, page_url
            ORDER BY clicks DESC
            LIMIT 10
        """)
        top_clicks = [dict(r) for r in cur.fetchall()]

        # 6. Répartition Appareils
        cur.execute("""
            SELECT device_type, COUNT(*) as count
            FROM site_visits
            GROUP BY device_type
            ORDER BY count DESC
        """)
        devices = [dict(r) for r in cur.fetchall()]

        # 7. Répartition Navigateurs
        cur.execute("""
            SELECT browser, COUNT(*) as count
            FROM site_visits
            GROUP BY browser
            ORDER BY count DESC
            LIMIT 6
        """)
        browsers = [dict(r) for r in cur.fetchall()]

        # 8. Répartition Géographique (Top Pays & Top Villes)
        cur.execute("""
            SELECT 
                COALESCE(NULLIF(country, ''), 'Non spécifié') as country,
                COALESCE(NULLIF(country_code, ''), '') as country_code,
                COUNT(*) as visits,
                COUNT(DISTINCT visitor_id) as unique_visitors
            FROM site_visits
            WHERE country IS NOT NULL AND country != ''
            GROUP BY country, country_code
            ORDER BY visits DESC
            LIMIT 10
        """)
        countries = [dict(r) for r in cur.fetchall()]

        cur.execute("""
            SELECT 
                city,
                COALESCE(NULLIF(country, ''), 'Non spécifié') as country,
                COALESCE(NULLIF(country_code, ''), '') as country_code,
                COUNT(*) as visits
            FROM site_visits
            WHERE city IS NOT NULL AND city != ''
            GROUP BY city, country, country_code
            ORDER BY visits DESC
            LIMIT 10
        """)
        cities = [dict(r) for r in cur.fetchall()]

        # 9. Visites récentes (dernières 20)
        cur.execute("""
            SELECT id, page_url, page_title, device_type, browser, os, ip_address, country, country_code, city, region, visited_at
            FROM site_visits
            ORDER BY visited_at DESC
            LIMIT 20
        """)
        recent_visits_raw = cur.fetchall()
        recent_visits = []
        for r in recent_visits_raw:
            item = dict(r)
            item['visited_at'] = item['visited_at'].isoformat() if item['visited_at'] else None
            recent_visits.append(item)

        cur.close()
        conn.close()

        return jsonify({
            'success': True,
            'totals': totals,
            'daily': daily,
            'monthly': monthly,
            'top_pages': top_pages,
            'top_clicks': top_clicks,
            'devices': devices,
            'browsers': browsers,
            'countries': countries,
            'cities': cities,
            'recent_visits': recent_visits
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/analytics/export', methods=['GET'])
def export_analytics_excel():
    try:
        conn = get_db()
        cur = conn.cursor(row_factory=psycopg.rows.dict_row)

        wb = openpyxl.Workbook()

        green_dark = "0D2818"
        green_light = "52B75A"
        white = "FFFFFF"
        grey_row = "F0F7F0"
        header_fill = PatternFill("solid", fgColor=green_light)
        title_fill = PatternFill("solid", fgColor=green_dark)
        sub_fill = PatternFill("solid", fgColor="E8F5E9")
        thin_border = Border(left=Side(style='thin', color='CCCCCC'),
                             right=Side(style='thin', color='CCCCCC'),
                             top=Side(style='thin', color='CCCCCC'),
                             bottom=Side(style='thin', color='CCCCCC'))

        # ─── ONGLET 1 : SYNTHÈSE GLOBALE & PAR JOUR ───
        ws1 = wb.active
        ws1.title = "Visites par Jour"

        ws1.merge_cells('A1:D1')
        t1 = ws1['A1']
        t1.value = "ACT'ERE - Statistiques des Visites par Jour"
        t1.font = Font(name='Calibri', bold=True, size=15, color=white)
        t1.fill = title_fill
        t1.alignment = Alignment(horizontal='center', vertical='center')
        ws1.row_dimensions[1].height = 32

        ws1.merge_cells('A2:D2')
        st1 = ws1['A2']
        st1.value = f"Généré le {datetime.datetime.now().strftime('%d/%m/%Y à %H:%M')}"
        st1.font = Font(name='Calibri', italic=True, size=10, color="555555")
        st1.fill = sub_fill
        st1.alignment = Alignment(horizontal='center')

        headers1 = ['Date', 'Visites Totales', 'Visiteurs Uniques', 'Ratio Visites/Visiteur']
        for col, h in enumerate(headers1, 1):
            c = ws1.cell(row=3, column=col, value=h)
            c.font = Font(name='Calibri', bold=True, size=11, color=white)
            c.fill = header_fill
            c.alignment = Alignment(horizontal='center', vertical='center')
        ws1.row_dimensions[3].height = 22

        cur.execute("""
            SELECT visited_at::date as day, COUNT(*) as visits, COUNT(DISTINCT visitor_id) as uniq
            FROM site_visits
            GROUP BY visited_at::date
            ORDER BY visited_at::date DESC
        """)
        day_rows = cur.fetchall()

        for idx, row in enumerate(day_rows, 4):
            bg = grey_row if idx % 2 == 0 else white
            ratio = round(row['visits'] / row['uniq'], 2) if row['uniq'] > 0 else 1
            vals = [row['day'].strftime('%d/%m/%Y'), row['visits'], row['uniq'], ratio]
            for col, val in enumerate(vals, 1):
                cell = ws1.cell(row=idx, column=col, value=val)
                cell.fill = PatternFill("solid", fgColor=bg)
                cell.border = thin_border
                cell.alignment = Alignment(horizontal='center', vertical='center')

        for i, w in enumerate([18, 18, 20, 24], 1):
            ws1.column_dimensions[get_column_letter(i)].width = w

        # ─── ONGLET 2 : VISITES PAR MOIS ───
        ws2 = wb.create_sheet(title="Visites par Mois")
        ws2.merge_cells('A1:C1')
        t2 = ws2['A1']
        t2.value = "ACT'ERE - Statistiques des Visites par Mois"
        t2.font = Font(name='Calibri', bold=True, size=15, color=white)
        t2.fill = title_fill
        t2.alignment = Alignment(horizontal='center', vertical='center')
        ws2.row_dimensions[1].height = 32

        headers2 = ['Mois', 'Visites Totales', 'Visiteurs Uniques']
        for col, h in enumerate(headers2, 1):
            c = ws2.cell(row=3, column=col, value=h)
            c.font = Font(name='Calibri', bold=True, size=11, color=white)
            c.fill = header_fill
            c.alignment = Alignment(horizontal='center', vertical='center')

        cur.execute("""
            SELECT to_char(visited_at, 'YYYY-MM') as m_key, to_char(visited_at, 'TMMonth YYYY') as m_label, COUNT(*) as visits, COUNT(DISTINCT visitor_id) as uniq
            FROM site_visits
            GROUP BY 1, 2
            ORDER BY m_key DESC
        """)
        month_rows = cur.fetchall()
        for idx, row in enumerate(month_rows, 4):
            bg = grey_row if idx % 2 == 0 else white
            vals = [row['m_label'] or row['m_key'], row['visits'], row['uniq']]
            for col, val in enumerate(vals, 1):
                cell = ws2.cell(row=idx, column=col, value=val)
                cell.fill = PatternFill("solid", fgColor=bg)
                cell.border = thin_border
                cell.alignment = Alignment(horizontal='center', vertical='center')

        for i, w in enumerate([22, 18, 20], 1):
            ws2.column_dimensions[get_column_letter(i)].width = w

        # ─── ONGLET 3 : TOP CLICS & INTERACTIONS ───
        ws3 = wb.create_sheet(title="Clics & Interactions")
        ws3.merge_cells('A1:E1')
        t3 = ws3['A1']
        t3.value = "ACT'ERE - Éléments & Boutons les Plus Cliqués"
        t3.font = Font(name='Calibri', bold=True, size=15, color=white)
        t3.fill = title_fill
        t3.alignment = Alignment(horizontal='center', vertical='center')
        ws3.row_dimensions[1].height = 32

        headers3 = ['ID', 'Texte de l\'élément / Bouton', 'Balise', 'Page d\'origine', 'Nombre de Clics']
        for col, h in enumerate(headers3, 1):
            c = ws3.cell(row=3, column=col, value=h)
            c.font = Font(name='Calibri', bold=True, size=11, color=white)
            c.fill = header_fill
            c.alignment = Alignment(horizontal='center', vertical='center')

        cur.execute("""
            SELECT element_text, element_tag, page_url, COUNT(*) as clicks
            FROM site_clicks
            WHERE element_text IS NOT NULL AND element_text != ''
            GROUP BY element_text, element_tag, page_url
            ORDER BY clicks DESC
        """)
        click_rows = cur.fetchall()
        for idx, row in enumerate(click_rows, 4):
            bg = grey_row if idx % 2 == 0 else white
            vals = [idx - 3, row['element_text'], row['element_tag'], row['page_url'], row['clicks']]
            for col, val in enumerate(vals, 1):
                cell = ws3.cell(row=idx, column=col, value=val)
                cell.fill = PatternFill("solid", fgColor=bg)
                cell.border = thin_border
                cell.alignment = Alignment(horizontal='left' if col == 2 else 'center', vertical='center')

        for i, w in enumerate([8, 35, 14, 25, 18], 1):
            ws3.column_dimensions[get_column_letter(i)].width = w

        # ─── ONGLET 4 : LOCALISATION GÉOGRAPHIQUE ───
        ws4 = wb.create_sheet(title="Géolocalisation")
        ws4.merge_cells('A1:D1')
        t4 = ws4['A1']
        t4.value = "ACT'ERE - Répartition Géographique des Visiteurs"
        t4.font = Font(name='Calibri', bold=True, size=15, color=white)
        t4.fill = title_fill
        t4.alignment = Alignment(horizontal='center', vertical='center')
        ws4.row_dimensions[1].height = 32

        headers4 = ['Rang', 'Pays / Territoire', 'Code Pays', 'Nombre de Visites']
        for col, h in enumerate(headers4, 1):
            c = ws4.cell(row=3, column=col, value=h)
            c.font = Font(name='Calibri', bold=True, size=11, color=white)
            c.fill = header_fill
            c.alignment = Alignment(horizontal='center', vertical='center')

        cur.execute("""
            SELECT COALESCE(NULLIF(country, ''), 'Non spécifié') as country,
                   COALESCE(NULLIF(country_code, ''), '') as country_code,
                   COUNT(*) as visits
            FROM site_visits
            GROUP BY country, country_code
            ORDER BY visits DESC
        """)
        geo_rows = cur.fetchall()
        for idx, row in enumerate(geo_rows, 4):
            bg = grey_row if idx % 2 == 0 else white
            vals = [idx - 3, row['country'], row['country_code'], row['visits']]
            for col, val in enumerate(vals, 1):
                cell = ws4.cell(row=idx, column=col, value=val)
                cell.fill = PatternFill("solid", fgColor=bg)
                cell.border = thin_border
                cell.alignment = Alignment(horizontal='left' if col == 2 else 'center', vertical='center')

        for i, w in enumerate([8, 30, 15, 20], 1):
            ws4.column_dimensions[get_column_letter(i)].width = w

        cur.close()
        conn.close()

        output = io.BytesIO()
        wb.save(output)
        output.seek(0)

        filename = f"actere_statistiques_trafic_{datetime.datetime.now().strftime('%Y%m%d_%H%M')}.xlsx"
        return send_file(
            output,
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            as_attachment=True,
            download_name=filename
        )
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# ─────────────────────────────────────────────
# ENDPOINTS : ARTICLES & ACTUALITÉS
# ─────────────────────────────────────────────
FRENCH_MONTHS = {
    1: 'Janvier', 2: 'Février', 3: 'Mars', 4: 'Avril', 5: 'Mai', 6: 'Juin',
    7: 'Juillet', 8: 'Août', 9: 'Septembre', 10: 'Octobre', 11: 'Novembre', 12: 'Décembre'
}

def format_french_date(dt):
    if not dt:
        return ''
    return f"{dt.day} {FRENCH_MONTHS.get(dt.month, '')} {dt.year}"

@app.route('/api/articles', methods=['GET'])
def list_articles():
    try:
        limit = request.args.get('limit', type=int)
        category = request.args.get('category', type=str)
        conn = get_db()
        cur = conn.cursor(row_factory=psycopg.rows.dict_row)
        
        query = "SELECT * FROM articles"
        params = []
        if category:
            query += " WHERE category = %s"
            params.append(category)
        query += " ORDER BY published_at DESC"
        if limit:
            query += " LIMIT %s"
            params.append(limit)
            
        cur.execute(query, params)
        rows = cur.fetchall()
        cur.close()
        conn.close()
        
        result = []
        for row in rows:
            r = dict(row)
            dt = r['published_at']
            r['published_at_iso'] = dt.isoformat() if dt else None
            r['date_formatted'] = format_french_date(dt) if dt else ''
            r['date'] = r['date_formatted']  # Compatible avec le template frontend
            result.append(r)
        return jsonify({'success': True, 'total': len(result), 'articles': result})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/articles/<int:article_id>', methods=['GET'])
def get_article(article_id):
    try:
        conn = get_db()
        cur = conn.cursor(row_factory=psycopg.rows.dict_row)
        cur.execute("SELECT * FROM articles WHERE id = %s", (article_id,))
        row = cur.fetchone()
        cur.close()
        conn.close()
        if not row:
            return jsonify({'success': False, 'message': 'Article introuvable'}), 404
        r = dict(row)
        dt = r['published_at']
        r['published_at_iso'] = dt.isoformat() if dt else None
        r['date_formatted'] = format_french_date(dt) if dt else ''
        r['date'] = r['date_formatted']
        return jsonify({'success': True, 'article': r})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/articles', methods=['POST'])
def create_article():
    try:
        import uuid
        import re

        title = ''
        category = 'Sensibilisation'
        author = 'Équipe ACT\'ERE'
        excerpt = ''
        content = ''
        image_url = ''

        if request.content_type and 'multipart/form-data' in request.content_type:
            title = (request.form.get('title') or '').strip()
            category = (request.form.get('category') or 'Sensibilisation').strip()
            author = (request.form.get('author') or 'Équipe ACT\'ERE').strip()
            excerpt = (request.form.get('excerpt') or '').strip()
            content = (request.form.get('content') or '').strip()
            image_url = (request.form.get('image_url') or '').strip()
            
            # Gestion de l'upload d'image unique
            if 'image_file' in request.files and request.files['image_file'].filename:
                file = request.files['image_file']
                if file and allowed_file(file.filename):
                    ext = file.filename.rsplit('.', 1)[1].lower()
                    unique_name = f"art_{int(datetime.datetime.now().timestamp())}_{uuid.uuid4().hex[:6]}.{ext}"
                    filepath = os.path.join(UPLOAD_FOLDER, unique_name)
                    file.save(filepath)
                    image_url = f"/uploads/{unique_name}"
        else:
            data = request.get_json() or {}
            title = (data.get('title') or '').strip()
            category = (data.get('category') or 'Sensibilisation').strip()
            author = (data.get('author') or 'Équipe ACT\'ERE').strip()
            excerpt = (data.get('excerpt') or '').strip()
            content = (data.get('content') or '').strip()
            image_url = (data.get('image_url') or '').strip()

        if not title:
            return jsonify({'success': False, 'message': 'Le titre de l\'article est obligatoire.'}), 400
        if not excerpt:
            return jsonify({'success': False, 'message': 'Le résumé de l\'article est obligatoire.'}), 400
        if not content:
            return jsonify({'success': False, 'message': 'Le contenu détaillé de l\'article est obligatoire.'}), 400

        if not image_url:
            image_url = "hero-bg.jpg"

        slug = re.sub(r'[^a-zA-Z0-9]+', '-', title.lower()).strip('-')
        if not slug:
            slug = f"article-{int(datetime.datetime.now().timestamp())}"

        conn = get_db()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO articles (title, slug, category, author, excerpt, content, image, published_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP)
            RETURNING id, published_at
        """, (title, slug, category, author, excerpt, content, image_url))
        row = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()

        return jsonify({
            'success': True,
            'message': 'Article publié avec succès !',
            'id': row[0],
            'published_at': row[1].isoformat() if row[1] else None,
            'image': image_url
        }), 201
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/articles/<int:article_id>', methods=['PUT', 'POST'])
def update_article(article_id):
    try:
        import uuid
        title = ''
        category = ''
        author = ''
        excerpt = ''
        content = ''
        image_url = ''

        if request.content_type and 'multipart/form-data' in request.content_type:
            title = (request.form.get('title') or '').strip()
            category = (request.form.get('category') or '').strip()
            author = (request.form.get('author') or '').strip()
            excerpt = (request.form.get('excerpt') or '').strip()
            content = (request.form.get('content') or '').strip()
            image_url = (request.form.get('image_url') or '').strip()
            
            if 'image_file' in request.files and request.files['image_file'].filename:
                file = request.files['image_file']
                if file and allowed_file(file.filename):
                    ext = file.filename.rsplit('.', 1)[1].lower()
                    unique_name = f"art_{int(datetime.datetime.now().timestamp())}_{uuid.uuid4().hex[:6]}.{ext}"
                    filepath = os.path.join(UPLOAD_FOLDER, unique_name)
                    file.save(filepath)
                    image_url = f"/uploads/{unique_name}"
        else:
            data = request.get_json() or {}
            title = (data.get('title') or '').strip()
            category = (data.get('category') or '').strip()
            author = (data.get('author') or '').strip()
            excerpt = (data.get('excerpt') or '').strip()
            content = (data.get('content') or '').strip()
            image_url = (data.get('image_url') or '').strip()

        if not title or not excerpt or not content:
            return jsonify({'success': False, 'message': 'Le titre, le résumé et le contenu sont obligatoires.'}), 400

        conn = get_db()
        cur = conn.cursor()
        
        if image_url:
            cur.execute("""
                UPDATE articles 
                SET title = %s, category = %s, author = %s, excerpt = %s, content = %s, image = %s
                WHERE id = %s
                RETURNING id
            """, (title, category, author, excerpt, content, image_url, article_id))
        else:
            cur.execute("""
                UPDATE articles 
                SET title = %s, category = %s, author = %s, excerpt = %s, content = %s
                WHERE id = %s
                RETURNING id
            """, (title, category, author, excerpt, content, article_id))
            
        row = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()

        if not row:
            return jsonify({'success': False, 'message': 'Article introuvable.'}), 404

        return jsonify({'success': True, 'message': 'Article mis à jour avec succès !'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/articles/<int:article_id>', methods=['DELETE'])
def delete_article(article_id):
    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute("DELETE FROM articles WHERE id = %s RETURNING id", (article_id,))
        row = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        if not row:
            return jsonify({'success': False, 'message': 'Article introuvable.'}), 404
        return jsonify({'success': True, 'message': 'Article supprimé avec succès !'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# ─────────────────────────────────────────────
# HEALTH CHECK
# ─────────────────────────────────────────────
@app.route('/api/health', methods=['GET'])
def health():
    try:
        conn = get_db()
        conn.close()
        return jsonify({'status': 'OK', 'message': "Backend ACT'ERE operationnel", 'db': 'connected'})
    except Exception as e:
        return jsonify({'status': 'WARNING', 'message': "Backend actif mais BDD inaccessible", 'error': str(e)}), 200

# Initialisation automatique au demarrage (utile en production avec Gunicorn)
try:
    init_db()
except Exception as _e:
    print(f"[INFO] BDD non initialisee au chargement : {_e}")

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print("==============================================")
    print("   ACT'ERE - Backend Flask + PostgreSQL")
    print("==============================================")
    print(f"Demarrage du serveur sur http://localhost:{port}")
    print(f"Portail Public  : http://localhost:{port}/")
    print(f"Portail Admin   : http://localhost:{port}/portail-prive-actere")
    print("Pour arreter : CTRL+C")
    app.run(debug=False, host='0.0.0.0', port=port)