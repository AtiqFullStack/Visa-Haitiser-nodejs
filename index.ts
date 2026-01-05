import express from 'express'

import cors from 'cors'

import { PORT } from './src/utils/cofig'
import { dbConnect } from './src/services'
import routes from './src/routes'
import errorHandler from './src/middlewares/errorHandler'


const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// db connection
dbConnect()
app.use(cors())

app.use('/api', routes)

app.get('/', (req, res) => {
    res.send('Hello  from Qr-generator Server')
})

// Error handling middleware (must be last)
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`)
})