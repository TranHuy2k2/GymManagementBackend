const LoaiThietBiModel =
	require("~/models/loaithietbi.model").model;
class LoaiThietBiController {
	/**
	 *
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 * @param {Function} next
	 */
	async laytatcaloaitb(req, res) {
		try {
			const allLoais = await LoaiThietBiModel.find();
			return res.status(200).json(allLoais);
		} catch (error) {
			res.send({ message: error.message });
		}
	}
	/**
	 *
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 * @param {Function} next
	 */
	async themloaitb(req, res) {
		try {
			const newLoaiTB = new LoaiThietBiModel(
				req.body
			);
			const newRecord = await newLoaiTB.save();
			return res.status(200).json(newRecord);
		} catch (error) {
			res.send({ message: error.message });
		}
	}
	/**
	 *
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 * @param {Function} next
	 */
	async sualoaitb(req, res) {
		try {
			const id = req.params.id;
			const result = await LoaiThietBiModel.updateOne(
				{ _id: id },
				req.body
			);
			return res.status(200).json(result);
		} catch (error) {
			res.send({ message: error.message });
		}
	}
	/**
	 *
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 * @param {Function} next
	 */
	async xoaloaitb(req, res) {
		try {
			const id = req.params.id;
			const result = await LoaiThietBiModel.deleteOne(
				{
					_id: id,
				}
			);
			return res.status(200).json(result);
		} catch (error) {
			res.send({ message: error.message });
		}
	}
	/**
	 *
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 * @param {Function} next
	 */
	async laymotloaithietbi(req, res) {
		try {
			const id = req.params.id;
			const loaitb = await LoaiThietBiModel.findById(
				id
			);
			return res.status(200).json(loaitb);
		} catch (error) {
			res.send({ message: error.message });
		}
	}
}

module.exports = new LoaiThietBiController();
