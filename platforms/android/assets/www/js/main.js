//Описание состояний игры
var mainState = {
    preload: function () {
        //Начало игры, загрузка ресурсов
        game.load.image('backgroundImage', 'img/background.jpg');
        game.load.image('bird', 'img/bird.png');
        game.load.image('pipe', 'img/pipe.png');
        game.load.audio('jump', 'img/jump.wav');
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
        this.bird = game.add.sprite(window.innerHeight/8, window.innerHeight/3, 'bird');

        //Добавляем физику птице
        game.physics.arcade.enable(this.bird);

        //Гравитация
        this.bird.body.gravity.y = 1000;

        // Якорь вращения птицы
        this.bird.anchor.setTo(-0.2, 0.5);

        //Звук прыжка
        this.jumpSound = game.add.audio('jump');

        //Вызов функции прыжка при нажатии кнопки пробел
        //var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        //spaceKey.onDown.add(this.jump, this);
        image.events.onInputDown.add(this.jump, this);

        ////Препятствия
        //Создаем группу
        this.pipes = game.add.group();
        this.timer = game.time.events.loop(4000, this.addRowOfPipes, this);

        this.score = 0;
        this.labelScore = game.add.text(window.innerWidth*0.05, window.innerWidth*0.05);
    },
    
    update: function () {
        //Логика игры, вызывается 60 раз в сек
        //Если птица вышла за рамки, то рестарт
        if (this.bird.y < 0 || this.bird.y > window.innerHeight) {
            this.restartGame();
        }

        game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);

        if (this.bird.angle < 20) {
            this.bird.angle += 1;
        }
    },

    //Функция прыжка
    jump: function () {
        if (this.bird.alive == false) {
            return;
        }
        this.bird.body.velocity.y = -window.innerHeight/2;

        //Анимация прыжка
        var animation = game.add.tween(this.bird);
        //Изменить угол птицы на -20 градусов за 100 мс
        animation.to({angle: -20}, 100);
        //Запуск анимации
        animation.start();

        //Звук прыжка
        this.jumpSound.play();
    },
    
    //Перезапуск игры
    restartGame: function () {
        game.state.start('main');
    },
    
    addOnePipe: function (x, y) {
        //Создаем на позиции х и у препятствие
        //console.log(x, y);
        var pipe = game.add.sprite(x, y, 'pipe');

        //Добавляем его в группу
        this.pipes.add(pipe);

        //Добавляем физику препятствию
        game.physics.arcade.enable(pipe);

        //Добавляем скорость
        pipe.body.velocity.x -= window.innerWidth*0.2;
        //pipe.body.velocity.x = -200;
        //console.log('velocity: ' +  window.innerWidth*0.2);
        //Удаляем препятствие если вышло за экран
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },

    addRowOfPipes: function () {
        //Создаем столбец препятствий с дыркой в случайном месте
        //Выюираем позицию дырки

        var hole = Math.floor(Math.random()*5) + 1;
        //console.log('add pipes with hole on ' + hole);

        //Добавляем 6 элементов с дыркой на позиции hole и hole+1
        for (var i=0; i<8; i++){
            if (i != hole && i != (hole + 1)) {
                //console.log(i + ' pipe: ' + window.innerWidth + ' ' + i*window.innerHeight/8 + window.innerHeight*0.1);
                if (i == 0) {
                    this.addOnePipe(window.innerWidth, i*window.innerHeight*0.15);
                } else {
                    this.addOnePipe(window.innerWidth, i*window.innerHeight*0.15 + window.innerHeight*0.05);
                }
            }
        }

        this.score += 1;
        this.labelScore.text = this.score;
    },
    
    hitPipe: function () {
        //Анимация столкновения
        if (this.bird.alive == false) {
            return;
        }

        this.bird.alive = false;

        //Останавливаем добавление препятствий
        game.time.elements.remove(this.timer);

        //Останавливаем все препятствия
        this.pipes.forEach(function (p) {
            p.body.velocity.x = 0;
        }, this);
    }
};

//Инициализация Phaser
var game = new Phaser.Game(window.innerHeight, window.innerHeight);
//Добавляем mainState и назавем main
game.state.add('main', mainState);
//Запуск игры
game.state.start('main');
