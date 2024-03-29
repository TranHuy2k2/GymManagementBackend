const PasswordUtil = require("~/utils/password.util");
const mongoose = require("mongoose");
const PTModel = require("~/models/pt.model").model;
const UserModel = require("~/models/users.model").model;
const DkyPTModel = require("~/models/dkypt.model").model;
class PTController {
	/**
	 *
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 * @param {Function} next
	 */
	async laythongtinprofile(req, res) {
		try {
			const currentUser = req.currentUser;
			if (!currentUser)
				res.status(401).send({
					message: "Vui lòng đăng nhập lại",
				});
			const pt = await PTModel.findOne({
				user: currentUser._id,
			}).then((data) => data.toJSON());
			if (!pt)
				throw new Error(
					"Không tìm thấy thông tin người PT này!"
				);

			const allDky = await DkyPTModel.find(
				{
					mapt: pt._id,
					isChecked: true,
				},
				{},
				{
					sort: {
						ngayhethan: -1,
					},
				}
			)
				.populate("makhach")
				.then((data) =>
					data.map((e) => e.toJSON())
				);

			return res
				.status(200)
				.json({ ...pt, khach: allDky });
		} catch (error) {
			return res
				.status(500)
				.json({ message: error.message });
		}
	}
	/**
	 *
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 * @param {Function} next
	 */
	async dkypt(req, res) {
		const session = await mongoose.startSession();
		try {
			session.startTransaction();
			// Tạo user
			const { mk, tk, ...rest } = req.body.user;
			const availableUser = await UserModel.findOne({
				tk,
			});
			if (availableUser)
				throw new Error("Tài Khoản Đã Tồn Tại");
			const hashedPassword = await PasswordUtil.hash(
				mk
			);

			const newUser = await UserModel.create(
				[
					{
						...rest,
						mk: hashedPassword,
						tk,
					},
				],
				{ session }
			);

			const newPT = await PTModel.create(
				[
					{
						...req.body.pt,
						user: new UserModel(newUser[0])._id,
					},
				],
				{
					session,
				}
			);
			await session.commitTransaction();
			return res.status(200).json(newPT);
		} catch (error) {
			await session.abortTransaction();
			res.send({
				msg: error.message,
			});
		}
		await session.endSession();
	}
	/**
	 *
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 * @param {Function} next
	 */
	async laymotpt(req, res) {
		try {
			const id = req.params.id;
			const pt = await PTModel.findById(id).populate({
				path: "user",
				select: "tk laadmin",
			});
			return res.status(200).json(pt);
		} catch (error) {
			res.send({
				msg: error.message,
			});
		}
	}
	/**
	 *
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 * @param {Function} next
	 */
	async laytatcapt(req, res) {
		try {
			const skip = req.query.offset || 0;
			const limit = req.query.pageSize;
			const name = req.query.name || null;
			const filter = {};
			if (name) {
				filter["ten"] = {
					$regex: name,
					$options: "i",
				};
			}
			const allPTs = await PTModel.find(filter, "", {
				skip,
				limit,
			});
			const totalRows = await PTModel.count(filter);
			return res.status(200).json({
				data: allPTs,
				totalRows,
			});
		} catch (error) {
			res.send({
				msg: error.message,
			});
		}
	}
	/**
	 *
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 * @param {Function} next
	 */
	async xoapt(req, res) {
		const session = await mongoose.startSession();
		try {
			session.startTransaction();
			const id = req.params.id;
			const pt = await PTModel.findById(id);
			if (!pt)
				throw new Error(
					"Không tìm thấy pt với mã " + id
				);
			await PTModel.deleteOne(
				{
					_id: id,
				},
				{ session }
			);
			await UserModel.deleteOne(
				{
					_id: pt.user,
				},
				{ session }
			);
			await session.commitTransaction();
			return res
				.status(200)
				.json({ msg: "Xóa Thành Công" });
		} catch (error) {
			await session.abortTransaction();
			res.send({
				msg: error.message,
			});
		}
		await session.endSession();
	}
	/**
	 *
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 * @param {Function} next
	 */
	async capnhatpt(req, res) {
		try {
			const id = req.params.id;
			const result = await PTModel.updateOne(
				{
					_id: id,
				},
				req.body
			);
			console.log(req.body);
			return res.status(200).json(result);
		} catch (error) {
			res.status(400).send({
				message: error.message,
			});
		}
	}
}

module.exports = new PTController();
