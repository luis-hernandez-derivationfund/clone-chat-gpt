const PORT = 8000 //8000 5000
const express = require('express')
const cors = require('cors')
require('dotenv').config()
const fetch = require('node-fetch');
const app = express()
app.use(express.json())
app.use(cors())


const API_KEY = "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"; //process.env.API_KEY 


app.post('/api/completions', async (req, res) =>{
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: req.body.message}],
            max_tokens: 100,
        })
    }
    try{
       const response = await fetch('https://api.openai.com/v1/chat/completions', options)
       const data = await response.json()
       res.send(data)
    }catch (error){
        console.error(error)
    }
} )

app.post('/images/generations', async (req, res) =>{
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": "dall-e-3",
            "prompt": req.body.message,
            "n": 1,
            "size": "1024x1024"
        })
    }
    try{
       const response_image = await fetch('https://api.openai.com/v1/images/generations', options)
       const data = await response_image.json()
      // console.log(data);
       res.send(data)
    }catch (error){
        console.error(error)
    }
} )
app.listen(PORT, '0.0.0.0',() => console.log('Your server is running on PORT ' + PORT))