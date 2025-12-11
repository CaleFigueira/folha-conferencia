# 🤖 Instruções para Agentes de IA - Auditoria CSB

## Contexto do Projeto

Sistema standalone de auditoria de folha de pagamento para CSB Drogarias. É uma **aplicação React 18 embedded em único arquivo HTML** - sem build system, sem dependências externas além de CDNs (React, Tailwind). Processa 6 arquivos CSV para detectar divergências em eventos de folha via 7 regras de auditoria.

## Arquitetura Principal

### Stack Tecnológico
- **Frontend**: React 18 (CDN) + Babel standalone + Tailwind CSS (CDN)
- **Lógica**: Objeto `AuditEngine` contém toda lógica de processamento
- **I/O**: Upload de CSV, processamento em-memória, display de resultados
- **Padrão**: Single-file monolítico (`index.html`)

### Componentes-chave
1. **AuditEngine** - Motor de auditoria com 7 regras (R1-R7)
   - `criarIndiceEventos()` - Converte CSV em índice: `{matrícula: {código: [ocorrências]}}`
   - `executarAuditoria()` - Orquestra todas as regras
   - Normalização: Flexível para espaços e acentos em nomes de coluna

2. **PayrollAuditApp** - Componente React com fluxo de 3 etapas
   - `upload`: Aceita 6 CSVs específicos
   - `proc`: Processamento (1.5s delay para UX)
   - `res`: Exibe resultados em dashboard

3. **Regras de Auditoria**
   - **R1**: Eventos novos (não existiam na folha anterior)
   - **R2**: Eventos removidos (existiam antes, sumiram)
   - **R3**: Valor alterado (variação >5% E >R$10)
   - **R5**: Validação de admitidos
   - **R6**: Validação de demitidos (apenas códigos 9000-9003)
   - **R7**: Eventos duplicados na mesma matrícula/código

## Padrões Críticos

### Normalização de Dados
```javascript
// Sempre usar AuditEngine.limpar() para comparações
// Remove acentos, espaços, caracteres especiais
// Exemplo: "Matricula Colaborador" → "matriculacobirador"
```

### Busca de Campos
- **Preferir `buscarCampoEspacos()`** - Mantém espaços, mais flexível com encoding ISO-8859-1
- Funciona com variações: "codigo evento", "codigoevento", "cod evento", "codev"
- Campo não encontrado retorna `null` - **validar sempre**

### Estrutura de Índice
```javascript
// Índice padrão retornado por criarIndiceEventos()
{
  "1234": {           // matrícula
    "5262": [         // código evento
      { valor: 1500, linha: 5, nome: "João Silva", dados: {...} },
      { valor: 1500, linha: 8, nome: "João Silva", dados: {...} }
    ]
  }
}
```

### Tolerância de R3
- **Baseline**: 5% de variação percentual E R$10 de diferença absoluta
- Se `Math.abs(varPerc) > 5 AND Math.abs(var_) > 10` → flagar
- Evita divergências de centavos

### Equivalência de Férias
```javascript
// Mapeamento bidirecional: evento 6262 ↔ 5262 são equivalentes
equivalenciaFerias: { '6262': '5262', '6254': '5254', ... }
// R1/R2 não flagam se existe equivalente na outra folha
```

## Convenções Específicas

### Nomes de Variáveis
- `mat` / `matricula` - matrícula do colaborador
- `cod` / `codigo` - código do evento de folha
- `val` / `valor` - valor monetário (float)
- `oc` / `ocs` - ocorrência/ocorrências (registros)
- `r1`, `r2`, etc - array de divergências da regra

### Propriedades de Divergência
```javascript
{
  regra: "R1",                    // Regra que gerou
  tipo: "EVENTO_NOVO",            // Tipo específico
  severidade: "ALTA" | "MEDIA",   // ALTA: valor>1000, MEDIA: resto
  matricula: "1234",              // Identificador
  codigoEvento: "5262",           // Evento envolvido
  descricao: "...",               // Mensagem legível
  impacto: 1500                   // Valor financeiro (pode ser negativo)
}
```

### Debugging
- **Console.log abundante** no AuditEngine com emojis e separadores
- F12 → Console mostra: colunas detectadas, registros válidos/inválidos, amostra de dados
- Sempre logar primeiros 2 registros de cada folha para validar parsing

## Pontos de Atenção

### Encoding
- CSVs esperados em **ISO-8859-1** (Windows-1252), não UTF-8
- Acentos normalizados com replace (á→a, ç→c, etc)

### Edge Cases
- **Arquivo vazio**: Retorna índice vazio `{}` - validar antes de comparar
- **Sem matrícula/código**: Registros são pulados silenciosamente
- **Duplicatas do mesmo evento**: R7 flagara como divergência
- **Admitidos/Demitidos**: Apenas validam presença/ausência, não valores

### Performance
- Adequado para ~10k registros por arquivo
- Loop O(n) sobre folhas + O(n²) worst-case em comparações
- Delay de 1.5s é apenas visual (setTimeout) - processamento é síncrono

## Tarefas Comuns

### Adicionar Nova Regra
1. Criar função no AuditEngine
2. Loop sobre índices (similar a R1-R3)
3. Push para array de resultado
4. Logar estatísticas
5. Retornar array no final de `executarAuditoria()`

### Modificar Colunas Esperadas
- Editar strings em `buscarCampoEspacos()` calls
- Manter array de alternativas (com/sem espaço)
- Testar com amostra de CSV real

### Alterar Tolerância de R3
- Mudar `tol = 5` para novo percentual
- Ajustar condição `Math.abs(var_) > 10` se necessário
- Logar nas estatísticas

## Recursos & Links

- **PRD**: `PRD.txt` (requisitos formais das 7 regras)
- **Documentação React**: Uso mínimo - apenas `useState` para fluxo
- **Tailwind**: Classes em `className` - nenhuma CSS customizada necessária
- **Teste**: Upload real de CSV em index.html no navegador + F12
