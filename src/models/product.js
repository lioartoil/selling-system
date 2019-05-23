const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		description: { type: String, trim: true, default: '' },
		price: {
			type: Number,
			required: true,
			validate(value) {
				if (value < 0) {
					throw new Error('Price must be a positive number');
				}
			}
		},
		amount: { type: Number, default: 0 },
		seller: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User'
		}
	},
	{ timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
