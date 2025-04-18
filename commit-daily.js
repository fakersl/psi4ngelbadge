// commit-daily.js
const { exec } = require('child_process');
const fs = require('fs');
const token = process.env.TOKEN;

// Lê o arquivo lastPing e verifica a data (ou cria se não existir)
const lastPingFile = './lastPing.txt';
const today = new Date().toISOString().slice(0, 10); // Data no formato YYYY-MM-DD

if (!fs.existsSync(lastPingFile)) {
  fs.writeFileSync(lastPingFile, `Last ping: ${today}`);
} else {
  const lastPing = fs.readFileSync(lastPingFile, 'utf-8');
  if (!lastPing.includes(today)) {
    fs.writeFileSync(lastPingFile, `Last ping: ${today}`);
  }
}

// Executa os comandos de commit
exec('git add . && git commit -m "Atualizando lastPing automaticamente" && git push origin main', (err, stdout, stderr) => {
  if (err) {
    console.error(`Erro ao fazer commit: ${err}`);
    return;
  }
  console.log(`Commit feito com sucesso: ${stdout}`);
});