# 🚀 Guia de Correção - Problema de Parsing CSV

## Resumo do Problema
O sistema está detectando apenas **1 coluna** em arquivos CSV que deveriam ter múltiplas colunas. Isso indica um problema no **delimitador de campos**.

### Sintomas
```
📋 1 colunas: Eventos Calculados - Conta Contábil...
⚠️  20895 registros sem matrícula
✅ 0 válidos | 0 matrículas | 0 eventos
```

## Passo-a-Passo para Diagnóstico

### 1. Identificar o Delimitador Real do CSV

**Abra o arquivo CSV com um editor de texto** (Notepad, VS Code, etc) e:
- Veja a **primeira linha** (cabeçalho)
- Identifique qual caractere separa as colunas

**Exemplos:**
```
Correto com ; → "Matricula;Codigo Evento;Valor;Nome"
Correto com , → "Matricula,Codigo Evento,Valor,Nome"
Incorreto com ; → "Matricula Codigo Evento Valor Nome" (sem separador)
```

### 2. Copiar Estrutura Exata do Arquivo

**Primeira linha (cabeçalho):**
```
[COPIE A PRIMEIRA LINHA EXATA AQUI]
```

**Primeira linha de dados:**
```
[COPIE O PRIMEIRO REGISTRO AQUI]
```

### 3. Testar no Console (F12)

```javascript
// Teste A: Detectar qual é o delimitador
const headerLine = "Cole a PRIMEIRA LINHA exata aqui";

const delims = [';', ',', '\t', '|'];
delims.forEach(d => {
  const count = (headerLine.match(new RegExp(d.replace('\\t', '	'), 'g')) || []).length;
  console.log(`Delimitador '${d}': ${count + 1} colunas`);
});

// Teste B: Ver as colunas reais
const delimiter = ';'; // AJUSTE COM O DELIMITADOR DETECTADO
const cols = headerLine.split(delimiter);
console.log('Colunas:', cols.map((c, i) => `${i}: "${c.trim()}"`));
```

## Soluções Possíveis

### Solução 1: Seu CSV usa Delimitador Diferente de `;`

**Se o arquivo usa `,` (vírgula):**
- O código já detecta automaticamente
- Verifique se o arquivo tem realmente vírgulas

**Se o arquivo usa `\t` (tab) ou outro caractere:**
- Precisa atualizar o parser
- Compartilhe qual é o delimitador

### Solução 2: Nomes das Colunas Estão Diferentes

O arquivo pode ter colunas com **nomes diferentes** dos esperados.

**Esperados pelo sistema:**
- Matrícula: `matricula`, `matrícula`, `mat`, `matr`, `colaborador`
- Código: `codigo evento`, `código evento`, `cod`
- Valor: `valor`, `valor mensal`, `val`
- Nome: `nome colaborador`, `colaborador`, `nome`

**Se os nomes são diferentes, precisa informar** (exemplos):
```
Seu arquivo tem: "Func_ID", "Rubrica_CD", "Val_Bruto", "Nom_Func"
```

### Solução 3: Arquivo com Estrutura Inesperada

Podem haver:
- Linhas em branco no início
- Cabeçalhos em múltiplas linhas
- Caracteres especiais não sendo removidos
- BOM (Byte Order Mark) no início do UTF-8

## Checklist de Correção

- [ ] 1. Identifique o delimitador real (;, ou \t, ou |)
- [ ] 2. Copie a primeira linha exata do cabeçalho
- [ ] 3. Copie o primeiro registro de dados
- [ ] 4. Liste os nomes EXATOS das colunas no arquivo
- [ ] 5. Rode o teste no console
- [ ] 6. Compartilhe os resultados

## Exemplo de Resposta Esperada

"O arquivo usa `;` como delimitador e as colunas são:"
```
0: "Matricula Colaborador"
1: "Codigo Evento" 
2: "Valor Mensal"
3: "Nome Colaborador"
```

Isso permitirá corrigir o parser automaticamente.

## Arquivo de Suporte

Verifique o arquivo `DIAGNOSTICO.md` para mais detalhes técnicos.
