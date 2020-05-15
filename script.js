/*  !!!  План для JS  !!!

1) Сделать движение игрока стрелочками up and down
2) Сделать выстрел, нажатием на клавишу
3) Сделать полет пули
4) Проверка на то, попала ли наша пуля в цель:
	Если попали по цели, то сделать анимацию взрыва самой пули
5) Удалить пулю после выхода за границу


*/

let name = prompt('Укажите ваш игровой ник: ');

heigth = window.innerHeight-200;
// Сначала выбираю блок с игроком

document.writeln("Игрок: " + name);
player = document.querySelector("#player"); 	/*Обращение к документу, где документ - это игровое поле, которое видит игрок*/
player.style.position = "absolute";

let enemySpeed = 10;

// Количество жизней
lifes = 3;
score = 0;

function moveUp(){
	y = player.offsetTop;
	y -= 80;
	player.style.top = y + "px";
	if(y < 0)
		player.style.top = "0px";
}

function addScore(){
	score = score + 1;
	document.getElementById("score").innerHTML = "score: " + score;
}


function moveDown(){
	y = player.offsetTop;
	y += 80;
	player.style.top = y + "px";
	if(y > heigth)
		player.style.top = (heigth) + "px";
}


// И здесь добавляю нажатие клавиши
document.addEventListener('keyup', function(event) { // keydown - это событие нажатие какой-либо клавиши, а функция - это именно дейсвтие при нажатии клавиши
	

	switch(event.keyCode) {
		case 83: 					// 83 код клавиши S
			moveDown();  /*Когда герой летит вниз, то пиксели идут вверх*/
			break;


		case 87:
			moveUp();
			break;

		case 32:  								// Space 
			createBullet();                   // Вызыв функции пули
			break;

	}

	
	console.dir(event);

});

// Создание пули
function createBullet() {

	// Создание блока для самой пули
	let bullet = document.createElement("div"); 		// Запихнул элемент див, который должен создать из индекса, в итоге должно получиться что-то типа <div class="bullet"></div>	
	
	// Класс пули
	bullet.className = 'bullet';
	
	// Создание начальной поз для пули
	
	// Пуля на игровлм поле
	bullet.style.top = player.offsetTop + 150 + "px";						// Изначальная позиция пули. Если гер 200пикс, то пуля вылетает где-то на 150 пикс +-
	document.body.appendChild(bullet);

	// движегие пули
	bulletMove(bullet);	
 
} 
createEnemy();

function bulletMove(bullet) {
		// Таймер движения пули
	let timerId = setInterval(function() {
		// Движение пули вправо
		bullet.style.left = bullet.offsetLeft + 10 + "px";
		// Проверка попадания пули в мишень
		isShot(bullet, timerId);
		
		if(bullet.offsetLeft > document.body.clientWidth) {
			bullet.remove();
			clearInterval(timerId);
		}

	}, 10);
}


function isShot(bullet, timer) {						// Для того, чтобы узнать, попала ли пуля в цель нужно проверять, находится ли пуля между верх.границей и нижней границей, а также левой и првой границы
	// Координаты верхней + нижней точки puli
	let topB = bullet.offsetTop;
	let bottomB = bullet.offsetTop + bullet.offsetHeight;

	
	let enemy = document.querySelector(".enemy");
	if(enemy != null) {
			// Координаты верхней + нижней точки юнита
		let topE = enemy.offsetTop;
		let bottomE = enemy.offsetTop + enemy.offsetHeight;

		let leftB = bullet.offsetLeft;
		let leftE = enemy.offsetLeft;

		// Далее надо сделать проверку, если топБ больше топа энеми, то есть попадание

		if(topB >= topE && topB <= bottomE && leftB >= leftE) {
			// Остановить энеми, для этого нужно таймер ID
			enemy.className = 'boom';
			enemy.style.top = (topE - 50) + "px";    // взрыв идет на 200 пикселей, этомного, поэтому минус 50
			enemy.style.left = (leftE - 50) + "px";
			clearInterval(enemy.dataset.timer);
			setTimeout(function() {
				addScore();
				enemy.remove();
				createEnemy();
				bullet.remove();
				clearInterval(timer);
			}, 500) 
		}

	}
	

													// 1) Для этого нужно проверять, если у пули позиция (top and left) > чем позиция цели (правого квадрата, его top and left), то тогда пуля находится ниже этого поля 
													// 2) Также нужно проверить, меньше ли наш tl цели. Если да, то в пределах пули находится
													// 3) ПРоверить, находится ли в пределах игрока уже по лефту. Совпадает ли лефт пули и цели
}

// Если муха попала в нас
function isDie() {
	let enemy = document.querySelector('.enemy');

	if(enemy.offsetTop > player.offsetTop && enemy.offsetTop < player.offsetTop + player.offsetHeight && 
		enemy.offsetLeft <= player.offsetLeft + player.offsetWidth) {
		enemy.className = 'boom';
			enemy.style.top = (player.offsetTop + 50) + "px";    // взрыв идет на 200 пикселей, этомного, поэтому минус 50
			enemy.style.left = (player.offsetLeft + 50) + "px";
			clearInterval(enemy.dataset.timer);
			setTimeout(function() {
				enemy.remove();
				createEnemy();
			}, 500) 
			die();
	}
}

// Создание врага 
// <div class="enemy"></div>	
function createEnemy() { 
	let enemy = document.createElement ("div");
	enemy.className = "enemy";
	enemy.style.top = random(200, document.body.offsetHeight - 100) + "px";  // min 200

	document.body.appendChild(enemy);


	var timerId = setInterval(function() {

		
		
		enemy.style.left = (enemy.offsetLeft - enemySpeed) + "px"
		if(enemy.offsetLeft + enemy.offsetWidth < 0) {
			enemy.remove();
			clearInterval(timerId);
			createEnemy();
			

			// Отжимаем жизнь, если враг залетел за нас
			die();
		}
		
		isDie();
	}, 100)
	enemySpeed += 5;

	enemy.dataset.timer = timerId;
}

function die() {
	lifes--;
	// Конец игры
	if(lifes != 0) {
	// Убираем в блоке жизнь
		let lifesBlock = document.querySelector('#lifes');
		let life = lifesBlock.querySelector("span");
		life.remove();
	} else {
		endGame();
	}
	
}

function endGame() {
	document.body.innerHTML = "";
	alert("Game over");
	score = 0;
	// Перезагрузка страницы
	location.reload();
}

// Получить случайно число от мин до мах (мах + 1)
function random(min, max) {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);

}



