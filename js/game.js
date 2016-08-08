$(function(){

		var createdBubbles = 0;
		var bubbleCount = 0;

		$(".target").html(Math.floor(Math.random() * 100));

		function bubbleType(){
			var x = Math.floor(Math.random() * 8);
			switch(x){
				case 0:
					var color_dims = 'background-color: #B3FF61; height: ' + 1.8 + 'em; width:' + 1.8 + 'em;"';
					var value = parseInt(1);
				break;
				case 1: 
					var color_dims = 'background-color: #3DE840; height: ' + 2.2 + 'em; width:' + 2.2 + 'em;"';
					var value = parseInt(2);
				break;
				case 2: 
					var color_dims = 'background-color: #18FF81; height: ' + 2.8 + 'em; width:' + 2.8 + 'em;"';
					var value = parseInt(5);
				break;
				case 3: 
					var color_dims = 'background-color: #41E8D6; height: ' + 3.2 + 'em; width:' + 3.2 + 'em;"';
					var value = parseInt(10);
				break;
				case 4: 
					var color_dims = 'background-color: #358EFF; height: ' + 4 + 'em; width:' + 4 + 'em;"';
					var value = parseInt(20);
				break;
				case 5: 
					var color_dims = 'background-color: #113747; height: ' + 2.4 + 'em; width:' + 2.4 + 'em;"';
					var value = parseInt(-5);
				break;
				case 6: 
					var color_dims = 'background-color: #0E302D; height: ' + 3.2 + 'em; width:' + 3.2 + 'em;"';
					var value = parseInt(-10);
				break;
				case 7: 
					var color_dims = 'background-color: #113747; height: ' + 4 + 'em; width:' + 4 + 'em;"';
					var value = parseInt(-20);
				break;
			}

			var sign;

			if(value > 0) {
				sign = "+";
			}
			else
				sign = "";

			return [color_dims, value, sign];
		}

		function margin(){return Math.floor(Math.random() * 100) + "%"};

		function newBubble(){
			bubble_type = bubbleType();//every so often (setinterval with random second argument), create bubble to extend time
			var bubble = '<div class="bubble" style="top:' + margin() + '; left:' + margin() + ';' + bubble_type[0] + ' " id=' + createdBubbles + '" data-count=' + bubble_type[1] + '><p>' + bubble_type[2] + bubble_type[1] + '</p></div>';
			$(".game").append(bubble);
			createdBubbles++;
			bubbleCount++;
		}		

		var timer = setInterval(function(){	
			if (createdBubbles < 6) {
				newBubble();
			}
			else
				clearInterval(timer);
		}, 50);

		function newPosition(){
			var h = $('.game').height() + $(window).height() - 200;
			var w = $('.game').width();

			var newHeight = Math.floor(Math.random() * h);
			var newWidth = Math.floor(Math.random() * w);

			return [newHeight, newWidth];
		}

		function moveBubbles(span = 5000){
				$('.bubble').each(function(index){
					var trajectory = newPosition();
					$(this).animate({top: trajectory[0], left: trajectory[1]}, span, "linear", 0)
				});
				return true;
		}

		function newBubbleTimer(repeat){
			t = setInterval(function(){
					newBubble(); 
					moveBubbles();
					if(createdBubbles > 50) {clearInterval(generatorTimer)}
				}, repeat);
			return t;
		}

		function newCountdown(){
			t = setInterval(function() {$('.time-left').html(parseInt($('.time-left').html()) - parseInt(1));}, 1000);
			return t;
		}

		function deleteBubble(element){
			element.remove();
			bubbleCount--;
			$('.bubble').each(function(index){$(this).stop()});
		}

		function adjustScore(element, change = parseInt(element.attr('data-count'))){
			score = parseInt($('.score').html());
			score += change;
			$(".score").html(score);
		}

		function winSequence(){
			$('.bubble').each(function(index){$(this).stop()});
			clearInterval(generatorTimer);
			clearInterval(countDown);
			var winDiv = $('<button type="button" class ="win">YOU WIN!</button>');
			$('.game-container').append(winDiv);
			$('.bubble').fadeOut(10, function(){$(this).remove();});
		}

		function loseSequence(){
			$('.lose-screen').css('display',  "block");
			clearInterval(countDown);
			$('.stop-btn').prop('disabled', 'disabled');
			$('.stop-btn').attr('opacity', '0.5');
		}

		function pauseGame(){
			moveBubbles(100);
			$('.bubble').each(function(index){$(this).stop();});
			clearInterval(generatorTimer);
			clearInterval(countDown);
			if ($('.stop-screen').css('display') == "none") {
				$('.stop-screen').css('display',  "block");
				$('.stop-btn').html("Resume");
			}
			else {
				generatorTimer = newBubbleTimer(1000);
				countDown = newCountdown();
				$('.stop-screen').css('display', "none");
				$('.stop-btn').html("stop");
			}
		}

		countDown = newCountdown();

		var generatorTimer = newBubbleTimer(1000);

		$('body').hover(function(){return;}, function(){adjustScore($(this), 5 + (Math.floor(Math.random() * -15)));});

		$(".game").on('mouseover', '.bubble', function(){

			deleteBubble($(this));

			adjustScore($(this));

			if($(".score").html() == $(".target").html()){//SWWWEEEET SWEEETTTTT VICTORY!!!
				winSequence();
			}

			else{
				moveBubbles();
				if(createdBubbles <= 50) {
					newBubble();
				}

				else if(bubbleCount == 0){//LOOOOOOSSSEEEEEERRRR
					loseSequence();
				}
			}

		});

		$('nav').on('click', '.stop-btn', function(){
			pauseGame();
		});

		$('.game-container').on('click', '.win', function(){location.reload()});
		$('nav').on('click', '.new-game-btn', function(){location.reload()});
		
	});