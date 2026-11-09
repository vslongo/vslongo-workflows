# Roteiro da defesa — ~20 minutos

Slides: `main.pdf` (30 páginas, modelo IFC Videira). Ritmo de referência: ~130 palavras por minuto. As falas abaixo somam cerca de 2.700 palavras; o tempo de cada bloco está entre colchetes e o acumulado à direita.

| Bloco | Slides | Tempo | Acumulado |
|---|---|---|---|
| Abertura | 1–2 | 0:45 | 0:45 |
| Introdução | 3–5 | 2:30 | 3:15 |
| Fundamentação | 6–8 | 1:45 | 5:00 |
| Metodologia | 9–12 | 3:00 | 8:00 |
| Desenvolvimento | 13–16 | 3:05 | 11:05 |
| Resultados | 17–23 | 7:30 | 18:35 |
| Considerações finais | 24–26 | 2:00 | 20:35 |
| Encerramento | 30 | 0:10 | ~20:45 |

Se o tempo apertar, corte nesta ordem: slide 8 (trabalhos relacionados, só cite a lacuna), slide 12 (protocolo, diga uma frase), slide 15 (fluxo). Se sobrar tempo, detalhe o caso P20/P21 no slide 22.

---

## Slide 1 — Capa [0:30]

Bom dia/boa tarde a todos. Agradeço à banca pela presença e ao professor Fabricio pela orientação. Meu nome é Vinícius Slongo e vou apresentar o trabalho "Sistema de suporte à validação de planos de ensino com modelos de linguagem", um estudo de caso aqui no curso de Ciência da Computação do IFC Campus Videira.

## Slide 2 — Roteiro [0:15]

A apresentação segue a estrutura do texto: introdução, fundamentação, metodologia, o desenvolvimento do sistema, os resultados e as considerações finais.

## Slide 3 — Divisor: Introdução [0:05]

## Slide 4 — Contextualização e problema [1:15]

Todo componente curricular do IFC tem, a cada semestre, um plano de ensino. A Organização Didática define o que esse plano precisa conter: ementa, objetivos, conteúdo, metodologia, avaliação, referências, horário de atendimento, entre outros.

Hoje, quem confere se cada plano tem esses elementos são a coordenação e o NDE, lendo documento por documento. É uma tarefa repetitiva, que cresce com o número de disciplinas e em que dois avaliadores podem chegar a conclusões diferentes.

Automatizar isso não é trivial. O SIGAA padroniza as seções, mas o conteúdo de cada seção é texto livre. Regras fixas, como as do lado direito, verificam se uma seção existe ou quantas referências ela tem. Mas não conseguem julgar se uma metodologia descreve de fato como as aulas serão conduzidas. Esse julgamento exige interpretar o texto, e é aí que entram os modelos de linguagem. Só que esses modelos alucinam: geram respostas plausíveis e incorretas. Então o desafio é usar o LLM sem confiar cegamente nele.

## Slide 5 — Problema de pesquisa e objetivos [1:10]

Daí vem o problema de pesquisa: de que forma um sistema baseado em modelos de linguagem pode apoiar essa verificação, indicando de forma confiável os itens que exigem revisão e mantendo a decisão final com o avaliador humano.

O objetivo geral foi desenvolver e avaliar um sistema semiautomático para isso. Os específicos, na ordem: transformar a Organização Didática em critérios verificáveis; implementar o pipeline com um LLM executado localmente; disponibilizar um painel web com o resultado e a justificativa de cada critério; e avaliar tudo com os 29 planos reais do semestre 2024/1, medindo robustez, desempenho e concordância.

## Slide 6 — Divisor: Fundamentação teórica [0:05]

## Slide 7 — Como tornar as respostas de um LLM confiáveis [1:00]

Da fundamentação, trago os cinco conceitos que viraram decisões de projeto.

Primeiro, a saída estruturada: em vez de pedir "responda em JSON" e torcer, eu passo um esquema JSON que restringe a própria geração do modelo. A estrutura da resposta passa a ser garantida.

Segundo, regras determinísticas: tudo que é exato, como contar referências, fica com o código, porque LLMs erram operações exatas.

Terceiro, a literatura de LLM como avaliador mostra boa concordância com humanos, mas com vieses, o que reforça a necessidade de medir.

Quarto, a execução local: o modelo Qwen2.5 de 7 bilhões de parâmetros roda pelo Ollama no próprio computador. Não há custo por requisição e nenhum documento sai da instituição, o que facilita a conformidade com a LGPD.

E quinto, a IA centrada no ser humano: o sistema aponta, o avaliador decide.

## Slide 8 — Trabalhos relacionados [0:40]

Nos trabalhos relacionados, o padrão é claro: há revisões, ensaios, taxonomias e relatos sobre IA na educação, mas a gestão administrativa aparece como lacuna, como em Tan e em Vieira, ou de forma apenas conceitual, como em Sposato e em Santos. Nenhum deles implementa e avalia um sistema para conferir planos de ensino frente a normas institucionais. É nessa lacuna que o trabalho se insere.

## Slide 9 — Divisor: Metodologia [0:05]

## Slide 10 — Classificação, corpus e ambiente [0:55]

É uma pesquisa aplicada, exploratória e descritiva, conduzida como estudo de caso, em que a unidade de análise é o par plano–critério. O desenvolvimento foi iterativo e incremental, de maio a novembro deste ano.

A avaliação detalhada usou os 29 planos de 2024/1, exportados do SIGAA em PDF, com 3 a 5 páginas cada; no fim, estendi a execução para 120 planos de quatro semestres. Por ética, os resultados são anonimizados, de P01 a P29, sem associar a docentes ou disciplinas.

Tudo rodou em um notebook com GPU de 6 GB, com o n8n e o Ollama em contêineres Docker, e temperatura 0,1 para respostas praticamente determinísticas.

## Slide 11 — Doze critérios de avaliação [1:10]

Os critérios vieram da Organização Didática e foram ajustados com o orientador. São doze. Repare na última coluna: a maioria é avaliada pelo LLM, porque exige interpretação. Objetivos e referências são avaliados por regra: objetivos só precisam estar preenchidos e referências exigem no mínimo 3 básicas e 5 complementares, o que é contagem.

Cada critério recebe OK, INCOMPLETO, quando há conteúdo mas ele não atende à regra, ou AUSENTE, quando o campo está vazio. O plano, por sua vez, é OK se tudo está OK, PENDENTE se há algo incompleto e REPROVADO se falta algo. Falha técnica gera ERRO.

## Slide 12 — Protocolo de avaliação [0:50]

A avaliação teve quatro dimensões. Robustez: quantos planos falham tecnicamente em cada iteração. Desempenho: tempo por plano e do lote, a partir dos metadados do Ollama. Concordância: para o horário de atendimento existe um oráculo estrutural, independente do modelo, então dá para calcular precisão, recall e Kappa. E, por fim, análise de erros: todo apontamento diferente de OK foi conferido manualmente no PDF.

## Slide 13 — Divisor: Desenvolvimento [0:05]

## Slide 14 — Arquitetura do sistema [1:00]

A arquitetura tem dois contêineres. No n8n rodam dois workflows. O de validação lê os PDFs da pasta de planos, extrai e segmenta o texto, monta o prompt e envia ao Ollama junto com o esquema JSON. O Ollama roda o Qwen2.5 na GPU e devolve o JSON. O workflow aplica as regras e grava um arquivo por plano na pasta de resultados.

O segundo workflow lê esses arquivos e gera o dashboard, acessado pelo navegador.

Um detalhe: até a penúltima versão, a entrada e a saída eram Google Drive e Google Sheets. Na revisão, o orientador apontou que configurar OAuth no Google Cloud complicaria a adoção. Troquei por pastas locais, e a implantação passou a ser só subir os contêineres e copiar os PDFs.

## Slide 15 — Fluxo de validação no n8n [1:00]

Aqui o fluxo em detalhe. O gatilho é diário às 5 da manhã ou manual. Depois de extrair o texto, a etapa de separar por tópicos usa expressões regulares ancoradas no início da linha para recortar as seções do SIGAA e já conta as referências.

O prompt é montado seção por seção, e não com o documento inteiro, o que reduz o ruído dos cabeçalhos e rodapés. Os planos são processados em blocos, com uma requisição por vez ao modelo — o porquê disso aparece nos resultados. Por fim, a interpretação aplica as regras determinísticas sobre a resposta e salva o resultado.

## Slide 16 — Painel de resultados [1:00]

Este é o dashboard com os dados reais da execução final. No topo, os indicadores do lote. Abaixo, um cartão por plano; ao clicar, aparecem os doze critérios com o status e a justificativa do modelo. O status sempre aparece em cor e em texto, por acessibilidade. Há um atalho para abrir o PDF e conferir, e a exportação de tudo em CSV.

No exemplo aberto, o P05: o avaliador vê na hora que faltam o horário de atendimento e os objetivos específicos e que o conteúdo programático está incompleto. Esse mesmo plano esconde um erro do sistema, que vou mostrar na análise de erros.

## Slide 17 — Divisor: Resultados e discussão [0:05]

## Slide 18 — Robustez técnica ao longo das iterações [1:15]

O primeiro resultado é de robustez. Na primeira execução, em maio, 86% dos planos falharam. Na versão final, nenhum.

A tabela mostra o que causava as falhas. A mais frequente era JSON vazio ou truncado: o n8n mandava todos os planos quase ao mesmo tempo e o servidor interrompia as respostas. A correção foi processar uma requisição por vez, com retentativas. JSON malformado foi resolvido com a saída estruturada.

A mais difícil de diagnosticar foi o prompt cortado: o contexto padrão do Ollama era de 4.096 tokens e o prompt tinha cerca de 5.100. O Ollama descartava o excesso em silêncio, sem erro, e o modelo respondia em outro idioma. Ou seja, falha de configuração que parece resposta plausível. O pico de 15/09 foi queda de desempenho do próprio notebook, resolvida com as otimizações de memória.

## Slide 19 — Desempenho [1:00]

Sobre o desempenho: o professor Fabricio disponibilizou os planos de 2024/2, 2025/1 e 2025/2, e eu rodei o sistema sobre os quatro semestres, 120 planos ao todo. Seis arquivos eram digitalizados, sem texto, e ficaram de fora, porque o sistema não faz OCR.

Nessa execução, cada plano levou em média 46 segundos, quatro vezes mais que os 11,5 segundos de outubro. A causa foi o equipamento: com outros programas abertos usando a GPU, 14% do modelo ficou na CPU, contra 8% antes.

E essa lentidão expôs uma falha do fluxo: ele envia um plano por segundo sem esperar a resposta do anterior. Com 11 segundos por plano, isso funcionava; com 46, os últimos da fila estouraram o tempo limite, e 55 planos tiveram de ser reprocessados. Fica como trabalho futuro fazer o fluxo esperar cada resposta. Com a GPU livre, centenas de planos cabem em menos de uma hora, sem custo por requisição.

## Slide 20 — Resultado da validação dos 120 planos [1:20]

E o que o sistema encontrou nos quatro semestres? 36 planos conformes, 21 pendentes e 63 reprovados, mais da metade.

O gráfico mostra que identificação e objetivo geral ficaram OK em todos os planos, e metodologia, cronograma e coerência quase sempre. A barra que chama atenção é o horário de atendimento: não conforme em 69 dos 120 planos, e em 43 deles é o único problema. Depois vêm as referências, incompletas em 17 planos, e os objetivos específicos, em 16.

É um achado útil para a gestão do curso: uma informação de interesse direto do estudante, simples de preencher, que falta em mais da metade dos planos em todos os semestres. Isso dificilmente apareceria numa conferência manual feita plano a plano.

## Slide 21 — Concordância com o oráculo estrutural [1:15]

Esses apontamentos estão corretos? Para isso, fiz a avaliação detalhada nos 29 planos de 2024/1. No horário de atendimento, o PDF do SIGAA permite um oráculo objetivo: o texto entre o rótulo "Horário de Atendimento" e a seção "Programa" diz se o campo foi preenchido.

Comparando com esse oráculo: o sistema encontrou os 15 campos vazios, recall de 100%, e apontou um único plano a mais, precisão de 93,8%. O Kappa de Cohen foi 0,93, concordância quase perfeita pela escala de Landis e Koch.

E esse único falso positivo, o P19, diz "conforme horário disponibilizado publicamente", sem dia nem hora. Pela regra do critério, ele é de fato não conforme; a limitação é do oráculo, que só vê se o campo está vazio.

## Slide 22 — Análise de erros [1:20]

Nos demais critérios, conferi cada apontamento no PDF. Os 11 apontamentos eram não conformidades reais. O modelo é bom em detectar se há um problema.

Mas há três fragilidades. Primeira: ele oscila entre INCOMPLETO e AUSENTE. O P20 e o P21 são duas turmas da mesma disciplina, quase idênticos, e um terminou reprovado e o outro pendente.

Segunda: houve um falso negativo, e ele não foi do modelo, foi da minha regra. No P05, o objetivo geral continha só "Não Cadastrado!", texto provisório do SIGAA, e a regra "preenchido é conforme" aceitou. Ou seja, as regras também precisam ser validadas.

Terceira: a observação geral, escrita pelo modelo antes das regras, às vezes contradiz o resultado do critério de referências. Não muda nenhum status, mas pode confundir o avaliador.

## Slide 23 — Por semestre [1:15]

Separando por semestre, a proporção de reprovados ficou entre 41% e 66%, sempre perto ou acima da metade.

E apareceu uma novidade: a partir de 2024/2, 29 docentes passaram a preencher o horário só com o link da página de PTD do campus, sem dia nem hora. É exatamente o caso do P19, agora em escala. Pela regra, isso não é conforme, e o sistema acertou todos esses casos, embora tenha marcado AUSENTE onde deveria ser INCOMPLETO. Só que aceitar ou não o link é uma decisão do NDE: se ele for aceito, os reprovados caem de 63 para 30.

Por fim, reprocessando os 29 planos de 2024/1, 99,2% das classificações se repetiram em relação a outubro; as poucas diferenças foram, de novo, entre INCOMPLETO e AUSENTE.

## Slide 24 — Divisor: Considerações finais [0:05]

## Slide 25 — Considerações finais [1:15]

Concluindo: os quatro objetivos específicos foram atendidos. O sistema se mostrou viável como ferramenta de triagem. Ele aponta os planos e os itens que precisam de revisão, mas quem decide é o avaliador.

A principal lição é que a confiabilidade veio muito mais da engenharia em torno do modelo — concorrência, saída estruturada, dimensionamento do contexto, registro das execuções — do que do modelo em si. E que dividir o trabalho entre regras para o que é exato e LLM para o que é interpretativo funciona, desde que as regras também sejam testadas.

As limitações: não houve anotação completa pelo NDE, então a concordância foi medida com oráculo em um único critério; a avaliação detalhada é de um semestre e a ampliação, de um único curso; planos digitalizados não são lidos; a segmentação depende do formato do SIGAA; e o tempo economizado na conferência não foi medido.

## Slide 26 — Trabalhos futuros [0:40]

Como próximos passos: executar o protocolo de anotação com o NDE, cujos artefatos já estão prontos; marcar como AUSENTE, por regra, os campos vazios e provisórios, o que elimina o falso negativo e boa parte da instabilidade; usar RAG com o PPC para conferir ementas e referências; e, institucionalmente, integrar a validação ao momento do cadastro do plano no SIGAA. O código e os dados estão no repositório indicado.

## Slides 27–29 — Referências [não ler]

Passe direto.

## Slide 30 — Encerramento [0:10]

Era isso. Obrigado pela atenção; fico à disposição da banca para as perguntas.

---

## Perguntas prováveis da banca

- **Por que não usar o ChatGPT ou o Gemini?** LGPD e custo: os planos ficam na instituição e não há cobrança por requisição. O prompt já gera um payload para o Gemini (RF13); trocar é mudar a URL e o corpo da requisição.
- **Por que o Qwen2.5 7B?** Pesos abertos (Apache 2.0), suporte ao português e ênfase declarada em saídas JSON. Na quantização Q4_K_M ocupa ~4,7 GB e cabe na GPU de 6 GB.
- **Por que não avaliaram com humanos?** O protocolo e a planilha de anotação estão prontos (Apêndice), mas a anotação pelo NDE não coube no prazo. É a primeira limitação e o primeiro trabalho futuro.
- **Temperatura 0,1 não deveria dar sempre o mesmo resultado?** Para o mesmo prompt, praticamente sim. P20 e P21 têm prompts diferentes em outras seções (cronograma), e isso basta para mudar a escolha entre INCOMPLETO e AUSENTE.
- **O link da página de PTD não deveria valer como horário?** Talvez; é uma decisão do NDE, não do sistema. A regra atual exige dia ou horário. Se o link for aceito, basta mudar a regra no prompt, e os reprovados caem de 63 para 30 nos quatro semestres.
- **Por que o desempenho piorou na execução ampliada?** Com outros programas abertos, 14% do modelo ficou na CPU e cada plano levou em média 46 s. Isso mostrou que o fluxo envia um plano por segundo sem esperar a resposta; com a máquina lenta, os últimos do bloco estouram o tempo limite. Está nos trabalhos futuros.
- **E se o SIGAA mudar o formato?** A segmentação por rótulos teria de ser revista; está registrada como limitação.
- **O sistema economiza tempo?** Não foi medido. O que se mostrou é que ele aponta corretamente onde olhar; medir o tempo depende de um estudo com usuários.
