# 📊 Sistema de Auditoria de Folha - CSB Drogarias

Sistema automatizado para auditoria de folha de pagamento conforme PRD.

## 🚀 Como Usar

1. **Abrir o arquivo:** `index.html` no navegador
2. **Fazer upload** dos 6 arquivos CSV:
   - Folha Atual (11/2025)
   - Folha Anterior (10/2025)
   - Admitidos
   - Demitidos
   - Férias
   - Licenciados

3. **Pressionar F12** para ver logs detalhados
4. **Clicar em "Executar Auditoria"**

## 📋 Regras Implementadas

- ✅ **R1** - Eventos Novos
- ✅ **R2** - Eventos Removidos
- ✅ **R3** - Valor Alterado (tolerância 5%)
- ✅ **R5** - Admitidos
- ✅ **R6** - Demitidos
- ✅ **R7** - Duplicados

## 🔧 Tecnologias

- React 18
- Tailwind CSS
- JavaScript puro (sem build)

## 📁 Estrutura

```
index.html          # Aplicação completa standalone
README.md           # Este arquivo
PRD.txt            # Documento de requisitos
```

## 🐛 Debug

Logs detalhados no Console (F12):
- Colunas detectadas
- Registros processados
- Matrículas encontradas
- Divergências por regra

## 📝 Notas

- Compatível com encoding ISO-8859-1
- Busca flexível de colunas (ignora acentos)
- Pula cabeçalhos automaticamente
- Suporta equivalência de eventos de férias

## 👤 Autor

Projeto CSB Drogarias S/A - 2025
