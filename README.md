# Validação Automática de Planos de Ensino (TCC)

Sistema semiautomático que valida planos de ensino em PDF usando n8n e IA local (Ollama), verificando se todos os campos obrigatórios estão preenchidos corretamente. Tudo roda localmente, sem conta Google: os PDFs ficam na pasta `planos/` e os resultados são gravados em `resultados/` (um JSON por plano), visualizados em um dashboard HTML que também exporta CSV.

## Como funciona

```
Pasta planos/ (PDFs)
        │
        ▼
n8n: lê e extrai o texto de cada PDF
        │
        ▼
Separa o texto por seções (ementa, objetivos, metodologia, ...)
        │
        ▼
IA (Ollama qwen2.5:7b local/GPU, ou Gemini): avalia cada campo → OK / INCOMPLETO / AUSENTE
        │
        ▼
resultados/<plano>.json ──► Dashboard HTML (/webhook/dashboard) ──► Baixar CSV
```

### Critérios avaliados

Identificação (instituição, componente, docente) · Ementa · Objetivos geral e específicos (basta estarem preenchidos) · Conteúdo programático · Metodologia · Procedimentos de avaliação · Cronograma · Avaliações · Horário de atendimento · Referências (mín. 3 básicas + 5 complementares) · Coerência entre objetivos, metodologia e avaliação.

## Arquivos

| Arquivo | O que é |
|---------|---------|
| `3go4m2xSKi3p5P0g-My_workflow.json` | Workflow principal de validação (roda todo dia às 5h ou manualmente) |
| `dashboard-planos.json` | Workflow do dashboard HTML via webhook |
| `docker-compose.yml` | Stack n8n + Ollama (com GPU NVIDIA) |
| `planos/` | Coloque aqui os PDFs a validar |
| `resultados/` | Gerado pelo workflow: um `.json` por plano (reprocessar sobrescreve) |

## Requisitos

- Docker Desktop
- GPU NVIDIA (opcional, mas ~10x mais rápido; sem GPU remova o bloco `deploy` do `docker-compose.yml`)

## Setup

### 1. Subir os containers

```bash
docker compose up -d
docker exec vslongo-workflows-ollama-1 ollama pull qwen2.5:7b
```

> O modelo padrão agora é o **qwen2.5:7b** (melhor que o llama3.2 em português e em saída JSON). Para trocar, edite a constante `OLLAMA_MODEL` no nó **Preparar Prompt**.

- n8n: http://localhost:5678 (criar conta local no primeiro acesso)
- Ollama: acessível pelos workflows em `http://ollama:11434`

### 2. Importar os workflows no n8n

Add workflow → ⋮ → **Import from file** (para os dois JSONs). Não há credenciais para configurar.

### 3. Usar

- **Validar**: copiar os PDFs para a pasta `planos/` e, no workflow principal, clicar em **Test workflow** (ou esperar o agendamento das 5h)
- **Dashboard**: ativar o workflow do dashboard (toggle) e abrir http://localhost:5678/webhook/dashboard
  - Cada plano é um card expansível: clique para ver o status e a observação de **cada tópico separadamente**, e use **📄 Abrir PDF** para abrir o arquivo original
  - **⬇ Baixar CSV** exporta todos os resultados (abre no Excel/LibreOffice)

> Outra pasta de PDFs? Troque `./planos` no `docker-compose.yml` pelo caminho desejado (ex.: `C:/PlanosDeEnsino:/data/planos:ro`) e rode `docker compose up -d`.
### Usar o Gemini (em vez do Ollama)

O nó **Preparar Prompt** já gera o payload nos dois formatos e o **Parsear Validação** entende as duas respostas. Basta editar o nó **Validar com IA (Ollama)**:

1. **URL**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`
2. **Headers**: adicionar `x-goog-api-key` com a sua chave (criar em https://aistudio.google.com/apikey)
3. **Body**: trocar a expressão para `{{ $json.geminiPayload }}`

Para voltar ao Ollama, desfaça os três passos.

## Solução de problemas

| Problema | Causa/Solução |
|----------|---------------|
| Nenhum plano processado | Os PDFs precisam estar em `planos/` (extensão `.pdf`). Conferir com `docker exec vslongo-workflows-n8n-1 ls /data/planos` |
| `Access to the file is not allowed` | Falta `N8N_RESTRICT_FILE_ACCESS_TO=/data` no `docker-compose.yml` → `docker compose up -d` |
| Linux: erro de permissão ao gravar em `resultados/` | A pasta deve existir antes do `docker compose up` (já vem no repositório) e ser gravável: `chmod 777 resultados` |
| Ollama lento / timeout | Verificar GPU: `docker exec vslongo-workflows-ollama-1 ollama ps` deve mostrar `100% GPU` |
| Esqueceu a senha do n8n | `docker exec vslongo-workflows-n8n-1 n8n user-management:reset` (workflows são preservados) |
| Só 1 plano processado | Code nodes devem usar `$input.all()`, nunca `$input.first()` |
| `Falha ao processar resposta da IA: Unexpected end of JSON input` | Ollama sobrecarregado por requisições simultâneas. O workflow agora processa em blocos de 10 ("Processar em Blocos"), envia 1 requisição por vez ao Ollama com 3 retentativas no nó HTTP. Cada bloco é gravado em `resultados/` antes do próximo começar. |
| `Falha ao processar resposta da IA: timeout of 180000ms exceeded` | Uma resposta normal leva ~15–60s. Se travar, confira `ollama ps` (deve estar quase 100% GPU) e se o notebook não entrou em suspensão/economia de energia durante a execução. |
| Dashboard abre em branco | Ainda não há resultados em `resultados/`, ou o nó "Ler Validações" falhou: ver a execução em Executions no n8n. |

## Análise dos resultados (monografia)

O CSV exportado pelo dashboard traz o dado por critério necessário para comparar o sistema com a avaliação humana (padrão ouro): coeficiente Kappa, acurácia, precisão, recall, F1-score e matriz de confusão. Esse cálculo é feito offline, fora do pipeline.
