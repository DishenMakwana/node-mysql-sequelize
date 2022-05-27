require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = require('twilio')(accountSid, authToken);

const sendSMS = async (to, body) => {
  try {
    const res = await client.messages.create({
      to: `+91${to}`,
      from: phoneNumber,
      body,
    });

    console.info('SMS sent to: +91 ' + to + ' Message sid: ' + res.sid);
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  sendSMS,
};
