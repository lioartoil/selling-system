const express = require('express');

const User = require('../models/user');
const auth = require('../middleware/auth');

const router = new express.Router();

router.post('/users', async (req, res) => {
	const user = new User(req.body);

	try {
		await user.save();
		const token = await user.generateAuthToken();
		res.status(201).send({ user, token });
	} catch (e) {
		res.status(400).send(e);
	}
});

router.post('/users/login', async (req, res) => {
	try {
		const user = await User.findByCredentials(
			req.body.email,
			req.body.password
		);
		const token = await user.generateAuthToken();
		res.send({ user, token });
	} catch (e) {
		res.status(400).send();
	}
});

router.post('/users/logout', auth, async ({ user, token: userToken }, res) => {
	try {
		user.tokens = user.tokens.filter(({ token }) => token !== userToken);
		await user.save();

		res.send();
	} catch (e) {
		res.status(500).send();
	}
});

router.get('/users/me', auth, async (req, res) => {
	res.send(req.user);
});

router.patch('/users/me', auth, async ({ body, user }, res) => {
	const updates = Object.keys(body);
	const allowedUpdates = ['name', 'email', 'password', 'age'];
	const isValidOperation = updates.every(update =>
		allowedUpdates.includes(update)
	);

	if (!isValidOperation) {
		return res.status(400).send({ error: 'Invalid updates!' });
	}

	try {
		updates.forEach(update => {
			user[update] = body[update];
		});
		await user.save();
		res.send(user);
	} catch (e) {
		res.status(400).send(e);
	}
});

router.delete('/users/me', auth, async ({ user }, res) => {
	try {
		await user.remove();
		res.send(user);
	} catch (e) {
		res.status(500).send();
	}
});

module.exports = router;
