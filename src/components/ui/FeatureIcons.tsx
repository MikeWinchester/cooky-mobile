import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle, Rect, Defs, LinearGradient, Stop, Ellipse } from 'react-native-svg';

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
}

// Icono de recetas auténticas (plato con tenedor cruzado)
export function RecipeIcon({ width = 32, height = 32, color = '#ff6600' }: IconProps) {
  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height} viewBox="0 0 32 32">
        <Defs>
          <LinearGradient id="plateGradient" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor={color} />
            <Stop offset="100%" stopColor="#e55a00" />
          </LinearGradient>
        </Defs>

        {/* Sombra del plato */}
        <Circle cx="16.5" cy="16.5" r="10" fill="rgba(0,0,0,0.1)" />
        
        {/* Plato principal */}
        <Circle cx="16" cy="16" r="9.5" fill="url(#plateGradient)" />
        
        {/* Borde interno del plato */}
        <Circle cx="16" cy="16" r="8" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <Circle cx="16" cy="16" r="6.5" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
        
        {/* Tenedor cruzado diagonalmente */}
        {/* Mango del tenedor */}
        <Path 
          d="M22 22 L28 28" 
          stroke="#666666" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
        />
        
        {/* Cabeza del tenedor */}
        <Path 
          d="M20 20 L22 22" 
          stroke="#666666" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
        />
        
        {/* Dientes del tenedor */}
        <Path 
          d="M18.5 18.5 L20.5 20.5" 
          stroke="#666666" 
          strokeWidth="1.8" 
          strokeLinecap="round" 
        />
        <Path 
          d="M19.2 17.8 L21.2 19.8" 
          stroke="#666666" 
          strokeWidth="1.8" 
          strokeLinecap="round" 
        />
        <Path 
          d="M19.9 17.1 L21.9 19.1" 
          stroke="#666666" 
          strokeWidth="1.8" 
          strokeLinecap="round" 
        />
        
        {/* Brillo en el plato */}
        <Circle cx="12" cy="12" r="2" fill="rgba(255,255,255,0.2)" />
      </Svg>
    </View>
  );
}

// Icono de ingredientes (naranja mejorada)
export function IngredientsIcon({ width = 32, height = 32, color = '#ff6600' }: IconProps) {
  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height} viewBox="0 0 32 32">
        <Defs>
          <LinearGradient id="orangeGradient" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#FFA500" />
            <Stop offset="50%" stopColor="#FF8C00" />
            <Stop offset="100%" stopColor="#FF7700" />
          </LinearGradient>
          <LinearGradient id="leafGradient" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#4CAF50" />
            <Stop offset="100%" stopColor="#388E3C" />
          </LinearGradient>
        </Defs>

        {/* Sombra de la naranja */}
        <Circle cx="16.5" cy="17" r="11" fill="rgba(0,0,0,0.1)" />
        
        {/* Naranja principal */}
        <Circle cx="16" cy="16" r="10.5" fill="url(#orangeGradient)" />
        
        {/* Textura realista de la naranja */}
        <Circle cx="13" cy="11" r="0.8" fill="rgba(255,255,255,0.2)" />
        <Circle cx="19" cy="13" r="0.6" fill="rgba(255,255,255,0.15)" />
        <Circle cx="16" cy="20" r="0.7" fill="rgba(255,255,255,0.2)" />
        <Circle cx="11" cy="19" r="0.5" fill="rgba(255,255,255,0.15)" />
        <Circle cx="21" cy="11" r="0.4" fill="rgba(255,255,255,0.1)" />
        <Circle cx="14" cy="24" r="0.6" fill="rgba(255,255,255,0.15)" />
        <Circle cx="20" cy="21" r="0.5" fill="rgba(255,255,255,0.1)" />
        
        {/* Líneas de segmentos */}
        <Path d="M16 6 Q18 16 16 26" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" fill="none" />
        <Path d="M16 6 Q14 16 16 26" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" fill="none" />
        <Path d="M6 16 Q16 14 26 16" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" fill="none" />
        <Path d="M6 16 Q16 18 26 16" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" fill="none" />
        
        {/* Hoja mejorada */}
        <Ellipse cx="18" cy="5" rx="3" ry="2" fill="url(#leafGradient)" transform="rotate(25 18 5)" />
        <Path d="M17 5 Q18 3 19 5 Q18 6 17 5" fill="rgba(255,255,255,0.2)" />
        
        {/* Punto de conexión */}
        <Circle cx="16" cy="6" r="1" fill="#D2691E" />
      </Svg>
    </View>
  );
}

// Icono de lista de compras mejorado
export function ShoppingListIcon({ width = 32, height = 32, color = '#ff6600' }: IconProps) {
  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height} viewBox="0 0 32 32">
        <Defs>
          <LinearGradient id="paperGradient" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="100%" stopColor="#F5F5F5" />
          </LinearGradient>
        </Defs>

        {/* Sombra de la lista */}
        <Rect x="4.5" y="4.5" width="20" height="24" rx="3" fill="rgba(0,0,0,0.1)" />
        
        {/* Papel de la lista */}
        <Rect x="4" y="4" width="20" height="24" rx="3" fill="url(#paperGradient)" stroke={color} strokeWidth="1.5" />
        
        {/* Clip superior */}
        <Rect x="12" y="2" width="8" height="4" rx="2" fill={color} />
        <Rect x="13" y="3" width="6" height="2" rx="1" fill="rgba(255,255,255,0.3)" />
        
        {/* Elementos de lista mejorados */}
        {/* Checkbox 1 */}
        <Rect x="7" y="9" width="3" height="3" rx="1" fill="none" stroke={color} strokeWidth="1.2" />
        <Path d="M8 10.5 L9 11.5 L12 8.5" fill="none" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" />
        <Path d="M12 10 L21 10" stroke="#666" strokeWidth="1.2" strokeLinecap="round" />
        
        {/* Checkbox 2 */}
        <Rect x="7" y="14" width="3" height="3" rx="1" fill="none" stroke={color} strokeWidth="1.2" />
        <Path d="M12 15.5 L19 15.5" stroke="#666" strokeWidth="1.2" strokeLinecap="round" />
        
        {/* Checkbox 3 */}
        <Rect x="7" y="19" width="3" height="3" rx="1" fill="none" stroke={color} strokeWidth="1.2" />
        <Path d="M8 20.5 L9 21.5 L12 18.5" fill="none" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" />
        <Path d="M12 20.5 L18 20.5" stroke="#666" strokeWidth="1.2" strokeLinecap="round" />
        
        {/* Checkbox 4 */}
        <Rect x="7" y="24" width="3" height="3" rx="1" fill="none" stroke={color} strokeWidth="1.2" />
        <Path d="M12 25.5 L20 25.5" stroke="#666" strokeWidth="1.2" strokeLinecap="round" />
      </Svg>
    </View>
  );
}

// Icono de favoritos (corazón mejorado) - Naranja
export function FavoritesIcon({ width = 32, height = 32, color = '#ff6600' }: IconProps) {
  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height} viewBox="0 0 32 32">
        <Defs>
          <LinearGradient id="heartGradient" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#FFA500" />
            <Stop offset="50%" stopColor="#FF8C00" />
            <Stop offset="100%" stopColor="#FF6600" />
          </LinearGradient>
        </Defs>

        {/* Sombra del corazón */}
        <Path
          d="M16.5 28.5 C16.5 28.5 4.5 18.5 4.5 12.5 C4.5 8.5 7.5 6.5 10.5 6.5 C12.5 6.5 14.5 7.5 16.5 9.5 C18.5 7.5 20.5 6.5 22.5 6.5 C25.5 6.5 28.5 8.5 28.5 12.5 C28.5 18.5 16.5 28.5 16.5 28.5 Z"
          fill="rgba(0,0,0,0.15)"
        />
        
        {/* Corazón principal */}
        <Path
          d="M16 28 C16 28 4 18 4 12 C4 8 7 6 10 6 C12 6 14 7 16 9 C18 7 20 6 22 6 C25 6 28 8 28 12 C28 18 16 28 16 28 Z"
          fill="url(#heartGradient)"
        />
        
        {/* Brillo en el corazón */}
        <Path
          d="M16 9 C14.5 7.5 12.8 6.5 10.5 6.5 C8.2 6.5 6 8.2 6 11.5 C6 14 8 16.5 12 20.5"
          fill="rgba(255,255,255,0.25)"
        />
        
        {/* Pequeño brillo superior */}
        <Circle cx="12" cy="10" r="1.5" fill="rgba(255,255,255,0.4)" />
      </Svg>
    </View>
  );
}