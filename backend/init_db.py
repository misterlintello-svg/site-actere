# -*- coding: utf-8 -*-
"""
Script d initialisation de la base de donnees ACT ERE.
Executez ce script une seule fois pour creer la base et les tables.
Usage : python init_db.py
"""
import psycopg
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def main():
    print("=== Initialisation de la base de donnees ACT ERE ===")
    print()

    from config import DB_CONFIG
    cfg = DB_CONFIG.copy()

    print(f"Connexion a PostgreSQL sur {cfg['host']}:{cfg['port']} en tant que '{cfg['user']}'...")
    print()

    # Etape 1 : Creer la base actere_db
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
            print("[OK] Base de donnees 'actere_db' creee avec succes.")
        else:
            print("[OK] La base 'actere_db' existe deja.")
        cur.close()
        conn.close()
    except psycopg.OperationalError as e:
        print()
        print(f"[ERREUR] Impossible de se connecter a PostgreSQL :")
        print(f"  {e}")
        print()
        print("Solutions :")
        print("  1. Verifiez que PostgreSQL est demarre (Services Windows)")
        print("  2. Modifiez le mot de passe dans backend/config.py")
        sys.exit(1)

    # Etape 2 : Creer les tables
    cfg['database'] = 'actere_db'
    conn = psycopg.connect(
        host=cfg['host'], port=cfg['port'],
        dbname='actere_db',
        user=cfg['user'], password=cfg['password']
    )
    cur = conn.cursor()

    # 1. Table inscriptions
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
    print("[OK] Table 'inscriptions' creee et prete.")

    # 2. Table contact_messages
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
    print("[OK] Table 'contact_messages' creee et prete.")

    conn.commit()
    print()
    print("Initialisation terminee avec succes !")
    print("Lancez maintenant : demarrer_serveur.bat")
    cur.close()
    conn.close()

if __name__ == '__main__':
    main()