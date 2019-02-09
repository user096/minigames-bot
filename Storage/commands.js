const bot = require('../Storage/constants.js');

module.exports = {

    ttt: {
        name: 'ttt',
        aliases: ['ttt', 'tic-tac-toe', 'крестики-нолики'],
        args: ['[пользователь]'],
        desc: '"Крестики-нолики"',
        detailedDesc: 'Команда для игры в "Крестики-нолики". Вы можете играть в нее с ботом или с другом. Когда будет ваш ход, то вы должны выбрать номер клетки, на которую, хотите поставить фигуру. Побеждает тот, кто выстроит 3 свои фигуры в ряд или диагонально.',
        example: 'ttt'
    },

    countries: {
        name: 'countries',
        aliases: ['countries', 'country', 'страны', 'страна'],
        args: ['[easy | medium | hard | impossible]'],
        desc: 'Миниигра "Угадай флаг страны"',
        detailedDesc: 'В Данной миниигре вам нужно будет угадать, какой флаг у страны указанной сверху. Каждый флаг пронумерован. Выбрав правильный флаг вы побеждаете',
        example: 'hard'
    },

    capitals: {
        name: 'capitals',
        aliases: ['capitals', 'capital', 'столицы', 'столица'],
        args: ['[easy | medium | hard | impossible]'],
        desc: 'Миниигра "Угадай столицу страны"',
        detailedDesc: 'В Данной миниигре вам нужно будет угадать, какая столица у страны указанной сверху. Каждая столица пронумерована. Выбрав правильную, вы побеждаете',
        example: 'easy'
    },

    rsp: {
        name: 'rsp',
        aliases: ['rsp', 'кнб'],
        args: ['<камень | ножницы | бумага>'],
        desc: '"Камень, ножницы, бумага"',
        detailedDesc: 'В Миниигре "Камень, ножницы, бумага" вам нужно выбрать камень, ножницы или бумагу. Бот тоже выбирает из них случайный предмет. Бумага побеждает камень, камень побеждает ножницы, а ножницы побеждают бумагу.',
        example: 'бумага'
    },

    info: {
        name: 'info',
        aliases: ['information', 'инфо', 'ифнормация', 'info'],
        desc: 'Информация (Ссылка на приглашение, создатель и т. п.)'
    },

    rand: {
        name: 'random',
        aliases: ['rand', 'random', 'roll', 'dice'],
        args: ['[n & n]'],
        desc: 'Генератор случайных чисел',
        detailedDesc: 'Эта команда генерирует случайное число в указанном диапазоне. Если вы не будете ничего указывать, то сгенерируется число от 1 до 6.',
        example: '50 100'
    },

    bug: {
        name: 'bug',
        aliases: ['bug', 'bug-report'],
        args: ['<Описание бага>'],
        desc: 'Если бот работает не так как должен, то вы можете написать об этом разработчику с помощью этой команды',
        example: 'В командах ${bot.prefix}capitals и ${bot.prefix}countries флаги/столицы иногда содержат 2 одинаковых ответа'
    },

    idea: {
        name: 'idea',
        aliases: ['idea', 'idea-report', 'идея'],
        args: ['<Описание бага>'],
        desc: 'Отправить идею разработчику',
        example: 'Шахматы'
    },

    donate: {
        name: 'donate',
        aliases: ['donate', 'пожертвование', 'донат'],
        desc: 'Информация о донате',
    },

    update: {
        name: 'update',
        aliases: ['update', 'updates', 'обновление', 'обновления'],
        args: ['[n.n.n]'],
        desc: 'Информация о текущем или предыдущих обновлениях',
        detailedDesc: `Чтобы получит информацию о том или ином обновлении, то вам нужно указать версию. Существующие версии: \`${bot.updatesList.join(', ')}\``,
        example: '0.3.2'
    },

    used: {
        name: 'used',
        aliases: ['used', 'cmd-log'],
        desc: 'Отчет о том, какие команды чаще используют',
    },

    help: {
        name: 'help',
        aliases: ['help', 'h'],
        disableHelp: true
    },

    cmd_help: {
        name: 'cmd-help',
        aliases: ['cmd-help', 'command-help', 'c-help', 'cmd-h'],
        disableHelp: true
    }
}
