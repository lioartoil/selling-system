const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const User = require('../../src/models/user');
const Product = require('../../src/models/product');

const _id1 = new mongoose.Types.ObjectId();
const _id2 = new mongoose.Types.ObjectId();
const token1 = jwt.sign({ _id: _id1 }, process.env.JWT_SECRET);
const token2 = jwt.sign({ _id: _id2 }, process.env.JWT_SECRET);

const user1 = {
	_id: _id1,
	name: 'Chanakan',
	email: 'chanakan@example.com',
	password: '1234Abcd!',
	tokens: [{ token: token1 }]
};

const user2 = {
	_id: _id2,
	name: 'Chanakan2',
	email: 'chanakan2@example.com',
	password: '1234Abcd!',
	tokens: [{ token: token2 }]
};

const product1 = {
	_id: new mongoose.Types.ObjectId(),
	name: 'product1',
	price: 10,
	amount: 10,
	seller: _id1
};

const product2 = {
	_id: new mongoose.Types.ObjectId(),
	name: 'product2',
	price: 20,
	amount: 5,
	seller: _id1
};

const product3 = {
	_id: new mongoose.Types.ObjectId(),
	name: 'product2',
	price: 40,
	amount: 0,
	seller: _id2
};

const setupDatabase = async () => {
	await User.deleteMany();
	await Product.deleteMany();
	await new User(user1).save();
	await new User(user2).save();
	await new Product(product1).save();
	await new Product(product2).save();
	await new Product(product3).save();
};

module.exports = {
	user1,
	user2,
	token1,
	token2,
	product1,
	product2,
	product3,
	setupDatabase
};
