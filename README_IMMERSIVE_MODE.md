# 🎮 Modo Inmersivo en Cooky

## ¿Qué es el Modo Inmersivo?

El modo inmersivo oculta las barras de navegación del sistema Android (botones home, back, recent apps) para proporcionar una experiencia de pantalla completa, similar a aplicaciones como **Clash Royale** o **PUBG Mobile**.

## 🚀 Características Implementadas

### ✅ **Modo Inmersivo Automático**
- Se activa automáticamente al entrar en la Landing Page
- Los botones del sistema desaparecen
- La app ocupa toda la pantalla

### ✅ **Toggle Manual**
- Botón flotante en la esquina superior derecha
- Permite alternar entre modo inmersivo y normal
- Iconos dinámicos que indican el estado actual

### ✅ **Comportamiento Inteligente**
- **Doble Swipe**: Para mostrar los botones del sistema temporalmente
- **Auto-Hide**: Los botones se ocultan automáticamente después de unos segundos
- **Sticky Mode**: Los botones permanecen ocultos durante la navegación

## 🎯 Funcionalidades

### **En Modo Inmersivo:**
- ✨ Los botones están pegados hasta abajo
- 🫥 La barra de navegación del sistema está oculta
- 📱 Experiencia de pantalla completa
- 👆 Doble swipe hacia arriba para mostrar controles del sistema temporalmente

### **En Modo Normal:**
- 📱 Los botones del sistema están visibles
- 🔄 Padding de seguridad para evitar superposición
- 🎮 Transición suave entre modos

## 🛠️ Implementación Técnica

### **Hook personalizado:**
```typescript
const { isImmersive, setImmersive } = useImmersiveMode(true)
```

### **API utilizada:**
- `expo-navigation-bar` para control de barras
- `react-native-safe-area-context` para áreas seguras
- Configuración automática en `app.json`

## 📲 Cómo Probar

1. **Inicia la app** en tu dispositivo Android
2. **Verás el modo inmersivo activado** automáticamente
3. **Usa el toggle** en la esquina superior derecha para cambiar modos
4. **Haz doble swipe hacia arriba** desde la parte inferior para mostrar los controles del sistema temporalmente

## 🎮 Experiencia Similar a Clash Royale

- ✅ Pantalla completa inmersiva
- ✅ Botones del sistema ocultos
- ✅ Doble swipe para mostrar controles
- ✅ Auto-hide de controles
- ✅ Transiciones suaves

¡Disfruta de una experiencia móvil moderna y envolvente! 🚀


