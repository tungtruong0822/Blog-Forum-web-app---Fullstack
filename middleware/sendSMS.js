const accountSid = `${process.env.TWILIO_ACCOUNT_SID}`;
const authToken = `${process.env.TWILIO_AUTH_TOKEN}`;
const SERVICE_SID = `${process.env.SERVICE_SID}`;
const from = process.env.TWILIO_PHONE_NUMBER;
import twilio from "twilio";
const client = twilio(accountSid, authToken);

export const sendSms = (to, body, txt) => {
  try {
    client.messages.create({
      body: `Fo rum Dev-H wellcome ${txt} to verify the account enter this code ${body}`,
      from,
      to,
    });
  } catch (err) {
    console.log(err);
  }
};

export const sendOTP = async (to, channel) => {
  try {
    const data = await client.verify
      .services(SERVICE_SID)
      .verifications.create({
        to,
        channel,
      });
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const smsVerify = async (to, code) => {
  try {
    const data = await client.verify
      .services(SERVICE_SID)
      .verificationChecks.create({ to, code });

    return data;
  } catch (err) {
    console.log(err);
  }
};
