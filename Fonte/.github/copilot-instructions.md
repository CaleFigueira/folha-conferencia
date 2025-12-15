# 🤖 Instruções para Agentes de IA - Auditoria CSB

## Visão Geral

Sistema **single-file HTML** que realiza auditoria de folha de pagamento para CSB Drogarias. Processa 6 CSVs para validar eventos de folha através de 7 regras de negócio. Sem build system - apenas React 18 via CDN + lógica pura em JavaScript em único arquivo de 731 linhas.

## Arquitetura Crítica

### Estrutura de Dados Principal: Índice de Eventos
```javascript
{
  "1234": {              // matrícula normalizada
    "5262": [            // código de evento
      { valor: 1500, linha: 5, nome: "João Silva", dados: {...} },
      { valor: 1500, linha: 8, nome: "João Silva", dados: {...} }  // duplicado
    ]
  }
}
```
Este formato alimenta **todas as 7 regras**. Gerado por `AuditEngine.criarIndiceEventos()`.

### Fluxo de Processamento
1. **Upload** (etapa='upload'): Usuário carrega 6 CSVs específicos
2. **Parse** (CSVParser.parsarCSV): Detecta delimitador (`;`, `,`, `\t`, `|`), normaliza encoding, pula linhas vazias
3. **Indexação** (criarIndiceEventos): Agrupa eventos por matrícula→código, mantém valores e dados
4. **Auditoria** (executarAuditoria): Aplica 7 regras comparando folha atual vs anterior
5. **Renderização** (etapa='res'): Dashboard com divergências por severidade

### Componentes Principais
- **AuditEngine**: Objeto com lógica pura de auditoria (criarIndiceEventos, executarAuditoria, 7 regras)
- **CSVParser**: Parse robusto com detecção automática de delimitador
- **PayrollAuditApp**: Componente React com `useState`, gerencia 3 etapas de fluxo

## Padrões Vitais

### ✅ Busca de Campos (Regra Ouro)
```javascript
// SEMPRE usar buscarCampoEspacos() - nunca direct row[key]
AuditEngine.buscarCampoEspacos(row, ['matricula', 'matrícula', 'mat'])
// Retorna PRIMEIRO match normalizando acentos mas PRESERVANDO espaços
// Falha? Retorna null - SEMPRE VALIDAR: if (!mat) { return; }
```
**Por quê?** CSVs em ISO-8859-1 com variações de coluna ("Matricula Colaborador" vs "Matrícula" vs "Mat Col").

### ✅ Normalização Sob Demanda
```javascript
AuditEngine.limpar(string)  // Remove acentos+espaços: "Matricula" → "matricula"
// USO: Comparar valores **após** extração, não em busca de campos
```

### ✅ Estrutura de Divergência (Template)
Toda regra retorna array com este shape:
```javascript
{
  regra: "R1",
  tipo: "EVENTO_NOVO",
  severidade: "ALTA" | "MEDIA",
  matricula: "1234",
  codigoEvento: "5262",
  nome: "João Silva",
  descricao: "Novo: 5262 (João Silva)",
  impacto: 1500,  // Positivo (novo), negativo (removido)
  // Campos extras por regra: valorAnterior, variacaoPerc, etc
}
```

## As 7 Regras Implementadas

| Regra | Lógica | Comparação |
|-------|--------|-----------|
| **R1** | Evento em ATUAL mas NÃO em ANTERIOR | Verificar equivalência de férias |
| **R2** | Evento em ANTERIOR mas NÃO em ATUAL | Verificar equivalência de férias |
| **R3** | `abs(varPerc) > 5% AND abs(valor) > R$10` | Folhas atuais vs anteriores |
| **R5** | Admitido deve estar em ATUAL, NÃO pode estar em ANTERIOR | Validação simples presença |
| **R6** | Demitido em ATUAL: apenas códigos 9000-9003; pode estar ausente | Validação códigos rescisão |
| **R7** | Mesmo evento (mat+cod) com >1 ocorrência na folha ATUAL | Detecção duplicatas |

### Equivalência de Férias (Crítico)
```javascript
equivalenciaFerias: {
  '6262': '5262', '6254': '5254', '6281': '5281', 
  '6272': '5272', '5020': '5023'
}
// R1/R2: Não flagam divergência se existe equivalente na outra folha
// Implementado com busca bidirecional (R2 inverte mapa)
```

## Convenções Código

### Nomes de Variáveis
- `mat` / `matricula`: string normalizada (sem espaços)
- `cod` / `codigo`: string código evento (ex: "5262")
- `val` / `valor`: float em reais
- `ocs`: array de ocorrências
- `indice`: mapa folha processada {mat → {cod → ocs}}
- `r1`, `r2`, ... `r7`: array de divergências por regra

### Debugging
```javascript
// AuditEngine registra ABUNDANTEMENTE com emojis:
console.log(`✅ ${r1.length} divergências`)  // Resultado
console.log(`❌ ${semMatricula} registros SEM MATRÍCULA`)  // Erro
console.log(`📝 Cabeçalho: "${line}"`)  // Context
```
Abrir **F12** no navegador mostra: colunas detectadas, amostra de dados, estatísticas por regra.

## Pontos de Atenção Críticos

### 🔴 Encoding ISO-8859-1
- Arquivos esperados em **Windows-1252** (não UTF-8)
- Normalização em `buscarCampoEspacos()`: `replace(/[áàãâä]/g, 'a')`
- Erro típico: UTF-8 quebra acentos

### 🔴 Índice Vazio
```javascript
if (Object.keys(indice).length === 0) {
  // Arquivo vazio ou sem matrículas detectadas
  // Loops O.entries() silenciosamente ignoram
  // Validar antes de comparações
}
```

### 🔴 Campos Retornam null
```javascript
const mat = AuditEngine.normalizarMatricula(row);
if (!mat) { semMatricula++; return; }  // Saltar registro inválido
```

### 🔴 Duplicatas R7 = Anomalia
```javascript
if (ocs.length > 1) {
  // Múltiplas ocorrências mesmo evento → divergência HIGH severidade
  // Isso é intencional per regra
}
```

### 🔴 Tolerância R3 (Dois Critérios)
```javascript
const tol = 5;  // 5% - requisito business
if (Math.abs(varPerc) > tol && Math.abs(var_) > 10) {
  // AMBAS condições devem ser true
  // Evita centavos, permite 5% até R$10
}
```

## Tarefas Frequentes

### Adicionar Regra R8
1. Criar seção comentada `// R8` no `executarAuditoria()`
2. Loop `for (const [mat, evts] of Object.entries(indiceAtual))`
3. Validar com `indiceAnterior[mat]?.[cod]` (optional chaining)
4. Construir `{ regra: "R8", tipo: "...", severidade: "..." }`
5. Fazer `r8.push({...})` e adicionar ao array final `todas`
6. Logar resultado: `console.log('\n━━━ R8: DESCRIÇÃO ━━━'); console.log(`✅ ${r8.length} divergências`);`

### Ajustar Colunas Esperadas
- Procurar `buscarCampoEspacos(row, [...])` em AuditEngine
- Adicionar string novo nome de coluna ao array
- Testar com CSV real para confirmar detecção
- Validar logs F12 primeiros 2 registros

### Modificar Tolerância R3
- Mudar `const tol = 5` para novo percentual
- Ajustar `Math.abs(var_) > 10` se necessário
- Atualizar `severidade: Math.abs(varPerc) > 20 ? 'ALTA' : 'MEDIA'` se comportamento muda

## Estrutura de Arquivos

```
Fonte/
  index.html                          # 731 linhas - aplicação completa
    ├─ AuditEngine (linhas ~80-350)  # Lógica
    ├─ CSVParser (linhas ~10-80)     # Parse CSV robusto
    └─ PayrollAuditApp (linhas ~350+) # React component
  README.md                           # Como usar
  .github/copilot-instructions.md    # Este arquivo
```

## Dependências
- **React 18** (CDN: unpkg.com/react@18)
- **Babel Standalone** (CDN: unpkg.com/@babel/standalone)
- **Tailwind CSS** (CDN: cdn.tailwindcss.com)
- Nenhuma dependência npm

## Teste Rápido
1. Abrir `index.html` em navegador
2. Arrastar 6 CSVs (ou clicar upload)
3. Clicar "Executar Auditoria"
4. F12 → Console para logs (colunas detectadas, amostra registros, estatísticas)
5. Resultados em dashboard: tabela com divergências filtráveis por severidade/regra
