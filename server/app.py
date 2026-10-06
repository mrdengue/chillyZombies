"""
Chilly Zombies - Online High Scores API
Simple Flask server for global leaderboard
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Allow requests from game

DATABASE = 'highscores.db'
MAX_HIGHSCORES = 100  # Keep top 100 scores
MAX_SCORE_LIMIT = 999999  # Basic anti-cheat: reject unrealistic scores
MIN_LEVEL = 1
MAX_LEVEL = 34  # Game has 34 levels

def get_db():
    """Get database connection"""
    db = sqlite3.connect(DATABASE)
    db.row_factory = sqlite3.Row
    return db

def init_db():
    """Initialize database with high scores table"""
    with app.app_context():
        db = get_db()
        db.execute('''
            CREATE TABLE IF NOT EXISTS highscores (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                score INTEGER NOT NULL,
                level INTEGER NOT NULL,
                timestamp TEXT NOT NULL,
                ip_address TEXT
            )
        ''')
        db.execute('CREATE INDEX IF NOT EXISTS idx_score ON highscores(score DESC)')
        db.commit()
        db.close()

@app.route('/api/highscores', methods=['GET'])
def get_highscores():
    """Get top high scores"""
    try:
        limit = request.args.get('limit', 10, type=int)
        limit = min(limit, MAX_HIGHSCORES)  # Cap at MAX_HIGHSCORES

        db = get_db()
        scores = db.execute(
            'SELECT name, score, level, timestamp FROM highscores ORDER BY score DESC LIMIT ?',
            (limit,)
        ).fetchall()
        db.close()

        result = [dict(row) for row in scores]
        return jsonify(result), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/highscores', methods=['POST'])
def add_highscore():
    """Add a new high score"""
    try:
        data = request.get_json()

        # Validate required fields
        if not data or 'name' not in data or 'score' not in data or 'level' not in data:
            return jsonify({'error': 'Missing required fields: name, score, level'}), 400

        name = data['name'].strip().upper()[:3]  # 3 characters max
        score = int(data['score'])
        level = int(data['level'])

        # Basic validation
        if len(name) != 3:
            return jsonify({'error': 'Name must be exactly 3 characters'}), 400

        if not name.isalpha():
            return jsonify({'error': 'Name must contain only letters'}), 400

        # Anti-cheat: basic score validation
        if score < 0 or score > MAX_SCORE_LIMIT:
            return jsonify({'error': 'Invalid score'}), 400

        if level < MIN_LEVEL or level > MAX_LEVEL:
            return jsonify({'error': 'Invalid level'}), 400

        # Get IP for basic rate limiting tracking
        ip_address = request.remote_addr
        timestamp = datetime.utcnow().isoformat()

        # Insert score
        db = get_db()
        cursor = db.execute(
            'INSERT INTO highscores (name, score, level, timestamp, ip_address) VALUES (?, ?, ?, ?, ?)',
            (name, score, level, timestamp, ip_address)
        )
        score_id = cursor.lastrowid

        # Keep only top MAX_HIGHSCORES
        db.execute('''
            DELETE FROM highscores
            WHERE id NOT IN (
                SELECT id FROM highscores ORDER BY score DESC LIMIT ?
            )
        ''', (MAX_HIGHSCORES,))

        db.commit()

        # Check rank
        rank = db.execute(
            'SELECT COUNT(*) + 1 FROM highscores WHERE score > ?',
            (score,)
        ).fetchone()[0]

        db.close()

        return jsonify({
            'success': True,
            'rank': rank,
            'id': score_id
        }), 201

    except ValueError:
        return jsonify({'error': 'Invalid data format'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/status', methods=['GET'])
def status():
    """Health check endpoint"""
    db = get_db()
    count = db.execute('SELECT COUNT(*) FROM highscores').fetchone()[0]
    db.close()

    return jsonify({
        'status': 'online',
        'total_scores': count,
        'max_scores': MAX_HIGHSCORES
    }), 200

if __name__ == '__main__':
    # Initialize database
    if not os.path.exists(DATABASE):
        init_db()
        print(f'✓ Database created: {DATABASE}')

    print('🚀 Chilly Zombies High Score Server')
    print('📊 Endpoints:')
    print('   GET  /api/highscores - Get top scores')
    print('   POST /api/highscores - Submit new score')
    print('   GET  /api/status - Server status')
    print('')

    # Run server
    app.run(host='0.0.0.0', port=5000, debug=True)
