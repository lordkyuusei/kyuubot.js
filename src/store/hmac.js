import Crypto from "crypto";

const hmacSign = (key, message) => Crypto.createHmac('sha256', key).update(message).digest('hex');

export default hmacSign;