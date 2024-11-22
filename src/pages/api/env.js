export default function handler(req, res) {
  res.status(200).json({ myEnv: process.env.NEXT_PUBLIC_MY_TEST_STRING_3 || 'hi' })
} 
