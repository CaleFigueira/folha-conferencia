# ✅ CHECKLIST - Correção de Parsing CSV

## 🎯 Objetivo
Fazer o sistema ler corretamente todas as colunas do CSV (atualmente lê apenas 1).

---

## FASE 1: DIAGNÓSTICO (15 min)

### ☐ Passo 1: Leia a Documentação
- [ ] Abra `PROBLEMA_E_SOLUCAO.md`
- [ ] Entenda o problema (console mostra "1 coluna")
- [ ] Entenda a solução (testar delimitadores)

### ☐ Passo 2: Prepare o Ambiente
- [ ] Abra o app em navegador (arquivo `index.html`)
- [ ] Pressione `F12` para abrir Console
- [ ] Deixe o Console aberto

### ☐ Passo 3: Identifique o Delimitador
- [ ] Faça upload de um arquivo CSV
- [ ] Copie a **primeira linha bruta** que aparece no console
- [ ] Cole num arquivo de texto ou notepad
- [ ] No console, execute o código em `TESTE_CONSOLE.md` - Opção 1
- [ ] **Anote qual delimitador retorna MAIS colunas**

Resultado esperado:
```
Delimitador ';': 4 colunas ← Este seria o correto
Delimitador ',': 1 coluna
Delimitador '\t': 1 coluna
Delimitador '|': 1 coluna
```

### ☐ Passo 4: Identifique as Colunas Reais
No console, execute:
```javascript
const line = "Cole a linha bruta aqui";
const delimiter = ';'; // Coloque o delimitador correto
const cols = line.split(delimiter);
cols.forEach((c, i) => console.log(`${i}: "${c.trim()}"`));
```

Anote as colunas:
- [ ] Coluna de matrícula: `_________________`
- [ ] Coluna de código: `_________________`
- [ ] Coluna de valor: `_________________`
- [ ] Coluna de nome: `_________________`

---

## FASE 2: COMUNICAÇÃO (5 min)

### ☐ Compartilhe Informações
Envie isto para o desenvolvedor:

```
Delimitador descoberto: [;  ou  ,  ou  \t  ou  |]

Colunas no arquivo:
1. [nome exato da coluna de matrícula]
2. [nome exato da coluna de código evento]
3. [nome exato da coluna de valor]
4. [nome exato da coluna de nome]
```

**Exemplo:**
```
Delimitador descoberto: ;

Colunas no arquivo:
1. Matricula Colaborador
2. Codigo Evento
3. Valor Calculado
4. Nome Colaborador
```

---

## FASE 3: IMPLEMENTAÇÃO (30-60 min)

*Apenas se você é desenvolvedor*

### ☐ Atualize o Parser
Em `index.html`, função `handleUpload()`:

```javascript
// Se delimitador é '\t' (tab), adicione:
let delimiter = ';';
if (!headerLine.includes(';') && headerLine.includes('\t')) {
  delimiter = '\t';
}
if (!headerLine.includes(';') && !headerLine.includes(',') && headerLine.includes('|')) {
  delimiter = '|';
}
```

### ☐ Atualize os Nomes de Coluna
Em `AuditEngine`, adicione variações em `buscarCampoEspacos()`:

```javascript
normalizarMatricula: (row) => {
  return AuditEngine.buscarCampoEspacos(row, [
    'matricula colaborador',     // Original
    'matrícula colaborador',      // Com acento
    'matricula',                  // Variação
    'Matricula Colaborador',      // Exato do cliente
    'mat col',                    // Abreviado
    'func id'                     // Alternativa
  ]);
},
```

### ☐ Teste a Correção
- [ ] Faça upload do CSV
- [ ] Verifique se mostra múltiplas colunas
- [ ] Verifique se há registros válidos (não "0 válidos")
- [ ] Verifique se há divergências encontradas

---

## FASE 4: VALIDAÇÃO FINAL (10 min)

### ☐ Teste Completo
- [ ] Console mostra "múltiplas colunas" ✅
- [ ] Console mostra "X registros válidos" (não 0) ✅
- [ ] Console mostra divergências por regra ✅
- [ ] Dashboard mostra resultados (não "0 divergências") ✅

### ☐ Verificação de Cada Regra
- [ ] R1 (Novos): Tem divergências? ___
- [ ] R2 (Removidos): Tem divergências? ___
- [ ] R3 (Alterados): Tem divergências? ___
- [ ] R5 (Admitidos): Tem divergências? ___
- [ ] R6 (Demitidos): Tem divergências? ___
- [ ] R7 (Duplicados): Tem divergências? ___
- [ ] **Impacto Financeiro**: R$ ___________

### ☐ Documentação
- [ ] Atualize `GUIA_CORRECAO.md` com nomes reais
- [ ] Atualize `.github/copilot-instructions.md` com delimitador
- [ ] Teste com arquivos de diferentes clientes

---

## 📋 Recursos de Referência

| Documento | Quando Usar | Tempo |
|-----------|------------|-------|
| PROBLEMA_E_SOLUCAO.md | Entender o que está errado | 5 min |
| TESTE_CONSOLE.md | Testar delimitadores | 10 min |
| GUIA_CORRECAO.md | Passo-a-passo detalhado | 15 min |
| DIAGNOSTICO.md | Análise técnica profunda | 20 min |
| csv-parser-helper.js | Código pronto para usar | 5 min |

---

## 🚨 Problemas Comuns & Soluções

| Problema | Causa | Solução |
|----------|-------|---------|
| "1 coluna" no console | Delimitador não reconhecido | Testar outros delimitadores |
| "Cont□bil" (corrompido) | Encoding errado | Salvar como ISO-8859-1 |
| "null" para mat/cod/valor | Nome de coluna diferente | Adicionar em buscarCampoEspacos() |
| "0 válidos" | Nenhum registro válido | Verificar se tem mat+cod |
| Nenhum divergência | Dados iguais em 2 folhas | Normal se folhas iguais |

---

## ✨ Resultado Esperado

### ANTES (❌ Errado):
```
📋 1 colunas: Eventos Calculados - Conta Contábil...
✅ 0 válidos | 0 matrículas | 0 eventos
🔴 0 alta | 🟡 0 média
💰 R$ 0,00
```

### DEPOIS (✅ Correto):
```
📋 4 colunas: [Matricula | Codigo | Valor | Nome]
✅ 20895 válidos | 15000 matrículas | 45000 eventos
🔴 45 alta | 🟡 120 média
💰 R$ 50.000,00
```

---

## 📞 Suporte

Se ficar preso:
1. **Antes de Fase 2**: Releia `PROBLEMA_E_SOLUCAO.md`
2. **Antes de Fase 3**: Consulte `DIAGNOSTICO.md`
3. **Durante Fase 3**: Use `csv-parser-helper.js` como referência

---

**Status**: [ ] Não iniciado | [ ] Em progresso | [ ] Concluído

**Data início**: ___/___/______

**Data conclusão**: ___/___/______

**Desenvolvedor**: _____________________

**Notas**: __________________________________________________
