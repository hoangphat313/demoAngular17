import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
const inlineBase64 = require('nodemailer-plugin-inline-base64');

const sendEmailConfirm = async (email: string): Promise<void> => {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_ACCOUNT,
      pass: process.env.MAIL_PASSWORD,
    },
  });
  transporter.use('compile', inlineBase64({ cidPrefix: 'somePrefix_' }));
  await transporter.sendMail({
    from: process.env.MAIL_ACCOUNT,
    to: email,
    subject: 'Cảm Ơn Bạn Đã Đăng Ký Tại TBOOK',
    text: 'Cảm ơn bạn đã đăng ký nhận thông báo từ TBOOK!',
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #4CAF50;">Cảm ơn bạn đã đăng ký tại TBOOK!</h2>
        <p>Bạn đã đăng ký thành công để nhận thông báo từ <strong>TBOOK</strong>.</p>
        <p>Chúng tôi sẽ gửi cho bạn những thông tin mới nhất và ưu đãi hấp dẫn trong thời gian tới.</p>
        <p>Trân trọng,<br>Đội ngũ TBOOK</p>
      </div>
      <img src="https://firebasestorage.googleapis.com/v0/b/ecommerceapp-c26cd.appspot.com/o/logo%2Flogo.png?alt=media&token=0edde305-16d2-4a6c-83c5-455351e0715c" alt="Logo" style="width:100px; height: auto; margin-top: 5px;" />
    `,
  });
};

const sendEmailConfirmOrder = async (
  email: string,
  orderItems: {
    postId: string;
    quantity: number;
  }[],
  totalAmount: number,
  address: {
    houseNumber: string;
    street: string;
    city: string;
  },
  paymentMethod: string
): Promise<void> => {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_ACCOUNT,
      pass: process.env.MAIL_PASSWORD,
    },
  });
  transporter.use('compile', inlineBase64({ cidPrefix: 'order_' }));

  const totalItems = orderItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const formattedAddress = `
    <div style="margin-top: 10px;">
      <strong>Địa chỉ giao hàng:</strong>
      <p>${address.houseNumber}, ${address.street}, ${address.city}</p>
    </div>
  `;
  await transporter.sendMail({
    from: process.env.MAIL_ACCOUNT,
    to: email,
    subject: 'Xác Nhận Đơn Hàng Từ TBOOK',
    html: `
     <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #4CAF50;">Xác Nhận Đơn Hàng Của Bạn Tại TBOOK</h2>
        <p>Cảm ơn bạn đã đặt hàng tại <strong>TBOOK</strong>!</p>
        <p style="font-size: 1.1em;">Tổng số sản phẩm: ${totalItems}</p>
        ${formattedAddress}
        <p style="font-size: 1.2em; margin-top: 10px;"><strong>Tổng Số Tiền: ${totalAmount.toLocaleString()} VND</strong></p>
        <p>Phương thức thanh toán: ${paymentMethod}</p>
        <p>Chúng tôi sẽ sớm liên hệ và gửi hàng đến bạn.</p>
        <p>Trân trọng,<br>Đội ngũ TBOOK</p>
      </div>
    `,
  });
};

export { sendEmailConfirm, sendEmailConfirmOrder };
