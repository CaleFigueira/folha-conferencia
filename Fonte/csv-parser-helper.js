// 🔧 Função Auxiliar para Detectar Delimitador Inteligentemente
// Adicione isto no início do AuditEngine

const CSVParser = {
  // Detectar qual delimitador resulta em mais colunas
  detectarDelimitador: (headerLine) => {
    const delimitadores = [';', ',', '\t', '|'];
    let melhorDelimitador = ';';
    let maiorNumColunas = 1;
    
    delimitadores.forEach(delim => {
      const cols = headerLine.split(delim);
      if (cols.length > maiorNumColunas) {
        maiorNumColunas = cols.length;
        melhorDelimitador = delim;
      }
    });
    
    console.log(`   🔎 Testado: ${delimitadores.map(d => {
      const count = headerLine.split(d).length;
      return `'${d}'=${count}cols`;
    }).join(' | ')}`);
    console.log(`   ✅ Melhor delimitador: '${melhorDelimitador}' (${maiorNumColunas} colunas)`);
    
    return melhorDelimitador;
  },
  
  // Parse com tratamento robusto
  parsarCSV: (text, tipo) => {
    console.log(`📥 ${tipo}: Iniciando parse...`);
    
    // Normalize line endings
    const textNorm = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    let lines = textNorm.split('\n').filter(l => l.trim());
    
    if (lines.length < 2) {
      console.error(`❌ ${tipo}: Arquivo com menos de 2 linhas`);
      return { rows: [], header: [] };
    }
    
    // Remove BOM if present
    if (lines[0].charCodeAt(0) === 0xFEFF) {
      lines[0] = lines[0].substring(1);
    }
    
    // Remove empty lines at start/end
    while (lines.length > 0 && !lines[0].trim()) lines.shift();
    while (lines.length > 0 && !lines[lines.length-1].trim()) lines.pop();
    
    const headerLine = lines[0];
    console.log(`   📝 Cabeçalho (${headerLine.length} chars): "${headerLine.substring(0, 80)}..."`);
    
    // Detect delimiter
    const delimiter = CSVParser.detectarDelimitador(headerLine);
    
    // Parse header
    const header = headerLine
      .split(delimiter)
      .map(h => h.replace(/^"|"$/g, '').trim())
      .filter(h => h.length > 0);
    
    console.log(`   📊 Colunas (${header.length}):`);
    if (header.length <= 20) {
      header.forEach((h, i) => console.log(`      ${i+1}: "${h}"`));
    } else {
      header.slice(0, 10).forEach((h, i) => console.log(`      ${i+1}: "${h}"`));
      console.log(`      ...`);
      header.slice(-5).forEach((h, i) => console.log(`      ${header.length-4+i}: "${h}"`));
    }
    
    // Parse rows
    const rows = [];
    const erros = [];
    
    for (let idx = 1; idx < lines.length; idx++) {
      const line = lines[idx];
      if (!line.trim()) continue;
      
      const vals = line.split(delimiter).map(v => 
        v.replace(/^"|"$/g, '').trim()
      );
      
      const row = { _lineNumber: idx + 1 };
      header.forEach((h, i) => {
        row[h] = vals[i] || '';
      });
      
      // Log detalhado dos primeiros 2 registros
      if (rows.length < 2) {
        console.log(`   📝 Registro ${rows.length + 1}:`);
        for (let i = 0; i < Math.min(3, header.length); i++) {
          console.log(`      ${header[i]}: "${row[header[i]]}"`);
        }
      }
      
      rows.push(row);
    }
    
    console.log(`   ✅ ${rows.length} registros parseados\n`);
    
    return { rows, header, delimiter };
  }
};

// Exemplo de uso:
// const { rows, header } = CSVParser.parsarCSV(csvText, 'FOLHA_ATUAL');
