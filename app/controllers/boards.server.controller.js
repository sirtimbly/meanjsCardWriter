'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Board = mongoose.model('Board'),
	 Card = mongoose.model('Card'),
	_ = require('lodash');

/**
 * Create a Board
 */
exports.create = function(req, res) {
	var board = new Board(req.body);
	board.user = req.user;

	board.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(board);
		}
	});
};

/**
 * Show the current Board
 */
exports.read = function(req, res) {
	res.jsonp(req.board);
};

/**
 * Update a Board
 */
exports.update = function(req, res) {
	
	var board = req.board ;
	
	console.log('updating board ' + board._id + ' -:> ' + board);
	board = _.extend(board , req.body);
	if (board.cards) {
		for (var i = board.cards.length - 1; i >= 0; i--) {
			var checkId = board.cards[i]._id;
			var currCard = Card.findById(checkId);
			if (currCard.contents !== board.cards[i].contents) {
				currCard.lastModifiedByUser = req.user;
				currCard.modified = Date.now;
				
			}
		}
	}
	
	

	board.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(board);
		}
	});
};

/**
 * Delete an Board
 */
exports.delete = function(req, res) {
	var board = req.board ;

	board.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(board);
		}
	});
};

/**
 * List of Boards
 */
exports.list = function(req, res) { Board.find().sort('-created').populate('user', 'displayName').exec(function(err, boards) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(boards);
		}
	});
};

/**
 * Board middleware
 */
exports.boardByID = function(req, res, next, id) { Board.findById(id).populate('user', 'displayName').exec(function(err, board) {
		if (err) return next(err);
		if (! board) return next(new Error('Failed to load Board ' + id));
		req.board = board ;
		next();
	});
};

/**
 * Board authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.board.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};