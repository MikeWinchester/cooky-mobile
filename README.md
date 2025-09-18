# Cooky App - React Native + Expo

Una aplicación móvil de recetas desarrollada con React Native y Expo, que permite a los usuarios descubrir, crear y compartir recetas de cocina.

## 🚀 Características

- **Recetas Personalizadas**: Descubre recetas basadas en tus ingredientes favoritos
- **Listas de Compras**: Organiza tus compras por categorías
- **Perfil Personalizado**: Configura tus preferencias alimentarias
- **Funcionalidades Móviles Únicas**:
  - 📸 Cámara para fotos de ingredientes y recetas
  - 📱 Escáner de códigos de barras para productos
  - 🔔 Notificaciones push para recordatorios
  - 📍 Ubicación para encontrar tiendas cercanas
  - 📤 Compartir recetas en redes sociales

## 🛠️ Tecnologías

- **React Native** - Framework móvil
- **Expo** - Plataforma de desarrollo
- **TypeScript** - Tipado estático
- **Zustand** - Gestión de estado
- **React Navigation** - Navegación
- **Expo Router** - Enrutamiento basado en archivos

## 📱 Funcionalidades Móviles

### Cámara e Imágenes
- Tomar fotos de ingredientes y recetas
- Seleccionar imágenes de la galería
- Escanear códigos de barras de productos

### Notificaciones
- Recordatorios de recetas
- Notificaciones de listas de compras
- Alertas personalizadas

### Ubicación
- Encontrar tiendas cercanas
- Servicios de geolocalización

### Compartir
- Compartir recetas por WhatsApp
- Compartir en Instagram Stories
- Compartir por cualquier aplicación

## 🚀 Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd project-cooky-app-develop
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar Expo**
```bash
npx expo install
```

4. **Ejecutar la aplicación**
```bash
# Desarrollo
npm start

# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

## 📦 Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo de Expo
- `npm run android` - Ejecuta en Android
- `npm run ios` - Ejecuta en iOS
- `npm run web` - Ejecuta en web
- `npm run build` - Construye la aplicación
- `npm run lint` - Ejecuta ESLint

## 🏗️ Estructura del Proyecto

```
src/
├── app/                    # Rutas de Expo Router
├── components/             # Componentes reutilizables
│   ├── auth/              # Componentes de autenticación
│   ├── common/            # Componentes comunes
│   ├── layout/            # Layouts de la aplicación
│   └── ui/                # Componentes de UI
├── contexts/              # Contextos de React
├── hooks/                 # Hooks personalizados
├── pages/                 # Páginas de la aplicación
├── services/              # Servicios de API
├── store/                 # Stores de Zustand
├── styles/                # Estilos globales
├── types/                 # Definiciones de tipos
└── utils/                 # Utilidades
```

## 🎨 Diseño

La aplicación mantiene el diseño original con:
- Colores cálidos y acogedores
- Tipografía clara y legible
- Navegación intuitiva
- Experiencia móvil optimizada

## 📱 Compatibilidad

- **Android**: 6.0+ (API 23+)
- **iOS**: 11.0+
- **Web**: Navegadores modernos

## 🔧 Configuración

### Variables de Entorno
Crear un archivo `.env` con:
```
EXPO_PUBLIC_API_URL=your_api_url
EXPO_PUBLIC_API_KEY=your_api_key
```

### Permisos
La aplicación requiere los siguientes permisos:
- Cámara (para fotos y escáner)
- Galería (para seleccionar imágenes)
- Ubicación (para tiendas cercanas)
- Notificaciones (para recordatorios)

## 🚀 Despliegue

### Android
```bash
npm run build:android
```

### iOS
```bash
npm run build:ios
```

### Web
```bash
npm run build
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Soporte

Para soporte, envía un email a support@cookyapp.com o crea un issue en GitHub.