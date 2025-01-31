import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';

export const verifyUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ Success: false, Error: 'Access denied.' });
  }

  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ Success: false, Error: 'Unautorized Access!'});
      }
      req.userId = decoded.id
      next();
    });
  }
}


export const encryptMessage = (message, secretKey) => {
  return CryptoJS.AES.encrypt(message, secretKey).toString();
}

export const decryptMessage = (encryptedMessage, secretKey) => {
  const bytes = CryptoJS.AES.decrypt(encryptedMessage, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}