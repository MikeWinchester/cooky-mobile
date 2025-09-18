interface ProductType {
  id: string;
  name: string;
  svg: string;
}
export interface Category {
  id: string;
  name: string;
  svg: string;
  products?: ProductType[];
}

export const categories: Category[] = [
  /* =================== Aceites y vinagres =================== */
  {
    id: "aceites_vinagres",
    name: "Aceites y vinagres",
    svg: `<svg viewBox="0 0 100 100"><rect x="44" y="24" width="12" height="52" rx="6" fill="#FFE082"/><rect x="46" y="20" width="8" height="6" rx="2" fill="#FFCA28"/></svg>`,
    products: [
      {
        id: "aceite_coco",
        name: "Aceite Coco",
        svg: `<svg viewBox="0 0 100 100"> <rect x="38" y="30" width="24" height="44" rx="6" fill="#FAFAFA" stroke="#CFD8DC" stroke-width="2"/> <rect x="42" y="34" width="16" height="32" rx="3" fill="#FFFFFF"/> <rect x="44" y="22" width="12" height="8" rx="2" fill="#B0BEC5"/></svg>`,
      },
      {
        id: "aceite_girasol",
        name: "Girasol",
        svg: `<svg viewBox="0 0 100 100"><rect x="38" y="30" width="24" height="44" rx="6" fill="#FFEE58" stroke="#FBC02D" stroke-width="2"/><rect x="42" y="34" width="16" height="32" rx="3" fill="#FFFDE7"/> <rect x="44" y="22" width="12" height="8" rx="2" fill="#FBC02D"/></svg>`,
      },
      {
        id: "aceite_maiz",
        name: "Aceite Maíz",
        svg: `<svg viewBox="0 0 100 100"><rect x="38" y="30" width="24" height="44" rx="6" fill="#FFD54F" stroke="#F9A825" stroke-width="2"/><rect x="42" y="34" width="16" height="32" rx="3" fill="#FFF8E1"/><rect x="44" y="22" width="12" height="8" rx="2" fill="#FFB300"/> </svg>`,
      },
      {
        id: "aceite_oliva",
        name: "Aceite Oliva",
        svg: `<svg viewBox="0 0 100 100"> <rect x="38" y="30" width="24" height="44" rx="6" fill="#C5E1A5" stroke="#8BC34A" stroke-width="2"/> <rect x="42" y="34" width="16" height="32" rx="3" fill="#E8F5E9"/><rect x="44" y="22" width="12" height="8" rx="2" fill="#7CB342"/></svg>`,
      },
      {
        id: "aceite_soya",
        name: "Aceite Soya",
        svg: `<svg viewBox="0 0 100 100"> <rect x="38" y="30" width="24" height="44" rx="6" fill="#FFF176" stroke="#FDD835" stroke-width="2"/> <rect x="42" y="34" width="16" height="32" rx="3" fill="#FFFDE7"/> <rect x="44" y="22" width="12" height="8" rx="2" fill="#FDD835"/> </svg>`,
      },
      {
        id: "ghee",
        name: "Ghee",
        svg: `<svg viewBox="0 0 100 100"><rect x="30" y="44" width="40" height="24" rx="6" fill="#FFEB3B" stroke="#FBC02D" stroke-width="2"/><rect x="34" y="48" width="32" height="12" rx="4" fill="#FFF176"/> </svg>`,
      },
      {
        id: "margarina",
        name: "Margarina",
        svg: `<svg viewBox="0 0 100 100"> <rect x="30" y="44" width="40" height="24" rx="6" fill="#FFF176" stroke="#FBC02D" stroke-width="2"/> <rect x="34" y="48" width="32" height="12" rx="4" fill="#FFEB3B"/></svg>`,
      },
      {
        id: "vinagre",
        name: "Vinagre",
        svg: `<svg viewBox="0 0 100 100"><rect x="42" y="28" width="16" height="44" rx="6" fill="#E1F5FE"/></svg>`,
      },
    ],
  },

  /* =================== Bebidas =================== */
  {
    id: "bebidas",
    name: "Bebidas",
    svg: `<svg viewBox="0 0 100 100"><rect x="38" y="28" width="24" height="44" rx="4" fill="#BBDEFB"/><rect x="40" y="30" width="20" height="40" rx="3" fill="#E3F2FD"/><rect x="42" y="24" width="16" height="6" rx="2" fill="#90CAF9"/></svg>`,
    products: [
      {
        id: "agua",
        name: "Agua",
        svg: `<svg viewBox="0 0 100 100"><path d="M50 22c10 14 16 24 16 32a16 16 0 1 1-32 0c0-8 6-18 16-32z" fill="#B3E5FC"/></svg>`,
      },
      {
        id: "cafe",
        name: "Café",
        svg: `<svg viewBox="0 0 100 100"><rect x="34" y="40" width="32" height="24" rx="6" fill="#6D4C41"/><rect x="30" y="40" width="40" height="6" rx="3" fill="#8D6E63"/></svg>`,
      },
      {
        id: "te",
        name: "Té",
        svg: `<svg viewBox="0 0 100 100"><rect x="36" y="44" width="28" height="18" rx="6" fill="#C5E1A5"/><path d="M64 46h6a6 6 0 0 1 0 12h-6" fill="none" stroke="#8BC34A" stroke-width="3"/></svg>`,
      },
    ],
  },

  /* =================== Carnes =================== */
  {
    id: "carnes",
    name: "Carnes",
    svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M30 30h40v40H30z" fill="#D32F2F"/><path d="M35 35h30v30H35z" fill="#F44336"/><path d="M40 40h20v20H40z" fill="#FFCDD2"/><circle cx="45" cy="45" r="2" fill="#D32F2F"/><circle cx="55" cy="45" r="2" fill="#D32F2F"/><circle cx="50" cy="55" r="2" fill="#D32F2F"/></svg>`,
    products: [
      {
        id: "bistec",
        name: "Bistec",
        svg: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="25" ry="18" fill="#B71C1C"/><ellipse cx="50" cy="50" rx="20" ry="13" fill="#E57373"/></svg>`,
      },
      {
        id: "chorizo",
        name: "Chorizo",
        svg: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="25" ry="10" fill="#BF360C"/><ellipse cx="50" cy="50" rx="20" ry="7" fill="#FF7043"/></svg>`,
      },
      {
        id: "chuleta",
        name: "Chuleta",
        svg: `<svg viewBox="0 0 100 100"><path d="M40 30h20v40H40z" fill="#E53935"/><circle cx="50" cy="50" r="10" fill="#FFCDD2"/></svg>`,
      },
      {
        id: "costilla",
        name: "Costilla",
        svg: `<svg viewBox="0 0 100 100"><rect x="30" y="40" width="40" height="20" fill="#B71C1C"/><line x1="35" y1="40" x2="35" y2="60" stroke="#FFF" stroke-width="2"/><line x1="45" y1="40" x2="45" y2="60" stroke="#FFF" stroke-width="2"/><line x1="55" y1="40" x2="55" y2="60" stroke="#FFF" stroke-width="2"/><line x1="65" y1="40" x2="65" y2="60" stroke="#FFF" stroke-width="2"/></svg>`,
      },
      {
        id: "filete",
        name: "Filete",
        svg: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="20" ry="12" fill="#C62828"/><ellipse cx="50" cy="50" rx="15" ry="8" fill="#FFCDD2"/></svg>`,
      },
      {
        id: "lomo",
        name: "Lomo",
        svg: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="25" ry="10" fill="#E53935"/><ellipse cx="50" cy="50" rx="20" ry="7" fill="#FFCDD2"/></svg>`,
      },
      {
        id: "pollo",
        name: "Pollo",
        svg: `<svg viewBox="0 0 100 100"><path d="M50 30c10 0 20 10 20 20s-10 20-20 20-20-10-20-20 10-20 20-20z" fill="#FFE0B2"/><path d="M50 25l5 5-5 5-5-5 5-5z" fill="#FFB300"/></svg>`,
      },
      {
        id: "salchicha",
        name: "Salchicha",
        svg: `<svg viewBox="0 0 100 100"><rect x="35" y="40" width="30" height="10" rx="5" fill="#F44336"/><rect x="35" y="50" width="30" height="10" rx="5" fill="#E57373"/></svg>`,
      },
    ],
  },

  /* =================== Especias =================== */
  {
    id: "especias",
    name: "Especias",
    svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><rect x="40" y="20" width="20" height="30" rx="10" fill="#8D6E63"/><rect x="42" y="22" width="16" height="26" rx="8" fill="#A1887F"/><circle cx="50" cy="60" r="8" fill="#FF9800"/><circle cx="45" cy="70" r="2" fill="#FF5722"/><circle cx="55" cy="70" r="2" fill="#FF5722"/><circle cx="50" cy="75" r="2" fill="#FF5722"/><circle cx="40" cy="72" r="1.5" fill="#FF5722"/><circle cx="60" cy="72" r="1.5" fill="#FF5722"/></svg>`,
    products: [
      {
        id: "ajo_polvo",
        name: "Ajo polvo",
        svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="15" fill="#F5E0B7" stroke="#B28B40" stroke-width="2"/></svg>`,
      },
      {
        id: "azafran",
        name: "Azafrán",
        svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="15" fill="#FFB300" stroke="#E65100" stroke-width="2"/></svg>`,
      },
      {
        id: "azucar",
        name: "Azúcar",
        svg: `<svg viewBox="0 0 100 100"><rect x="35" y="35" width="30" height="30" rx="5" fill="#FFFFFF" stroke="#E0E0E0"/></svg>`,
      },
      {
        id: "canela",
        name: "Canela",
        svg: `<svg viewBox="0 0 100 100"><rect x="40" y="25" width="8" height="50" rx="3" fill="#A0522D"/><rect x="52" y="25" width="8" height="50" rx="3" fill="#A0522D"/></svg>`,
      },
      {
        id: "clavo_olor",
        name: "Clavo olor",
        svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="40" r="6" fill="#5D4037"/><rect x="48" y="45" width="4" height="25" fill="#795548"/></svg>`,
      },
      {
        id: "comino",
        name: "Comino",
        svg: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="20" ry="10" fill="#A1887F" stroke="#6D4C41" stroke-width="2"/></svg>`,
      },
      {
        id: "curcuma",
        name: "Cúrcuma",
        svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="15" fill="#FBC02D" stroke="#F57F17" stroke-width="2"/></svg>`,
      },
      {
        id: "oregano",
        name: "Orégano",
        svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="15" fill="#8BC34A" stroke="#558B2F" stroke-width="2"/></svg>`,
      },
      {
        id: "pimienta_negra",
        name: "Pimienta",
        svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="15" fill="#5D4037"/></svg>`,
      },
      {
        id: "romero",
        name: "Romero",
        svg: `<svg viewBox="0 0 100 100"><path d="M50 20v60" stroke="#33691E" stroke-width="3"/><path d="M50 30l-10-5M50 35l10-5M50 40l-10-5M50 45l10-5" stroke="#558B2F" stroke-width="2"/></svg>`,
      },
      {
        id: "sal",
        name: "Sal",
        svg: `<svg viewBox="0 0 100 100"><rect x="35" y="35" width="30" height="30" rx="5" fill="#ECEFF1"/></svg>`,
      },
      {
        id: "vainilla",
        name: "Vainilla",
        svg: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="15" ry="5" fill="#6D4C41"/></svg>`,
      },
    ],
  },

  /* =================== Frutas =================== */
  {
    id: "frutas",
    name: "Frutas",
    svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M50 85c-15.5 0-28-12.5-28-28 0-10.5 6-19.5 14.5-24.5C38 25 42 18 50 18s12 7 13.5 14.5C72 37.5 78 46.5 78 57c0 15.5-12.5 28-28 28z" fill="#8BC34A"/><path d="M50 18c-2 0-4 1-5 3-1-2-3-3-5-3-3 0-5 2-5 5s2 5 5 5c2 0 4-1 5-3 1 2 3 3 5 3 3 0 5-2 5-5s-2-5-5-5z" fill="#4CAF50"/></svg>`,
    products: [
      {
        id: "arandano",
        name: "Arándano",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="45" cy="58" r="9" fill="#3949AB"/><circle cx="57" cy="58" r="9" fill="#5C6BC0"/><circle cx="51" cy="48" r="9" fill="#3F51B5"/><circle cx="51" cy="58" r="2" fill="#1A237E"/></svg>`,
      },
      {
        id: "banana",
        name: "Banana",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M30 20c5-5 15-5 20 0 8 8 8 25 5 35-2 8-8 15-15 18-7-3-13-10-15-18-3-10-3-27 5-35z" fill="#FFEB3B"/><path d="M35 25c3-3 8-3 10 0 5 5 5 18 3 25-1 5-5 10-8 12-3-2-7-7-8-12-2-7-2-20 3-25z" fill="#FFF176"/></svg>`,
      },
      {
        id: "cereza",
        name: "Cereza",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="40" cy="60" r="8" fill="#C2185B"/><circle cx="60" cy="60" r="8" fill="#C2185B"/><path d="M40 52 L50 30 L60 52" stroke="#2E7D32" stroke-width="2" fill="none"/></svg>`,
      },
      {
        id: "ciruela",
        name: "Ciruela",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="48" cy="58" r="16" fill="#7E57C2"/><circle cx="58" cy="58" r="14" fill="#673AB7"/><path d="M53 38 L56 28" stroke="#2E7D32" stroke-width="3"/></svg>`,
      },
      {
        id: "coco",
        name: "Coco",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="50" cy="55" r="26" fill="#6D4C41"/><circle cx="50" cy="55" r="18" fill="#FFFFFF"/><circle cx="45" cy="48" r="2" fill="#333"/><circle cx="55" cy="48" r="2" fill="#333"/><circle cx="50" cy="56" r="2" fill="#333"/></svg>`,
      },
      {
        id: "durazno",
        name: "Durazno",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="45" cy="55" r="20" fill="#FFB074"/><circle cx="60" cy="55" r="18" fill="#FFA062"/><path d="M52 33 C56 30,62 32,60 38" fill="#2E7D32"/></svg>`,
      },
      {
        id: "fresa",
        name: "Fresa",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M35 70 Q30 50 35 45 Q45 35 50 35 Q55 35 65 45 Q70 50 65 70 Q60 80 50 80 Q40 80 35 70" fill="#FF1493"/><path d="M38 65 Q33 50 38 47 Q46 40 50 40 Q54 40 62 47 Q67 50 62 65 Q58 75 50 75 Q42 75 38 65" fill="#FF69B4"/><path d="M42 25 Q50 20 58 25 Q55 30 50 28 Q45 30 42 25" fill="#32CD32"/><circle cx="42" cy="55" r="1.5" fill="#8B0000"/><circle cx="52" cy="50" r="1.5" fill="#8B0000"/><circle cx="48" cy="65" r="1.5" fill="#8B0000"/><circle cx="58" cy="60" r="1.5" fill="#8B0000"/></svg>`,
      },
      {
        id: "granada",
        name: "Granada",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="50" cy="58" r="18" fill="#C62828"/><path d="M50 36 L48 30 L52 30 Z" fill="#8E0000"/><circle cx="44" cy="58" r="2" fill="#FFD1D1"/><circle cx="50" cy="56" r="2" fill="#FFD1D1"/><circle cx="56" cy="58" r="2" fill="#FFD1D1"/></svg>`,
      },
      {
        id: "guayaba",
        name: "Guayaba",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><ellipse cx="50" cy="58" rx="18" ry="22" fill="#AED581"/><circle cx="50" cy="58" r="10" fill="#F8BBD0"/><circle cx="46" cy="58" r="1.4" fill="#AD1457"/><circle cx="54" cy="58" r="1.4" fill="#AD1457"/></svg>`,
      },
      {
        id: "higo",
        name: "Higo",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M50 38 C46 42,40 50,40 60 C40 70,60 70,60 60 C60 50,54 42,50 38 Z" fill="#8E44AD"/><circle cx="50" cy="58" r="6" fill="#F8BBD0"/></svg>`,
      },
      {
        id: "kiwi",
        name: "Kiwi",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="50" cy="50" r="28" fill="#8BC34A" stroke="#6D4C41" stroke-width="4"/><circle cx="50" cy="50" r="15" fill="#CDDC39"/><circle cx="50" cy="50" r="2" fill="#000"/><circle cx="45" cy="50" r="2" fill="#000"/><circle cx="55" cy="50" r="2" fill="#000"/><circle cx="50" cy="45" r="2" fill="#000"/><circle cx="50" cy="55" r="2" fill="#000"/></svg>`,
      },
      {
        id: "limon",
        name: "Limón",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><ellipse cx="50" cy="50" rx="28" ry="20" fill="#FFF176" stroke="#FBC02D" stroke-width="3"/><path d="M50 30 L50 70 M30 50 L70 50" stroke="#FBC02D" stroke-width="2"/></svg>`,
      },
      {
        id: "mandarina",
        name: "Mandarina",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="50" cy="58" r="18" fill="#FF9800"/><path d="M50 40 C54 38,58 40,57 44" stroke="#2E7D32" stroke-width="3"/></svg>`,
      },
      {
        id: "mango",
        name: "Mango",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><ellipse cx="50" cy="55" rx="20" ry="28" fill="#FFC107"/><path d="M50 25 C55 20, 65 25, 60 35" fill="#4CAF50"/></svg>`,
      },
      {
        id: "manzana",
        name: "Manzana",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M40 60 C38 45,62 45,60 60 C60 74,40 74,40 60 Z" fill="#E53935"/><path d="M50 38 L52 30" stroke="#2E7D32" stroke-width="3"/><circle cx="50" cy="38" r="3" fill="#2E7D32"/></svg>`,
      },
      {
        id: "maracuya",
        name: "Maracuyá",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="50" cy="50" r="26" fill="#7B1FA2"/><circle cx="50" cy="50" r="18" fill="#FFEE58"/><circle cx="44" cy="50" r="2" fill="#000"/><circle cx="56" cy="50" r="2" fill="#000"/><circle cx="50" cy="44" r="2" fill="#000"/><circle cx="50" cy="56" r="2" fill="#000"/></svg>`,
      },
      {
        id: "melon",
        name: "Melón",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><ellipse cx="52" cy="58" rx="24" ry="16" fill="#A5D6A7" stroke="#81C784" stroke-width="3"/><path d="M40 50 A14 14 0 0 0 64 66" stroke="#66BB6A" stroke-width="2"/></svg>`,
      },
      {
        id: "mora",
        name: "Mora",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="44" cy="58" r="7" fill="#4A148C"/><circle cx="52" cy="58" r="7" fill="#6A1B9A"/><circle cx="48" cy="50" r="7" fill="#7B1FA2"/><path d="M48 42 L50 34" stroke="#2E7D32" stroke-width="2"/></svg>`,
      },
      {
        id: "naranja",
        name: "Naranja",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="50" cy="50" r="28" fill="#FFA500"/><path d="M50 22 L50 78 M22 50 L78 50 M32 32 L68 68 M68 32 L32 68" stroke="#FFD580" stroke-width="2"/></svg>`,
      },
      {
        id: "papaya",
        name: "Papaya",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><ellipse cx="50" cy="55" rx="22" ry="30" fill="#FFA726"/><ellipse cx="50" cy="55" rx="10" ry="18" fill="#6D4C41"/><circle cx="46" cy="55" r="1.6" fill="#000"/><circle cx="50" cy="58" r="1.6" fill="#000"/><circle cx="54" cy="52" r="1.6" fill="#000"/></svg>`,
      },
      {
        id: "pera",
        name: "Pera",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M50 85c-12 0-22-10-22-22 0-8 4-15 10-19-2-3-3-7-3-11 0-8 7-15 15-15s15 7 15 15c0 4-1 8-3 11 6 4 10 11 10 19 0 12-10 22-22 22z" fill="#8BC34A"/><path d="M50 18c-2 0-4 1-5 3-1-2-3-3-5-3-3 0-5 2-5 5s2 5 5 5c2 0 4-1 5-3 1 2 3 3 5 3 3 0 5-2 5-5s-2-5-5-5z" fill="#4CAF50"/></svg>`,
      },
      {
        id: "pina",
        name: "Piña",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M35 75 Q50 95 65 75 Q65 55 50 35 Q35 55 35 75" fill="#F1C40F" stroke="#D4AC0D" stroke-width="2"/><path d="M45 30 L50 20 L55 30 L50 25 Z" fill="#27AE60"/><path d="M40 25 L45 15 L50 25 L45 20 Z" fill="#2ECC71"/><path d="M55 25 L60 15 L65 25 L60 20 Z" fill="#2ECC71"/></svg>`,
      },
      {
        id: "pitahaya",
        name: "Pitahaya",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><ellipse cx="50" cy="58" rx="16" ry="22" fill="#E91E63"/><ellipse cx="50" cy="58" rx="10" ry="14" fill="#FFFFFF"/><circle cx="47" cy="58" r="1" fill="#000"/><circle cx="53" cy="56" r="1" fill="#000"/><circle cx="50" cy="62" r="1" fill="#000"/></svg>`,
      },
      {
        id: "sandia",
        name: "Sandía",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="50" cy="50" r="35" fill="#FF5722"/><circle cx="50" cy="50" r="28" fill="#FFEB3B"/><circle cx="50" cy="50" r="20" fill="#4CAF50"/><circle cx="42" cy="45" r="2" fill="#000"/><circle cx="58" cy="45" r="2" fill="#000"/><circle cx="50" cy="55" r="2" fill="#000"/><circle cx="45" cy="60" r="1.5" fill="#000"/><circle cx="55" cy="60" r="1.5" fill="#000"/></svg>`,
      },
      {
        id: "toronja",
        name: "Toronja",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="50" cy="58" r="20" fill="#FF7043"/><circle cx="50" cy="58" r="14" fill="#FFCCBC"/><path d="M50 44 L50 72 M36 58 L64 58 M42 48 L58 68 M58 48 L42 68" stroke="#FF8A65" stroke-width="2"/></svg>`,
      },
      {
        id: "uva",
        name: "Uva",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="40" cy="60" r="8" fill="#8E44AD"/><circle cx="50" cy="60" r="8" fill="#9B59B6"/><circle cx="60" cy="60" r="8" fill="#8E44AD"/><circle cx="45" cy="50" r="8" fill="#9B59B6"/><circle cx="55" cy="50" r="8" fill="#8E44AD"/><circle cx="50" cy="40" r="8" fill="#9B59B6"/><path d="M50 30 L50 20" stroke="#27AE60" stroke-width="3"/></svg>`,
      },
    ],
  },

  /* =================== Frutos secos y semillas =================== */
  {
    id: "frutos_secos_semillas",
    name: "Frutos secos y semillas",
    svg: `<svg viewBox="0 0 100 100"><circle cx="44" cy="56" r="8" fill="#8D6E63"/><circle cx="56" cy="56" r="8" fill="#A1887F"/><ellipse cx="50" cy="44" rx="6" ry="10" fill="#D7CCC8"/></svg>`,
    products: [
     {
      id: "almendras",
      name: "Almendras",
      svg: `<svg viewBox="0 0 100 100"><path d="M50 30c8 6 12 14 12 22s-6 14-12 14-12-6-12-14 4-16 12-22z" fill="#A1887F"/></svg>`,
    },
    {
      id: "avellanas",
      name: "Avellanas",
      svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="8" fill="#8D6E63" stroke="#5D4037" stroke-width="2"/></svg>`,
    },
    {
      id: "cacahuates",
      name: "Cacahuates",
      svg: `<svg viewBox="0 0 100 100"><ellipse cx="46" cy="54" rx="6" ry="8" fill="#D7B899"/><ellipse cx="54" cy="46" rx="6" ry="8" fill="#D7B899"/></svg>`,
    },
    {
      id: "castanas",
      name: "Castañas",
      svg: `<svg viewBox="0 0 100 100"><path d="M50 40c6 0 12 6 12 12s-6 12-12 12-12-6-12-12 6-12 12-12z" fill="#8D6E63" stroke="#6D4C41" stroke-width="2"/></svg>`,
    },
    {
      id: "chia",
      name: "Chía",
      svg: `<svg viewBox="0 0 100 100"><circle cx="45" cy="55" r="2" fill="#616161"/><circle cx="50" cy="58" r="2" fill="#616161"/><circle cx="55" cy="54" r="2" fill="#616161"/><circle cx="50" cy="50" r="2" fill="#616161"/></svg>`,
    },
    {
      id: "linaza",
      name: "Linaza",
      svg: `<svg viewBox="0 0 100 100"><ellipse cx="46" cy="54" rx="3" ry="5" fill="#8D6E63"/><ellipse cx="54" cy="46" rx="3" ry="5" fill="#A1887F"/><ellipse cx="50" cy="50" rx="3" ry="5" fill="#8D6E63"/></svg>`,
    },
    {
      id: "nueces",
      name: "Nueces",
      svg: `<svg viewBox="0 0 100 100"><circle cx="46" cy="54" r="8" fill="#795548"/><circle cx="54" cy="54" r="8" fill="#6D4C41"/></svg>`,
    },
    {
      id: "pistachos",
      name: "Pistachos",
      svg: `<svg viewBox="0 0 100 100"><ellipse cx="46" cy="54" rx="4" ry="6" fill="#C5E1A5"/><ellipse cx="54" cy="46" rx="4" ry="6" fill="#AED581"/></svg>`,
    },
    {
      id: "sesamo",
      name: "Sésamo",
      svg: `<svg viewBox="0 0 100 100"><circle cx="45" cy="55" r="2" fill="#FFF8E1"/><circle cx="50" cy="58" r="2" fill="#FFF8E1"/><circle cx="55" cy="54" r="2" fill="#FFF8E1"/><circle cx="50" cy="50" r="2" fill="#FFF8E1"/></svg>`,
    },
    ],
  },

  /* =================== Granos =================== */
  {
    id: "granos",
    name: "Granos",
    svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="50" cy="35" r="8" fill="#8D6E63"/><circle cx="40" cy="50" r="8" fill="#8D6E63"/><circle cx="60" cy="50" r="8" fill="#8D6E63"/><circle cx="35" cy="65" r="8" fill="#8D6E63"/><circle cx="50" cy="65" r="8" fill="#8D6E63"/><circle cx="65" cy="65" r="8" fill="#8D6E63"/></svg>`,
    products: [
      {
        id: "arroz",
        name: "Arroz",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><ellipse cx="50" cy="45" rx="4" ry="12" fill="#ECEFF1"/><ellipse cx="42" cy="50" rx="4" ry="12" fill="#ECEFF1"/><ellipse cx="58" cy="50" rx="4" ry="12" fill="#ECEFF1"/><ellipse cx="35" cy="55" rx="4" ry="12" fill="#ECEFF1"/><ellipse cx="50" cy="55" rx="4" ry="12" fill="#ECEFF1"/><ellipse cx="65" cy="55" rx="4" ry="12" fill="#ECEFF1"/></svg>`,
      },
      {
        id: "avena",
        name: "Avena",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><ellipse cx="50" cy="50" rx="5" ry="8" fill="#FFF9C4"/><ellipse cx="45" cy="55" rx="5" ry="8" fill="#FFF9C4"/><ellipse cx="55" cy="55" rx="5" ry="8" fill="#FFF9C4"/><ellipse cx="50" cy="60" rx="5" ry="8" fill="#FFF9C4"/></svg>`,
      },
      {
        id: "cebada",
        name: "Cebada",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M50 20v60" stroke="#CDDC39" stroke-width="3"/><ellipse cx="50" cy="30" rx="4" ry="8" fill="#CDDC39"/><ellipse cx="50" cy="40" rx="4" ry="8" fill="#CDDC39"/><ellipse cx="50" cy="50" rx="4" ry="8" fill="#CDDC39"/><ellipse cx="50" cy="60" rx="4" ry="8" fill="#CDDC39"/><ellipse cx="50" cy="70" rx="4" ry="8" fill="#CDDC39"/></svg>`,
      },
      {
        id: "centeno",
        name: "Centeno",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><ellipse cx="50" cy="45" rx="4" ry="10" fill="#A1887F"/><ellipse cx="42" cy="50" rx="4" ry="10" fill="#A1887F"/><ellipse cx="58" cy="50" rx="4" ry="10" fill="#A1887F"/></svg>`,
      },
      {
        id: "frijoles",
        name: "Frijoles",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><ellipse cx="45" cy="50" rx="6" ry="10" fill="#6D4C41"/><ellipse cx="55" cy="50" rx="6" ry="10" fill="#6D4C41"/></svg>`,
      },
      {
        id: "garbanzos",
        name: "Garbanzos",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="45" cy="50" r="6" fill="#FFECB3"/><circle cx="55" cy="50" r="6" fill="#FFECB3"/><circle cx="50" cy="58" r="6" fill="#FFECB3"/></svg>`,
      },
      {
        id: "lentejas",
        name: "Lentejas",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="40" cy="50" r="4" fill="#A1887F"/><circle cx="50" cy="50" r="4" fill="#A1887F"/><circle cx="60" cy="50" r="4" fill="#A1887F"/><circle cx="45" cy="55" r="4" fill="#A1887F"/><circle cx="55" cy="55" r="4" fill="#A1887F"/></svg>`,
      },
      {
        id: "maiz",
        name: "Maíz",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M50 20c-8 10-8 50 0 60 8-10 8-50 0-60z" fill="#FFEB3B"/><path d="M40 35c-10 15-10 35 0 50h20c10-15 10-35 0-50z" fill="#4CAF50"/></svg>`,
      },
      {
        id: "quinua",
        name: "Quinua",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="45" cy="50" r="3" fill="#FFF176"/><circle cx="55" cy="50" r="3" fill="#FFF176"/><circle cx="50" cy="55" r="3" fill="#FFF176"/><circle cx="48" cy="45" r="3" fill="#FFF176"/><circle cx="52" cy="45" r="3" fill="#FFF176"/></svg>`,
      },
      {
        id: "sorgo",
        name: "Sorgo",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M50 20v60" stroke="#8BC34A" stroke-width="3"/><circle cx="50" cy="30" r="4" fill="#FF9800"/><circle cx="50" cy="40" r="4" fill="#FF9800"/><circle cx="50" cy="50" r="4" fill="#FF9800"/><circle cx="50" cy="60" r="4" fill="#FF9800"/></svg>`,
      },
      {
        id: "trigo",
        name: "Trigo",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M50 20v60" stroke="#FBC02D" stroke-width="3"/><ellipse cx="50" cy="30" rx="4" ry="8" fill="#FBC02D"/><ellipse cx="50" cy="40" rx="4" ry="8" fill="#FBC02D"/><ellipse cx="50" cy="50" rx="4" ry="8" fill="#FBC02D"/><ellipse cx="50" cy="60" rx="4" ry="8" fill="#FBC02D"/><ellipse cx="50" cy="70" rx="4" ry="8" fill="#FBC02D"/></svg>`,
      },
    ],
  },

  /* =================== Huevos =================== */
  {
    id: "huevos",
    name: "Huevos",
    svg: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="56" rx="16" ry="22" fill="#FFF8E1" stroke="#FFE0B2" stroke-width="2"/></svg>`,
    products: [
      {
        id: "huevo",
        name: "Huevo",
        svg: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="56" rx="14" ry="20" fill="#FFFDE7"/></svg>`,
      },
      {
        id: "claras",
        name: "Claras",
        svg: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="56" rx="14" ry="20" fill="#E3F2FD"/></svg>`,
      },
      {
        id: "yemas",
        name: "Yemas",
        svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="56" r="10" fill="#FFEB3B"/></svg>`,
      },
    ],
  },

  /* =================== Lácteos =================== */
  {
    id: "lacteos",
    name: "Lácteos",
    svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><rect x="37" y="28" width="26" height="48" rx="6" fill="#F0F8FF"/><rect x="40" y="31" width="20" height="42" rx="4" fill="#FFFFFF"/><rect x="42" y="20" width="16" height="10" rx="3" fill="#E0E0E0"/></svg>`,
    products: [
      {
        id: "crema",
        name: "Crema",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><ellipse cx="50" cy="62" rx="20" ry="10" fill="#FFF8E1"/><ellipse cx="50" cy="58" rx="18" ry="8" fill="#FFFFFF"/><ellipse cx="50" cy="54" rx="15" ry="6" fill="#FFF8E1"/></svg>`,
      },
      {
        id: "helado",
        name: "Helado",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M50 28c10 0 18 8 18 18s-8 18-18 18-18-8-18-18 8-18 18-18z" fill="#FFF3E0"/><path d="M50 64 L58 80 L42 80 Z" fill="#E0B07A"/></svg>`,
      },
      {
        id: "kefir",
        name: "Kéfir",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><rect x="36" y="30" width="28" height="44" rx="6" fill="#F1F8FF"/><rect x="39" y="33" width="22" height="38" rx="4" fill="#FFFFFF"/><circle cx="50" cy="40" r="3" fill="#E3F2FD"/><circle cx="46" cy="45" r="2" fill="#E3F2FD"/><circle cx="54" cy="50" r="2" fill="#E3F2FD"/></svg>`,
      },
      {
        id: "leche",
        name: "Leche",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><rect x="35" y="30" width="30" height="50" rx="5" fill="#F0F8FF"/><rect x="38" y="33" width="24" height="44" rx="3" fill="#FFFFFF"/><rect x="40" y="20" width="20" height="15" rx="3" fill="#E0E0E0"/></svg>`,
      },
      {
        id: "mantequilla",
        name: "Mantequilla",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><rect x="30" y="44" width="40" height="22" rx="5" fill="#FFF176" stroke="#FBC02D" stroke-width="2"/><rect x="34" y="48" width="32" height="14" rx="3" fill="#FFEB3B"/></svg>`,
      },
      {
        id: "natilla",
        name: "Natilla",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><ellipse cx="50" cy="62" rx="24" ry="10" fill="#FFF3E0" stroke="#FFE0B2" stroke-width="2"/><ellipse cx="50" cy="58" rx="20" ry="8" fill="#FFFFFF"/></svg>`,
      },
      {
        id: "queso",
        name: "Queso",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M26 70 L50 32 L74 70 Z" fill="#FFEB3B" stroke="#FBC02D" stroke-width="2"/><circle cx="46" cy="56" r="3" fill="#FBC02D"/><circle cx="56" cy="60" r="3" fill="#FBC02D"/></svg>`,
      },
      {
        id: "requeson",
        name: "Requesón",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><rect x="34" y="40" width="32" height="24" rx="6" fill="#FFFFFF" stroke="#E0E0E0" stroke-width="2"/><circle cx="44" cy="52" r="2" fill="#ECEFF1"/><circle cx="56" cy="54" r="2" fill="#ECEFF1"/><circle cx="50" cy="50" r="2" fill="#ECEFF1"/></svg>`,
      },
      {
        id: "yogur",
        name: "Yogur",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><rect x="36" y="32" width="28" height="46" rx="6" fill="#FFFDE7"/><ellipse cx="50" cy="32" rx="14" ry="5" fill="#FFCDD2"/></svg>`,
      },
    ],
  },

  /* =================== Mariscos =================== */
  {
    id: "mariscos",
    name: "Mariscos",
    svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M25 50c0-8 8-15 20-15h10c12 0 20 7 20 15s-8 15-20 15H45c-12 0-20-7-20-15z" fill="#2196F3"/><path d="M75 45l15-5v20l-15-5v-10z" fill="#1976D2"/><circle cx="60" cy="45" r="3" fill="#000"/><path d="M35 40c-3 0-5 2-5 5v10c0 3 2 5 5 5" stroke="#1976D2" stroke-width="2" fill="none"/></svg>`,
    products: [
      {
        id: "almeja",
        name: "Almeja",
        svg: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="55" rx="25" ry="18" fill="#D2B48C"/><ellipse cx="50" cy="50" rx="25" ry="15" fill="#F5DEB3"/></svg>`,
      },
      {
        id: "camaron",
        name: "Camarón",
        svg: `<svg viewBox="0 0 100 100"><path d="M50 50c10-10 20 0 20 10s-10 20-20 10-10-20 0-30z" fill="#FF7F50"/><circle cx="45" cy="45" r="5" fill="#000"/></svg>`,
      },
      {
        id: "cangrejo",
        name: "Cangrejo",
        svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="15" fill="#FF4500"/><path d="M35 45l-10-10M65 45l10-10" stroke="#FF6347" stroke-width="3"/><path d="M35 55l-10 10M65 55l10 10" stroke="#FF6347" stroke-width="3"/></svg>`,
      },
      {
        id: "langosta",
        name: "Langosta",
        svg: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="12" ry="25" fill="#B22222"/><circle cx="50" cy="25" r="8" fill="#B22222"/><circle cx="50" cy="75" r="8" fill="#B22222"/></svg>`,
      },
      {
        id: "mejillon",
        name: "Mejillón",
        svg: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="20" ry="30" fill="#2F4F4F"/><ellipse cx="50" cy="50" rx="15" ry="25" fill="#708090"/></svg>`,
      },
      {
        id: "ostion",
        name: "Ostión",
        svg: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="55" rx="25" ry="20" fill="#C0C0C0"/><circle cx="50" cy="55" r="8" fill="#FFF8DC"/></svg>`,
      },
      {
        id: "pulpo",
        name: "Pulpo",
        svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="40" r="15" fill="#800080"/><path d="M35 55q-5 10 5 15M45 55q-5 10 5 15M55 55q-5 10 5 15M65 55q-5 10 5 15" stroke="#800080" stroke-width="4" fill="none"/></svg>`,
      },
    ],
  },

  /* =================== Pan =================== */
  {
    id: "pan",
    name: "Pan",
    svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M25 45c0-10 10-20 25-20s25 10 25 20v15c0 8-7 15-15 15H40c-8 0-15-7-15-15V45z" fill="#8D6E63"/><path d="M30 50h40v5H30z"/><path d="M30 60h40v5H30z"/><circle cx="40" cy="40" r="2" fill="#5D4037"/><circle cx="50" cy="42" r="2" fill="#5D4037"/><circle cx="60" cy="40" r="2" fill="#5D4037"/></svg>`,
    products: [
      {
        id: "baguette",
        name: "Baguette",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><ellipse cx="50" cy="55" rx="25" ry="10" fill="#C69C6D"/><path d="M35 55 L40 60 M45 55 L50 60 M55 55 L60 60 M65 55 L70 60" stroke="#8D6E63" stroke-width="2"/></svg>`,
      },
      {
        id: "bolillo",
        name: "Bolillo",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><ellipse cx="50" cy="55" rx="20" ry="10" fill="#BCA37F"/><path d="M40 55 Q50 50 60 55" stroke="#8D6E63" stroke-width="2" fill="none"/></svg>`,
      },
      {
        id: "croissant",
        name: "Croissant",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M30 60 Q50 38 70 60 Q60 70 50 70 Q40 70 30 60" fill="#D4A373"/><path d="M40 58 Q50 48 60 58" stroke="#8D6E63" stroke-width="2" fill="none"/></svg>`,
      },
      {
        id: "dona",
        name: "Dona",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="50" cy="55" r="15" fill="#F8BBD0"/><circle cx="50" cy="55" r="6" fill="#FFF"/><circle cx="43" cy="50" r="1.5" fill="#E91E63"/><circle cx="57" cy="58" r="1.5" fill="#9C27B0"/><circle cx="54" cy="48" r="1.5" fill="#FFC107"/></svg>`,
      },
      {
        id: "galletas",
        name: "Galletas",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="50" cy="50" r="20" fill="#8D6E63"/><circle cx="45" cy="45" r="2" fill="#3E2723"/><circle cx="55" cy="45" r="2" fill="#3E2723"/><circle cx="45" cy="55" r="2" fill="#3E2723"/><circle cx="55" cy="55" r="2" fill="#3E2723"/><circle cx="50" cy="50" r="1.5" fill="#3E2723"/></svg>`,
      },
      {
        id: "pan_blanco",
        name: "Pan",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M25 45c0-10 10-20 25-20s25 10 25 20v15c0 8-7 15-15 15H40c-8 0-15-7-15-15V45z" fill="#8D6E63"/><circle cx="40" cy="40" r="2" fill="#5D4037"/><circle cx="50" cy="42" r="2" fill="#5D4037"/><circle cx="60" cy="40" r="2" fill="#5D4037"/></svg>`,
      },
      {
        id: "pan_integral",
        name: "Pan Integral",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><rect x="36" y="42" width="28" height="22" rx="4" fill="#A1887F"/><circle cx="44" cy="50" r="1.2" fill="#5D4037"/><circle cx="56" cy="55" r="1.2" fill="#5D4037"/><circle cx="50" cy="58" r="1.2" fill="#5D4037"/></svg>`,
      },
      {
        id: "pan_pita",
        name: "Pan Pita",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><ellipse cx="50" cy="55" rx="20" ry="12" fill="#D7CCC8"/><path d="M35 55 Q50 50 65 55" stroke="#8D6E63" stroke-width="2" fill="none"/></svg>`,
      },
    ],
  },

  /* =================== Pasta =================== */
  {
    id: "pasta",
    name: "Pasta",
    svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><g stroke="#FFC107" stroke-width="3" fill="none"><path d="M20 30c10-5 20-5 30 0s20 5 30 0"/><path d="M20 40c10-5 20-5 30 0s20 5 30 0"/><path d="M20 50c10-5 20-5 30 0s20 5 30 0"/><path d="M20 60c10-5 20-5 30 0s20 5 30 0"/><path d="M20 70c10-5 20-5 30 0s20 5 30 0"/></g></svg>`,
    products: [
      {
        id: "farfalle",
        name: "Farfalle",
        svg: `<svg viewBox="0 0 100 100"><polygon points="30,40 40,50 30,60 20,50" fill="#FFD54F" stroke="#CC8A00" stroke-width="2"/><polygon points="70,40 80,50 70,60 60,50" fill="#FFD54F" stroke="#CC8A00" stroke-width="2"/></svg>`,
      },
      {
        id: "fettuccine",
        name: "Fettuccine",
        svg: `<svg viewBox="0 0 100 100"><rect x="20" y="46" width="60" height="8" rx="2" fill="#FFD54F" stroke="#CC8A00" stroke-width="2"/></svg>`,
      },
      {
        id: "fusilli",
        name: "Fusilli",
        svg: `<svg viewBox="0 0 100 100"><g fill="none" stroke="#FFD54F" stroke-width="6" stroke-linecap="round"><path d="M30 40c10 10 30 10 40 0"/><path d="M30 52c10 10 30 10 40 0"/><path d="M30 64c10 10 30 10 40 0"/></g><g fill="none" stroke="#CC8A00" stroke-width="2" stroke-linecap="round" opacity="0.6"><path d="M30 40c10 10 30 10 40 0"/><path d="M30 52c10 10 30 10 40 0"/><path d="M30 64c10 10 30 10 40 0"/></g></svg>`,
      },
      {
        id: "lasana",
        name: "Lasaña",
        svg: `<svg viewBox="0 0 100 100"><rect x="28" y="40" width="44" height="24" rx="3" fill="#FFD54F" stroke="#CC8A00" stroke-width="3"/></svg>`,
      },
      {
        id: "macarrones",
        name: "Macarrones",
        svg: `<svg viewBox="0 0 100 100"><g fill="#FFD54F" stroke="#CC8A00" stroke-width="2"><rect x="28" y="48" width="12" height="12" rx="6"/><rect x="44" y="48" width="12" height="12" rx="6"/><rect x="60" y="48" width="12" height="12" rx="6"/></g></svg>`,
      },
      {
        id: "orzo",
        name: "Orzo",
        svg: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="16" ry="6" fill="#FFD54F" stroke="#CC8A00" stroke-width="2"/></svg>`,
      },
      {
        id: "pappardelle",
        name: "Pappardelle",
        svg: `<svg viewBox="0 0 100 100"><rect x="22" y="52" width="56" height="8" rx="3" fill="#FFD54F" stroke="#CC8A00" stroke-width="3"/></svg>`,
      },
      {
        id: "penne",
        name: "Penne",
        svg: `<svg viewBox="0 0 100 100"><polygon points="28,40 40,40 36,60 24,60" fill="#FFD54F" stroke="#CC8A00" stroke-width="2"/></svg>`,
      },
      {
        id: "ravioli",
        name: "Ravioli",
        svg: `<svg viewBox="0 0 100 100"><rect x="36" y="36" width="28" height="28" fill="#FFD54F" stroke="#CC8A00" stroke-width="2"/></svg>`,
      },
      {
        id: "spaguetti",
        name: "Spaguetti",
        svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><g stroke="#FFC107" stroke-width="3" fill="none"><path d="M20 30c10-5 20-5 30 0s20 5 30 0"/><path d="M20 40c10-5 20-5 30 0s20 5 30 0"/><path d="M20 50c10-5 20-5 30 0s20 5 30 0"/><path d="M20 60c10-5 20-5 30 0s20 5 30 0"/><path d="M20 70c10-5 20-5 30 0s20 5 30 0"/></g></svg>`,
      },
      {
        id: "tagliatelle",
        name: "Tagliatelle",
        svg: `<svg viewBox="0 0 100 100"><rect x="20" y="44" width="60" height="4" fill="#FFD54F" stroke="#CC8A00" stroke-width="1"/><rect x="20" y="52" width="60" height="4" fill="#FFD54F" stroke="#CC8A00" stroke-width="1"/></svg>`,
      },
      {
        id: "tortellini",
        name: "Tortellini",
        svg: `<svg viewBox="0 0 100 100"><path d="M50 30a20 20 0 1 0 0 40a10 10 0 1 1 0-20a10 10 0 1 0 0-20z" fill="#FFD54F" stroke="#CC8A00" stroke-width="2"/></svg>`,
      },
    ],
  },

  /* =================== Salsas =================== */
  {
    id: "salsas",
    name: "Salsas",
    svg: `<svg viewBox="0 0 100 100"><rect x="40" y="28" width="20" height="40" rx="4" fill="#FFCDD2"/><rect x="44" y="20" width="12" height="10" rx="2" fill="#EF9A9A"/></svg>`,
    products: [
      {
      id: "barbacoa",
      name: "Barbacoa",
      svg: `<svg viewBox="0 0 100 100"><rect x="38" y="28" width="24" height="40" rx="6" fill="#6D4C41"/><rect x="42" y="22" width="16" height="6" rx="3" fill="#8D6E63"/></svg>`,
    },
    {
      id: "ketchup",
      name: "Ketchup",
      svg: `<svg viewBox="0 0 100 100"><rect x="40" y="30" width="20" height="38" rx="4" fill="#F44336"/><rect x="44" y="24" width="12" height="8" rx="2" fill="#E57373"/></svg>`,
    },
    {
      id: "mayonesa",
      name: "Mayonesa",
      svg: `<svg viewBox="0 0 100 100"><rect x="38" y="30" width="24" height="38" rx="6" fill="#FFFDE7"/><rect x="40" y="26" width="20" height="6" rx="3" fill="#FFF9C4"/></svg>`,
    },
    {
      id: "mostaza",
      name: "Mostaza",
      svg: `<svg viewBox="0 0 100 100"><rect x="40" y="28" width="20" height="40" rx="4" fill="#FFEB3B"/><polygon points="50,20 56,28 44,28" fill="#FBC02D"/></svg>`,
    },
    {
      id: "pesto",
      name: "Pesto",
      svg: `<svg viewBox="0 0 100 100"><rect x="38" y="30" width="24" height="38" rx="6" fill="#8BC34A"/><rect x="42" y="26" width="16" height="6" rx="3" fill="#7CB342"/></svg>`,
    },
    {
      id: "soja",
      name: "De soja",
      svg: `<svg viewBox="0 0 100 100"><rect x="38" y="30" width="24" height="38" rx="4" fill="#3E2723"/><rect x="42" y="26" width="16" height="6" rx="3" fill="#5D4037"/></svg>`,
    },
    {
      id: "sriracha",
      name: "Sriracha",
      svg: `<svg viewBox="0 0 100 100"><rect x="40" y="28" width="20" height="40" rx="4" fill="#E53935"/><polygon points="50,20 56,28 44,28" fill="#C62828"/></svg>`,
    },
    {
      id: "tartara",
      name: "Tártara",
      svg: `<svg viewBox="0 0 100 100"><rect x="38" y="30" width="24" height="38" rx="6" fill="#FFF9C4"/><circle cx="50" cy="50" r="3" fill="#A1887F"/><circle cx="45" cy="46" r="3" fill="#A1887F"/><circle cx="55" cy="54" r="3" fill="#A1887F"/></svg>`,
    },
    ],
  },

  /* =================== Verduras =================== */
  {
    id: "verduras",
    name: "Verduras",
    svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><g fill="#4CAF50"><path d="M50 20c-8 0-15 7-15 15v20c0 8 7 15 15 15s15-7 15-15V35c0-8-7-15-15-15z"/><path d="M40 35h20v5H40z"/><path d="M40 45h20v5H40z"/><path d="M40 55h20v5H40z"/></g></svg>`,
    products: [
      {
        id: "aceituna",
        name: "Aceituna",
        svg: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="20" ry="15" fill="#556B2F"/><circle cx="50" cy="50" r="5" fill="#000"/></svg>`,
      },
      {
        id: "ajo",
        name: "Ajo",
        svg: `<svg viewBox="0 0 100 100"><path d="M50 80 Q30 60 40 40 Q45 25 50 20 Q55 25 60 40 Q70 60 50 80" fill="#EEE8AA" stroke="#BDB76B"/></svg>`,
      },
      {
        id: "berenjena",
        name: "Berenjena",
        svg: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="60" rx="18" ry="28" fill="#6A0DAD"/><path d="M50 28 Q48 20 52 15 Q56 20 54 28 Z" fill="#228B22"/></svg>`,
      },
      {
        id: "brocoli",
        name: "Brócoli",
        svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="40" r="20" fill="#228B22"/><rect x="45" y="40" width="10" height="30" fill="#6B8E23"/></svg>`,
      },
      {
        id: "calabacin",
        name: "Calabacín",
        svg: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="15" ry="35" fill="#6B8E23"/><ellipse cx="50" cy="50" rx="12" ry="32" fill="#9ACD32"/></svg>`,
      },
      {
        id: "calabaza",
        name: "Calabaza",
        svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="55" r="25" fill="#FFA500"/><path d="M50 25 Q48 20 52 15 Q56 20 54 25 Z" fill="#228B22"/></svg>`,
      },
      {
        id: "cebolla",
        name: "Cebolla",
        svg: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="60" rx="20" ry="25" fill="#DAA520"/><path d="M50 20 Q48 15 52 10 Q56 15 54 20 Z" fill="#228B22"/></svg>`,
      },
      {
        id: "champinon",
        name: "Champiñón",
        svg: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="40" rx="25" ry="15" fill="#DEB887"/><rect x="45" y="40" width="10" height="25" fill="#F5DEB3"/></svg>`,
      },
      {
        id: "cilantro",
        name: "Cilantro",
        svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="20" fill="#228B22"/><line x1="50" y1="50" x2="50" y2="80" stroke="#006400" stroke-width="3"/></svg>`,
      },
      {
        id: "espinaca",
        name: "Espinaca",
        svg: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="20" ry="35" fill="#228B22"/><path d="M50 15 Q55 20 50 25 Q45 20 50 15" fill="#006400"/></svg>`,
      },
      {
        id: "lechuga",
        name: "Lechuga",
        svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="30" fill="#8BC34A"/><path d="M50 20 Q30 40 50 60 Q70 40 50 20" fill="#4CAF50"/></svg>`,
      },
      {
        id: "maiz",
        name: "Maíz",
        svg: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="15" ry="35" fill="#FFD700"/><rect x="47" y="15" width="6" height="70" fill="#FFA500"/></svg>`,
      },
      {
        id: "papa",
        name: "Papa",
        svg: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="55" rx="20" ry="25" fill="#D2B48C"/><circle cx="45" cy="50" r="2" fill="#8B4513"/><circle cx="55" cy="60" r="2" fill="#8B4513"/></svg>`,
      },
      {
        id: "pepino",
        name: "Pepino",
        svg: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="15" ry="35" fill="#2E8B57"/><ellipse cx="50" cy="50" rx="12" ry="32" fill="#3CB371"/></svg>`,
      },
      {
        id: "pimiento",
        name: "Pimiento",
        svg: `<svg viewBox="0 0 100 100"><path d="M50 25 Q65 35 60 65 Q55 85 50 80 Q45 85 40 65 Q35 35 50 25" fill="#FF5722"/></svg>`,
      },
      {
        id: "rabano",
        name: "Rábano",
        svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="60" r="15" fill="#FF0000"/><path d="M50 40 Q48 30 52 25 Q56 30 54 40 Z" fill="#228B22"/></svg>`,
      },
      {
        id: "tomate",
        name: "Tomate",
        svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="25" fill="#FF6347"/><path d="M50 20 Q48 15 52 10 Q56 15 54 20 Z" fill="#228B22"/></svg>`,
      },
      {
        id: "zanahoria",
        name: "Zanahoria",
        svg: `<svg viewBox="0 0 100 100"><path d="M50 20 Q55 40 50 80 Q45 40 50 20" fill="#FFA500"/><path d="M48 18 Q50 10 52 18" stroke="#228B22" stroke-width="2" fill="none"/></svg>`,
      },
    ],
  },
];