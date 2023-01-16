const express = require('express')
const app = express()
const mongoose = require('mongoose')
const axios = require('axios')
const path=require('path')

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')))


const EntrySchema = new mongoose.Schema({
  title: String,
  description: String,
  link: String,
  category: String
})

const Entry = mongoose.model('Entry', EntrySchema)


app.get('/entries/:category', async (req, res) => {
    try {
      const category = req.params.category
      const response = await axios.get('https://api.publicapis.org/entries')
      const entries = response.data.entries
      const filteredEntries = entries.filter(entry => entry.API === category)
      const filteredData = filteredEntries.map(entry => {
        return { title: entry.API, description: entry.Description }
      })
      res.send(filteredData)
    } catch (error) {
      console.error(error)
      res.status(500).send("some error occured")
    }
  })


app.post('/entries', async (req, res) => {
  try {
    const entryData = await axios.get('https://api.publicapis.org/entries')
    const entry = new Entry(entryData)
    await entry.save()
    res.send("Data saved")
  } catch (error) {
    console.log(error)
    res.status(500).send("some error occured")
  }
})
app.get('/',async(req,res)=>
{
    res.send("HELLO")
})
app.listen(3000, () => {
  console.log('Server running on port 3000')
})

