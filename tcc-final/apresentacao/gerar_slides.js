// Gera defesa.pptx no modelo institucional do IFC Videira (mesmos layouts do
// gerar_template.js enviado pelo orientador), com o roteiro nas anotações.
// Uso: npm install pptxgenjs jszip && node gerar_slides.js
const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");
const { applyTheme } = require("./apply_theme.js");

const A = (f) => path.join(__dirname, "figuras", f);
const IMG = (f) => path.join(__dirname, "..", "images", f);
const OUT = path.join(__dirname, "defesa.pptx");

const THEME = {
  name: "IFC Videira — BCC",
  headFontFace: "Calibri",
  bodyFontFace: "Calibri",
  colors: {
    dk1: "1D1D1E", lt1: "FFFFFF", dk2: "16241B", lt2: "EEF4EF",
    accent1: "349A46", accent2: "CA2027", accent3: "7BC48A",
    accent4: "5B6B62", accent5: "1F6E33", accent6: "E0A526",
    hlink: "1F6E33", folHlink: "5B6B62",
  },
};
const HEX = THEME.colors;

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13,333" x 7,5"
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
pres.title = "Sistema de suporte à validação de planos de ensino com modelos de linguagem";
pres.author = "Vinícius Slongo";
pres.company = "Instituto Federal Catarinense — Campus Videira";
pres.subject = "Defesa de Trabalho de Conclusão de Curso";
const C = pres.SchemeColor;

const CURSO = "Bacharelado em Ciência da Computação";
const CAMPUS = "Instituto Federal Catarinense — Campus Videira";
const LOGO_RATIO = 744 / 195;
const PAD_RATIO = 1200 / 2200;

// ---------- layouts: cópia fiel do modelo do orientador ----------
const footer = () => [
  { image: { x: 0.6, y: 6.86, h: 0.36, w: 0.36 * LOGO_RATIO, path: A("logo-ifc.png") } },
  { text: { text: `${CURSO}  ·  Campus Videira`, options: { x: 2.25, y: 6.86, w: 8.6, h: 0.36, fontSize: 11, color: C.accent4, valign: "middle", margin: 0 } } },
];
const slideNum = { x: 11.73, y: 6.86, w: 1.0, h: 0.36, fontSize: 11, color: C.accent4, align: "right", valign: "middle" };
const titlePh = (prompt = "Título do slide") => ({
  placeholder: {
    options: { name: "title", type: "title", align: "left", x: 0.6, y: 0.4, w: 12.13, h: 0.85, fontSize: 30, bold: true, color: C.text2, valign: "middle", margin: 0 },
    text: prompt,
  },
});

pres.defineSlideMaster({
  title: "Capa",
  background: { color: C.background1 },
  objects: [
    { image: { x: 0.6, y: 0.55, h: 0.62, w: 0.62 * LOGO_RATIO, path: A("logo-ifc.png") } },
    { image: { x: 9.55, y: 0.45, h: 6.6, w: 6.6 * PAD_RATIO, path: A("padrao.png") } },
    { text: { text: "TRABALHO DE CONCLUSÃO DE CURSO", options: { x: 0.6, y: 1.85, w: 8.5, h: 0.35, fontSize: 13, bold: true, charSpacing: 2, color: C.accent5, margin: 0 } } },
    { text: { text: `${CURSO} · ${CAMPUS}`, options: { x: 0.6, y: 6.55, w: 8.6, h: 0.4, fontSize: 12, color: C.accent4, margin: 0, valign: "middle" } } },
    { placeholder: { options: { name: "title", type: "title", align: "left", x: 0.6, y: 2.3, w: 8.6, h: 1.95, fontSize: 36, bold: true, color: C.text2, valign: "top", margin: 0 }, text: "Título" } },
    { placeholder: { options: { name: "autor", type: "body", x: 0.6, y: 4.45, w: 8.6, h: 0.5, fontSize: 22, bold: true, color: C.text1, valign: "top", margin: 0 }, text: "Autor" } },
    { placeholder: { options: { name: "orientacao", type: "body", x: 0.6, y: 5.0, w: 8.6, h: 0.85, fontSize: 16, color: C.accent4, valign: "top", margin: 0 }, text: "Orientador" } },
    { placeholder: { options: { name: "data", type: "body", x: 0.6, y: 5.95, w: 8.6, h: 0.4, fontSize: 14, color: C.accent4, valign: "top", margin: 0 }, text: "Data" } },
  ],
});
pres.defineSlideMaster({
  title: "Divisor de seção",
  background: { color: C.background1 },
  objects: [
    { image: { x: 9.55, y: 0.45, h: 6.6, w: 6.6 * PAD_RATIO, path: A("padrao.png") } },
    { image: { x: 0.6, y: 6.78, h: 0.42, w: 0.42 * LOGO_RATIO, path: A("logo-ifc.png") } },
    { placeholder: { options: { name: "numero", type: "body", x: 0.6, y: 2.0, w: 3.0, h: 1.4, fontSize: 80, bold: true, color: C.accent1, valign: "bottom", margin: 0 }, text: "01" } },
    { placeholder: { options: { name: "title", type: "title", align: "left", x: 0.6, y: 3.5, w: 9.2, h: 1.2, fontSize: 40, bold: true, color: C.text2, valign: "top", margin: 0 }, text: "Seção" } },
    { placeholder: { options: { name: "descricao", type: "body", x: 0.6, y: 4.75, w: 9.2, h: 0.8, fontSize: 18, color: C.accent4, valign: "top", margin: 0 }, text: "Descrição" } },
  ],
});
pres.defineSlideMaster({
  title: "Título e conteúdo",
  background: { color: C.background1 },
  objects: [...footer(), titlePh(),
    { placeholder: { options: { name: "body", type: "body", x: 0.6, y: 1.5, w: 12.13, h: 5.0, fontSize: 20, color: C.text1, valign: "top", margin: 0 }, text: "Texto" } }],
  slideNumber: { ...slideNum },
});
pres.defineSlideMaster({
  title: "Duas colunas",
  background: { color: C.background1 },
  objects: [...footer(), titlePh(),
    { placeholder: { options: { name: "esquerda", type: "body", x: 0.6, y: 1.5, w: 5.85, h: 5.0, fontSize: 20, color: C.text1, valign: "top", margin: 0 }, text: "Esquerda" } },
    { placeholder: { options: { name: "direita", type: "body", x: 6.88, y: 1.5, w: 5.85, h: 5.0, fontSize: 20, color: C.text1, valign: "top", margin: 0 }, text: "Direita" } }],
  slideNumber: { ...slideNum },
});
pres.defineSlideMaster({
  title: "Texto e figura",
  background: { color: C.background1 },
  objects: [...footer(), titlePh(),
    { placeholder: { options: { name: "body", type: "body", x: 0.6, y: 1.5, w: 5.6, h: 5.0, fontSize: 20, color: C.text1, valign: "top", margin: 0 }, text: "Texto" } },
    { placeholder: { options: { name: "legenda", type: "body", x: 6.63, y: 1.5, w: 6.1, h: 0.4, fontSize: 14, bold: true, color: C.text1, valign: "bottom", margin: 0 }, text: "Figura" } },
    { placeholder: { options: { name: "figura", type: "pic", x: 6.63, y: 2.0, w: 6.1, h: 4.0, color: C.text1 }, text: "Figura" } },
    { placeholder: { options: { name: "fonte", type: "body", x: 6.63, y: 6.1, w: 6.1, h: 0.35, fontSize: 12, color: C.accent4, valign: "top", margin: 0 }, text: "Fonte" } }],
  slideNumber: { ...slideNum },
});
pres.defineSlideMaster({
  title: "Somente título",
  background: { color: C.background1 },
  objects: [...footer(), titlePh()],
  slideNumber: { ...slideNum },
});
pres.defineSlideMaster({
  title: "Encerramento",
  background: { color: C.background1 },
  objects: [
    { image: { x: 9.55, y: 0.45, h: 6.6, w: 6.6 * PAD_RATIO, path: A("padrao.png") } },
    { image: { x: 0.6, y: 0.55, h: 0.62, w: 0.62 * LOGO_RATIO, path: A("logo-ifc.png") } },
    { placeholder: { options: { name: "title", type: "title", align: "left", x: 0.6, y: 2.4, w: 8.6, h: 1.3, fontSize: 54, bold: true, color: C.text2, valign: "bottom", margin: 0 }, text: "Obrigado!" } },
    { placeholder: { options: { name: "contato", type: "body", x: 0.6, y: 3.9, w: 8.6, h: 1.4, fontSize: 18, color: C.text1, valign: "top", margin: 0 }, text: "Contato" } },
    { text: { text: `${CURSO} · ${CAMPUS}`, options: { x: 0.6, y: 6.55, w: 8.6, h: 0.4, fontSize: 12, color: C.accent4, margin: 0, valign: "middle" } } },
  ],
});

// ---------- roteiro de fala -> anotações (seções "## Slide N — ..." do roteiro.md) ----------
const notas = {};
fs.readFileSync(path.join(__dirname, "roteiro.md"), "utf8")
  .split(/^## /m).slice(1)
  .forEach((bloco) => {
    const m = bloco.match(/^Slides? (\d+)/);
    if (!m) return;
    const [cab, ...corpo] = bloco.split("\n");
    notas[m[1]] = (cab.replace(/^Slides? [\d–]+ — /, "") + "\n\n" + corpo.join("\n")).replace(/\*\*/g, "").trim();
  });

// ---------- helpers ----------
const bullets = (items, opts = {}) =>
  items.map((t, i) => ({
    text: t,
    options: { bullet: { indent: 18 }, paraSpaceAfter: 10, breakLine: i < items.length - 1, ...opts },
  }));
// item com rótulo em negrito: ["Rótulo", " resto"]
const rbullets = (items, opts = {}) => {
  const runs = [];
  items.forEach(([b, t], i) => {
    // ponytail: o Google Slides perde o marcador de itens com mais de um trecho; vai sem negrito
    runs.push({ text: b + t, options: { bullet: { indent: 18 }, paraSpaceAfter: 10, breakLine: i < items.length - 1, ...opts } });
  });
  return runs;
};
const card = (s, x, y, w, h, name) =>
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.12, fill: { color: C.background2 }, line: { type: "none" }, objectName: name });
const tx = (s, text, o) => s.addText(text, { margin: 0, isTextBox: true, color: C.text1, valign: "top", ...o });
const numero = (s, x, y, w, big, label, name) => {
  tx(s, big, { x, y, w, h: 0.9, fontSize: 44, bold: true, color: C.accent1, valign: "bottom", objectName: `${name} valor` });
  tx(s, label, { x, y: y + 0.95, w, h: 0.75, fontSize: 15, color: C.accent4, objectName: `${name} rótulo` });
};
const fonte = (s, t, x, y, w) => tx(s, `Fonte: ${t}`, { x, y, w, h: 0.3, fontSize: 11, color: C.accent4, objectName: "Fonte" });
const hdr = (t) => ({ text: t, options: { bold: true, color: C.background1, fill: { color: C.text2 } } });
const dest = (t) => ({ text: t, options: { bold: true, color: C.accent5, fill: { color: C.background2 } } });
const status = { ok: { color: C.accent1 }, inc: { color: C.accent6 }, aus: { color: C.accent2 }, erro: { color: C.accent4 } };

const addTable = (sl, rows, o) => sl.addTable(rows, { fontFace: "Calibri", ...o });
let secAtual = "";
let n = 0;
const slide = (masterName) => {
  const s = pres.addSlide({ masterName, sectionTitle: secAtual });
  n += 1;
  if (notas[n]) s.addNotes(notas[n]);
  return s;
};
const secao = (num, titulo, desc) => {
  secAtual = titulo; pres.addSection({ title: titulo });
  const s = slide("Divisor de seção");
  s.addText(num, { placeholder: "numero" });
  s.addText(titulo, { placeholder: "title" });
  s.addText(desc, { placeholder: "descricao" });
};

// ================= SLIDES =================
secAtual = "Abertura"; pres.addSection({ title: secAtual });
let s = slide("Capa");
s.addText("Sistema de suporte à validação de planos de ensino com modelos de linguagem", { placeholder: "title" });
s.addText("Vinícius Slongo", { placeholder: "autor" });
s.addText("Orientador: Prof. Me. Fabricio Bizotto", { placeholder: "orientacao" });
s.addText("Videira (SC), novembro de 2026", { placeholder: "data" });

s = slide("Somente título");
s.addText("Roteiro da apresentação", { placeholder: "title" });
["Introdução", "Fundamentação teórica", "Metodologia", "Desenvolvimento", "Resultados e discussão", "Considerações finais"].forEach((t, i) => {
  const col = i < 3 ? 0 : 1, row = i % 3;
  const x = 0.6 + col * 6.2, y = 1.85 + row * 1.45;
  s.addShape(pres.shapes.OVAL, { x, y, w: 0.85, h: 0.85, fill: { color: i === 0 ? C.accent2 : C.accent1 }, line: { type: "none" }, objectName: `Roteiro marcador ${i + 1}` });
  tx(s, String(i + 1).padStart(2, "0"), { x, y, w: 0.85, h: 0.85, fontSize: 20, bold: true, color: C.background1, align: "center", valign: "middle", objectName: `Roteiro número ${i + 1}` });
  tx(s, t, { x: x + 1.15, y, w: 4.7, h: 0.85, fontSize: 22, valign: "middle", objectName: `Roteiro item ${i + 1}` });
});

// ---- Introdução
secao("01", "Introdução", "Contexto, problema de pesquisa e objetivos");

s = slide("Somente título");
s.addText("Contextualização e problema", { placeholder: "title" });
tx(s, bullets([
  "A Organização Didática define o que o plano de ensino deve conter (IFC, 2022)",
  "A conferência é manual: coordenação e NDE leem plano por plano",
  "Repetitiva e sujeita a inconsistências entre avaliadores",
  "O SIGAA padroniza as seções, mas o conteúdo é texto livre",
  "LLMs interpretam texto, mas alucinam (JI et al., 2023)",
]), { x: 0.6, y: 1.6, w: 6.9, h: 4.9, fontSize: 19, objectName: "Contexto" });
card(s, 7.95, 1.6, 4.78, 2.2, "Cartão regras");
tx(s, "Regras fixas resolvem…", { x: 8.25, y: 1.85, w: 4.2, h: 0.45, fontSize: 18, bold: true, color: C.accent5, objectName: "Regras título" });
tx(s, "“A seção existe?”\n“Há 3 referências básicas?”", { x: 8.25, y: 2.4, w: 4.2, h: 1.2, fontSize: 17, objectName: "Regras texto" });
card(s, 7.95, 4.1, 4.78, 2.2, "Cartão julgamento");
tx(s, "…mas não julgam", { x: 8.25, y: 4.35, w: 4.2, h: 0.45, fontSize: 18, bold: true, color: C.accent5, objectName: "Julgamento título" });
tx(s, "“Esta metodologia descreve como as aulas serão conduzidas?”", { x: 8.25, y: 4.9, w: 4.2, h: 1.2, fontSize: 17, objectName: "Julgamento texto" });

s = slide("Somente título");
s.addText("Problema de pesquisa e objetivos", { placeholder: "title" });
card(s, 0.6, 1.45, 12.13, 1.45, "Cartão problema");
tx(s, [
  { text: "Problema de pesquisa  ", options: { bold: true, color: C.accent5 } },
  { text: "De que forma um sistema baseado em modelos de linguagem pode apoiar a verificação da conformidade dos planos de ensino às normas do IFC, indicando de forma confiável os itens que exigem revisão e preservando o controle humano sobre a decisão final?" },
], { x: 0.9, y: 1.6, w: 11.5, h: 1.15, fontSize: 16, valign: "middle", objectName: "Problema" });
tx(s, "Objetivo geral", { x: 0.6, y: 3.15, w: 4.6, h: 0.45, fontSize: 20, bold: true, color: C.accent5, objectName: "Rótulo objetivo geral" });
tx(s, "Desenvolver e avaliar um sistema semiautomático baseado em IA para apoiar a validação dos planos de ensino do curso de Ciência da Computação do IFC Videira.", { x: 0.6, y: 3.7, w: 4.6, h: 2.7, fontSize: 17, objectName: "Objetivo geral" });
tx(s, "Objetivos específicos", { x: 5.7, y: 3.15, w: 7.0, h: 0.45, fontSize: 20, bold: true, color: C.accent5, objectName: "Rótulo específicos" });
[
  "Converter a Organização Didática em critérios verificáveis",
  "Implementar um pipeline com LLM local e registro rastreável",
  "Disponibilizar um painel web com resultado e justificativa",
  "Avaliar com planos reais (2024/1 a 2025/2): robustez, desempenho e concordância",
].forEach((t, i) => {
  const y = 3.72 + i * 0.7;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 5.7, y, w: 0.5, h: 0.5, rectRadius: 0.08, fill: { color: C.accent1 }, line: { type: "none" }, objectName: `Marcador objetivo ${i + 1}` });
  tx(s, String(i + 1), { x: 5.7, y, w: 0.5, h: 0.5, fontSize: 16, bold: true, color: C.background1, align: "center", valign: "middle", objectName: `Número objetivo ${i + 1}` });
  tx(s, t, { x: 6.4, y, w: 6.33, h: 0.5, fontSize: 16, valign: "middle", objectName: `Objetivo ${i + 1}` });
});

// ---- Fundamentação
secao("02", "Fundamentação teórica", "Conceitos que sustentam o trabalho");

s = slide("Somente título");
s.addText("Como tornar as respostas de um LLM confiáveis", { placeholder: "title" });
[
  ["Saída estruturada", "Um esquema JSON restringe a decodificação e garante a estrutura da resposta (WILLARD; LOUF, 2023)"],
  ["Regras determinísticas", "O que é exato, como contar referências ou detectar campo vazio, fica com o código"],
  ["LLM como avaliador", "Boa concordância com humanos, mas com vieses que precisam ser medidos (ZHENG et al., 2023)"],
  ["Execução local", "Ollama + Qwen2.5 7B quantizado: sem custo por requisição e sem enviar documentos para fora (LGPD)"],
  ["IA centrada no humano", "O sistema aponta, o avaliador decide (SHNEIDERMAN, 2022)"],
].forEach(([t, d], i) => {
  const col = i % 3, row = Math.floor(i / 3);
  const x = 0.6 + col * 4.12, y = 1.55 + row * 2.6, w = 3.89;
  card(s, x, y, w, 2.35, `Cartão ${t}`);
  tx(s, t, { x: x + 0.25, y: y + 0.22, w: w - 0.5, h: 0.45, fontSize: 18, bold: true, color: C.accent5, objectName: `Título ${t}` });
  tx(s, d, { x: x + 0.25, y: y + 0.75, w: w - 0.5, h: 1.45, fontSize: 15, objectName: `Texto ${t}` });
});

s = slide("Somente título");
s.addText("Trabalhos relacionados", { placeholder: "title" });
addTable(s, [
  [hdr("Trabalho"), hdr("Foco"), hdr("Tipo de estudo"), hdr("Processo administrativo?")],
  ["Tan, Cheng e Ling (2025)", "IA no ensino e na formação docente", "Revisão sistemática", "Apontado como lacuna"],
  ["Kasneci et al. (2023)", "Oportunidades e riscos de LLMs", "Ensaio crítico", "Não"],
  ["Sposato (2025)", "IA na gestão educacional", "Taxonomia", "Sim, conceitual"],
  ["Hoare e Smith-Ferguson (2025)", "Ferramenta institucional de IA", "Relato de implantação", "Não"],
  ["Santos, Silva e Lima (2025)", "Plataformas e IA na gestão pública", "Análise documental", "Sim, conceitual"],
  ["Vieira e Moura (2025)", "IA nos Institutos Federais", "Revisão integrativa", "Apontado como lacuna"],
  [dest("Este trabalho"), dest("Validação de planos de ensino"), dest("Sistema e estudo de caso"), dest("Sim, implementado e avaliado")],
], {
  x: 0.6, y: 1.5, w: 12.13, colW: [3.4, 3.6, 2.6, 2.53], fontSize: 14, color: C.text1,
  border: { type: "solid", pt: 0.75, color: "C9D6CC" }, rowH: 0.52, valign: "middle", margin: [0.04, 0.12, 0.04, 0.12],
  objectName: "Tabela de trabalhos relacionados",
});
fonte(s, "Elaborado pelo autor (2026).", 0.6, 5.85, 12.13);

// ---- Metodologia
secao("03", "Metodologia", "Como o trabalho foi desenvolvido e avaliado");

s = slide("Somente título");
s.addText("Classificação, corpus e ambiente", { placeholder: "title" });
tx(s, rbullets([
  ["Pesquisa aplicada", ", exploratória e descritiva (GIL, 2017)"],
  ["Estudo de caso", " (YIN, 2015); unidade de análise: o par plano–critério"],
  ["Desenvolvimento iterativo e incremental", ", de maio a novembro de 2026"],
  ["Corpus:", " 29 planos de 2024/1 (avaliação detalhada) e 120 de 2024/1 a 2025/2 (ampliação)"],
  ["Ética:", " resultados anonimizados (P01 a P29)"],
]), { x: 0.6, y: 1.6, w: 6.6, h: 4.9, fontSize: 18, objectName: "Classificação" });
card(s, 7.65, 1.6, 5.08, 4.6, "Cartão ambiente");
tx(s, "Ambiente experimental", { x: 7.95, y: 1.85, w: 4.5, h: 0.45, fontSize: 18, bold: true, color: C.accent5, objectName: "Ambiente título" });
addTable(s, [
  ["CPU", "Intel Core Ultra 7 155H"], ["GPU", "RTX 4050 Laptop, 6 GB"], ["RAM", "32 GB"],
  ["Orquestração", "n8n 2.21 (Docker)"], ["Inferência", "Ollama 0.24"], ["Modelo", "Qwen2.5 7B, Q4_K_M"], ["Temperatura", "0,1"],
], { x: 7.95, y: 2.4, w: 4.5, colW: [1.6, 2.9], fontSize: 15, color: C.text1, rowH: 0.47, margin: [0.02, 0.05, 0.02, 0], objectName: "Tabela ambiente" });

s = slide("Somente título");
s.addText("Doze critérios de avaliação", { placeholder: "title" });
const crit = [
  ["Identificação", "Instituição, componente e docente", "LLM"],
  ["Ementa", "Texto corrido com ao menos 15 palavras", "LLM"],
  ["Objetivo geral e objetivos específicos", "Texto preenchido", "Regra"],
  ["Conteúdo programático", "Lista tópicos ou unidades", "LLM"],
  ["Metodologia", "Estratégias e recursos das aulas", "LLM"],
  ["Proc. de avaliação e Avaliações", "Instrumentos, datas ou pesos", "LLM"],
  ["Cronograma", "Distribuição por datas ou semanas", "LLM"],
  ["Horário de atendimento", "Dia(s) e/ou horário(s) de atendimento", "LLM"],
  ["Referências", "No mínimo 3 básicas e 5 complementares", "Regra"],
  ["Coerência", "Objetivos, metodologia e avaliação compatíveis", "LLM"],
];
addTable(s, [[hdr("Critério"), hdr("Regra para OK"), hdr("Avaliado por")], ...crit], {
  x: 0.6, y: 1.4, w: 12.13, colW: [4.0, 6.33, 1.8], fontSize: 13, color: C.text1,
  border: { type: "solid", pt: 0.75, color: "C9D6CC" }, rowH: 0.36, valign: "middle", margin: [0.02, 0.12, 0.02, 0.12],
  objectName: "Tabela de critérios",
});
fonte(s, "Elaborado pelo autor (2026), com base em IFC (2022).", 0.6, 5.5, 12.13);
tx(s, [
  { text: "Critério: ", options: { bold: true, color: C.accent5 } },
  { text: "OK", options: { bold: true, ...status.ok } }, { text: " atende   " },
  { text: "INCOMPLETO", options: { bold: true, ...status.inc } }, { text: " há conteúdo, mas não atende   " },
  { text: "AUSENTE", options: { bold: true, ...status.aus } }, { text: " vazio ou sem relação", options: { breakLine: true } },
  { text: "Plano: ", options: { bold: true, color: C.accent5 } },
  { text: "OK", options: { bold: true, ...status.ok } }, { text: " tudo OK   " },
  { text: "PENDENTE", options: { bold: true, ...status.inc } }, { text: " algum INCOMPLETO   " },
  { text: "REPROVADO", options: { bold: true, ...status.aus } }, { text: " algum AUSENTE   " },
  { text: "ERRO", options: { bold: true, ...status.erro } }, { text: " falha técnica" },
], { x: 0.6, y: 5.9, w: 12.13, h: 0.8, fontSize: 14, objectName: "Legenda de status" });

s = slide("Somente título");
s.addText("Protocolo de avaliação", { placeholder: "title" });
const etapas = [
  ["Robustez", "Proporção de planos com status ERRO em cada iteração"],
  ["Desempenho", "Tempo de inferência por plano e do lote, tokens/s (metadados do Ollama)"],
  ["Concordância", "Horário de atendimento contra oráculo estrutural: precisão, recall e Kappa"],
  ["Análise de erros", "Todo apontamento diferente de OK conferido no texto do PDF"],
];
const cw = 2.65, gap = 0.51;
etapas.forEach(([t, d], i) => {
  const x = 0.6 + i * (cw + gap);
  card(s, x, 1.9, cw, 3.6, `Cartão etapa ${i + 1}`);
  s.addShape(pres.shapes.OVAL, { x: x + 0.3, y: 2.2, w: 0.8, h: 0.8, fill: { color: C.accent1 }, line: { type: "none" }, objectName: `Marcador etapa ${i + 1}` });
  tx(s, String(i + 1), { x: x + 0.3, y: 2.2, w: 0.8, h: 0.8, fontSize: 20, bold: true, color: C.background1, align: "center", valign: "middle", objectName: `Número etapa ${i + 1}` });
  tx(s, t, { x: x + 0.3, y: 3.2, w: cw - 0.5, h: 0.5, fontSize: 20, bold: true, color: C.text2, objectName: `Título etapa ${i + 1}` });
  tx(s, d, { x: x + 0.3, y: 3.75, w: cw - 0.5, h: 1.6, fontSize: 16, objectName: `Descrição etapa ${i + 1}` });
  if (i < etapas.length - 1)
    s.addShape(pres.shapes.CHEVRON, { x: x + cw + 0.13, y: 3.5, w: 0.25, h: 0.4, fill: { color: C.accent3 }, line: { type: "none" }, objectName: `Seta etapa ${i + 1}` });
});

// ---- Desenvolvimento
secao("04", "Desenvolvimento", "Arquitetura, fluxo de validação e interface");

s = slide("Somente título");
s.addText("Arquitetura do sistema", { placeholder: "title" });
const caixa = (x, y, w, h, titulo, sub, o = {}) => {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.08, fill: { color: o.fill || C.background1 }, line: { color: o.line || C.text2, width: 1.25, dashType: o.dash ? "dash" : "solid" }, objectName: `Caixa ${titulo}` });
  tx(s, [{ text: titulo, options: { bold: true, breakLine: true } }, { text: sub, options: { fontSize: 13, color: C.accent4 } }],
    { x: x + 0.1, y, w: w - 0.2, h, fontSize: 16, align: "center", valign: "middle", objectName: `Texto ${titulo}` });
};
const seta = (x1, y1, x2, y2, rot) => {
  s.addShape(pres.shapes.LINE, { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1) || 0.001, h: Math.abs(y2 - y1) || 0.001, flipH: x2 < x1, flipV: y2 < y1, line: { color: C.text2, width: 1.5, endArrowType: "triangle" }, objectName: `Seta ${rot || ""}` });
};
// contêineres
s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 3.35, y: 1.55, w: 4.3, h: 4.4, rectRadius: 0.1, fill: { color: C.background2 }, line: { type: "none" }, objectName: "Contêiner n8n" });
tx(s, "Contêiner n8n", { x: 3.35, y: 1.6, w: 4.3, h: 0.35, fontSize: 13, bold: true, color: C.accent4, align: "center", objectName: "Rótulo n8n" });
s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 8.75, y: 1.55, w: 3.98, h: 2.1, rectRadius: 0.1, fill: { color: C.background2 }, line: { type: "none" }, objectName: "Contêiner Ollama" });
tx(s, "Contêiner Ollama", { x: 8.75, y: 1.6, w: 3.98, h: 0.35, fontSize: 13, bold: true, color: C.accent4, align: "center", objectName: "Rótulo Ollama" });
caixa(0.6, 2.15, 2.3, 1.1, "Pasta planos", "PDFs dos planos", { dash: true });
caixa(3.6, 2.0, 3.8, 1.4, "Workflow de validação", "extrai, segmenta, monta prompt, aplica regras");
caixa(9.0, 2.0, 3.48, 1.4, "Ollama", "Qwen2.5 7B na GPU (6 GB)", { line: C.accent1 });
caixa(0.6, 4.35, 2.3, 1.1, "Pasta resultados", "um JSON por plano", { dash: true });
caixa(3.6, 4.2, 3.8, 1.4, "Workflow do dashboard", "gera HTML e exporta CSV");
caixa(9.0, 4.2, 3.48, 1.4, "Coordenação / NDE", "navegador web");
seta(2.9, 2.7, 3.6, 2.7, "lê PDFs");
seta(7.4, 2.5, 9.0, 2.5, "prompt");
seta(9.0, 2.9, 7.4, 2.9, "JSON");
tx(s, "prompt + esquema", { x: 7.4, y: 2.1, w: 1.6, h: 0.35, fontSize: 11, italic: true, color: C.accent4, align: "center", objectName: "Rótulo prompt" });
tx(s, "JSON", { x: 7.4, y: 2.95, w: 1.6, h: 0.35, fontSize: 11, italic: true, color: C.accent4, align: "center", objectName: "Rótulo JSON" });
seta(3.6, 3.3, 2.9, 4.35, "grava");
seta(2.9, 4.9, 3.6, 4.9, "lê resultados");
seta(7.4, 4.9, 9.0, 4.9, "dashboard");
tx(s, "Docker Compose: implantação = subir os contêineres e copiar os PDFs para a pasta planos", { x: 0.6, y: 6.15, w: 12.13, h: 0.4, fontSize: 14, color: C.accent4, objectName: "Nota implantação" });

s = slide("Somente título");
s.addText("Fluxo de validação no n8n", { placeholder: "title" });
const passos = [
  ["Gatilho", "agendado (5h) ou manual"], ["Ler arquivos", "pasta planos (*.pdf)"], ["Extrair texto", "PDF.js"], ["Separar por tópicos", "regex + contagem de referências"],
  ["Preparar prompt", "regras + esquema JSON"], ["Processar em blocos", "10 planos por vez"], ["Validar com IA", "Ollama, 1 requisição por vez"], ["Interpretar e salvar", "regras determinísticas, JSON"],
];
passos.forEach(([t, d], i) => {
  const row = Math.floor(i / 4), col = i % 4;
  const x = 0.6 + col * 3.13, y = 1.65 + row * 2.45, w = 2.73;
  card(s, x, y, w, 1.95, `Passo ${i + 1}`);
  s.addShape(pres.shapes.OVAL, { x: x + 0.22, y: y + 0.22, w: 0.6, h: 0.6, fill: { color: i === 6 ? C.accent2 : C.accent1 }, line: { type: "none" }, objectName: `Marcador passo ${i + 1}` });
  tx(s, String(i + 1), { x: x + 0.22, y: y + 0.22, w: 0.6, h: 0.6, fontSize: 16, bold: true, color: C.background1, align: "center", valign: "middle", objectName: `Número passo ${i + 1}` });
  tx(s, t, { x: x + 0.22, y: y + 0.92, w: w - 0.4, h: 0.4, fontSize: 17, bold: true, color: C.text2, objectName: `Título passo ${i + 1}` });
  tx(s, d, { x: x + 0.22, y: y + 1.32, w: w - 0.4, h: 0.55, fontSize: 14, color: C.accent4, objectName: `Descrição passo ${i + 1}` });
  if (col < 3)
    s.addShape(pres.shapes.CHEVRON, { x: x + w + 0.08, y: y + 0.78, w: 0.22, h: 0.38, fill: { color: C.accent3 }, line: { type: "none" }, objectName: `Seta passo ${i + 1}` });
});
tx(s, "Etapa 7 em vermelho: a única que usa o modelo de linguagem; todas as demais são código.", { x: 0.6, y: 6.35, w: 12.13, h: 0.35, fontSize: 13, color: C.accent4, objectName: "Nota fluxo" });

s = slide("Texto e figura");
s.addText("Painel de resultados (dashboard)", { placeholder: "title" });
s.addText(bullets([
  "Indicadores do lote: aprovados, pendentes e com problemas",
  "Um cartão por plano, com os 12 critérios e a justificativa de cada um",
  "Status sempre em cor e em texto (acessibilidade)",
  "Atalho para o PDF original e exportação em CSV",
  "Exemplo aberto: P05, sem horário de atendimento e sem objetivos específicos",
], { fontSize: 17 }), { placeholder: "body" });
s.addText("Figura – Dashboard com o plano P05 expandido", { placeholder: "legenda" });
s.addImage({ path: IMG("dashboard.png"), x: 7.63, y: 2.0, w: 4.0 * (2300 / 2240), h: 4.0, objectName: "Print do dashboard" });
s.addText("Fonte: Elaborado pelo autor (2026). Nomes anonimizados.", { placeholder: "fonte" });

// ---- Resultados
secao("05", "Resultados e discussão", "O que foi obtido e o que isso significa");

// ponytail: gráficos desenhados com formas; os nativos perdem os rótulos ao converter para Google Slides
const barra = (x, y, w, h, color, name) =>
  s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color }, line: { type: "none" }, objectName: name });

s = slide("Somente título");
s.addText("Robustez: falhas técnicas caíram de 86,2% para zero", { placeholder: "title" });
tx(s, "Planos com status ERRO por execução (%)", { x: 0.6, y: 1.5, w: 6.6, h: 0.4, fontSize: 15, bold: true, objectName: "Título gráfico robustez" });
const base = 5.75, alturaMax = 3.3;
[["22/05", 86.2], ["07/07", 3.4], ["10/08", 69.0], ["25/08", 49.1], ["10/09", 0], ["15/09", 17.2], ["19/10", 0]].forEach(([d, v], i) => {
  const x = 0.75 + i * 0.93, h = (v / 100) * alturaMax;
  if (h > 0) barra(x, base - h, 0.62, h, i === 6 ? C.accent1 : C.accent4, `Barra ${d}`);
  tx(s, v.toFixed(1).replace(".", ","), { x: x - 0.15, y: base - h - 0.35, w: 0.92, h: 0.3, fontSize: 13, bold: i === 6, color: i === 6 ? C.accent1 : C.text1, align: "center", objectName: `Valor ${d}` });
  tx(s, d, { x: x - 0.15, y: base + 0.08, w: 0.92, h: 0.3, fontSize: 13, color: C.accent4, align: "center", objectName: `Data ${d}` });
});
s.addShape(pres.shapes.LINE, { x: 0.65, y: base, w: 6.5, h: 0, line: { color: C.accent4, width: 1 }, objectName: "Eixo robustez" });
fonte(s, "Elaborado pelo autor (2026).", 0.6, 6.3, 6.6);
addTable(s, [
  [hdr("Falha"), hdr("Correção")],
  ["JSON vazio ou truncado", "Uma requisição por vez + 3 tentativas"],
  ["JSON malformado", "Saída estruturada (esquema)"],
  ["Prompt cortado em silêncio (4.096 tokens)", "Contexto explícito + prompt menor"],
  ["Timeout", "FlashAttention e KV cache em 8 bits"],
], { x: 7.55, y: 1.55, w: 5.18, colW: [2.5, 2.68], fontSize: 14, color: C.text1, border: { type: "solid", pt: 0.75, color: "C9D6CC" }, rowH: 0.62, valign: "middle", margin: [0.04, 0.1, 0.04, 0.1], objectName: "Tabela de falhas" });
numero(s, 7.55, 4.85, 5.18, "86,2% → 0%", "de planos com falha técnica, da 1ª à última versão", "Robustez");

s = slide("Somente título");
s.addText("Desempenho: 120 planos, 4x mais lento com a GPU disputada", { placeholder: "title" });
[
  ["46 s", "por plano na execução dos 120 planos (mediana 41 s; de 28 a 77 s)"],
  ["11,5 s", "por plano em 19/10, com a GPU livre (29 planos em 8 min 54 s)"],
  ["14%", "do modelo na CPU em 04/11 (8% em 19/10): outros programas usavam a GPU"],
].forEach(([v, l], i) => {
  const x = 0.6 + i * 4.12;
  card(s, x, 1.6, 3.89, 2.45, `Cartão número ${i + 1}`);
  numero(s, x + 0.3, 1.7, 3.3, v, l, `Desempenho ${i + 1}`);
});
tx(s, bullets([
  "A lentidão expôs uma falha: o fluxo envia um plano por segundo sem esperar a resposta; 55 planos estouraram o tempo limite e foram reprocessados",
  "Com a GPU livre, centenas de planos caberiam em menos de 1 hora, de madrugada",
  "Sem custo por requisição e sem enviar documentos para fora da instituição",
]), { x: 0.6, y: 4.4, w: 12.13, h: 2.3, fontSize: 17, objectName: "Desempenho comentários" });

s = slide("Somente título");
s.addText("Horário de atendimento falhou em 69 dos 120 planos", { placeholder: "title" });
tx(s, "Resultado por critério, 2024/1 a 2025/2 (n.º de planos)", { x: 0.6, y: 1.45, w: 7.4, h: 0.4, fontSize: 15, bold: true, objectName: "Título gráfico critérios" });
const porPlano = 4.6 / 120;
[
  ["Identificação", 120, 0, 0], ["Ementa", 114, 6, 0], ["Objetivo geral", 120, 0, 0], ["Obj. específicos", 104, 15, 1],
  ["Conteúdo programático", 118, 0, 2], ["Metodologia", 119, 1, 0], ["Proc. de avaliação", 116, 4, 0], ["Cronograma", 119, 1, 0],
  ["Avaliações", 113, 6, 1], ["Horário de atendimento", 51, 7, 62], ["Referências", 103, 17, 0], ["Coerência", 117, 3, 0],
].forEach(([nome, ok, inc, aus], i) => {
  const y = 1.95 + i * 0.36;
  const destaque = nome === "Horário de atendimento";
  tx(s, nome, { x: 0.6, y, w: 2.55, h: 0.26, fontSize: 13, bold: destaque, align: "right", valign: "middle", objectName: `Rótulo ${nome}` });
  let x = 3.3;
  [[ok, C.accent1], [inc, C.accent6], [aus, C.accent2]].forEach(([v, cor], k) => {
    if (!v) return;
    barra(x, y, v * porPlano, 0.26, cor, `Barra ${nome} ${k}`);
    if (k > 0 && v * porPlano >= 0.3) tx(s, String(v), { x, y, w: v * porPlano, h: 0.26, fontSize: 11, bold: true, color: C.background1, align: "center", valign: "middle", objectName: `Valor ${nome} ${k}` });
    x += v * porPlano;
  });
});
[["OK", C.accent1], ["INCOMPLETO", C.accent6], ["AUSENTE", C.accent2]].forEach(([t, cor], i) => {
  const x = 3.3 + i * 1.6;
  barra(x, 6.35, 0.2, 0.2, cor, `Legenda ${t}`);
  tx(s, t, { x: x + 0.28, y: 6.3, w: 1.3, h: 0.3, fontSize: 12, valign: "middle", objectName: `Legenda texto ${t}` });
});
fonte(s, "Elaborado pelo autor (2026).", 0.6, 6.3, 2.5);
tx(s, [
  { text: "36 OK (30%)", options: { bold: true, ...status.ok, breakLine: true } },
  { text: "21 pendentes (17,5%)", options: { bold: true, ...status.inc, breakLine: true } },
  { text: "63 reprovados (52,5%)", options: { bold: true, ...status.aus } },
], { x: 8.4, y: 1.5, w: 4.33, h: 1.3, fontSize: 20, objectName: "Status geral" });
tx(s, bullets([
  "Horário de atendimento não conforme em 69 planos; em 43, é o único problema",
  "Referências incompletas em 17 planos; objetivos específicos em 16",
  "Problema sistemático do curso, repetido nos quatro semestres",
]), { x: 8.4, y: 3.05, w: 4.33, h: 3.4, fontSize: 16, objectName: "Validação comentários" });

s = slide("Somente título");
s.addText("Em 2024/1, contra o oráculo estrutural, o Kappa foi de 0,93", { placeholder: "title" });
tx(s, "Oráculo: no PDF do SIGAA, o texto entre “Horário de Atendimento” e “Programa” indica se o campo foi preenchido.", { x: 0.6, y: 1.55, w: 6.2, h: 1.0, fontSize: 16, objectName: "Oráculo" });
addTable(s, [
  [hdr(""), hdr("Sistema: não conforme"), hdr("Sistema: conforme")],
  [{ text: "Oráculo: vazio", options: { bold: true } }, { text: "15 (VP)", options: { fill: { color: C.background2 } } }, "0 (FN)"],
  [{ text: "Oráculo: preenchido", options: { bold: true } }, "1 (FP)", { text: "13 (VN)", options: { fill: { color: C.background2 } } }],
], { x: 0.6, y: 2.75, w: 6.2, colW: [2.2, 2.0, 2.0], fontSize: 15, color: C.text1, align: "center", border: { type: "solid", pt: 0.75, color: "C9D6CC" }, rowH: 0.6, valign: "middle", objectName: "Matriz de confusão" });
fonte(s, "Elaborado pelo autor (2026).", 0.6, 4.75, 6.2);
tx(s, "O único falso positivo (P19, “conforme horário disponibilizado publicamente”) é de fato não conforme pela regra do critério.", { x: 0.6, y: 5.1, w: 6.2, h: 1.2, fontSize: 15, color: C.accent4, objectName: "Nota P19" });
[["100%", "recall"], ["93,8%", "precisão"], ["0,93", "Kappa de Cohen: quase perfeita (LANDIS; KOCH, 1977)"], ["0,968", "F1"]].forEach(([v, l], i) => {
  const x = 7.35 + (i % 2) * 2.75, y = 1.5 + Math.floor(i / 2) * 2.45;
  numero(s, x, y, 2.6, v, l, `Concordância ${i + 1}`);
});

s = slide("Duas colunas");
s.addText("Análise de erros: acerta o problema, oscila na categoria", { placeholder: "title" });
s.addText([
  { text: "O que funcionou", options: { bold: true, color: C.accent5, fontSize: 20, paraSpaceAfter: 12, breakLine: true } },
  ...bullets([
    "Os 11 demais apontamentos, conferidos no PDF, eram não conformidades reais",
    "O modelo detecta bem se há um problema",
  ], { fontSize: 17 }),
], { placeholder: "esquerda" });
s.addText([
  { text: "O que falhou", options: { bold: true, color: C.accent2, fontSize: 20, paraSpaceAfter: 12, breakLine: true } },
  ...bullets([
    "Oscila entre INCOMPLETO e AUSENTE: P20 e P21, quase idênticos, terminaram REPROVADO e PENDENTE",
    "1 falso negativo da regra, não do modelo: “Não Cadastrado!” aceito como objetivo geral (P05)",
    "A observação geral contradiz o critério de referências em 18 de 24 planos",
  ], { fontSize: 17 }),
], { placeholder: "direita" });

// ---- Considerações finais
s = slide("Somente título");
s.addText("Por semestre: desde 2024/2, o link do PTD substitui o horário", { placeholder: "title" });
tx(s, "Status geral por semestre (n.º de planos)", { x: 0.6, y: 1.5, w: 6.4, h: 0.4, fontSize: 15, bold: true, objectName: "Título gráfico semestres" });
const baseSem = 5.75, porPlanoSem = 3.3 / 34;
[["2024/1", 11, 4, 14], ["2024/2", 12, 8, 14], ["2025/1", 5, 5, 19], ["2025/2", 8, 4, 16]].forEach(([sem, ok, pend, rep], i) => {
  const x = 0.9 + i * 1.55;
  let y = baseSem;
  [[ok, C.accent1], [pend, C.accent6], [rep, C.accent2]].forEach(([v, cor], k) => {
    const h = v * porPlanoSem;
    y -= h;
    barra(x, y, 0.9, h, cor, `Barra ${sem} ${k}`);
    tx(s, String(v), { x, y, w: 0.9, h, fontSize: 12, bold: true, color: C.background1, align: "center", valign: "middle", objectName: `Valor ${sem} ${k}` });
  });
  tx(s, `${sem} (n = ${ok + pend + rep})`, { x: x - 0.3, y: baseSem + 0.08, w: 1.5, h: 0.3, fontSize: 12, color: C.accent4, align: "center", objectName: `Semestre ${sem}` });
});
s.addShape(pres.shapes.LINE, { x: 0.7, y: baseSem, w: 6.2, h: 0, line: { color: C.accent4, width: 1 }, objectName: "Eixo semestres" });
[["OK", C.accent1], ["PENDENTE", C.accent6], ["REPROVADO", C.accent2]].forEach(([t, cor], i) => {
  const x = 0.9 + i * 1.75;
  barra(x, 6.35, 0.2, 0.2, cor, `Legenda sem ${t}`);
  tx(s, t, { x: x + 0.28, y: 6.3, w: 1.4, h: 0.3, fontSize: 12, valign: "middle", objectName: `Legenda sem texto ${t}` });
});
tx(s, bullets([
  "Reprovados por semestre: 48%, 41%, 66% e 57%",
  "29 planos trazem só o link da página de PTD do campus, sem dia nem hora",
  "Pela regra, o sistema acertou os 120 planos; errou a categoria (AUSENTE em vez de INCOMPLETO)",
  "Aceitar o link é decisão do NDE: os reprovados cairiam de 63 para 30",
  "2024/1 reprocessado: 99,2% das classificações se repetiram",
]), { x: 7.4, y: 1.55, w: 5.33, h: 4.9, fontSize: 16, objectName: "Semestres comentários" });

secao("06", "Considerações finais", "Conclusões e próximos passos");

s = slide("Duas colunas");
s.addText("Considerações finais", { placeholder: "title" });
s.addText([
  { text: "Conclusões", options: { bold: true, color: C.accent5, fontSize: 20, paraSpaceAfter: 12, breakLine: true } },
  ...bullets([
    "Os quatro objetivos específicos foram atendidos",
    "Viável como triagem: aponta planos e itens a revisar; a decisão fica com o avaliador",
    "A confiabilidade veio mais da engenharia em torno do modelo do que do modelo em si",
    "Regras para o exato, LLM para o interpretativo, e as regras também precisam ser validadas",
  ], { fontSize: 16 }),
], { placeholder: "esquerda" });
s.addText([
  { text: "Limitações", options: { bold: true, color: C.accent5, fontSize: 20, paraSpaceAfter: 12, breakLine: true } },
  ...bullets([
    "Sem anotação humana completa pelo NDE: oráculo em um único critério",
    "Avaliação detalhada em um semestre; ampliação em um único curso",
    "Planos digitalizados (sem texto) não são lidos",
    "Dependência do formato do SIGAA",
    "O tempo economizado na conferência não foi medido",
  ], { fontSize: 16 }),
], { placeholder: "direita" });

s = slide("Somente título");
s.addText("Trabalhos futuros", { placeholder: "title" });
[
  "Executar o protocolo de anotação com o NDE em todos os critérios e ampliar o corpus",
  "Atribuir AUSENTE por regra a campos vazios e provisórios (“Não Cadastrado!”, “A cadastrar”) e gerar a observação geral por código",
  "RAG com o PPC e as ementas oficiais; comparar modelos maiores",
  "Notificar docentes e integrar a validação ao cadastro do plano no SIGAA, medindo a utilidade com usuários",
].forEach((t, i) => {
  const y = 1.6 + i * 1.12;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y, w: 0.6, h: 0.6, rectRadius: 0.08, fill: { color: C.accent1 }, line: { type: "none" }, objectName: `Marcador futuro ${i + 1}` });
  tx(s, String(i + 1), { x: 0.6, y, w: 0.6, h: 0.6, fontSize: 18, bold: true, color: C.background1, align: "center", valign: "middle", objectName: `Número futuro ${i + 1}` });
  tx(s, t, { x: 1.45, y: y - 0.1, w: 11.28, h: 0.85, fontSize: 18, valign: "middle", objectName: `Futuro ${i + 1}` });
});
tx(s, "Código, fluxos e dados: github.com/vslongo/vslongo-workflows", { x: 0.6, y: 6.2, w: 12.13, h: 0.4, fontSize: 14, color: C.accent4, objectName: "Repositório" });

// ---- Referências (ABNT NBR 6023)
const refs = [
  [["BRASIL. "], ["Lei nº 13.709, de 14 de agosto de 2018", 1], [": Lei Geral de Proteção de Dados Pessoais (LGPD). Brasília, DF: Presidência da República, 2018."]],
  [["GIL, Antonio Carlos. "], ["Como elaborar projetos de pesquisa", 1], [". 6. ed. São Paulo: Atlas, 2017."]],
  [["HOARE, Joseph; SMITH-FERGUSON, Jules. Using AI to boost evidence-based teaching and learning: a collaborative approach across a network of schools. "], ["Theory Into Practice", 1], [", v. 64, n. 4, p. 407–420, 2025. DOI: 10.1080/00405841.2025.2528547."]],
  [["INSTITUTO FEDERAL CATARINENSE. "], ["Organização Didática dos Cursos do IFC", 1], [". Blumenau: IFC, 2022."]],
  [["JI, Ziwei et al. Survey of hallucination in natural language generation. "], ["ACM Computing Surveys", 1], [", v. 55, n. 12, 2023. DOI: 10.1145/3571730."]],
  [["KASNECI, Enkelejda et al. ChatGPT for good? On opportunities and challenges of large language models for education. "], ["Learning and Individual Differences", 1], [", v. 103, 2023. DOI: 10.1016/j.lindif.2023.102274."]],
  [["LANDIS, J. Richard; KOCH, Gary G. The measurement of observer agreement for categorical data. "], ["Biometrics", 1], [", v. 33, n. 1, p. 159–174, 1977. DOI: 10.2307/2529310."]],
  [["SANTOS, Genesí B. G. A.; SILVA, Luís G. A. da; COSTA BRITTO PEREIRA LIMA, Daniela da. Plataformas digitais e inteligência artificial na gestão das redes públicas de ensino e das escolas: conquistas e desafios. "], ["Jornal de Políticas Educacionais", 1], [", v. 19, n. 1, 2025."]],
  [["SHNEIDERMAN, Ben. "], ["Human-centered AI", 1], [". Oxford: Oxford University Press, 2022."]],
  [["SPOSATO, Martin. Artificial intelligence in educational leadership: a comprehensive taxonomy and future directions. "], ["International Journal of Educational Technology in Higher Education", 1], [", v. 22, n. 1, 2025."]],
  [["TAN, Xiao; CHENG, Gary; LING, Man Ho. Artificial intelligence in teaching and teacher professional development: a systematic review. "], ["Computers and Education: Artificial Intelligence", 1], [", v. 8, 2025."]],
  [["VIEIRA, Luis A. B.; MOURA, Mayra C. M. de. Inteligência artificial na educação profissional e tecnológica: experiências pedagógicas nos institutos federais. "], ["Revista Brasileira da Educação Profissional e Tecnológica", 1], [", v. 1, n. 25, 2025."]],
  [["WILLARD, Brandon T.; LOUF, Rémi. "], ["Efficient guided generation for large language models", 1], [". arXiv, 2023. DOI: 10.48550/arXiv.2307.09702."]],
  [["YIN, Robert K. "], ["Estudo de caso", 1], [": planejamento e métodos. 5. ed. Porto Alegre: Bookman, 2015."]],
  [["ZHENG, Lianmin et al. Judging LLM-as-a-judge with MT-Bench and Chatbot Arena. In: "], ["Advances in Neural Information Processing Systems 36", 1], [". Red Hook: Curran Associates, 2023."]],
];
const refRuns = (lista) => {
  const runs = [];
  lista.forEach((r, i) => r.forEach(([text, bold], j) => {
    const last = j === r.length - 1;
    runs.push({ text, options: { bold: !!bold, fontSize: 13, paraSpaceAfter: 9, breakLine: last && i < lista.length - 1 } });
  }));
  return runs;
};
[refs.slice(0, 8), refs.slice(8)].forEach((parte) => {
  s = slide("Título e conteúdo");
  s.addText("Referências", { placeholder: "title" });
  s.addText(refRuns(parte), { placeholder: "body" });
});

s = slide("Encerramento");
s.addNotes(notas[30] || "");
s.addText("Obrigado!", { placeholder: "title" });
s.addText([
  { text: "Vinícius Slongo", options: { bold: true, breakLine: true } },
  { text: "vslongo@gmail.com" },
], { placeholder: "contato" });

(async () => {
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("OK:", OUT, n, "slides");
})();
