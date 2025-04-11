const admin = require("firebase-admin");

const serviceAccount = {
  type: "service_account",
  project_id: "react-urpex-auth",
  private_key_id: "5b016b58ffef429cd5439342330b89fac3d4d637",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDGlSAdRufhupVn\n8XIrJozkuXkL8FyCPZeJRYDiDwqTe9ZZkcibtL5etdaS3XMiv5jz1VPIjmi4rh7u\nFCpApBsme0CfRZ08GNz2u1cT+OQlrOcWezSIc9+nozDAVRjhghyDKkgPe9YMfSAU\nLKdDNeFOmyPNuLw+sx0yOCQ64832KPFDtyKTlkk3mr8GUsjtCNYM5e4Xg8JYLtHN\nmbz48KOPymHp9fG7Yv45ey6u01w/TlrA5ZlHijzT7HhYaXHaSBTbkLS52gcph+XN\nsL0j3XijYxEz0BJ1tH4JAbAA9E7tdHNUJaEQXK4lMbjZit39HEAV1nL85bB/r0f3\nZs06u0XvAgMBAAECggEAFJrlov63/HU/9RyZnujtm/qzbi3fE3Pbn5aSzyIGFBPj\nQ8D7jU3S+6snhsQBTdzj5y0T9/lFhsrTvRq3ivncMqvS9+khGFrGFriNSlkRfJKf\nxHaSlrQF7smL5fEOggZeT1fZnqMCrKIRFuF5QOE8LcwC34uTG3hkslDJUEOnRoAo\ncwIVyy3fJgShK78dTrdObLQwhafAwbI2EpoqmftkG52zACx0WI7F33dt9DWYPvfA\n9kRQ4R7IzipL+pbiPx6Xo0jUDeF/KzqnxQvSIfTLJI5DrnfBMlnRvDxeJML8BJHj\nS4TkA7laHy27z99uWa45ips1+3+/8WDBa4pjAnl60QKBgQD0c2CzbmLK53voUcLt\nKcOFsWemQeF48klfaEN+C+qjKqp0lU7pK4GwrQnQKvOn+QSmtbRNVfyEnJxJLUiH\nyqZO5R/Nt+FkxYalnWOo9e3OXY9sFswgBXsxoj/ZJ4u3iQzZoU8RuusDuMtKLLQV\nSZatXa6oLEytnK6W+xpLwGWTfwKBgQDP9vlMfqEs9rzyAnwnqeyiFJuKvmosFHM3\n5pk0T3MViHZ/Cd6/vcwxPGiIGKl+1WGBK6OsM2wBBo0lkRRYvzHJAQvEDTm6meVK\n0O1unSVJz2oQUISKP6wY2wErviENniuCew7yPqKuNkU6kaMEt7D+8IViK2Q1XyVa\njsS22k7FkQKBgQDW5uPZeq7RcIYG7HIwa2nfi+HyULK20FHe1VuYYUOK5IRr76Mq\n67udJdKdtlT0k8AaC14SKwjPUJs43d2Iu4hPjbDS+tfk7p371Qz7ShEhPjFLNhOI\nBymRrfDxqIl09cBdRymrDad0Yy4c7IX4vPQBP32/jQpwCnGWe/RXKjJiYwKBgQC2\no5wFxiAesQL3N5955g3fumFv1BLCa6NUsLxT6IKVoqcOoshxdGpjwz26aI5SyWs8\nWesATJjJvcsv9t37os5CTRzcLRFKA+YPcrVSs8gProzjjxMXpxupKI06sVut7f8g\nNJrHvKJ6hUb/TO/yMLDM9MbvlFQJW2oewcuZGtibQQKBgQCNDiXFM4A6GiHXZRWT\nb9VWI8yxuh51xmjV2dwGsJNrahnKiLrNQS/+wc3swFT8eeTSbhI0Q25IE+vkb74X\n4hMyG1xvM4bc/eY2xJZ1IB6pK+5+Y/cUQakXE8e9GQWLy7e9SGD71J2TJCFdzjyC\nXwPZlZSGTuOvLE/NpRfZG7j2nQ==\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@react-urpex-auth.iam.gserviceaccount.com",
  client_id: "100950583948982096046",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40react-urpex-auth.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;