# ✅ CHECKLIST DE VALIDAÇÃO - SPRINT 1

## 🎯 Objetivo
Confirmar que Sprint 1 está funcionando corretamente antes de passar para Sprint 2.

---

## 📋 VALIDAÇÃO DO USUÁRIO - Faça Este Teste Agora

### ETAPA 1: Upload ✓
- [ ] Abrir `Fonte/index.html` no navegador
- [ ] Área de upload aparece com 6 slots
- [ ] Arrastar ou clicar para selecionar arquivos
- [ ] Selecionar os 6 CSVs da pasta `ENTRADA/`:
  1. `ENTRADA/Mensal/base_folha_mes_202511.csv` → Folha Atual
  2. `ENTRADA/Mensal/base_folha_mes_anterior_202510.csv` → Folha Anterior
  3. `ENTRADA/Admitidos/base_admitidos_mes_202511.csv` → Admitidos
  4. `ENTRADA/Demitidos/base_demitidos_mes_202511.csv` → Demitidos
  5. `ENTRADA/Ferias/base_ferias_mes_202511.csv` → Férias
  6. `ENTRADA/Licenciados/base_licenciados_mes.csv` → Licenciados

**Resultado Esperado:**
- Todos 6 slots preenchidos ✓
- Nomes dos arquivos aparecem ✓
- Botão "Executar Auditoria" fica ativo (azul) ✓

### ETAPA 2: Auditoria ✓
- [ ] Clicar "Executar Auditoria"
- [ ] Aguardar processamento (5-10 segundos)
- [ ] Barra de progresso avança ✓
- [ ] Nenhuma mensagem de erro em vermelho ✓

**Status Esperado:**
```
✅ Processados: 40.139 registros
✅ Matrículas encontradas: 6.847
✅ Divergências totais: ~15.400
```

### ETAPA 3: Dashboard de Resultados ✓

#### Seção de Métricas
- [ ] Card "Total": Mostra ~15.403
- [ ] Card "Alta": Mostra ~7.030 (R3 principalmente)
- [ ] Card "Média": Mostra ~8.373 (R1, R2, R6)

#### Seção de Regras
- [ ] **R1** card: Mostra 4.975 divergências (clicável)
- [ ] **R2** card: Mostra 3.328 divergências (clicável)
- [ ] **R3** card: Mostra 7.030 divergências (clicável)
- [ ] **R5** card: Mostra 0 divergências
- [ ] **R6** card: Mostra 70 divergências (clicável)
- [ ] **R7** card: Mostra 0 divergências

#### Seção de Segmentação
Deve mostrar 4 boxes (Férias, Admitidos, Demitidos, Licenciados):
- [ ] Cada box com número de divergências
- [ ] Números variam quando clica em regra diferente
- [ ] Clicável (background muda ao selecionar)

#### Tabela de Resultados
- [ ] Aparece com ~15.400 registros
- [ ] Tem 6 colunas:
  1. **Código Folha** - Ex: "001"
  2. **Matrícula Colaborador** - Ex: "12345"
  3. **Tipo Evento** - "Provento" ou "Desconto"
  4. **Código Evento** - Ex: "5262"
  5. **Evento** - Ex: "Férias Período"
  6. **Valor** - Ex: "R$ 1.500,00"

- [ ] Linhas alternam cores (branco/cinza)
- [ ] Rolagem suave (sem travamento)

#### Botão Export
- [ ] "Exportar CSV" está visível (botão azul)
- [ ] Clicando, baixa arquivo `.csv`
- [ ] Arquivo abre no Excel com dados corretos
- [ ] 6 colunas no CSV com headers

### ETAPA 4: Filtros Dinâmicos ✓

#### Teste Filtro por Regra
1. [ ] Clique no card **R1**
   - Tabela atualiza mostrando apenas R1 (4.975 linhas)
   - Segmentação boxes atualizam números
2. [ ] Clique no card **R3**
   - Tabela atualiza mostrando apenas R3 (7.030 linhas)
3. [ ] Clique em **R1 novamente**
   - Volta a mostrar 4.975 linhas

#### Teste Filtro por Tipo
1. [ ] Clique em **Férias** (quando nenhuma regra selecionada)
   - Tabela mostra apenas divergências de férias
2. [ ] Clique em **Admitidos**
   - Tabela mostra apenas divergências de admitidos
3. [ ] Com **R3 selecionado**, clique em **Demitidos**
   - Tabela mostra apenas R3 + demitidos (intersecção)

#### Teste Combinado
- [ ] Selecionar R1 + Férias
- [ ] Clicar R3 (deve mudar para R3 + Férias)
- [ ] Clicar outro tipo (muda filtro tipo mas mantém R3)
- [ ] Fazer reset manual desmarcando regra

### ETAPA 5: Console Debug (F12) ✓
- [ ] Pressionar **F12** para abrir Developer Tools
- [ ] Ir aba **Console**
- [ ] Procurar por mensagens:

```
✅ Cabeçalho detectado: [lista de colunas]
✅ Processados: 20.893 registros   (para folha atual)
✅ Matrículas encontradas: 6.847
━━━ R1: EVENTOS_NOVOS ━━━
✅ 4.975 divergências
━━━ R2: EVENTOS_REMOVIDOS ━━━
✅ 3.328 divergências
... (etc)
```

- [ ] **Nenhum erro em vermelho** (ReferenceError, TypeError, etc)
- [ ] **Nenhum warning amarelo** (opcional)

---

## 🎯 RESULTADO ESPERADO - Tudo Verde?

Se TODOS os itens acima tiverem **✅**, então:

```
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║   🎉 SPRINT 1 VALIDADO COM SUCESSO! 🎉                        ║
║                                                                ║
║   ✅ Parser funcionando                                        ║
║   ✅ Motor de auditoria OK                                     ║
║   ✅ 15.403 divergências detectadas                            ║
║   ✅ Dashboard renderizando corretamente                       ║
║   ✅ Filtros dinâmicos funcionando                             ║
║   ✅ CSV export operacional                                    ║
║   ✅ Sem erros de console                                      ║
║                                                                ║
║   PRÓXIMO PASSO: Começar Sprint 2                              ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

---

## ⚠️ PROBLEMAS COMUNS & SOLUÇÕES

### Problema: "Tabela vazia / nenhum resultado aparece"
**Causa:** Possível que arquivos CSV não tenham dados esperados ou delimitador não detectado corretamente
**Solução:**
1. Abrir F12 → Console
2. Procurar erro: "ReferenceError", "TypeError"
3. Verificar se logs mostram matrículas encontradas
4. Tentar recarregar: F5

### Problema: "Números não batem / poucos divergências"
**Causa:** Arquivo anterior pode estar incompleto ou com formato diferente
**Solução:**
1. Verificar se arquivos da pasta `ENTRADA/Mensal/` existem
2. Abrir em editor de texto (não Excel!) para verificar delimitador
3. Contar linhas: `wc -l base_folha_mes_202511.csv`
4. Se diferente de ~20.893, arquivo pode estar truncado

### Problema: "Erro ao exportar CSV"
**Causa:** Navegador bloqueou download ou sem espaço em disco
**Solução:**
1. Verificar pasta Downloads
2. Tentar novamente
3. Usar Chrome/Edge (melhor suporte)
4. Se persistir, copiar tabela e colar no Excel

### Problema: "Segmentação não atualiza ao clicar regra"
**Causa:** Possível cache do navegador
**Solução:**
1. Pressionar Ctrl+Shift+Delete (limpar cache)
2. Recarregar página (F5)
3. Tentar novamente

### Problema: "Números diferentes de 15.403"
**Causa Normal:** Dados podem variar se arquivos forem diferentes
**Solução:**
- Números estar próximos (±10%) é OK
- Se muito diferente (>20%), verificar se arquivos são de 11/2025

---

## 📞 SE ALGO NÃO FUNCIONAR

1. **Documentação:**
   - Consulte `Fonte/README.md` (guia completo)
   - Veja `Fonte/.github/copilot-instructions.md` (padrões técnicos)
   - Abra `Fonte/.github/SPRINT-STATUS.md` (roadmap)

2. **Debug Rápido:**
   - Pressionar F12 → Console
   - Procurar mensagens vermelhas
   - Copiar erro completo

3. **Próximas Passos:**
   - Descrever o problema para retomar Sprint 1 (se necessário)
   - Ou autorizar começar Sprint 2 se tudo OK

---

## ✅ CONFIRMAÇÃO FINAL

Após validar TODOS os itens:

**Diga ao Copilot:**
```
"Sprint 1 validado! Tudo funcionando. 
Vamos para Sprint 2?"
```

**OU se houver problemas:**
```
"Encontrei um problema: [descrever]
Pode ajudar a corrigir?"
```

---

## 📅 Próximas Sprints (Após Validação)

### Sprint 2: Paginação + Ordenação + Validações
- Tabela com paginação (500 registros/página)
- Headers clicáveis para ordenar
- Mensagens de erro mais claras

### Sprint 3: Gráficos + Relatórios
- Dashboards com visualizações
- Export PDF
- Análises avançadas

---

**Última Atualização:** 15 de Dezembro de 2025  
**Versão:** Sprint 1 Concluído
