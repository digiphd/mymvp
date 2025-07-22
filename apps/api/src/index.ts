import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Routes will be added here
app.get('/api/test', (req, res) => {
  res.json({ message: 'MyMVP API is running!' })
})

app.listen(PORT, () => {
  console.log(`🚀 API server running on port ${PORT}`)
})
