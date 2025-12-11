# 🔍 Diagnóstico de Problemas - Auditoria CSB

## Problema Identificado
O console mostra apenas **1 coluna detectada** quando deveria detectar múltiplas colunas do CSV.

Exemplo do erro:
```
📋 1 colunas: Eventos Calculados - Conta Contábil...
🔍 [1] mat="null" cod="null" val=0
⚠️  20895 registros sem matrícula
```

## Causas Prováveis

### 1. **Delimitador Incorreto** ❌
O CSV pode estar usando um delimitador diferente de `;` ou `,`
- Possíveis delimitadores: `\t` (tab), `|`, espaço
- O arquivo está sendo lido inteiro como uma única coluna

### 2. **Encoding ISO-8859-1 vs UTF-8**
O caractere corrompido `Cont�bil` em vez de `Contábil` indica problema de encoding
- Arquivo esperado: ISO-8859-1 (Windows-1252)
- Mas navegador pode estar usando UTF-8

### 3. **Estrutura do CSV Inesperada**
O cabeçalho pode ser:
- Multi-linha (linhas em branco ou títulos extras no topo)
- Com aspas ou caracteres especiais não sendo removidos corretamente
- Com BOM (Byte Order Mark) no início do arquivo

## Como Diagnosticar

### Passo 1: Verificar Delimitador Real
Pressione F12 e verifique o primeiro log:
```javascript
Primeira linha (bruta): [COPIAR A LINHA INTEIRA AQUI]
```

Se a linha estiver inteira em uma coluna, o delimitador não é `;` nem `,`.

### Passo 2: Teste Manual no Console
```javascript
const testLine = "Col1;Col2;Col3"; // Cole a PRIMEIRA LINHA EXATA
const cols = testLine.split(';');
console.log('Colunas com ;:', cols.length); // Deve retornar 3

const cols2 = testLine.split(',');
console.log('Colunas com ,:', cols2.length);

const cols3 = testLine.split('\t');
console.log('Colunas com TAB:', cols3.length);

const cols4 = testLine.split('|');
console.log('Colunas com |:', cols4.length);
```

### Passo 3: Verificar Coluna de Matrícula
Após descobrir o delimitador correto, procure qual coluna contém:
- "Matricula", "Matrícula", "Mat", "Funcionário", "Colaborador"
- Copiar primeiro valor dessa coluna para validar format

## Solução

### Opção A: Ajustar Parser Automaticamente
Implementar detecção inteligente de delimitador contando ocorrências:
```javascript
const countChars = (str, char) => (str.match(new RegExp(char, 'g')) || []).length;
const delimiters = [';', ',', '\t', '|'];
let bestDelimiter = ';';
let maxCount = 0;

delimiters.forEach(d => {
  const count = countChars(headerLine, d);
  if (count > maxCount) {
    maxCount = count;
    bestDelimiter = d;
  }
});
```

### Opção B: Adicionar Seletor Manual
Permitir usuário escolher o delimitador na UI:
```javascript
<select onChange={(e) => setDelimiter(e.target.value)}>
  <option value=";">Ponto e vírgula (;)</option>
  <option value=",">Vírgula (,)</option>
  <option value="\t">Tab</option>
  <option value="|">Barra (|)</option>
</select>
```

### Opção C: Corrigir Mapping de Colunas
Se o delimitador estiver certo, o problema pode ser os nomes das colunas:
- Verificar exatamente qual é o nome da coluna no arquivo
- Ajustar `buscarCampoEspacos()` com os nomes reais

## Próximas Ações

1. **Copiar a primeira linha exata do CSV** (sem truncar)
2. **Testar delimitadores** no console (passo 2 acima)
3. **Compartilhar nome das colunas** reais do arquivo
4. **Atualizar** `buscarCampoEspacos` com nomes corretos

## Debug Rápido

Adicione esta linha no console para diagnosticar:
```javascript
// Cole a primeira linha exata do seu CSV
const line = "COLE_AQUI";

// Teste cada delimitador
console.log('Colunas com ;:', line.split(';').length);
console.log('Colunas com ,:', line.split(',').length);
console.log('Colunas com TAB:', line.split('\t').length);
console.log('Colunas com |:', line.split('|').length);

// Mostra os valores
console.log('Com ; :', line.split(';').map((c,i) => `[${i}]=${c.substring(0,20)}`));
```
