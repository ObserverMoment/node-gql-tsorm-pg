import crypto from 'crypto'

// Encoding = hex, utf8, binary etc.
export const encrypt = (toEncrypt, encryptionKey, numIVBytes, algo, encoding) => {
  const iv = crypto.randomBytes(numIVBytes)
  const cipher = crypto.createCipheriv(algo, Buffer.from(encryptionKey, encoding), iv)
  let encrypted = cipher.update(toEncrypt)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return `${iv.toString(encoding)}.${encrypted.toString(encoding)}`
}

export const decrypt = (toDecrypt, decryptionKey, iv, algo, encoding) => {
  const ivBuffer = Buffer.from(iv, encoding)
  const toDecryptBuffer = Buffer.from(toDecrypt, encoding)
  const decipher = crypto.createDecipheriv(algo, Buffer.from(decryptionKey), ivBuffer)
  let decrypted = decipher.update(toDecryptBuffer)
  decrypted = Buffer.concat([decrypted, decipher.final()])
  return decrypted.toString()
}
