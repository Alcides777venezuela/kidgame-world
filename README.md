# 🎈 KidGame World — Juego de Memoria

¡Bienvenido al **Juego de Memoria** de KidGame World! Un juego colorido para niños donde deben encontrar todas las parejas de animales: 🐶 🐱 🦊 🐸 🐼 🐵

## ✨ Características

- 🧠 6 parejas de animales con animación de volteo 3D
- 🔊 Sonidos divertidos (Web Audio, sin archivos externos)
- ⭐ Sistema de estrellas según los movimientos:
  - **3 estrellas**: 10 movimientos o menos
  - **2 estrellas**: hasta 14 movimientos
  - **1 estrella**: más de 14
- ⏱️ Temporizador y contador de movimientos
- 🎉 Celebración con confeti al ganar
- 📱 Diseño responsivo (funciona en celulares, tablets y PC)
- 🌎 Todo en español, pensado para niños

## 🚀 Cómo ejecutar

### Localmente

```bash
npm start
```

Luego abre tu navegador en [http://localhost:3000](http://localhost:3000).

También puedes abrir `index.html` directamente en el navegador sin servidor.

### En Azure (automático)

El repositorio incluye un workflow de GitHub Actions (`.github/workflows/azure-webapps-node.yml`) que despliega automáticamente a Azure Web App cuando haces push a `main`. Requisitos:

1. Crear la Web App en Azure (Node.js 20, Linux).
2. En el repositorio: **Settings → Secrets and variables → Actions**, crear el secreto `AZURE_WEBAPP_PUBLISH_PROFILE` con el contenido del Publish Profile de tu Web App.
3. Confirmar que `AZURE_WEBAPP_NAME` en el workflow coincide con el nombre de tu Web App.

## 📂 Estructura

```
kidgame-world/
├── index.html      # Página del juego
├── styles.css      # Estilos y animaciones
├── game.js         # Lógica del juego
├── server.js       # Servidor estático (sin dependencias)
└── package.json    # Configuración Node.js
```

## 🛠️ Próximas ideas

- Más niveles (4x3, 6x4, 6x6 cartas)
- Nuevas temáticas (frutas, números, letras)
- Modo de 2 jugadores
- Tabla de récords
