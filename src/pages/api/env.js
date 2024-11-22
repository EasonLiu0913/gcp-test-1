export default function handler(req, res) {
  res.status(200).json({ myEnv: process.env || 'hi' })
} 
