# 📊 Sistema de Auditoria de Folha - CSB Drogarias

Sistema automatizado para auditoria de folha de pagamento com análise avançada de divergências.

## 📌 Status Atual - Sprint 1 ✅

**Data:** 15 de Dezembro de 2025  
**Status:** CONCLUÍDO COM SUCESSO

### ✅ Funcionalidades Implementadas

#### 1. Upload e Parse de Arquivos
- ✅ Interface com 6 slots de upload
- ✅ Detecção automática de delimitador (`;`, `,`, `\t`, `|`)
- ✅ Parsing robusto em encoding ISO-8859-1 (Windows-1252)
- ✅ Validação de colunas obrigatórias
- ✅ Barra de progresso visual

#### 2. Motor de Auditoria
- ✅ **R1** - Eventos Novos (4.975 divergências detectadas em teste)
- ✅ **R2** - Eventos Removidos (3.328 divergências)
- ✅ **R3** - Valor Alterado - Tolerância 5% (7.030 divergências)
- ✅ **R5** - Validação Admitidos
- ✅ **R6** - Validação Demitidos (70 divergências)
- ✅ **R7** - Detecção de Duplicados
- ✅ Equivalência automática de eventos de férias

#### 3. Dashboard de Resultados
- ✅ Métricas de resumo (Total, por severidade)
- ✅ Seleção de regra com contagem dinâmica
- ✅ Segmentação por tipo de colaborador (Férias, Admitidos, Demitidos, Licenciados)
- ✅ Tabela drill-through com colunas corretas:
  - Código Folha
  - Matrícula Colaborador
  - Tipo Evento (Provento/Desconto)
  - Código Evento
  - Evento (Descrição)
  - Valor
- ✅ Export CSV com dados filtrados
- ✅ Filtros dinâmicos (regra + segmentação)

#### 4. Qualidade e Conformidade
- ✅ Sem exposição de dados pessoais (nomes removidos)
- ✅ Funções helper corretamente escopo no AuditEngine
- ✅ Hooks React no topo do componente (sem violações)
- ✅ Sem erros de console
- ✅ Perfil de 15.403 divergências validado (Sprint 1)

---

## 🚀 Como Usar (Guia Rápido)

### Teste Inicial
1. Abrir `index.html` no navegador (Chrome/Edge recomendado)
2. Fazer upload dos 6 CSVs na ordem sugerida
3. Clicar "Executar Auditoria" (levará alguns segundos)
4. Explorar resultados:
   - Clique em uma regra (R1, R2, etc) para filtrar
   - Clique em um tipo (Férias, Admitidos, etc) para segmentar
   - Clique "Exportar CSV" para baixar dados filtrados

### Validação Após Upload
- **Métricas:** Devem aparecer no topo (Total, Alta, Média)
- **Tabela:** Deve mostrar ~15.400 divergências
- **Console:** Pressionar F12 para ver logs de processamento
- **Segmentação:** Números devem atualizar ao clicar regras

---

## 🎯 Próximas Sprints - Roadmap

### Sprint 2: Refinamento UX/Dados
- [ ] Adicionar filtros por data de processamento
- [ ] Paginação na tabela (limite 500 registros/página)
- [ ] Coluna de "Impacto Financeiro" (soma valores)
- [ ] Ordenação de colunas (clicável)
- [ ] Botão "Resetar Filtros"
- [ ] Validação de integridade de arquivo antes do upload
- [ ] Mensagem de sucesso/erro mais clara

### Sprint 3: Análises Avançadas
- [ ] Gráficos (Divergências por Regra, por Tipo, Timeline)
- [ ] Relatório PDF com resumo executivo
- [ ] Comparativo histórico (Sprint anterior vs atual)
- [ ] Estimativa de impacto financeiro total
- [ ] Drill-down: Clique em divergência → detalhes completos

### Sprint 4: Automação & Integrações
- [ ] Salvar sessões (localStorage)
- [ ] Histórico de auditorias executadas
- [ ] Template de importação (exemplo de arquivo correto)
- [ ] API para integração com sistemas externos
- [ ] Agendamento de auditorias periódicas (se backend)

---

## 📋 Regras Implementadas - Detalhes

| Regra | Lógica | Status | Divergências |
|-------|--------|--------|--------------|
| **R1** | Evento em ATUAL mas NÃO em ANTERIOR | ✅ | ~4.975 |
| **R2** | Evento em ANTERIOR mas NÃO em ATUAL | ✅ | ~3.328 |
| **R3** | Variação > 5% E valor > R$10 | ✅ | ~7.030 |
| **R5** | Admitido deve estar em ATUAL | ✅ | 0 |
| **R6** | Demitido: apenas códigos 9000-9003 | ✅ | ~70 |
| **R7** | Mesmo evento em duplicata | ✅ | 0 |

**Nota:** Valores aproximados de teste com dados de 11/2025.

---

## 🔧 Arquitetura Técnica

### Stack
- **Frontend:** React 18 (CDN unpkg.com)
- **Styling:** Tailwind CSS (CDN)
- **Parser:** JavaScript puro (detecção automática delimitador)
- **Engine:** AuditEngine (lógica de negócio)
- **Build:** Nenhum (single-file HTML, ~961 linhas)

### Estrutura de Dados Principal
```javascript
indiceEventos: {
  "1234": {              // Matrícula normalizada
    "5262": [            // Código Evento
      { valor: 1500, linha: 5, dados: {...} },
      { valor: 1500, linha: 8, dados: {...} }  // Duplicato
    ]
  }
}
```

### Fluxo de Execução
```
Upload → Parse CSV → Criar Índices → Aplicar 7 Regras → Renderizar Results
```

---

## 📁 Estrutura de Pastas

```
ENTRADA/
  ├── Mensal/
  │   ├── base_folha_mes_202511.csv      (Folha Atual)
  │   └── base_folha_mes_anterior_202510.csv (Folha Anterior)
  ├── Admitidos/
  │   └── base_admitidos_mes_202511.csv
  ├── Demitidos/
  │   └── base_demitidos_mes_202511.csv
  ├── Ferias/
  │   └── base_ferias_mes_202511.csv
  └── Licenciados/
      └── base_licenciados_mes.csv

SAIDA/
  └── (Exportações CSV geradas pelo usuário)

Fonte/
  ├── index.html                         (APP COMPLETA)
  ├── README.md                          (Este arquivo)
  ├── csv-parser-helper.js              (Utility antigo - check se usar)
  └── .github/
      └── copilot-instructions.md       (Instruções para IA)

CONFIG/
  └── PRD – Plataforma de Auditoria Folha.txt (Especificação)
```

---

## 🐛 Debug e Troubleshooting

### Abrir Console (F12)
- **Ctrl+Shift+J** (Windows) ou **Cmd+Option+J** (Mac)
- Mostra logs de processamento por etapa

### Validação Checklist
```
✓ Colunas detectadas (log "✅ Cabeçalho detectado")
✓ Registros processados (log "Processados: XXXX")
✓ Matrículas extraídas (log "Matrículas: XXXX")
✓ Índices criados (log "Índice Atual: XXXX")
✓ Regras executadas (log "R1: XXXX | R2: XXXX | ...")
✓ Tabela renderizada (visual no dashboard)
```

### Problemas Comuns

| Problema | Causa | Solução |
|----------|-------|---------|
| Arquivo não sobe | Coluna não detectada | Verificar se CSV tem: Matrícula, Código Evento, Valor |
| Tabela vazia | Sem divergências | Usar dados de teste corretos (11/2025) |
| Console error | Hook no lugar errado | Pressionar F5 para recarregar |
| Números errados | Delimitador incorreto | Parser detecta automático; se errado, editar CSV |

---

## 📝 Notas Técnicas

- **Encoding:** Compatível ISO-8859-1 (Windows-1252)
- **Delimitadores:** Detecta `;`, `,`, `\t`, `|` automaticamente
- **Cabeçalhos:** Pula automaticamente, busca flexível com acentos
- **Equivalência Férias:** 6262↔5262, 6254↔5254, 6281↔5281, 6272↔5272, 5020↔5023
- **Tolerância R3:** Aplicada bidirecional (folha atual vs anterior)

---

## 👥 Suporte e Contato

**Responsável:** Equipe de Desenvolvimento CSB  
**Última Atualização:** 15/12/2025  
**Versão:** 1.0 (Sprint 1 Concluída)

Para issues ou sugestões, abrir issue no repositório.

---

## 📄 Licença

Projeto CSB Drogarias S/A - 2025
