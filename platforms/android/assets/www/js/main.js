//Описание состояний игры
var mainState = {
    preload: function () {
        //Начало игры, загрузка ресурсов
        game.load.image('bird', 'img/bird.png');
        game.load.image('backgroundImage', 'img/background.jpg');
    },

    create: function () {
        //Вызывается после preload
        //Устанавливаются параметры
        //Фон
        var image = game.add.sprite(game.world.centerX, game.world.centerY, 'backgroundImage');
        //Умещаем нашу картинку в наше окно
        image.anchor.set(0.5);
        //Активируем все действия по картинке
        image.inputEnabled = true;

        //Модель физики
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //Показываем птицу на позиции x=100 y=245
        this.bird = game.add.sprite(window.innerHeight/4, window.innerHeight/3, 'bird');

        //Добавляем физику птице
        game.physics.arcade.enable(this.bird);

        //Гравитация
        this.bird.body.gravity.y = 1000;

        //Вызов функции прыжка при нажатии кнопки пробел
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);
        image.events.onInputDown.add(this.jump, this);
    },
    
    update: function () {
        //Логика игры, вызывается 60 раз в сек
        //Если птица вышла за рамки, то рестарт
        if (this.bird.y < 0 || this.bird.y > window.innerHeight) {
            this.restartGame();
        }
    },

    //Функция прыжка
    jump: function () {
        this.bird.body.velocity.y = -window.innerHeight/2;
    },
    
    //Перезапуск игры
    restartGame: function () {
        game.state.start('main');
    }
};

//Инициализация Phaser
var game = new Phaser.Game(window.innerHeight, window.innerHeight);
//Добавляем mainState и назавем main
game.state.add('main', mainState);
//Запуск игры
game.state.start('main');
