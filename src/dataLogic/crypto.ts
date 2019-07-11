import crypto from 'crypto'

export const encrypt = (toEncrypt, encryptionKey, ivBytes, algo, encoding) => {
  const iv = crypto.randomBytes(ivBytes)
  const cipher = crypto.createCipheriv(algo, Buffer.from(encryptionKey), iv)
  let encryptedKey = cipher.update(toEncrypt)
  encryptedKey = Buffer.concat([encryptedKey, cipher.final()])
  return `${iv.toString(encoding)}.${encryptedKey.toString(encoding)}`
}

// Returns the key as a string
export const decrypt = (encrypted, iv, encoding, algo) => {
  const ivDecoded = Buffer.from(iv, encoding)
  const encryptedKeyDecoded = Buffer.from(encrypted, encoding)
  const decipher = crypto.createDecipheriv(algo, Buffer.from(process.env.CRYPTO_SECRET_2FA), ivDecoded)
  const decrypted = decipher.update(encryptedKeyDecoded)
  return Buffer.concat([decrypted, decipher.final()]).toString()
}
