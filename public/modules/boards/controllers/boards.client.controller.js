'use strict';

// Boards controller
angular.module('boards').controller('BoardsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Boards',
	function($scope, $stateParams, $location, Authentication, Boards) {
		$scope.authentication = Authentication;

		// Create new Board
		$scope.create = function() {
			// Create new Board object
			var board = new Boards ({
				name: this.name
			});

			// Redirect after save
			board.$save(function(response) {
				$location.path('boards/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.addCard = function() {
			//add a card to an existing board document
			var currBoard = this.board;

			currBoard.cards.push({
				boardId: this.boardId,
				contents: ''
			});
			//this.contents = '';

		};

		$scope.removeCard = function(card) {
			var currBoard = this.board;
			currBoard.cards.splice(currBoard.cards.indexOf(card), 1);
		};

		// Remove existing Board
		$scope.remove = function( board ) {
			if ( board ) { board.$remove();

				for (var i in $scope.boards ) {
					if ($scope.boards [i] === board ) {
						$scope.boards.splice(i, 1);
					}
				}
			} else {
				$scope.board.$remove(function() {
					$location.path('boards');
				});
			}
		};

		// Update existing Board
		$scope.update = function() {
			var board = $scope.board ;
			console.log(board);
			board.$update(function() {
				$location.path('boards/' + board._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Boards
		$scope.find = function() {
			$scope.boards = Boards.query();
		};

		// Find existing Board
		$scope.findOne = function() {
			var foundBoard = Boards.get({ 
				boardId: $stateParams.boardId
			});
			
			if (foundBoard.cards) {
				if (foundBoard.cards.length < 1 || foundBoard.cards.$last.contents !== '') {
					foundBoard.cards.push({boardId: foundBoard._id});
				}
			} else {
				foundBoard.cards = [{boardId: foundBoard._id}];
			}
			
			$scope.board = foundBoard;
		};
	}
]);