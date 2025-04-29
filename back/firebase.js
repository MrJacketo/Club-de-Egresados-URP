const admin = require("firebase-admin");

const serviceAccount = {
  type: "service_account",
  project_id: "react-urpex-auth",
  private_key_id: "5d9756d1d010f8ff7014a32843da5b1e1f0f0b7f",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC333ZERE8k4zFX\nEUkXHu1/b60qS9M4Tv6K8pKeNeoAqBBgSYqd4EefQx+Z7GRXHi6VjZ6QzusoXOxq\nfx3XMywLIpdmGv6w0NQJ/pnf+sV78xJask7TxuXXDRF+HV7H2Y3oxxe4umXQ+wNw\nAGx4VdteTYD3PxSh1JUdsrQuOYJY6QrfCWp9kZYJlAU3v+HhyNnjx30UfzwAJG6U\ndRoPaS1+ZOosSNdN72yxirDX9QF1tE2r5mhqr94pfHHvF7zY7jM5U/EqdJhirxJw\nSm2njCrflXUQRvh32RGAlQAvJ6O+xJouWPCJRuRJd0M//AEK3afiQ1x3taMvpdV/\nLvWtoIobAgMBAAECggEAVTPy6SpgJD8071weqtyVgA5fRzCwtTCBqiBCiZaBEwHN\n6NhbJ9I0Thv8CkbsriPZwUpJFmATvvXkRWsXCE/5kkVas6FBsOxrvR/h7NSW61tU\n/3sNpPvPKGoxV2fDskbhB+Mt3lddc8vFKYLAwLhEOTwfzTJJXL4VxRe4f4z9ljXI\nqHwmowgg+U+pAf3bakbiEko2C2rqYelz6zZa2Z+q9DZnOJsY+I8haJFnTRMYfagD\nAW4rFn40Jxz+v4o+VHhHLJdwLcdtJ8j8NiNexXX/k5E6h+bTet4S4GfGpen3/643\nW2i+gMJtG4okqzuqGUhb9ISRPab188A37KTXm4jaDQKBgQDxvYSgmjobyvJamHEr\nDcHbKcafqE898jGktGXDIJ/4xOR8ZJ1rj6aQJGhKfd6Ny4zkEc7YmAWLTzvhwIK5\nnHSScdJsU2TfmykZ7K+Iw9cOFmiWJxvaou9H7Yw+kqw3zZy/66T9N5eDuVyK2RPD\nNhjfA9ZCBAOucvA+rB/QfoBy1QKBgQDCuBjuxE82SdZ44qD/hGSQDxH4aehVHEA8\nBYcsNfVgnHDxoVQIZ8XnsZ2pSNurnG0P8GC8hlOxlonnTbNhzdMms0LHJrNxA8uM\n3VojIdqS+I1lK8K/kohMj49SDutyIedAJnzSBXnmVeLat2rTFuJFIRFTeBs/VJ8A\nBEdIA0YhLwKBgQDAY/Jv1w60G9qx220FtNc504+udUdLp7t2t9PdbdOjKyAlF/Zp\nKlSHl1IhJve+peclhD65BpQzAQZJbusbSbdE7a1oZR59D4GwjjxNfn9jSNZH2ixC\n3zXMavQYwKarasp7u9D9bgb54MYUAxvFWwKESwt0UrmTVwp49ogDaQpVWQKBgGnL\nCkjXwc3WKj+9qgmJzfVzKqlUKVXspn215y4/FtVpyfeOVpDGiQEMQIPUQP2pXJwX\nVwe218wZ5U0Vq0uNP5a8OKDpRv81N6eOMEX8Q7wsbO4163aYT5OBQDYuQv/cqb7x\n6klVjlh1+24nz1NnEILMp5Q5IlyzRjwFFxFqLfUjAoGBANGbFEGxLkJrhKpxqwrN\nzJchjIRlIUYP6ExM5VMYvMV5rukhBI1ZK24dGLj1pfS5sBcjYan8l2KVO5L+WOPw\nUctEXtBhFr7U/y8Wb63xbNuWg0FH4i71Wnnwh8dUreNzXBkLyMA6dU4aOJQ/zEld\noBg+TnQBxrJ2i0+auurvQXLT\n-----END PRIVATE KEY-----\n",
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