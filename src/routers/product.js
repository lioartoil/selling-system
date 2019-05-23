const express = require('express');

const Product = require('../models/product');
const auth = require('../middleware/auth');

const router = new express.Router();

router.post('/products', auth, async (req, res) => {
	const product = new Product({ ...req.body, seller: req.user._id });

	try {
		await product.save();

		res.status(201).send(product);
	} catch (e) {
		res.status(400).send();
	}
});

router.get(
	'/products',
	async ({ query: { name, price, in_stock, limit, skip, sortBy } }, res) => {
		const match = {};
		const sort = {};

		if (name) {
			match.name = name;
		}

		if (price) {
			const [gte, lte] = price.split('-');
			match.price = { $gte: parseFloat(gte), $lte: parseFloat(lte) };
		}

		if (in_stock && in_stock === 'true') {
			match.amount = { $gt: 0 };
		}

		if (sortBy) {
			const parts = sortBy.split(':');
			sort[parts[0]] = parts[1] === 'asc' ? 1 : -1;
		}

		try {
			const products = await Product.find(match)
				.limit(parseInt(limit))
				.skip(parseInt(skip))
				.sort(sort)
				.exec();

			res.send(products);
		} catch (e) {
			res.status(500).send();
		}
	}
);

router.get('/products/:_id', async (req, res) => {
	try {
		const product = await Product.findById(req.params._id);

		if (!product) return res.status(404).send();

		res.send(product);
	} catch (e) {
		res.status(500).send();
	}
});

router.patch('/products/:_id', auth, async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = ['name', 'description', 'price', 'amount'];
	const isValidOperation = updates.every(update =>
		allowedUpdates.includes(update)
	);

	if (!isValidOperation) {
		return res.status(400).send({ error: 'Invalid updates!' });
	}

	try {
		const product = await Product.findOne({
			_id: req.params._id,
			seller: req.user._id
		});

		if (!product) return res.status(404).send();

		updates.forEach(update => (product[update] = req.body[update]));
		await product.save();

		res.send(product);
	} catch (e) {
		res.status(400).send(e);
	}
});

module.exports = router;
