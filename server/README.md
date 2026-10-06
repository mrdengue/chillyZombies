# Chilly Zombies - Online High Scores Server

Servidor Flask simple para leaderboard global.

## 🚀 Instalación

```bash
cd server
python3 -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## ▶️ Ejecutar

```bash
python app.py
```

El servidor corre en `http://localhost:5000`

## 📡 Endpoints

### GET /api/highscores
Obtiene los mejores puntajes.

**Query params:**
- `limit` (opcional): Número de scores a retornar (default: 10, max: 100)

**Respuesta:**
```json
[
  {
    "name": "AAA",
    "score": 50000,
    "level": 10,
    "timestamp": "2025-11-28T12:00:00"
  },
  ...
]
```

### POST /api/highscores
Envía un nuevo puntaje.

**Body:**
```json
{
  "name": "AAA",
  "score": 50000,
  "level": 10
}
```

**Respuesta:**
```json
{
  "success": true,
  "rank": 5,
  "id": 123
}
```

### GET /api/status
Estado del servidor.

**Respuesta:**
```json
{
  "status": "online",
  "total_scores": 42,
  "max_scores": 100
}
```

## 🛡️ Validación Anti-Cheating

- Score máximo: 999,999
- Nivel válido: 1-34
- Nombre: exactamente 3 letras
- Solo letras A-Z permitidas
- Rate limiting por IP (básico)

## 💾 Base de Datos

SQLite: `highscores.db`
- Se crea automáticamente al iniciar
- Mantiene top 100 scores
- Índice en score para queries rápidas

## 🌐 Despliegue

Para producción:
1. Usar gunicorn: `gunicorn app:app`
2. Configurar nginx como reverse proxy
3. Usar PostgreSQL en vez de SQLite
4. Agregar rate limiting con Redis
