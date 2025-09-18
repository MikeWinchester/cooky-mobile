const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Añadir soporte para archivos SVG
config.resolver.assetExts.push('svg');

// Configurar el transformer para SVG
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');

module.exports = config;
