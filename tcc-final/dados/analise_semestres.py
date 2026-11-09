"""Consolida a validação dos planos de 2024/1 a 2025/2 (execução de 04/11/2026).

Uso: python analise_semestres.py <pasta resultados/> <pasta planos/> [ollama.log]

Lê o JSON de cada plano gravado pelo workflow, recalcula o oráculo estrutural do
horário de atendimento no texto do PDF (pdftotext -raw) e grava
validacoes_2026-11-04.csv anonimizado (S1-P01 ... S4-Pnn, ordem alfabética do
arquivo dentro do semestre). O ollama.log opcional (saída de `docker logs` do
contêiner) dá o tempo de cada chamada a /api/generate.
"""
import csv
import json
import re
import statistics as st
import subprocess
import sys
from collections import Counter, defaultdict
from pathlib import Path

from analise import CAMPOS, metricas

AQUI = Path(__file__).parent
SEMESTRES = ['2024-1', '2024-2', '2025-1', '2025-2']


def horario_vazio(pdf):
    """Oráculo: nenhum texto entre o rótulo 'Horário de Atendimento' e a seção 'Programa'."""
    txt = subprocess.run(['pdftotext', '-q', '-raw', '-enc', 'UTF-8', str(pdf), '-'],
                         capture_output=True, text=True, encoding='utf-8').stdout
    m = re.search(r'Hor[áa]rio de Atendimento:?(.*?)^\s*Programa\s*$', txt, re.S | re.M | re.I)
    return None if m is None else not m.group(1).strip()


def tempos_ollama(log):
    """Duração (s) de cada POST /api/generate nas linhas [GIN] do Ollama."""
    unid = {'ms': 1e-3, 's': 1, 'm': 60, 'µs': 1e-6}
    out = []
    for linha in open(log, encoding='utf-8', errors='ignore'):
        m = re.search(r'\|\s+200\s+\|\s+([\d.]+m?[0-9.]*)(µs|ms|s|m)\s+\|.*POST\s+"/api/generate"', linha)
        if m:
            v = m.group(1)
            if 'm' in v:  # formato 1m2.3s
                mi, se = v.split('m')
                out.append(int(mi) * 60 + float(se))
            else:
                out.append(float(v) * unid[m.group(2)])
    return out


def main():
    res_dir, pdf_dir = Path(sys.argv[1]), Path(sys.argv[2])
    linhas = []
    for sem_i, sem in enumerate(SEMESTRES, 1):
        arqs = sorted(res_dir.glob(f'{sem}__*.json'))
        for i, arq in enumerate(arqs, 1):
            r = json.load(open(arq, encoding='utf-8'))
            pdf = pdf_dir / r['Arquivo']
            linhas.append({
                'plano': f'S{sem_i}-P{i:02d}', 'semestre': sem.replace('-', '/'),
                'status_geral': r['Status Geral'],
                'horario_texto_vazio': {True: 1, False: 0, None: ''}[horario_vazio(pdf)],
                **{c: r.get(c, '') for c in CAMPOS},
            })

    with open(AQUI / 'validacoes_2026-11-04.csv', 'w', newline='', encoding='utf-8') as f:
        w = csv.DictWriter(f, fieldnames=list(linhas[0]))
        w.writeheader()
        w.writerows(linhas)

    por_sem = defaultdict(list)
    for l in linhas:
        por_sem[l['semestre']].append(l)
    print(f'Planos: {len(linhas)}')
    for sem, ls in list(por_sem.items()) + [('TOTAL', linhas)]:
        c = Counter(l['status_geral'] for l in ls)
        hor = sum(l['Horário Atendimento'] != 'OK' for l in ls)
        print(f'{sem:7s} n={len(ls):3d} {dict(c)}  horário não OK={hor}')
    print('Por critério (todos os semestres):')
    for c in CAMPOS:
        print(f'  {c:24s}', dict(Counter(l[c] for l in linhas)))
    for sem, ls in por_sem.items():
        print(sem, {c: sum(l[c] != 'OK' for l in ls) for c in CAMPOS})

    pares = [(l['horario_texto_vazio'] == 1, l['Horário Atendimento'] != 'OK')
             for l in linhas if l['horario_texto_vazio'] != '']
    print(f'Horário x oráculo (n={len(pares)}):', {k: round(v, 4) for k, v in metricas(pares).items()})
    for sem, ls in por_sem.items():
        p = [(l['horario_texto_vazio'] == 1, l['Horário Atendimento'] != 'OK') for l in ls if l['horario_texto_vazio'] != '']
        print(f'  {sem}', {k: round(v, 3) for k, v in metricas(p).items()})
    divergentes = [(l['plano'], l['horario_texto_vazio'], l['Horário Atendimento']) for l in linhas
                   if l['horario_texto_vazio'] != '' and (l['horario_texto_vazio'] == 1) != (l['Horário Atendimento'] != 'OK')]
    print('Divergências com o oráculo:', divergentes)

    if len(sys.argv) > 3:
        t = tempos_ollama(sys.argv[3])
        if t:
            print(f'Chamadas ao Ollama: {len(t)}  média={st.mean(t):.1f}s mediana={st.median(t):.1f}s '
                  f'min={min(t):.1f}s max={max(t):.1f}s dp={st.stdev(t):.1f}s')


if __name__ == '__main__':
    main()
