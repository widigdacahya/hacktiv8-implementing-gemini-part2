// const express = require('express')
// const cors = require('cors')
// const dotenv = require('dotenv')
// const { GoogleGenerativeAI } = require('@google/generative-ai')


import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { GoogleGenerativeAI } from '@google/generative-ai'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.static('public'))

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ 
    model: 'models/gemini-2.0-flash'
})


app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message.userMessage

    if(!userMessage) {
        return res.status(400).json({ reply: 'No message provided. It is required' })
    }


    try {
        const result = await model.generateContent(userMessage)
        res.json({reply: result.response.text()})        
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Something went wrong' })
    }

})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

