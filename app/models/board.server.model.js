'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Card Schema
 */
var CardSchema = new Schema({
	name: {
		type: String,
		default: '',
		trim: true
	},
	textType: {
		type: String,
		default: 'mdText'
	},
	contents: {
		type: String
	},
	created: {
		type: Date,
		default: Date.now
	},
	modified: {
		type: Date,
		default: Date.now
	},
	lastModifiedByUser: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	boardId: {
		type: Schema.ObjectId,
		ref: 'Board'
	}

});

mongoose.model('Card', CardSchema);

/**
 * Board Schema
 */
var BoardSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Board name',
		trim: true
	},
	description: {
		type: String,
		default: ''
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	active: {
		type: Boolean,
		default: true
	},
	modified: {
		type: Date,
		default: Date.now
	},
	cards: [CardSchema]

});

mongoose.model('Board', BoardSchema);