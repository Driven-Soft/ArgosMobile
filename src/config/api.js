// Configuração da base URL da API .NET do Argos.
//
// PRODUÇÃO (padrão): a API está hospedada no Render e é consumida via HTTPS.
// Essa é a URL que o app mobile deve usar normalmente.
//
//   https://argosapi-net.onrender.com
//
// ⚠️ Cold start (free tier do Render): após ~15 min sem tráfego o serviço
// "dorme". A primeira request pode levar 30–50s para acordar; as seguintes
// são rápidas. Por isso o timeout do cliente HTTP é generoso (ver http.js).

export const API_BASE_URL = "https://argosapi-net.onrender.com";
