# ForgeIQ — Developer Intelligence Platform

*Project concept, architecture, growth roadmap and technical direction*

---

## 1. The Idea

ForgeIQ is a developer intelligence platform that observes software-development activity, analyses engineering data, and uses AI to identify patterns, bottlenecks, risks and opportunities for improvement. Rather than being another CRUD application or simple dashboard, it aims to answer the deeper question: **"What is happening in my development process, and why?"**

The platform connects to repositories and CI/CD systems, collects engineering telemetry, analyses source code and pipeline behaviour, correlates the resulting metrics, and provides evidence-based recommendations through an AI layer.

---

## 2. Core Vision

Build an **"observability platform for software development"** that turns Git, CI/CD, Java code, tests and project documentation into actionable engineering intelligence.

**Example insight:** Instead of only reporting that pipeline failures increased, ForgeIQ could determine that integration tests account for most failures, that those failures are concentrated around an authentication module, and that a recent configuration change is strongly correlated with the increase.

---

## 3. High-Level Architecture

- **Data sources:** Git repositories, GitLab CI/CD, Maven/Java projects, Docker and eventually other engineering tools.
- **Ingestion layer:** Collect commits, merge requests, changed files, pipelines, jobs, test results, build information and logs.
- **Java analysis engine:** Process engineering events, calculate metrics, analyse Java projects and correlate data.
- **Data layer:** PostgreSQL for structured/historical engineering data and a vector database for semantic retrieval.
- **AI/RAG layer:** Retrieve relevant code, commits, CI logs, tests and documentation before generating grounded insights.
- **Frontend:** React dashboard for engineering metrics, risk areas, trends and AI-generated explanations.
- **Infrastructure:** Docker and GitLab CI/CD for reproducible deployment and automated delivery.

---

## 4. Key Capabilities

### Git Intelligence
Commits, branches, files changed, authors, commit frequency, change size and repository activity.

### CI/CD Intelligence
Pipeline success rate, job duration, failure frequency, retries, stages and failure hotspots.

### Java Intelligence
Classes, methods, dependencies, complexity, coupling, test coverage and structural relationships.

### Engineering Metrics
Cycle time, review time, deployment frequency, build performance, quality and reliability indicators.

### Correlation Engine
Connect code changes, complexity, test coverage and CI failures to identify likely causes and patterns.

### RAG Knowledge Layer
Index source code, documentation, commits, CI logs and test results so AI answers are grounded in project evidence.

### AI Engineering Insights
Convert evidence into a structured problem, evidence, impact, likely cause, recommendation and confidence.

### Risk Analysis
Identify high-risk modules based on change frequency, complexity, coverage and failure history.

### Predictive Intelligence
Eventually predict the probability that a code change will cause a build or pipeline failure.

---

## 5. Example User Experience

A developer opens ForgeIQ and sees:

- Pipeline success: 91%
- Test coverage: 76%
- High-risk components: `AuthenticationService`, `PaymentService` and `UserService`
- Pipeline failure hotspots: authentication and integration tests
- AI engineering insight: **"Authentication is becoming a bottleneck."**

The developer can select **"Why?"** on a metric. ForgeIQ traces the evidence through historical engineering data and explains the likely cause rather than simply displaying a number.

---

## 6. Example "Why?" Investigation

1. **Why are pipelines failing?** → Most failures originate from integration tests.
2. **Why are integration tests failing?** → Most failures involve database connectivity.
3. **When did this begin?** → The increase started after a specific commit.
4. **What changed?** → The commit modified connection-pooling configuration.
5. **Conclusion** → The configuration change is strongly correlated with the increase in integration-test failures.
6. **Recommendation** → Investigate the connection-pool change and strengthen the relevant integration tests.

---

## 7. Technology Direction

| Technology | Role |
|------------|------|
| **Java** | Core processing and analysis engine; concurrency, event processing, parsing and engineering logic. |
| **Spring Boot** | Application/integration layer where appropriate, without making the project merely an API. |
| **React** | Interactive analytics and AI-insight dashboard. |
| **PostgreSQL** | Historical engineering metrics and structured data. |
| **Vector database** | Semantic retrieval for code, documentation, commits and CI evidence. |
| **RAG + LLM** | Grounded engineering analysis and recommendations. |
| **Docker** | Isolation, reproducibility and deployment. |
| **GitLab CI/CD** | Automated build, testing and deployment. |
| **Git / Maven / Java tooling** | Primary engineering-data sources and code-analysis targets. |

---

## 8. Development Roadmap

| Stage | Focus |
|-------|-------|
| **Stage 1 — Git Intelligence** | Connect a repository and analyse commits, authors, files, branches and changes. |
| **Stage 2 — CI/CD Intelligence** | Connect GitLab and analyse pipelines, jobs, duration, failures and stages. |
| **Stage 3 — Java Intelligence** | Parse Java projects and calculate code structure, dependencies, complexity and coverage. |
| **Stage 4 — Correlation Engine** | Find relationships between code changes, quality metrics and pipeline failures. |
| **Stage 5 — RAG** | Index source code, documentation, commits, CI logs and test results. |
| **Stage 6 — AI Insights** | Generate evidence-based explanations and recommendations. |
| **Stage 7 — Predictive Intelligence** | Use historical data to predict failure risk and identify likely problem areas. |

---

## 9. Skills This Project Builds

### Existing skills leveraged
- Java
- Python
- Git/GitLab
- CI/CD
- Docker
- React
- SQL/databases
- RAG/LLMs
- Testing

### New skills deliberately developed
- Advanced Java and concurrency
- Event-driven architecture
- Static code analysis and AST parsing
- System design and data modelling
- Engineering observability
- Data correlation and analytical reasoning
- AI evaluation and grounded generation
- Predictive analytics / machine learning
- Scalable data processing

---

## 10. Why This Project Fits the Developer

The project is designed around skills already being developed — Java, GitLab CI/CD, Docker, databases, React and AI/RAG — while deliberately pushing into deeper engineering concepts. It also connects naturally with a mathematical and analytical background through metrics, correlations, optimisation and eventually predictive modelling.

The project can therefore demonstrate **progression** rather than technology collecting: each version starts from an existing capability and introduces a meaningful new engineering challenge.

---

## 11. Portfolio Positioning

> *"ForgeIQ is a Java-based software engineering intelligence platform that collects Git and CI/CD telemetry, analyses code and test behaviour, correlates engineering signals, and uses RAG and AI to provide evidence-based insights into software quality, delivery performance and engineering risk."*

---

## 12. Long-Term Vision

ForgeIQ can evolve from a personal engineering dashboard into a broader engineering intelligence platform. Future capabilities could include:

- Predictive pipeline failures
- Automated code-risk scoring
- Architecture mapping
- Team/project analytics
- AI-assisted root-cause analysis
- Recommendations that are continuously evaluated against subsequent engineering outcomes

