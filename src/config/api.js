// Configuração da base URL da API .NET do Argos.
//
// Em desenvolvimento use HTTP puro (NÃO https).
// `HOST` deve ser o IP da máquina que roda a API na rede Wi-Fi — costuma ser o
// mesmo IP que o Metro/Expo exibe ao iniciar. Ele muda conforme o DHCP do
// roteador, então atualize quando necessário.
//
//   • Celular físico (Expo Go):  IP da máquina na Wi-Fi (ex.: "192.168.15.6")
//   • Emulador Android:          "10.0.2.2"
//   • Simulador iOS:             "localhost"

const HOST = "192.168.15.6";
const PORT = 5084;

export const API_BASE_URL = `http://${HOST}:${PORT}`;
