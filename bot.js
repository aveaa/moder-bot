const Discord = require('discord.js');
const client = new Discord.Client({disableEveryone : true});

const inviteReg = /https:\/\/discord(app\.com|\.gg|\.me|\.io)\/?(invite\/)?([_a-zA-Z0-9]{5,32})/gi

let warnedEmojis = new Set();
let warnedCmds = new Set();
let warnedFlood = new Set();

let flood = new Set();

const official = '496233900071321600';

const emojis = '518367008408993804';
const cmds = '496237236791279616';
const zoo = '520988738814345216';

const animal = '520987892219379712';

/** @namespace process.env.BOT_TOKEN */

client.on('ready', () => {
    client.user.setActivity('за тобой', { type : 4 });
    console.log(`Бот ${client.user.tag} умер`);
});

client.on('message', message => {
    if (message.author.bot || message.channel.type !== 'text') return

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
                message.channel.send(`${message.author} Был уебан с вертухи. Кто следующий?`)
                if (message.member.bannable) message.member.ban('Реклама')
            }
        })
    });

    //Система защиты от спама. Код пиздец какой ебнутый, я знаю

    if (message.member.roles.has(animal) && message.channel.id === zoo) return;

    const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 6000 })
    collector.on('collect', msg => {
        const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 4000 })
        collector.on('collect', msg2 => {
            const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 2000 })
            collector.on('collect', msg3 => {
                if (!warnedFlood.has(message.author.id)) {
                    message.reply('попрошу вас пожалуйста перестать спамить, иначе уебу');
                    warnedFlood.add(message.author.id);
                    setInterval(() => { warnedFlood.delete(message.author.id) }, 3000)
                } 
            })
        })
    })

    if (warnedFlood.has(message.author.id) && message.guild.id == official) {
        warnedFlood.delete(message.author.id)
        const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 3000 })
            collector.on('collect', msg3 => {
                message.reply('Ты наказан на 10 минут');
                message.member.addRole(animal);
                setInterval(() => { message.member.removeRole(animal) }, 600000)
            });
    }

    //

    if (message.channel.id === emojis) {
        if (message.attachments.size === 0 && !message.content.match(/https:\/\/cdn.discordapp.com\/attachments\//)) {
            message.delete();
            if (!warnedEmojis.has(message.author.id)) {
                warnedEmojis.add(message.author.id)
                message.author.send('Ваше сообщение не имеет картинки, либо ссылкана картинку не принадлежит Discord (`https://cdn.discordapp.com/attachments/id/id/name.png`). Будешь продолжать - получишь бан');
            }
            else {
                message.author.send('Мы уже блять тебя предупредили что нужно сука отправлять только эмодзи (с ссылками принадлежащими дискорду). Так что получаешь бан по причине пидорас')
                message.member.ban('Пидорас');
            }
        }
    }

    if (message.channel.id === cmds) {
        if (message.content.startsWith('=')) {
            message.delete();
            if (!warnedCmds.has(message.author.id)) {
                warnedCmds.add(message.author.id)
                message.author.send('Ты че заголовок не читал? Там сказано что нельзя использовать команды этого бота, у тебя же блять нет на это прав долбаеб...');
            }
            else {
                message.author.send('Мы уже блять тебя предупредили что нельзя сука использовать команды этого бота. Так что получаешь бан по причине пидорас. Нам не нужны такие долбаебы как ты')
                message.member.ban('Пидорас');
            }
        }
    }

})

client.login('NTIyMDE5NDc3NDA4NDQ4NTI0.DvE4Mw.qGrbVD5WU1DszclcSZ9DZWdFLiY');