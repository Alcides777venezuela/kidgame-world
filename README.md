# 🎈 KidGame World — Juego de Memoria

¡Bienvenido al **Juego de Memoria** de KidGame World! Un juego colorido para niños donde deben encontrar todas las parejas: 🐶 🐱 🦊 🐸 🐼 🐵

## ✨ Características

- 🎮 **3 niveles de dificultad**:
  - **Nivel 1 — Principiante**: 6 parejas (tablero 4×3)
  - **Nivel 2 — Explorador**: 8 parejas (tablero 4×4)
  - **Nivel 3 — Maestro**: 12 parejas (tablero 6×4)
- 🎨 **4 temáticas**: 🐾 Animales, 🍎 Frutas, 🔢 Números y 🔤 Letras
- 🧠 Animación de volteo 3D en todas las cartas
- 🔊 Sonidos divertidos (Web Audio, sin archivos externos)
- ⭐ Sistema de estrellas según los movimientos:
  - **3 estrellas**: 10 movimientos o menos
  - **2 estrellas**: hasta 14 movimientos
  - **1 estrella**: más de 14
- ⏱️ Temporizador y contador de movimientos
- 🎉 Celebración con confeti al ganar cada nivel
- 📱 Diseño responsivo (celulares, tablets y PC)
- 🌎 Todo en español, pensado para niños

## 🚀 Cómo ejecutar

### Localmente

```bash
npm install   # genera package-lock.json (sin dependencias externas)
npm start
```

Luego abre tu navegador en [http://localhost:3000](http://localhost:3000).

También puedes abrir `index.html` directamente en el navegador sin servidor.

### En Azure (automático)

El repositorio incluye un workflow de GitHub Actions (`.github/workflows/azure-webapps-node.yml`) que despliega automáticamente a Azure Web App cuando haces push a `main`. Requisitos:

1. Crear la Web App en Azure (Node.js 20, Linux).
2. En el repositorio: **Settings → Secrets and variables → Actions**, crear el secreto `AZURE_WEBAPP_PUBLISH_PROFILE` con el contenido del Publish Profile de tu Web App.
3. Confirmar que `AZURE_WEBAPP_NAME` en el workflow coincide con el nombre de tu Web App.
4. El `package-lock.json` ya está incluido (lo requiere el workflow para el caché de npm).

## 📂 Estructura

```
kidgame-world/
├── index.html      # Página del juego
├── styles.css      # Estilos y animaciones
├── game.js         # Lógica del juego (niveles y temáticas)
├── server.js       # Servidor estático (sin dependencias)
├── package.json    # Configuración Node.js
└── package-lock.json  # Bloqueo de dependencias (para el workflow)
```

## 🛠️ Próximas ideas

- Más niveles (6×6 cartas) y más temáticas (vehículos, planetas, emojis)
- Modo de 2 jugadores
- Tabla de récords
- Modo contrarreloj
