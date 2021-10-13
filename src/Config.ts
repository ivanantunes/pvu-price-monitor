import dotenv from 'dotenv';

dotenv.config({
    path: '.env'
});

export const Config = {
    CFG_INTERFAVAL: String(process.env.CFG_INTERFAVAL || '1d'),
    CFG_CURRENCY: String(process.env.CFG_CURRENCY || 'BRL'),
    CFG_NOTIFICATION_EMAIL: String(process.env.CFG_NOTIFICATION_EMAIL) || null,
    CFG_NOTIFICATION_PRICE: Number(process.env.CFG_NOTIFICATION_PRICE) || null,
    CFG_CHECK_TIME: Number(process.env.CFG_CHECK_TIME) || 10000
};
