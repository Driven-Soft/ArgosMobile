<p align="center">
  <img src="./assets/images/ArgosLogoTitle.png" alt="Logo do Argos" width="260" />
</p>

<h1 align="center">Argos</h1>

<p align="center">
  <strong>Monitoramento de risco de inundações e deslizamentos, do céu até a sua rua.</strong>
</p>

---

## Sobre o Projeto

O **Argos** é um aplicativo móvel React Native desenvolvido para a **Global Solution (FIAP 2026)**, dentro do tema de **uso de dados satelitais para prevenção de desastres naturais**.

O Brasil convive todos os anos com tragédias causadas por chuvas extremas — enchentes urbanas, transbordamento de rios e deslizamentos de encostas. Boa parte dessas mortes é evitável: o que falta, na ponta, é **informação acionável e em tempo hábil** chegando ao cidadão comum.

O Argos resolve isso conectando **dois mundos**:

1. **Dados de observação da Terra (satélite/sensoriamento remoto)** — para prever objetivamente, célula por célula do território, onde o risco de inundação e deslizamento está subindo.
2. **A comunidade e a Defesa Civil** — para reportar ocorrências reais em campo, emitir alertas e coordenar a resposta.

O resultado é uma plataforma de segurança pública que transforma dados de satélite em um mapa de risco visual, alertas em tempo real e um canal de comunicação direto entre cidadãos e autoridades.

---

## Relação com o Tema da GS: Dados Satelitais

O coração técnico do Argos é o consumo de **dados de observação da Terra** através da **Open-Meteo API** (gratuita, sem chave). Esses dados são derivados de **satélites e modelos de reanálise alimentados por sensoriamento remoto**:

| Dado utilizado | Origem (sensoriamento remoto / satélite) | Uso no Argos |
| --- | --- | --- |
| **Vazão fluvial** (`river_discharge`) | **GloFAS** (Global Flood Awareness System / Copernicus), resolução de 5 km | Detecção de risco de **inundação** por transbordamento de rios |
| **Umidade do solo** (`soil_moisture_9_to_27cm`) | Modelos de reanálise (ERA5) alimentados por satélites de umidade do solo | Fator estrutural do risco de **deslizamento** |
| **Precipitação acumulada e atual** | Reanálise meteorológica + estimativas de precipitação por satélite | Gatilho principal do cálculo de risco |
| **Elevação do terreno** | **DEM** (Modelo Digital de Elevação) de 90 m, derivado de missões orbitais | Refino do risco de deslizamento por declividade |

Esses dados são cruzados em um **índice de risco** calculado no próprio app (ver seção *Cálculo de Risco*) e projetados sobre um **mapa de calor** ao redor da posição do usuário. É exatamente a proposta da GS: **pegar dados que vêm do espaço e transformá-los em prevenção concreta na vida das pessoas.**

> A camada de observação da Terra (Open-Meteo / GloFAS) é **complementar** à API REST própria (.NET), que cuida do conteúdo gerado por pessoas: usuários, ocorrências reportadas, comentários e alertas oficiais.

---

## Funcionalidades

- 🛰️ **Mapa de Risco (Heatmap)** — grid de coordenadas ao redor do usuário; para cada ponto, o risco de inundação/deslizamento é calculado a partir de dados de satélite e exibido com escala semântica de cores (verde → amarelo → laranja → vermelho).
- 🌧️ **Dashboard / Card Hero** — nível de risco atual da sua localização, precipitação nas últimas 24h, condição climática e probabilidade de chuva.
- 🚨 **Alertas em tempo real** — feed de alertas oficiais com filtros (Todos / Ativos / Críticos), badge de severidade e tela de detalhamento com mapa e recomendações.
- 📍 **Reporte de ocorrências (crowdsourcing)** — o cidadão registra rua alagada, queda de barreira, etc., com geolocalização automática e ajuste manual do pino no mapa.
- 💬 **Comunicação por ocorrência** — feed de atualizações estilo chat dentro de cada ocorrência.
- 🗑️ **Gestão das próprias ocorrências** — o autor pode excluir as ocorrências que registrou.
- 👤 **Perfil do usuário** — cadastro, login, edição de dados e histórico.

---

## CRUD com a API .NET (RESTful + Axios)

Todo o conteúdo gerado por usuários é **armazenado e manipulado via API REST .NET** (nunca apenas no dispositivo), consumida com **Axios**, com **loaders** e **tratamento de erro** (mensagens e alertas) em todas as operações.

| Operação | Método HTTP | Endpoint | Onde acontece no app |
| --- | --- | --- | --- |
| **Create** | `POST` | `/usuarios` | Cadastro de conta |
| **Create** | `POST` | `/ocorrencias` | Registrar ocorrência |
| **Create** | `POST` | `/ocorrencias/{id}/comentarios` | Enviar atualização/comentário |
| **Read** | `GET` | `/alertas`, `/ocorrencias`, `/usuarios`, `/tipos-ocorrencia` | Feeds, mapas, perfil |
| **Update** | `PATCH` | `/usuarios/{id}` | Editar perfil |
| **Delete** | `DELETE` | `/ocorrencias/{id}` | Excluir ocorrência própria |

A camada HTTP fica centralizada em `src/services/http.js` (instância Axios + interceptor que normaliza os `ProblemDetails` da API em mensagens amigáveis), e as chamadas por domínio em `src/services/api/`.

---

## Telas e Navegação

Navegação com **React Navigation** (Stack raiz + Bottom Tabs), com mais de 5 telas distintas:

- **Autenticação:** Welcome, Login, Cadastro
- **Bottom Tabs:** Início, Mapa, Alertas, Ocorrências, Perfil
- **Fluxos:** Detalhe do Alerta, Detalhe da Ocorrência, Registrar Ocorrência, Editar Perfil, Detalhe da Zona, Notificações, Busca

---

## Cálculo de Risco

O índice de risco é calculado no frontend (`src/services/risk.js`) a partir dos dados de satélite, normalizando cada variável de 0 a 1 e combinando-as por pesos:

```
score = (precipitação24h × 0.55) + (umidadeSolo × 0.20) + (chuvaAtual × 0.25)
```

| Nível | Score | Cor | Mensagem |
| --- | --- | --- | --- |
| 🟢 Baixo | 0.00 – 0.24 | `#22C55E` | Situação normal |
| 🟡 Médio | 0.25 – 0.49 | `#EAB308` | Atenção recomendada |
| 🟠 Alto | 0.50 – 0.74 | `#F97316` | Risco real, evite áreas baixas |
| 🔴 Crítico | 0.75 – 1.00 | `#EF4444` | Perigo iminente, busque local seguro |

---

## Tecnologias Utilizadas

| Tecnologia | Versão | Finalidade |
| --- | --- | --- |
| Expo | ~54.0.35 | Plataforma de desenvolvimento mobile React Native |
| React | 19.1.0 | Biblioteca de interface de usuário |
| React Native | 0.81.5 | Framework para apps móveis nativos |
| React Navigation (native / stack / bottom-tabs) | 7.x | Navegação entre telas e abas |
| axios | ^1.16.1 | Cliente HTTP para consumo das APIs (REST .NET e Open-Meteo) |
| react-native-maps | 1.20.1 | Mapas, marcadores e overlay de risco |
| expo-location | ~19.0.8 | Geolocalização do usuário e geotag de ocorrências |
| @react-native-async-storage/async-storage | 2.2.0 | Sessão local e rastreio de ocorrências próprias |
| @expo-google-fonts/public-sans | ^0.4.2 | Fonte oficial do app (Public Sans) |
| @expo/vector-icons | ^15.0.3 | Ícones da interface |
| nativewind | ^4.2.4 | Estilização Tailwind CSS para React Native |
| tailwindcss | ^3.4.19 | Utilitários CSS e tokens de design |
| react-native-reanimated / worklets | ~4.1.1 / 0.5.1 | Animações fluidas (bottom sheet, transições) |
| react-native-gesture-handler | ~2.28.0 | Gestos e interações de toque |
| react-native-safe-area-context | ~5.6.0 | Respeito às áreas seguras de tela |
| react-native-screens | ~4.16.0 | Otimização de telas e navegação |
| react-native-web | ^0.21.0 | Suporte de execução no navegador |
| prettier-plugin-tailwindcss | ^0.5.14 | Formatação consistente de código e classes Tailwind |

---

## Estrutura do Projeto

```
Argos/
├─ App.js                      # Entry point: fontes, sessão e NavigationContainer
├─ app.json
├─ babel.config.js
├─ global.css                  # Diretivas Tailwind/NativeWind
├─ index.js
├─ metro.config.js
├─ tailwind.config.js          # Tokens de design (cores, fontes)
├─ ARGOS_SPEC.md               # Especificação técnica (APIs e cálculo de risco)
├─ assets/                     # Imagens, logo e ícones
└─ src/
   ├─ components/
   │  ├─ map/                  # MapSearchBar, NearbyZonesSheet, RiskLegend
   │  └─ ui/                   # AlertCard, RiskBadge, FAB, ScreenHeader, TextField...
   ├─ config/
   │  └─ api.js                # Base URL da API .NET (HOST/PORT configuráveis)
   ├─ constants/               # theme.js, alerts.js, incidents.js
   ├─ routes/                  # stack / tab / alertas / ocorrencias (React Navigation)
   ├─ screens/                 # Telas e seus sub-módulos (Alertas, Ocorrencias, auth...)
   ├─ services/
   │  ├─ api/                  # alerts, incidents, users, types, openMeteo (satélite)
   │  ├─ http.js               # Instância Axios + interceptor de erros
   │  ├─ location.js           # Geolocalização
   │  ├─ risk.js               # Cálculo do índice de risco
   │  └─ session.js            # Sessão local e ocorrências próprias
   └─ utils/                   # format.js, masks.js
```

---

## Como Executar

### Pré-requisitos

- Node.js 18.x ou superior
- Emulador Android/iOS ou dispositivo físico com o **Expo Go** instalado
- A **API .NET do Argos** já está hospedada em produção no Render — não é preciso rodar nada localmente para o CRUD funcionar

### 1. App mobile

```bash
git clone https://github.com/Driven-Soft/ArgosMobile
cd Argos
npm install
npm start
```

Para rodar diretamente:

```bash
npm run android
# ou
npm run ios
# ou
npm run web
```

### 2. API .NET (produção)

O endereço da API é definido em [`src/config/api.js`](./src/config/api.js). Por padrão o app já aponta para a **API em produção no Render**, então não é necessário configurar nada para os recursos de alertas e ocorrências (CRUD) funcionarem:

```js
export const API_BASE_URL = "https://argosapi-net.onrender.com";
```

Os endpoints respondem direto nas rotas dos controllers, por exemplo:

- `GET https://argosapi-net.onrender.com/tipos-ocorrencia`
- `GET https://argosapi-net.onrender.com/ocorrencias`

> ⏱️ **Cold start (free tier do Render):** após ~15 min sem tráfego o serviço "dorme". A **primeira** request do app pode levar **30–50s** para acordar o servidor; as seguintes são rápidas. Por isso o timeout do cliente HTTP foi aumentado para **60s** em [`src/services/http.js`](./src/services/http.js).

> ℹ️ Mesmo sem a API, o mapa de risco por satélite continua funcionando, pois usa a Open-Meteo diretamente.

---

## Equipe Driven Soft

### Integrantes

| Nome | RM |
| --- | --- |
| Felipe Bezerra Beatrici | 564723 |
| Max Hayashi Batista | 563717 |
| Henrique Cunha Torres | 565119 |

### Link do Vídeo de Demonstração

* [https://youtu.be/bQOAkRHnJs8](https://youtu.be/bQOAkRHnJs8)

### Link do Repositório no GitHub

* [https://github.com/Driven-Soft/ArgosMobile](https://github.com/Driven-Soft/ArgosMobile)
