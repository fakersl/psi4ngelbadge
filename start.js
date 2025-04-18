const { spawn } = require("child_process");

function runScript(scriptName) {
  return new Promise((resolve, reject) => {
    const process = spawn("node", [scriptName], { stdio: "inherit" });

    process.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${scriptName} falhou com código ${code}`));
      }
    });
  });
}

(async () => {
  try {
    console.log("🔧 Registrando comandos (/)...\n");
    await runScript("deploy-commands.js");

    console.log("\n🚀 Iniciando o bot...\n");
    await runScript("index.js");
  } catch (err) {
    console.error("❌ Erro durante o start:", err);
  }
})();
