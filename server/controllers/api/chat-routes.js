const router = require('express').Router();
const { Chat } = require('../../models')

// get all 
router.get('/', async (req, res) => {
    try {
        const posts = await Chat.find({})
        console.log(posts);
        res.status(200).send(posts)
    } catch (err) {
        console.error(err)
        res.json({ message: 'An error has occured' })
    }
})

// post chat
router.post('/', async (req, res) => {
    let body = req.body;
    console.log(body)
    try {
        const newChat = await Chat.create(body)
        res.json(newChat)
    } catch (err) {
        console.error({message: `you have an error: ${err}`})
        throw err
    }
})

module.exports = router;