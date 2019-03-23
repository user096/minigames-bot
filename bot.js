//Подключаем библиотеки
const Discord = require('discord.js');
const fs = require('fs');
const hastebin = require('hastebin-gen');
const jimp = require('jimp');

//Переменные среды
/** @namespace process.env.BOT_TOKEN */

//Класс бота
class Bot {
    //Конструктор
    constructor() {
        //Делаем this класса Bot более глобальным
        let _this = this;
        //Подключаем боту библиотеки
        this.Discord = Discord;
        this.fs = fs;
        this.hastebin = hastebin;
        this.jimp = jimp;
        //Создаем клиент бота
        this.client = new Discord.Client({disableEveryone: true});
        //Регистрируем бота
        this.client.login(process.env.BOT_TOKEN).then(() => delete process.env.BOT_TOKEN);
        //Имя и версия бота
        this.name = 'Minigames Bot';
        this.version = '0.7.0';
        //Объект с командами
        this.commands = [];
        //
        this.embed = new Discord.RichEmbed().setFooter('<> with ❤ by ANREY#2623');
        //Функция, возвращающая объект embed, стилизованный под ошибку
        this.embedErr = (message) => {
            const embed = _this.embed
            .setAuthor('Error', message.author.avatarURL)
            .setColor('ff5555')
            return embed;
        };

        this.err = (message, reason) => message.channel.send(_this.embedErr(message).setDescription(`Reason: **${reason}**`));

        this.invalidArgs = (message, cmd) => {
            const embed = _this.embedErr(message).setDescription(`Invalid arguments were provided\n
            Usage: **${cmd.name} \`${cmd.args}\`**
            Example: **${cmd.name} ${cmd.example}**`);
            message.channel.send(embed);
        }

        //Функция, возвращающая объект Emoji
        this.emoji = (id) => _this.client.emojis.get(id) || '';

        //Функция для генерации случайного числа в определенном диапазоне
        this.random = (min, max) => Math.floor(Math.random() * (max + 1 - min)) + min;

        //Функция, отправляющая сообщение в указанный канал
        this.sendIn = (id, msg) => this.client.channels.get(id).send(msg);

        this.addCommas = (int) => int.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        this.toMoscowTime = (time) => time.toLocaleString('ru-RU', {timeZone: 'Europe/Moscow', hour12: false}).replace(/\/|\./g, '-');

        //Событие запуска клиента
        _this.client.on('ready', () => {
            _this.prefixes = ['m!', 'm1', 'м!', 'м1', `<@${this.client.user.id}>`];
            console.log(`${this.client.user.tag} is Logged successfully.\nGuilds: ${this.client.guilds.size}\nUsers: ${this.client.users.size}\nChannels: ${this.client.channels.size}`);
            fs.readdir('./Commands', (err, cmds) => {
                if (err) throw err;
                cmds.forEach(command => {
                    const cmd = require(`./Commands/${command}`);
                    this.commands.push({
                        name: cmd.info.name,
                        regex: cmd.info.regex.toString().slice(1, -1),
                        args: cmd.info.args,
                        desc: cmd.info.desc,
                        run: cmd.run,
                        private: cmd.info.private || false,
                        hidden: cmd.info.hidden || false,
                    });
                })
            })
        })


        _this.client.on('message', message => {
            const prefix = _this.prefixes.find(p => message.content.startsWith(p));
            if (!message.guild || message.author.bot) return;
            //something
            if (!prefix) return;

            const args = message.content.slice(prefix.length).trim().split(/ +/g);
            const command = args.shift().toLowerCase();

            const cmd = _this.commands.find(c => command.match(new RegExp(c.regex)));
            if (cmd && (!cmd.private || message.author.id === _this.creatorID)) cmd.run(message, args, command);

            if (command === 'help') {
                const page = parseInt(args[0]) || 1;
                const helpCommands = _this.commands.filter(c => !c.private && !c.hidden)
                const arr = helpCommands.map(cmd => `◽ **${cmd.name} ${cmd.args?`\`${cmd.args}\``:''} -** ${cmd.desc}`);
                const embed = new Discord.RichEmbed()
                .setAuthor('Help', message.author.avatarURL)
                .setDescription(`**\`<...>\` - Require parameter.\n\`[...]\` - Optional parameter.\n\`&\` - AND operator.\n\`|\` - OR operator.\n\`n\` - Number.**\n\n${arr.join('\n')}`)
                .setColor(_this.colors.main)
                .addField('More info', `**:link: Official server: ${_this.serverLink}\n:kiwi: Qiwi - https://qiwi.me/andreybots\n:moneybag: PayPal - https://donatebot.io/checkout/496233900071321600\n◽ Type ${_this.prefixes[0]}donate for more info**`)
                .setFooter('<> with ❤ by ANDREY#2623')
                message.channel.send(embed);
            }
        });

        _this.client.on('guildCreate', (guild) => {
            const embed = new Discord.RichEmbed()
            .addField(':inbox_tray: New server information', `
        Name: \`${guild.name}\`
        ID: \`${guild.id}\`
        Objects count: \`m: ${guild.memberCount}, r: ${guild.roles.size}, ch: ${guild.channels.size}, e: ${guild.emojis.size}\`
        Owner: ${guild.owner.user} \`${guild.owner.user.tag}\`
        Created at: \`${_this.toMoscowTime(guild.createdAt)}\``)
            .setColor(_this.colors.green)
            .setThumbnail(guild.iconURL)
            .setFooter(`This is our ${client.guilds.size} server`)
            Bot.sendIn(Bot.channels.serverLeaveJoin, embed);
            let channels = guild.channels.filter(channel => channel.type === 'text' && channel.permissionsFor(guild.members.get(client.user.id)).has('SEND_MESSAGES'));
            if (channels.size > 0) channels.first().send(`Thank you for ading me! Type ${this.prefixes[0]}help for help! https://discord.gg/DxptT7N`);
        });


        /*
        * Costants
        */

        this.serverLink = 'https://discord.gg/NvcAKdt';

        this.colors = {
            discord: '36393F',
            green: '55ff55',
            red: 'ff5555',
            yellow: 'ffff55',
            main: 'af00ff'
        };

        this.chooseVariantsCmd = (message, variants, answers, minigameName, difficulty, question) => {
            let seconds = 0;
            let numberOfVariants = 0;
            if (difficulty.match(/e(asy)?|л(е[гх]ко)?/i)) {
                seconds = 20;
                numberOfVariants = 3;
            } else if (difficulty.match(/h(ard)?|с(ло[жш]но)?|х(ар[дт])?/i)) {
                seconds = 15;
                numberOfVariants = 12;
            } else if (difficulty.match(/i(mposs?ible?)?|н(евозмо[жш]но)?|ex(tr[ei]me?)?|э(кстрим)?/i)) {
                seconds = 15;
                numberOfVariants = 24;
            } else {
              seconds = 10;
              numberOfVariants = 6;
            }

            const definder = _this.random(0, variants.length - 1);
            const numberInList = _this.random(1, numberOfVariants);
            const variantsInMenu = [];
            const embed = new Discord.RichEmbed()
            .setAuthor(`Minigame "${minigameName}"`, message.author.avatarURL,)
            .setDescription(`${message.member}, ${question} **"${variants[definder]}"**?`)
            .setColor(_this.colors.main)
            .setFooter(`Write of the correct answer number down bellow (You have only ${seconds} seconds!)`)
            .setTimestamp();
            for (let i = 1; i < numberOfVariants + 1; i++) {
                let answer = answers[_this.random(0, answers.length - 1)];
                if (i === numberInList) answer = answers[definder];
                variantsInMenu.forEach(variantInMenu => {
                    while (answer === variantInMenu) answer = answers[_this.random(0, answers.length - 1)];
                })
                variantsInMenu.push(answer);
                embed.addField(`${i})`, `**${answer}**`, true);
            }
            message.channel.send({embed}).then(() => {
                const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: seconds * 1000 });
                collector.on('collect', msg => {
                    collector.stop();
                    function youLose () {
                        const embed = new _this.Discord.RichEmbed()
                        .setAuthor('You lose >:D', message.author.avatarURL)
                        .setDescription(`The correct answer is **${numberInList})** ${answers[definder]}`)
                        .setColor(_this.colors.red)
                        message.channel.send(embed);
                    }
                    if (msg.content || !isNaN(parseInt(msg.content))) {
                        const number = parseInt(msg.content) - 1;

                        if (variantsInMenu[number] === answers[definder]) {
                            const embed = new _this.Discord.RichEmbed()
                            .setAuthor('You won!', message.author.avatarURL)
                            .setDescription(`The correct answer is **${numberInList})** ${answers[definder]}`)
                            .setColor(_this.colors.green)
                            message.channel.send(embed);
                        }

                        else youLose();

                    } else youLose();
                })
            });
        }

        this.creatorID = '242975403512168449';
        this.helperID = '421030089732653057';
        this.avatarCreatorID = '447019894735634432';
        this.evalWhitelist = [this.creatorID, this.helperID];

        this.versionsList = ['0.1.0', '0.2.0', '0.3.0', '0.3.1', '0.3.2', '0.4.0', '0.5.0', '0.6.0', '0.6.1', '0.7.0'];

        this.channels = {
            serverLeaveJoin: '536187820243550228',
            commandsUsing: '536187872655704074',
            reports: '536187892968587285',
            stats: '539737874032230437',
        };

        this.versions = {
            '0.1.0': [`На мoмент создания бота были команды ${this.prefix}countries, ${this.prefix}rsp, ${this.prefix}help, ${this.prefix}idea, ${this.prefix}bug и ${this.prefix}creator`],
            '0.2.0': [`Добавлена команда ${this.prefix}capitals`],
            '0.3.0': [`Добавлена команда ${this.prefix}ttt', 'Добавлена возможность выбирать уровень сложности в командах ${this.prefix}capitals и ${this.prefix}countries`],
            '0.3.1': [`Крестики-нолики (${this.prefix}ttt) стали намного умнее', 'Были добавлены команды ${this.prefix}update и ${this.prefix}rand`],
            '0.3.2': [`Дизайн команды ${this.prefix}ttt был изменен с черно-белого на радужный, на клетках появились цифры', 'Теперь когда вы делаете ход в ${this.prefix}ttt, то бот вас упоминает, чтобы не было путаницы', 'Изменены фразы после проигрыша/выигрыша в ${this.prefix}ttt`],
            '0.4.0': [`В ${this.prefix}ttt теперь можно играть с другом', 'Добавлена возможность выбирать кто пойдет первым в ${this.prefix}ttt`],
            '0.5.0': [`Добавлена команда ${this.prefix}seabattle (морской бой)`],
            '0.6.0': [`Была убрана команда ${this.prefix}seabattle из-за перегрузок', 'Был изменен дизай команды ${this.prefix}help', 'Добавлены команды ${this.prefix}cmd-info \`<Название команды>\` и ${this.prefix}info', 'Крестики-нолики теперь не засоряют чат', '*Пссс, еще был добавлен донат, ${this.prefix}donate, только никому не говори!*`],
            '0.6.1': [`Была добавлена команда ${this.prefix}used, которая позволяет просматривать какие команды чаще используют', 'Функция, которая отправляет информацию о том где и кто использует команды была улучшена ~~(чтобы это увидеть, то нужно прийти к нам на серве...)~~', 'Теперь, каждому репорту бага или идеи присваивается уникальный ID, чтобы на них было легче отвечать`],
            '0.7.0': ['Optimization and bugfix', 'Translating on English']
        };

        this.emojis = {
            yoba: '522739254825058304',
            rock: '522738393566937089',
            typing: '526365694183342087',

            whitePawn: '527399844093100042',
            whiteHourse: '527399872521961482',
            whiteEleph: '527399891962691584',
            whiteLadya: '527399926838067200',
            whiteFerz: '527399969469235200',
            whiteKing: '527400008144650280',

            blackPawn: '527400035776856065',
            blackHourse: '527400068345626625',
            blackEleph: '527400077363511296',
            blackLadya: '527400087299817484',
            blackFerz: '527400003105107828',
            blackKing: '527400109890207755'
        };

        this.images = {
            circle: 'https://cdn.discordapp.com/attachments/492028926919573506/540953553523703808/circle.png',
            bg: 'https://cdn.discordapp.com/attachments/492028926919573506/540957076508114944/background.png',

            ttt: {
                field: 'https://cdn.discordapp.com/attachments/524159437464797184/526470580115996672/tttField.png',
                cross: 'https://cdn.discordapp.com/attachments/524159437464797184/526470512310878208/cross.png',
                circle: 'https://cdn.discordapp.com/attachments/524159437464797184/526470469092769793/circle.png'
            },

            sb: {
                field: 'https://cdn.discordapp.com/attachments/524159437464797184/526470930721931265/seabattleField.png',
                ship: 'https://cdn.discordapp.com/attachments/524159437464797184/526470967237672960/ship.png',
                cross: 'https://cdn.discordapp.com/attachments/524159437464797184/526471033104891905/redCross.png',
                dot: 'https://cdn.discordapp.com/attachments/524159437464797184/526471615387795466/dot.png',
                blast: 'https://cdn.discordapp.com/attachments/524159437464797184/526493484543246348/blast.png',
            },

            chess: {
                field: 'https://cdn.discordapp.com/attachments/524159437464797184/527395245386629121/chessField.png',
                blackSquare: 'https://cdn.discordapp.com/attachments/524159437464797184/527417268842397716/blackSquare.png',
                whiteSquare: 'https://cdn.discordapp.com/attachments/524159437464797184/527417312878395410/whiteSquare.png',
                blackPawn: 'https://cdn.discordapp.com/attachments/524159437464797184/527131436382158879/blackPawn.png',
                blackHourse: 'https://cdn.discordapp.com/attachments/524159437464797184/527131380858224641/blackHourse.png',
                blackEleph: 'https://cdn.discordapp.com/attachments/524159437464797184/527131309282295809/blackEleph.png',
                blackLadya: 'https://cdn.discordapp.com/attachments/524159437464797184/527131421605756941/blackLadya.png',
                blackFerz: 'https://cdn.discordapp.com/attachments/524159437464797184/527131366618300416/blackFerz.png',
                blackKing: 'https://cdn.discordapp.com/attachments/524159437464797184/527131405055033354/blackKing.png',
                whitePawn: 'https://cdn.discordapp.com/attachments/524159437464797184/527131598462779393/whitePawn.png',
                whiteHourse: 'https://cdn.discordapp.com/attachments/524159437464797184/527131534898233344/whiteHourse.png',
                whiteEleph: 'https://cdn.discordapp.com/attachments/524159437464797184/527131491059236864/whiteEleph.png',
                whiteLadya: 'https://cdn.discordapp.com/attachments/524159437464797184/527131578598424607/whiteLadya.png',
                whiteFerz: 'https://cdn.discordapp.com/attachments/524159437464797184/527131508947943434/whiteFerz.png',
                whiteKing: 'https://cdn.discordapp.com/attachments/524159437464797184/527131558205849601/whiteKing.png'
            }
        };

        this.minigames = {
            countries: ['Zimbabwe', 'Croatia', 'Latvia', 'Kazakhstan', 'Russia', 'Greece',
                'Denmark', 'Uganda', 'Finland', 'Belarus', 'Romania', 'Albania', 'Switzerland',
                'Monaco', 'Poland', 'Italy', 'America', 'Britain', 'Portugal', 'Turkey',
                'Egypt', 'India', 'Austalia', 'New Zealand', 'Singapore', 'Malaysia', 'Pakistan',
                'Uzbekistan', 'China', 'Ukraine', 'Germany', 'France', 'Japan', 'Brasil',
                'Bangladesh', 'Austria', 'Hungary', 'Nepal', 'Indonesia', 'Uruguay', 'Paraguay',
                'Argentina', 'Chile', 'Cuba', 'Peru', 'Syria', 'Iraq', 'Iran',
                'Czech'
            ],

            flags: [':flag_zw:', ':flag_hr:', ':flag_lv:', ':flag_kz:', ':flag_ru:', ':flag_gr:',
                ':flag_dk:', ':flag_ug:', ':flag_fi:', ':flag_by:', ':flag_ro:', ':flag_al:', ':flag_ch:',
                ':flag_mc:', ':flag_pl:', ':flag_it:', ':flag_us:', ':flag_gb:', ':flag_pt:', ':flag_tr:',
                ':flag_eg:', ':flag_in:', ':flag_au:', ':flag_nz:', ':flag_sg:', ':flag_my:', ':flag_pk:',
                ':flag_uz:', ':flag_cn:', ':flag_ua:', ':flag_de:', ':flag_fr:', ':flag_jp:', ':flag_br:',
                ':flag_bd:', ':flag_at:', ':flag_hu:', ':flag_np:', ':flag_my:', ':flag_uy:', ':flag_py:',
                ':flag_ar:', ':flag_cl:', ':flag_cu:', ':flag_pf:', ':flag_sy:', ':flag_iq:', ':flag_ir:',
                ':flag_cz:'
            ],

            capitals: ['Harare', 'Zagreb', 'Riga' , 'Astana', 'Moscow', 'Athens',
                'Copenhagen', 'Kampala', 'Helsinki', 'Minsk', 'Bucharest', 'Tirana', 'Bern',
                'Monaco', 'Warsaw', 'Rome', 'Washington', 'London', 'Lisbon', 'Ankara',
                'Cairo', 'New Delhi', 'Caberra', 'Wellington', 'Singapore', 'Kuala Lumpur', 'Islamabad',
                'Tashkent', 'Beijing', 'Kiev', 'Berlin', 'Paris', 'Tokio', 'Brasília',
                'Dhaka', 'Vienna', 'Budapest', 'Kathmandu', 'Jakarta', 'Montevideo', 'Asunción',
                'Buenos Aires', 'Santiago', 'Havana', 'Lima', 'Damascus', 'Baghdad', 'Tehran',
                'Prague'
            ]
        };
    };
};

global.Bot = new Bot();
