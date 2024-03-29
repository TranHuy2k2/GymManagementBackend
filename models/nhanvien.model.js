/* eslint-disable valid-typeof */
const mongoose = require("mongoose");
const MongooseService = require("~/services/mongoose.service");
const autoIncrement = require("mongoose-auto-increment");
const NhanVien = new mongoose.Schema({
	ten: {
		type: String,
		require: true,
	},
	ngaysinh: {
		type: Date,
		require: true,
		validate: {
			validator: function (input) {
				return (
					Object.prototype.toString.call(
						input
					) === "[object Date]" &&
					new Date(input) < new Date()
				);
			},
			message: (input) =>
				`${input} phải sớm hơn ngày hiện tại`,
		},
	},
	// true là nam
	gioitinh: {
		type: Boolean,
		default: true,
	},
	cccd: {
		type: String,
		require: true,
	},
	sdt: {
		type: String,
		require: true,
		validate: {
			validator:
				function isVietnamesePhoneNumberValid(
					number
				) {
					return /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/.test(
						number
					);
				},
			message: () => "Số điện thoại không hợp lệ",
		},
	},
	email: {
		type: String,
		require: true,
		validate: {
			validator: (email) => {
				return String(email)
					.toLowerCase()
					.match(
						/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
					);
			},
			message: () => "Email không hợp lệ",
		},
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	isDeleted: {
		type: Boolean,
		default: false,
	},
});

MongooseService.setupSoftDelete(NhanVien);
autoIncrement.initialize(mongoose.connection);
NhanVien.plugin(autoIncrement.plugin, {
	model: "NhanVien",
	field: "id",
	startAt: 1000,
});

module.exports = {
	schema: NhanVien,
	model: mongoose.model("NhanVien", NhanVien),
};
