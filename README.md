graph TD
    subgraph "User Interaction"
        U[👨‍💻 User / Load Generator]
    end

    subgraph "Application Services (Docker Compose)"
        GW[🚀 API Gateway (Node.js)]
        US[🐍 User Service (Python)]
    end

    subgraph "Metrics Pipeline"
        P[🔥 Prometheus]
    end

    subgraph "Logging Pipeline"
        D[🐳 Docker Engine]
        PT[📜 Promtail]
        L[🐺 Loki]
    end

    subgraph "Visualization & Alerting"
        G[📊 Grafana]
        W[📡 Webhook.site]
    end

    %% --- Data Flows ---

    %% User Request Flow
    U -- "1. HTTP Request" --> GW
    GW -- "2. Internal API Call" --> US

    %% Metrics Flow
    GW -- "3a. Exposes /metrics" --> P
    US -- "3b. Exposes /metrics" --> P
    P -- "4. Scrapes Metrics" --> GW & US
    G -- "5. Queries Metrics (PromQL)" --> P

    %% Logging Flow
    GW & US -- "6. Write Logs to stdout" --> D
    PT -- "7. Scrapes Docker Logs" --> D
    PT -- "8. Pushes Logs" --> L
    G -- "9. Queries Logs (LogQL)" --> L

    %% Alerting Flow
    G -- "10. Sends Notification (if alert fires)" --> W

    %% User View Flow
    U -- "Views Dashboard" --> G
