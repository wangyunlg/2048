var board = new Array();   //存放方格中的数字
var score = 0;
var hasConflicted = new Array(); 
$(document).ready(function (){
	newGame();
});

function newGame (){
	//初始化
	//形成棋盘界面
	init();
	//随机生成两个数字
	generateOneNumber();
	generateOneNumber();
}
function init (){
	//初始化完成棋盘布局
	for ( var i = 0; i < 4; i ++){
		for ( var j = 0; j < 4; j ++){
			var gridCell = $("#grid-cell-" + i + "-" + j);
			gridCell.css("top",getPosTop(i,j));
			gridCell.css("left",getPosLeft(i,j));
		}
	}
	//初始化board-二维数组
	for (var i = 0; i < 4; i ++){
		board[i] = new Array();
		hasConflicted[i] = new Array();
		for (var j = 0; j < 4; j ++){
			board[i][j] = 0;
			hasConflicted[i][j] = false;
		} 
	}
	updateBoardView();
	score = 0;
	updateScore();
	$(".game-over").css("z-index",-100);
	
}
//获取格子的坐标
function getPosTop (i,j){
	return 20+120*i;
}
function getPosLeft (i,j){
	return 20+120*j;
}
//更新棋盘上的数字
function updateBoardView (){
	//???
	$(".number-cell").remove();
	for (var i = 0; i < 4; i ++){
		for (var j = 0; j < 4; j ++){
			$(".grid-container").append('<div class="number-cell" id="number-cell-'+ i +'-'+ j +'"></div>');
			var numberCell = $("#number-cell-"+ i +"-"+ j);
			if (board[i][j] == 0){
				numberCell.css("width",0);
				numberCell.css("height",0);
				numberCell.css("top",getPosTop(i,j)+50);
				numberCell.css("left",getPosLeft(i,j)+50);
			}
			else {
				numberCell.css("width","100px");
				numberCell.css("height","100px");
				numberCell.css("top",getPosTop(i,j));
				numberCell.css("left",getPosLeft(i,j));
				numberCell.css("background-color",getNumberBackgroundColor(board[i][j]));
				numberCell.css("color",getNumberColor(board[i][j]));
				numberCell.text(board[i][j]);
			}
		}
	}

}
//不同数字的背景色
function getNumberBackgroundColor (number){
	switch( number ){
        case 2:return "#eee4da";break;
        case 4:return "#ede0c8";break;
        case 8:return "#f2b179";break;
        case 16:return "#f59563";break;
        case 32:return "#f67c5f";break;
        case 64:return "#f65e3b";break;
        case 128:return "#edcf72";break;
        case 256:return "#edcc61";break;
        case 512:return "#9c0";break;
        case 1024:return "#33b5e5";break;
        case 2048:return "#09c";break;
        case 4096:return "#a6c";break;
        case 8192:return "#93c";break;
    }
    return "#000";
}
//不同数字的字体色
function getNumberColor (number){
	if (number <= 4){
        return "#776e65";
	}
	return "#fff";
}
function generateOneNumber (){
	//判断是否还有空间
	if (nospace( board )){
		return false;
	}
	//随机位置
	var randX = Math.floor(Math.random()*4);
	var randY = Math.floor(Math.random()*4);
	var times = 0;
	while (times < 50){
		if (board[randX][randY] == 0){
			break;
		}
		var randX = Math.floor(Math.random()*4);
		var randY = Math.floor(Math.random()*4);
		times ++;
	}
	if (times == 50){
		for (var i = 0; i < 4; i ++){
			for (var j = 0; j < 4; j ++){
				if (board[i][j] == 0){
					randX = i;
					randY = j; 
				}
			}
		}
	}
	var randomNum = Math.random() < 0.5 ? 2 : 4;
	board[randX][randY] = randomNum;
	showNumAnimation(randX,randY,randomNum);
	return true;

}
//判断是否还有空间
function nospace ( board ){
	for (var i = 0; i < 4; i ++){
		for (var j = 0; j < 4; j++){
			if (board[i][j] == 0){
				return false;
			} 
		}
	}
	return true;
}
//随机出现两个数字的动画
function showNumAnimation (i,j,randomNum){
	var numberCell = $("#number-cell-"+ i +"-"+ j);
	numberCell.css("background-color",getNumberBackgroundColor(randomNum));
	numberCell.css("color",getNumberColor(randomNum));
	numberCell.text(randomNum);
	numberCell.animate(
	{"width":"100px",
	 "height":"100px",
	 "left":getPosLeft(i,j),
	 "top":getPosTop(i,j),
	},50);

}
//游戏操作部分
//获取键盘的输入数据
$(document).keydown(function(event) {
	event.preventDefault();
	switch (event.keyCode){
		case 37:  //left
		//先判断是否还可以进行移动
			if (moveLeft()){
				setTimeout( "generateOneNumber()",250);
				setTimeout( "isGameOver()",300);
			}
			break;
		case 38:  //uo
		//先判断是否还可以进行移动
			if (moveUp()){
				setTimeout( "generateOneNumber()",250);
				setTimeout( "isGameOver()",300);
			}
			break;
		case 39:  //right
		//先判断是否还可以进行移动
			if (moveRight()){
				setTimeout( "generateOneNumber()",250);
				setTimeout( "isGameOver()",300);
			}
			break;
		case 40:  //down
		//先判断是否还可以进行移动
			if (moveDown()){
				setTimeout( "generateOneNumber()",250);
				setTimeout( "isGameOver()",300);
			}
		default:
			break;
	}
});
//判断是否结束
function nomove (board){
	if (canMoveLeft(board) || canMoveRight(board) || canMoveUp(board) || canMoveDown(board)){
		return false;
	}
	return true;
}
function isGameOver (){
	if (nospace(board) && nomove(board)){
		gameOver();
	}
}
function gameOver (){
	$(".game-over").css("z-index",100);
}
//moveleft
function moveLeft (){
	if (!canMoveLeft()){
		return false;
	}
	for (var i = 0; i < 4; i ++){
		for (var j = 1; j < 4; j++){
			if (board[i][j] != 0){
				for (var k = 0; k < j; k ++){
					if (board[i][k] == 0 && noBlockHrizontal(i,k,j,board)){
						showMoveAnimation(i,j,i,k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else if (board[i][k] == board[i][j] && noBlockHrizontal(i,k,j,board) && !hasConflicted[i][k]){
						showMoveAnimation(i,j,i,k);
						board[i][k] += board[i][j];
						board[i][j] = 0;
						hasConflicted[i][k] == true;
						score += board[i][k];
						updateScore(score);
						continue;
					}
				}
			}
		}
	}
	setTimeout("updateBoardView()",200);
	return true;
}
//moveup
function moveUp (){
	if (!canMoveUp()){
		return false;
	}
	for (var j = 0; j < 4; j ++){
		for (var i = 1; i < 4; i++){
			if (board[i][j] != 0){
				for (var k = 0; k < i; k ++){
					if (board[k][j] == 0 && noBlockVertical(j,k,i,board)){
						showMoveAnimation(i,j,k,j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else if (board[k][j] == board[i][j] && noBlockVertical(j,k,i,board) && !hasConflicted[k][j]){
						showMoveAnimation(i,j,k,j);
						board[k][j] += board[i][j];
						board[i][j] = 0;
						hasConflicted[k][j] == true;
						score += board[k][j];
						updateScore(score);
						continue;
					}
				}
			}
		}
	}
	setTimeout("updateBoardView()",200);
	return true;
}
//moveRight
function moveRight (){
	if (!canMoveRight()){
		return false;
	}
	for (var i = 0; i < 4; i ++){
		for (var j = 2; j >= 0; j --){
			if (board[i][j] != 0){
				for (var k = 3; k > j; k --){
					if (board[i][k] == 0 && noBlockHrizontal(i,j,k,board)){
						showMoveAnimation(i,j,i,k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else if (board[i][k] == board[i][j] && noBlockHrizontal(i,j,k,board) && !hasConflicted[i][k]){
						showMoveAnimation(i,j,i,k);
						board[i][k] += board[i][j];
						board[i][j] = 0;
						hasConflicted[i][k] == true;
						score += board[i][k];
						updateScore(score);
						continue;
					}
				}
			}
		}
	}
	setTimeout("updateBoardView()",200);
	return true;
}
//movedown
function moveDown (){
	if (!canMoveDown()){
		return false;
	}
	for (var j = 0; j < 4; j ++){
		for (var i = 2; i >= 0; i --){
			if (board[i][j] != 0){
				for (var k = 3; k > i; k --){
					if (board[k][j] == 0 && noBlockVertical(j,i,k,board)){
						showMoveAnimation(i,j,k,j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else if (board[k][j] == board[i][j] && noBlockVertical(j,i,k,board) && !hasConflicted[k][j]){
						showMoveAnimation(i,j,k,j);
						board[k][j] += board[i][j];
						board[i][j] = 0;
						hasConflicted[k][j] == true;
						score += board[k][j];
						updateScore(score);
						continue;
					}
				}
			}
		}
	}
	setTimeout("updateBoardView()",200);
	return true;
}
//判断是否可以左移
function  canMoveLeft (){
	for (var i = 0; i < 4; i ++){
		for (var j = 1; j < 4; j ++){
			if (board[i][j] != 0){
				if (board[i][j-1] == 0 || board[i][j] == board[i][j-1]){
					return true;
				}
			}
		}
	}
	return false;
}
//判断是否可以上移
function  canMoveUp (){
	for (var i = 1; i < 4; i ++){
		for (var j = 0; j < 4; j ++){
			if (board[i][j] != 0){
				if (board[i-1][j] == 0 || board[i][j] == board[i-1][j]){
					return true;
				}
			}
		}
	}
	return false;
}
//判断是否可以右移
function  canMoveRight (){
	for (var i = 3; i >= 0; i --){
		for (var j = 2; j >= 0; j --){
			if (board[i][j] != 0){
				if (board[i][j+1] == 0 || board[i][j] == board[i][j+1]){
					return true;
				}
			}
		}
	}
	return false;
}
//判断是否可以下移
function  canMoveDown (){
	for (var i = 2; i >= 0; i --){
		for (var j = 3; j >= 0; j --){
			if (board[i][j] != 0){
				if (board[i+1][j] == 0 || board[i][j] == board[i+1][j]){
					return true;
				}
			}
		}
	}
	return false;
}
//判定横向移动的格子和目标格子之间有没有障碍物
function noBlockHrizontal (row,col1,col2,board){
	for (var i = col1 + 1; i < col2; i++){
		if (board[row][i] != 0){
			return false;
		}
	}
	return true;
}
//判定竖向移动的格子和目标格子之间有没有障碍物
function noBlockVertical (col,row1,row2,board){
	for (var i = row1 + 1; i < row2; i++){
		if (board[i][col] != 0){
			return false;
		}
	}
	return true;
}
//格子移动动画
function showMoveAnimation (fromX,fromY,toX,toY){
	var numberCell = $("#number-cell-"+ fromX + "-" + fromY);
	numberCell.animate({
		"top":getPosTop(toX,toY),
		"left":getPosLeft(toX,toY)
	},200)
}
//得分更新
function updateScore (){
	$("#score").text(score);
}