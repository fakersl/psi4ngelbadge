const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");
const cron = require("node-cron");
require("dotenv").config();
const token = process.env.TOKEN;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  client.commands.set(command.data.name, command);
}

client.once("ready", async () => {
  console.log(`🤖 Bot online: ${client.user.tag}`);

  // Executando o comando automaticamente ao iniciar o bot
  const command = client.commands.get("ping"); // Comando a ser executado automaticamente
  if (command) {
    // Defina o canal que você quer que o comando seja enviado
    const guild = await client.guilds.fetch(process.env.GUILD_ID);
    const channel = guild.channels.cache.find(
      (c) => c.isTextBased() && c.viewable
    );
    if (channel) {
      await channel.send("/ping"); // Envia o comando para o canal desejado
      console.log("📤 /ping executado automaticamente no início.");
    }
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "❌ Erro ao executar comando.",
      ephemeral: true,
    });
  }
});

client.login(process.env.TOKEN);
