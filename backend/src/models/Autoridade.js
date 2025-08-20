const pool = require('../config/db');

// Lista de autoridades mockadas com suas coordenadas
const autoridades = [
    {
        nome: 'Polícia Turística Central',
        telefone: '(38) 99999-9999',
        email: 'contato.turismo@mg.gov.br',
        localizacao: { lat: -15.4746, lng: -44.3855 } // Januária, MG
    },
    {
        nome: 'Corpo de Bombeiros Januária',
        telefone: '(38) 98888-8888',
        email: 'bombeiros@mg.gov.br',
        localizacao: { lat: -15.4850, lng: -44.3800 } // Próximo ao centro
    },
    {
        nome: 'Hospital Regional',
        telefone: '(38) 97777-7777',
        email: 'hospital@mg.gov.br',
        localizacao: { lat: -15.4950, lng: -44.4000 } // Outra localização
    }
];

// Função para calcular a distância entre duas coordenadas (fórmula de Haversine)
function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}

class Autoridade {
    static async getByLocation(localizacao) {
        let autoridadeMaisProxima = null;
        let menorDistancia = Infinity;

        autoridades.forEach(autoridade => {
            const distancia = haversine(
                localizacao.lat,
                localizacao.lng,
                autoridade.localizacao.lat,
                autoridade.localizacao.lng
            );

            if (distancia < menorDistancia) {
                menorDistancia = distancia;
                autoridadeMaisProxima = autoridade;
            }
        });

        return autoridadeMaisProxima;
    }
}

module.exports = Autoridade;