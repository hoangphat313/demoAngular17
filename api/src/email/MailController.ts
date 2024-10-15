import { NextFunction, Request, Response } from 'express';
import { sendEmailConfirm } from './MailService';
import { sendEmailConfirmOrder as sendOrderEmail } from './MailService';

const sendEmail = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  try {
    await sendEmailConfirm(email);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
const sendEmailConfirmOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, orderItems, totalAmount, address, paymentMethod } =
    req.body;
  try {
    await sendOrderEmail(
      email,
      orderItems,
      totalAmount,
      address,
      paymentMethod
    );
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export { sendEmail, sendEmailConfirmOrder };
