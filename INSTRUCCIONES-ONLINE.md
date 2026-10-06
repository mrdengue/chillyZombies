# Instrucciones - High Scores Online

## 🚀 Iniciar el servidor

### 1. Instalar dependencias (primera vez)
```bash
cd server
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Ejecutar servidor
```bash
cd server
source venv/bin/activate  # Windows: venv\Scripts\activate
python app.py
```

Verás:
```
🚀 Chilly Zombies High Score Server
📊 Endpoints:
   GET  /api/highscores - Get top scores
   POST /api/highscores - Submit new score
   GET  /api/status - Server status

 * Running on http://0.0.0.0:5000
```

### 3. Abrir el juego
En otra terminal:
```bash
cd /home/jorge/chilly
python3 -m http.server 8000
```

Abrir: http://localhost:8000/index.html

## ✅ Verificar que funciona

1. **Abre la consola del navegador (F12)**
2. Deberías ver:
   ```
   [ONLINE] API client loaded, mode: ONLINE
   [ONLINE] ✓ Server online: 0 scores
   ```

3. **Juega y haz Game Over con un puntaje alto**
4. **Escribe tus iniciales (3 letras)**
5. **Verás en la consola:**
   ```
   [SAVE] ✓ Score submitted to global leaderboard, rank: 1
   ```

6. **La tabla de high scores mostrará:**
   ```
   Loading global scores... (mientras carga)
   → Luego mostrará el leaderboard global
   ```

## 🔧 Configuración

### Cambiar URL del servidor (para producción)

Edita `online-api.js`:
```javascript
const API_URL = 'https://tu-servidor.com/api';  // Cambiar aquí
```

### Desactivar modo online (solo local)

Edita `online-api.js`:
```javascript
const USE_ONLINE = false;  // Cambiar a false
```

## 🌐 Desplegar en producción

### Opción 1: PythonAnywhere (Gratis)
1. Sube los archivos de `/server`
2. Configura WSGI
3. Cambia `API_URL` en `online-api.js`

### Opción 2: Heroku
```bash
# Crear Procfile
echo "web: gunicorn app:app" > Procfile
# Deploy
heroku create chilly-zombies
git push heroku master
```

### Opción 3: VPS (DigitalOcean, Linode, etc.)
```bash
# Instalar en servidor
sudo apt install python3-pip nginx
pip3 install gunicorn
gunicorn app:app --bind 0.0.0.0:5000
# Configurar nginx como proxy
```

## 📊 Testing manual

### Obtener high scores
```bash
curl http://localhost:5000/api/highscores
```

### Enviar un puntaje
```bash
curl -X POST http://localhost:5000/api/highscores \
  -H "Content-Type: application/json" \
  -d '{"name":"AAA","score":50000,"level":10}'
```

### Ver estado
```bash
curl http://localhost:5000/api/status
```

## 🛡️ Anti-Cheating

El servidor valida:
- ✅ Score entre 0 y 999,999
- ✅ Nivel entre 1 y 34
- ✅ Nombre exactamente 3 letras (A-Z)
- ✅ Solo mantiene top 100 scores
- ✅ Registra IP para rate limiting básico

## 💾 Base de Datos

El archivo `highscores.db` se crea automáticamente.

### Ver scores en la DB:
```bash
cd server
sqlite3 highscores.db
sqlite> SELECT * FROM highscores ORDER BY score DESC LIMIT 10;
sqlite> .exit
```

### Limpiar scores (testing):
```bash
rm server/highscores.db
# Se recreará al reiniciar el servidor
```

## 🐛 Troubleshooting

### "Failed to fetch online scores"
- ✅ Verifica que el servidor Flask esté corriendo
- ✅ Revisa que la URL en `online-api.js` sea correcta
- ✅ Verifica CORS si es cross-origin

### "Score not appearing"
- ✅ Mira la consola del navegador
- ✅ Verifica logs del servidor Flask
- ✅ Confirma que el score sea válido (< 999,999)

### Servidor no inicia
- ✅ Activa el venv: `source venv/bin/activate`
- ✅ Instala dependencias: `pip install -r requirements.txt`
- ✅ Verifica que el puerto 5000 esté libre
