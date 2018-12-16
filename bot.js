const Discord = require('discord.js');
const client = new Discord.Client({disableEveryone : true});

const inviteReg = /https:\/\/discord(app\.com|\.gg|\.me|\.io)\/?(invite\/)?([_a-zA-Z0-9]{5,32})/gi

let warnedFlood = new Set();

let flood = new Set();

const officialID = '496233900071321600';
const official = client.guilds.get(officialID);

const emojis = '518367008408993804';
const cmds = '496237236791279616';
const zoo = '520988738814345216';

const animal = '520987892219379712';

/** @namespace process.env.BOT_TOKEN */

client.on('ready', () => {
    const official = client.guilds.get(officialID);
    client.user.setActivity(`за ${official.members.random().displayName}`, { type: 3 });
    console.log(`Бот ${client.user.tag} умер`);
});

client.on('message', message => {
    if (message.author.bot || message.channel.type !== 'text') return;
    
    if (message.guild.id !== officialID) {
        message.channel.send('Пiшов нахуй :middle_finger:');
        message.guild.leave().catch();
    }
    
    if (message.member.hasPermission("ADMINISTRATOR")) return;
    
    if (message.author.id === '493372185063325706') message.member.addRole(animal);

    setTimeout(() => client.user.setActivity(`за ${message.author.username}`, { type: 3 }), 16000)

    let arr = [];
    message.guild.fetchInvites().then(invites => {
        invites.forEach(invite => {
        arr.push(invite.code); 
    })
    let matches = message.content.match(inviteReg);
    if (matches)
        matches.forEach((match) => {
            if (!arr.includes(match.match(/discord(app\.com|\.gg|\.me|\.io)\/?(invite\/)?([_a-zA-Z0-9]{5,32})/i)[3])) {
                message.delete();
                message.author.send('Слышь ты, пидорас. Ахуел сервера пиарить? Получай перманетный бан')
                message.channel.send(`${message.author} Был уебан с вертухи за рекламу. Кто следующий?`)
                if (message.member.bannable) message.member.ban('Пидорас рекламит сервер')
            }
        })
    });

    //Система защиты от спама. Код пиздец какой ебнутый, я знаю

    if (message.member.roles.has(animal) && message.channel.id === zoo) return;

    const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 8000 })
    collector.on('collect', msg => {
        const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 4000 })
        collector.on('collect', msg2 => {
            const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 2000 })
            collector.on('collect', msg3 => {
                if (!warnedFlood.has(message.author.id)) {
                    message.reply('попрошу вас пожалуйста перестать спамить, иначе уебу');
                    warnedFlood.add(message.author.id);
                    setTimeout(() => { warnedFlood.delete(message.author.id) }, 10000)
                } 
            })
        })
    })

    if (warnedFlood.has(message.author.id) && message.guild.id == officialID) {
        warnedFlood.delete(message.author.id)
        const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 3000 })
            collector.on('collect', msg3 => {
                message.reply('Был наказан на час');
                message.member.addRole(animal);
                message.author.send('Ты наказан на час');
                setTimeout(() => { message.member.removeRole(animal) }, 3600000)
            });
    }

    //

    if (message.channel.id === emojis) {
        if (message.attachments.size === 0 && !message.content.match(/https:\/\/cdn.discordapp.com\/(attachments|emojis)\//)) {
            message.delete();
            message.author.send('Ваше сообщение не имеет картинки, либо ссылкана картинку не принадлежит Discord (`https://cdn.discordapp.com/attachments/id/id/name.png`). Будешь продолжать - получишь бан');
        }
    }

    if (message.channel.id === cmds) {
        if (message.content.startsWith('=r')) {
            message.delete();
            message.author.send('Ты че заголовок не читал? Там сказано что нельзя использовать команды этого бота, у тебя же блять нет на это прав долбаеб...');
        }
    }

})

client.login(process.env.BOT_TOKEN);
