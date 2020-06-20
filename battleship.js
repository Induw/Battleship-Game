var view = {
	hitcount : 0,
	displayMessage: function(msg){
		var messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
		
	},
	displayHit: function(location){
		var hitcell = document.getElementById(location);
		if(hitcell.className =="hit"){
			alert("You already attacked that cell !");
		}else{
		hitcell.setAttribute("class","hit");
		this.hitcount++;
	  	}
	},
	displayMiss: function(location){
		var misscell = document.getElementById(location);
		misscell.setAttribute("class","miss");
	}
};

var model = {
	boardSize : 7,   
	numShips : 3,
	shipLength : 3,
	shipsSunk : 0,
	ships: [ { locations: [0, 0, 0], hits: ["", "", ""] },
			{ locations: [0, 0, 0], hits: ["", "", ""] },
			{ locations: [0, 0, 0], hits: ["", "", ""] } ],
	fire: function(guess){
		for(var i =0 ; i<this.numShips ; i++){
			var ship = this.ships[i];
			var index = ship.locations.indexOf(guess);
			if (index >= 0) {
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("You Hit &#128079 &#128165 ");
				if(this.isSunk(ship)){
					this.shipsSunk++;
					view.displayMessage("You sank a Battleship &#128588 <br>Keep firing to sink the other "+
										+ (this.numShips - this.shipsSunk) +".");
					
				}
			
			return true;
			 }
		}
		view.displayMiss(guess);
		view.displayMessage("You Missed &#10060 &#128577");
		return false;

		},
	
	isSunk: function(ship){
		for(var i = 0 ; i<this.shipLength; i++){
			if(ship.hits[i] !== "hit"){
				return false;
				}

			}
		return true;
		},
	generateShipLocations: function() {
		var locations;
		for (var i = 0; i < this.numShips; i++) {
		do {
		locations = this.generateShip();
		} while (this.collision(locations));
		this.ships[i].locations = locations;
			}
		},
	generateShip: function() {
		var direction = Math.floor(Math.random() * 2);
		var row, col;
		if (direction === 1) {
			row = Math.floor(Math.random()*this.boardSize);
			col = Math.floor(Math.random()*(this.boardSize - this.shipLength));
		} else {
			row = Math.floor(Math.random()*(this.boardSize - this.shipLength));
			col = Math.floor(Math.random()*this.boardSize);
		}
		var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i));
			} else {
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return newShipLocations;
		
	},
	collision: function(locations){
			for (var i = 0; i < this.numShips; i++) {
				var ship = model.ships[i];
				for (var j = 0; j < locations.length; j++) {
					if (ship.locations.indexOf(locations[j]) >= 0) {
						return true;
					}
				}
			}
return false;

	}
};

var controller = {
	guesses: 0,
	processGuess: function(guess) {
		var location = parseGuess(guess);
		if (location) {
			this.guesses++;
			var hit = model.fire(location);
			if (hit && model.shipsSunk === model.numShips) {
					var accuracy = view.hitcount / this.guesses;
					accuracy = Math.round( accuracy*100 )/100 ;
					view.displayMessage(" &#129346 Congrats! You sank all the battleships, in " + this.guesses + " guesses.<br>"+ "Your shooting accuracy was : "+ accuracy*100 +"%");
			}
		}
	}
}

function parseGuess(guess){
	var alphabet = [ "A", "B", "C", "D", "E", "F","G"];
	if(guess.length !== 2 || guess === null){
		view.displayMessage("Oops, Please enter a letter and a number on the board to Fire.");
	}else{
		guess = guess.toUpperCase();
		firstChar = guess.charAt(0);
		var row = alphabet.indexOf(firstChar);
		var column = guess.charAt(1);
		if(isNaN(row) || isNaN(column)){
			view.displayMessage("Oops, That isn't on the board ! Please Re-fire.");
		}else if(row < 0 || row >= model.boardSize  || column < 0 || column >= model.boardSize){
			view.displayMessage("Oops, That isn't on the board ! Please Re-fire");

		}else{
			return row + column ;
		}
	}
	return null;
}

function init(){
	var fireButton = document.getElementById("fireButton");
	fireButton.onclick = handleFireButton;
	var guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;
	model.generateShipLocations();
	
}
window.onload =init ;

function handleFireButton(){
	var guessInput = document.getElementById("guessInput");
	var guess = guessInput.value ;
	controller.processGuess(guess);
	guessInput.value = "";
}

function handleKeyPress(e) {
var fireButton = document.getElementById("fireButton");
if (e.keyCode === 13) {
fireButton.click();
return false;
  }
}

