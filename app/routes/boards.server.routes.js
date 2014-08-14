'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var boards = require('../../app/controllers/boards');

	// Boards Routes
	app.route('/boards')
		.get(boards.list)
		.post(users.requiresLogin, boards.create);

	app.route('/boards/:boardId')
		.get(boards.read)
		.put(users.requiresLogin, boards.hasAuthorization, boards.update)
		.delete(users.requiresLogin, boards.hasAuthorization, boards.delete);

	// Finish by binding the Board middleware
	app.param('boardId', boards.boardByID);
};