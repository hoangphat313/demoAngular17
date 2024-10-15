import express from 'express';
import { sendEmail, sendEmailConfirmOrder } from './MailController';

const MailRouter = express.Router();

MailRouter.post('/send-email', sendEmail);
MailRouter.post('/send-email-order',sendEmailConfirmOrder)
export default MailRouter;
