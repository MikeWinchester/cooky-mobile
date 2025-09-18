import React from 'react';

export type Item = {
    id: string;
    name: string;
    svg: string;
    icon?: React.ReactNode;
};

export const dislike: Item[] = [
    { 
        id: "cilantro", 
        name: "Cilantro", 
        svg: '<svg viewBox="0 0 100 100" width="100%" height="100%"><rect x="48" y="60" width="4" height="30" fill="#228B22"/><path d="M25 45 Q30 35 35 40 L40 45 Q35 50 30 45 Q25 50 20 45 Q25 40 25 45" fill="#32CD32"/><path d="M45 35 Q50 25 55 30 L60 35 Q55 40 50 35 Q45 40 40 35 Q45 30 45 35" fill="#90EE90"/><path d="M65 50 Q70 40 75 45 L80 50 Q75 55 70 50 Q65 55 60 50 Q65 45 65 50" fill="#32CD32"/><path d="M35 25 Q40 15 45 20 L50 25 Q45 30 40 25 Q35 30 30 25 Q35 20 35 25" fill="#90EE90"/><path d="M55 55 Q60 45 65 50 L70 55 Q65 60 60 55 Q55 60 50 55 Q55 50 55 55" fill="#228B22"/><circle cx="27" cy="42" r="1" fill="#006400" opacity="0.7"/><circle cx="47" cy="32" r="1" fill="#006400" opacity="0.7"/><circle cx="67" cy="47" r="1" fill="#006400" opacity="0.7"/></svg>' 
    },
    { 
        id: "aceituna", 
        name: "Aceituna", 
        svg: '<svg viewBox="0 0 100 100" width="100%" height="100%"><ellipse cx="50" cy="55" rx="20" ry="25" fill="#2F4F2F"/><ellipse cx="50" cy="55" rx="15" ry="20" fill="#556B2F"/><circle cx="50" cy="45" r="3" fill="#8FBC8F"/><path d="M47 30 Q50 25 53 30 Q50 35 47 30" fill="#228B22"/></svg>' 
    },
    { 
        id: "brocoli", 
        name: "Brócoli", 
        svg: '<svg viewBox="0 0 100 100" width="100%" height="100%"><rect x="46" y="65" width="8" height="25" fill="#8FBC8F"/><circle cx="35" cy="45" r="8" fill="#228B22"/><circle cx="50" cy="38" r="10" fill="#32CD32"/><circle cx="65" cy="45" r="8" fill="#228B22"/><circle cx="42" cy="55" r="6" fill="#90EE90"/><circle cx="58" cy="55" r="6" fill="#90EE90"/><circle cx="50" cy="52" r="7" fill="#32CD32"/><circle cx="30" cy="52" r="5" fill="#006400"/><circle cx="70" cy="52" r="5" fill="#006400"/><circle cx="38" cy="38" r="4" fill="#90EE90"/><circle cx="62" cy="38" r="4" fill="#90EE90"/><circle cx="25" cy="42" r="3" fill="#228B22"/><circle cx="75" cy="42" r="3" fill="#228B22"/><path d="M42 68 L46 70 L50 68 L54 70 L58 68" stroke="#228B22" stroke-width="1" fill="none"/></svg>' 
    },
];

export const quick: Item[] = [
    { 
        id: "champiñon", 
        name: "Champiñón", 
        svg: '<svg viewBox="0 0 100 100" width="100%" height="100%"><ellipse cx="50" cy="45" rx="30" ry="20" fill="#D2B48C"/><ellipse cx="50" cy="45" rx="25" ry="15" fill="#F5DEB3"/><rect x="45" y="55" width="10" height="25" fill="#FFFACD"/><circle cx="40" cy="40" r="2" fill="#8B4513" opacity="0.5"/><circle cx="60" cy="42" r="1.5" fill="#8B4513" opacity="0.5"/><circle cx="52" cy="38" r="1" fill="#8B4513" opacity="0.3"/></svg>' 
    },
    { 
        id: "ajo", 
        name: "Ajo", 
        svg: '<svg viewBox="0 0 100 100" width="100%" height="100%"><ellipse cx="50" cy="60" rx="18" ry="25" fill="#F5F5DC"/><ellipse cx="50" cy="60" rx="15" ry="22" fill="#FFFACD"/><path d="M45 35 Q50 30 55 35 Q52 40 50 38 Q48 40 45 35" fill="#90EE90"/><circle cx="50" cy="65" r="2" fill="#8B4513" opacity="0.3"/><path d="M47 50 Q50 48 53 50" stroke="#DEB887" stroke-width="1" fill="none"/></svg>' 
    },
    { 
        id: "pimiento", 
        name: "Pimiento", 
        svg: '<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M35 70 Q30 50 35 40 Q45 30 55 30 Q65 30 75 40 Q80 50 75 70 Q70 80 50 80 Q30 80 35 70" fill="#FF6347"/><path d="M38 65 Q33 50 38 42 Q46 35 54 35 Q62 35 72 42 Q77 50 72 65 Q68 75 50 75 Q32 75 38 65" fill="#FF4500"/><path d="M45 25 Q50 20 55 25 Q52 30 50 28 Q48 30 45 25" fill="#228B22"/><circle cx="45" cy="50" r="2" fill="#8B0000" opacity="0.3"/></svg>' 
    },
    { 
        id: "picante", 
        name: "Picante", 
        svg: '<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M45 80 Q40 60 42 50 Q45 40 50 35 Q55 30 60 35 Q62 45 60 55 Q58 70 55 80" fill="#DC143C"/><path d="M47 75 Q42 58 44 50 Q46 42 50 38 Q54 35 58 38 Q60 46 58 54 Q56 68 53 75" fill="#FF0000"/><path d="M55 25 Q60 20 65 25 Q62 30 60 28 Q58 30 55 25" fill="#228B22"/><circle cx="48" cy="45" r="1" fill="#8B0000" opacity="0.5"/></svg>' 
    },
    { 
        id: "pepino", 
        name: "Pepino", 
        svg: '<svg viewBox="0 0 100 100" width="100%" height="100%"><ellipse cx="50" cy="50" rx="15" ry="35" fill="#32CD32"/><ellipse cx="50" cy="50" rx="12" ry="32" fill="#90EE90"/><circle cx="45" cy="35" r="2" fill="#228B22" opacity="0.6"/><circle cx="55" cy="40" r="1.5" fill="#228B22" opacity="0.6"/><circle cx="48" cy="50" r="1.5" fill="#228B22" opacity="0.6"/><circle cx="54" cy="55" r="2" fill="#228B22" opacity="0.6"/><circle cx="46" cy="65" r="1.5" fill="#228B22" opacity="0.6"/></svg>' 
    },
];
