const { SlashCommandBuilder } = require('@discordjs/builders');
const token = process.env.TOKEN;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Responde com pong!'),
  async execute(interaction) {
    const start = Date.now(); // Começar a contagem do tempo

    // Responde ao comando
    await interaction.reply('Pong!');

    const end = Date.now(); // Tempo final

    // Atualiza a resposta para mostrar o tempo de latência
    await interaction.editReply(`Pong! Demorou ${end - start}ms.`);

    // Altera o status do bot para refletir o tempo de resposta
    const latency = end - start;
    interaction.client.user.setPresence({
      activities: [{
        name: `Último /ping: ${latency}ms`,
        type: 'WATCHING',
      }],
      status: 'online',
    });
  },
};