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
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  client.commands.set(command.data.name, command);
}

client.once("ready", () => {
  console.log(`🤖 Bot online: ${client.user.tag}`);

  const lastPingPath = path.join(__dirname, "lastPing.json");

  function getLastDate() {
    try {
      const data = fs.readFileSync(lastPingPath, "utf-8");
      return JSON.parse(data).lastDate;
    } catch {
      return "";
    }
  }

  function updateLastDate(date) {
    fs.writeFileSync(lastPingPath, JSON.stringify({ lastDate: date }, null, 2));
  }

  async function sendPingIfNeeded() {
    const today = dayjs().format("YYYY-MM-DD");
    const lastDate = getLastDate();

    if (lastDate !== today) {
      const guild = await client.guilds.fetch(process.env.GUILD_ID);
      const channel = guild.channels.cache.find(c => c.isTextBased() && c.viewable);
      if (channel) {
        await channel.send("/ping");
        console.log(`📤 /ping enviado em ${today}`);
        updateLastDate(today);
      }
    } else {
      console.log(`✅ Já enviou /ping em ${today}`);
    }
  }

  // Agendamento normal às 12h todo dia
  cron.schedule("0 12 * * *", sendPingIfNeeded);

  // Failsafe: verifica a cada 30 min se precisa enviar
  cron.schedule("*/30 * * * *", sendPingIfNeeded);
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
