# 🎈 KidGame World v2.0 — ¡Monedas, Rachas, Avatares y Power-ups!

**Un juego de memoria para niños de 5-8 años. ¡Encuentra parejas, gana monedas y desbloquea todo!**

> 🌐 **Jugalo ahora:** [kidgame-world.netlify.app](https://kidgame-world.netlify.app)

---

## ✨ Características

### 🧠 Juego Base
- 🎮 **3 niveles de dificultad**: Principiante (6 pares), Explorador (8 pares), Maestro (12 pares)
- 🎨 **4 temáticas**: 🐾 Animales, 🍎 Frutas, 🔢 Números y 🔤 Letras
- 🧠 Animación de volteo 3D en todas las cartas
- 🔊 Sonidos divertidos (Web Audio, sin archivos externos)
- ⭐ **Sistema de estrellas** según movimientos: 3⭐ (≤10), 2⭐ (≤14), 1⭐ (>14)
- ⏱️ Temporizador y contador de movimientos
- 🎉 Celebración con confeti al ganar cada nivel
- 📱 Diseño responsivo (celulares, tablets y PC)
- 🌎 Todo en español, pensado para niños

### 🆕 NUEVO en v2.0

| Característica | Descripción |
|---------------|-------------|
| 🪙 **Monedas** | Gana monedas por cada nivel completado (más estrellas = más monedas) |
| 🔥 **Rachas diarias** | Juega días seguidos para mantener tu racha — ¡30 días = Legendario! |
| 👤 **Avatares** | 10 avatares desbloqueables: 🧒 👧 🧑‍🚀 🦸 🧙‍♂️ 🐉 🧜‍♀️ 🤖 👸 🏴‍☠️ |
| 🏪 **Tienda** | Gasta monedas en power-ups y más |
| ⚡ **Power-ups** | 🔍 Lupa (revela cartas), ⏸️ Pausa (congela tiempo), ❌ Comodín (encuentra pareja) |
| 💾 **Progreso persistente** | Todo se guarda en tu navegador (localStorage) |

---

## 🚀 Cómo ejecutar

### Localmente
```bash
npm install
npm start
```

Luego abre [http://localhost:3000](http://localhost:3000).

También puedes abrir `index.html` directamente en el navegador sin servidor.

### En línea (Netlify)
El proyecto está deployado automáticamente vía Netlify. Cada push a `main` se despliega en:
👉 **[https://kidgame-world.netlify.app](https://kidgame-world.netlify.app)**

---

## 📂 Estructura

```
kidgame-world/
├── index.html      # Página del juego (estructura completa)
├── styles.css      # Estilos y animaciones (v2.0)
├── game.js         # Lógica del juego (monedas, rachas, avatares, power-ups, tienda)
├── server.js       # Servidor estático (sin dependencias externas)
├── package.json    # Configuración Node.js
├── package-lock.json
└── .netlify/       # Configuración de deploy Netlify
```

---

## 🎯 Próximas ideas (v3.0)

- 🌌 Temáticas desbloqueables (Espacial, Dinosaurios, Marina)
- 🏆 Tabla de récords local (mejores tiempos por nivel)
- 🤝 Modo 2 jugadores (turnos en el mismo dispositivo)
- ⏱️ Modo contrarreloj
- 🔔 Recordatorio diario para mantener rachas
- 🗺️ Mapa de progreso visual

---

## 🛠️ Tecnologías

- **HTML5 + CSS3** con animaciones 3D y diseño responsivo
- **JavaScript vanilla** (ES6+) — sin frameworks ni dependencias
- **Web Audio API** — sonidos generados proceduralmente
- **localStorage** — persistencia de progreso
- **Netlify** — hosting con deploy automático desde GitHub