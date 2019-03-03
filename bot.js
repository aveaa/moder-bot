const Discord = require('discord.js');
const client = new Discord.Client({disableEveryone : true});

const inviteReg = /discord(app\.com\/invite|.\w{2}\/\w{5,})/gi;

let warnedFlood = new Set();
let flood = new Set();

const help = 'Здарова нахуй, я пришел сюда, чтобы оберегать ваш сервер от ебланов. А еще мне не требуется настройка. Для того чтобы меня пригласить напиши `-invite` или `-help` для помощи. \n\nИ да блять, если у тебя непереносимость мата, то смело кикай меня, мата у меня будет много, но мне как-то похуй. (Кто не зайдет тот лох https://discord.gg/NvcAKdt)'

/** @namespace process.env.BOT_TOKEN */

client.on('ready', () => {
    setInterval(() => client.user.setActivity(`за ${client.users.random().username}`, {type: 'WATCHING'}), 16000);
    console.log(`Бот ${client.user.tag} умер`);
});

client.on('guildCreate', guild => {
    const embed = new Discord.RichEmbed()
    .addField(':inbox_tray: New server information', `
    Name: \`${guild.name}\`
    ID: \`${guild.id}\`
    Objects count: \`m: ${guild.memberCount}, r: ${guild.roles.size}, ch: ${guild.channels.size}, e: ${guild.emojis.size}\`
    Owner: ${guild.owner.user} \`${guild.owner.user.tag}\`
    Created at: \`${guild.createdAt.toLocaleString('ru-RU', {timeZone: 'Europe/Moscow', hour12: false}).replace(/\//g, '.')}\``)
    .setColor('ff55ff')
    .setThumbnail(guild.iconURL)
    .setFooter(`Now we have ${client.guilds.size} servers`)
    client.channels.get('548824964556521493').send(embed)
    let channels = guild.channels.filter(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'));
    if (channels) channels.first().send(help);
});

client.on('guildDelete', guild => {
    const embed = new Discord.RichEmbed()
    .addField(':outbox_tray: -Server', `
    Name: \`${guild.name}\`
    ID: \`${guild.id}\`
    Objects count: \`m: ${guild.memberCount}, r: ${guild.roles.size}, ch: ${guild.channels.size}, e: ${guild.emojis.size}\`
    Owner: ${guild.owner.user} \`${guild.owner.user.tag}\`
    Created at: \`${guild.createdAt.toLocaleString('ru-RU', {timeZone: 'Europe/Moscow', hour12: false}).replace(/\//g, '.')}\``)
    .setColor('ff5555')
    .setThumbnail(guild.iconURL)
    .setFooter(`Now we have ${client.guilds.size} servers`);
    client.channels.get('548824964556521493').send(embed);
})

client.on('message', message => {
    if (message.author.bot || !message.guild) return

    const muted = message.guild.roles.find(r => r.name.match(/muted/i));

    if (message.content === '-help') {
      const embed = new Discord.RichEmbed()
      .addField('Спраффка', help)
      .setColor('230989')
      message.channel.send(embed);
    } if (message.content === '-invite') {
      const embed = new Discord.RichEmbed()
      .setDescription(`[тык](https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8)`)
      message.channel.send(embed);
    }

    let arr = [];
    message.guild.fetchInvites().then(invites => {
        invites.forEach(invite => {
        arr.push(invite.code);
    })

    let matches = message.content.match(inviteReg);

    if (matches)
        matches.forEach((match) => {
            if (!arr.includes(match.match(/discord(app\.com\/invite|.\w{2}\/\w{5,})/i)[3])) {
                message.delete();
                message.channel.send(`${message.author} Был уебан с вертухи за рекламу. Кто следующий?`);
                message.author.send('Слышь ты, пидорас. Ахуел сервера пиарить? Получай перманетный бан')
                message.guild.ban(message.member)
            }
        })
    });
    
    if (message.conetnt.match(/<@242975403512168449>/)) {
        message.reply('Андрюшу не пингуй, мут на 3 часа');
        message.member.addRole('520987892219379712').then(r => setTimeout(() => message.member.removeRole(r), 36e5*3))
    }

    //Система защиты от спама. Код пиздец какой ебнутый, я знаю

    let collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 6000 })
    collector.on('collect', msg => {
        collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 4000 })
        collector.on('collect', msg2 => {
            collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 2000 })
            collector.on('collect', msg3 => {
                if (!warnedFlood.has(message.author.id)) {
                    msg3.delete();
                    message.reply('попрошу вас пожалуйста перестать спамить, иначе уебу');
                    warnedFlood.add(message.author.id);
                    setTimeout(() => warnedFlood.delete(message.author.id), 3000)
                }
            })
        })
    })

    if (warnedFlood.has(message.author.id)) {
        warnedFlood.delete(message.author.id)
        const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 4000 })
        collector.on('collect', msg => {
            msg.delete();
            if (muted) {
                if (!message.guild.me.hasPermission('MANAGE_ROLES')) return message.channel.send('Бля, не могу замутить этого пидораса, прав нету')
                message.reply('Был наказан на 10 минут');
                message.author.send('Ты наказан на 10 минут');
                message.member.addRole(muted);
                setTimeout(() => message.member.removeRole(muted), 600000)
            } else {
                if (message.member.kickable) message.channel.send(`Упс, кажется, на вашем сервер нет роли с названием \`Muted\`, так что ${message.author} был кикнут`);
                else message.channel.send('Бля, не могу кикнуть этого пидораса, прав нету')
                message.member.kick('Пидорас');
            };
        });
    }
})

client.login(process.env.BOT_TOKEN);
