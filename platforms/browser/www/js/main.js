//Описание состояний игры
var mainState = {
    preload: function () {
        //Начало игры, загрузка ресурсов
        game.load.image('bird', 'img/bird.png')
    },

    create: function () {
        //Вызывается после preload
        //Устанавливаются параметры
        //Фон
        game.stage.backgroundColor = '#71c5cf';

        //Модель физики
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //Показываем птицу на позиции x=100 y=245
        this.bird = game.add.sprite(100, 245, 'bird');

        //Добавляем физику птице
        game.physics.arcade.enable(this.bird);

        //Гравитация
        this.bird.bodies.gravity = 1000;

        //Вызов функции прыжка при нажатии кнопки пробел
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);
    },
    
    update: function () {
        //Логика игры, вызывается 60 раз в сек
        //Если птица вышла за рамки, то рестарт
        if (this.bird.y < 0 || this.bird.y > 490) {
            this.restartGame();
        }
    },

    //Функция прыжка
    jump: function () {
        this.bird.body.velocity.y = -350;
    },
    
    //Перезапуск игры
    restartGame: function () {
        game.state.start('main');
    }
};

//Инициализация Phaser
var game = new Phaser.Game(400, 900);
//Добавляем mainState и назавем main
game.state.add('main', mainState);
//Запуск игры
game.state.start('main');