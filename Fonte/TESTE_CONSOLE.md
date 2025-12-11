# 🔧 Teste Rápido no Console (F12)

## Opção 1: Detectar Delimitador do Seu CSV

**Cole isto no console do navegador (F12):**

```javascript
// PASSO 1: Digite a PRIMEIRA LINHA exata do seu CSV aqui
const headerLine = "Cole a primeira linha aqui";

// PASSO 2: Execute isto para testar delimitadores
const delimiters = [';', ',', '\t', '|'];
const results = {};

delimiters.forEach(delim => {
  const cols = headerLine.split(delim);
  results[delim] = cols.length;
  console.log(`Delimitador '${delim}': ${cols.length} colunas`);
  
  // Se encontrou muitas colunas, mostra elas
  if (cols.length > 3 && cols.length < 50) {
    console.log(`  Colunas: [${cols.map(c => c.trim().substring(0, 20)).join(' | ')}]`);
  }
});

// PASSO 3: Qual teve mais colunas?
const best = Object.entries(results).sort((a,b) => b[1] - a[1])[0];
console.log(`\n✅ Melhor delimitador: '${best[0]}' com ${best[1]} colunas`);
```

## Opção 2: Testar Detecção Automática (CSVParser)

**Se copiou `csv-parser-helper.js` para o projeto:**

```javascript
// Cole o conteúdo do arquivo no console ou importe
// Depois teste:

const testText = `Matricula;Codigo;Valor;Nome
12345;5262;1500,00;João Silva
12346;5262;2000,00;Maria Santos`;

const result = CSVParser.parsarCSV(testText, 'TESTE');
console.log('Resultado:', result);
```

## Opção 3: Debug do Parsing Atual

**Durante o upload do arquivo, abra F12 e veja:**

```
🔎 Testado: ';'=4cols | ','=1cols | '\t'=1cols | '|'=1cols
✅ Melhor delimitador: ';' (4 colunas)
   📊 Colunas:
      1: "Matricula"
      2: "Codigo Evento"
      3: "Valor"
      4: "Nome Colaborador"
```

Se mostrar "1 coluna" para todos, o CSV pode estar:
1. **Corrompido** - tentar abrir em editor e copiar primeira linha
2. **Usando delimitador especial** - espaço, pipe duplo `||`, etc
3. **Com caracteres invisíveis** - EOL diferente, BOM, etc

## Opção 4: Copiar Primeira Linha Bruta

**Se o upload mostra erro, copie exatamente isto do console:**

```javascript
// Encontre no console esta linha:
// "Primeira linha (bruta): ..."

// Cole a linha completa aqui para análise:
const linha = "Cole aqui";

// Mostra cada caractere:
console.log('Caracteres:', Array.from(linha).map((c, i) => 
  `${i}:'${c}'(${c.charCodeAt(0)})`
).join(' '));

// Encontra delimitador mais comum:
console.log('Contagem de caracteres especiais:');
console.log(`  ; : ${(linha.match(/;/g)||[]).length}`);
console.log(`  , : ${(linha.match(/,/g)||[]).length}`);
console.log(`  | : ${(linha.match(/\|/g)||[]).length}`);
console.log(`  TAB: ${(linha.match(/\t/g)||[]).length}`);
```

## 🎯 Checklist de Diagnóstico

- [ ] Conseguiu identificar o delimitador?
- [ ] Quantas colunas foram detectadas?
- [ ] Quais são os nomes EXATOS das colunas?
- [ ] Há caracteres estranhos (`Cont�bil`)?
- [ ] O arquivo tem linhas em branco no início?
- [ ] O encoding está correto (ISO-8859-1 ou UTF-8)?

## 📊 Exemplo de Saída Esperada

```
Delimitador ';': 4 colunas
Delimitador ',': 1 colunas
Delimitador '\t': 1 colunas
Delimitador '|': 1 colunas

✅ Melhor delimitador: ';' com 4 colunas

Colunas:
  0: "Matricula Colaborador"
  1: "Codigo Evento"
  2: "Valor Calculado"
  3: "Nome Colaborador"
```

Se vir algo diferente, compartilhe a saída para ajuste!

## 🔗 Arquivos de Suporte

- `GUIA_CORRECAO.md` - Guia completo passo-a-passo
- `DIAGNOSTICO.md` - Análise técnica aprofundada
- `csv-parser-helper.js` - Código pronto para usar
