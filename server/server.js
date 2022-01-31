const express = require('express')
const bodyParser = require('body-parser')
var Sequelize = require('sequelize');
const e = require('express');
const Op = Sequelize.Op
const cors = require('cors')    // for cross origin if needed

// here a function to validate URL
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'sample.db',
    define: {
        timestamps: false
    }
})

const VirtualShelf = sequelize.define('vshelf', {
    description: Sequelize.STRING,
    date: Sequelize.DATE  // this should be validated - TODO
})

const Book = sequelize.define('book', {
    title: Sequelize.STRING,
    literary_genre: Sequelize.TEXT,
    url: Sequelize.STRING   // this should be validated
})

VirtualShelf.hasMany(Book)

const app = express()
app.use(cors())
app.use(bodyParser.json())


function validateUrl(value) {
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
}

const bookGenres = ['COMEDY', 'TRAGEDY', 'PERSONAL DEVELOPMENT', 'ACTION', 'ADVENTURE', 'MYSTERY',
    'FANTASY', 'HORROR', 'ROMANCE', 'SF', 'THRILLER']

// not for production
app.get('/sync', async (req, res) => {
    try {
        await sequelize.sync({ force: true })
        res.status(201).json({ message: 'created' })
    } catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }
})

// Virtual Shelf API
app.get('/virtual_shelf', async (req, res) => {
    try {
    const query = {}
    let pageSize = 2
    const allowedFilters = ['date']
    const filterKeys = Object.keys(req.query).filter(e => allowedFilters.indexOf(e) !== -1)
    if (filterKeys.length > 0) {
      query.where = {}
      for (const key of filterKeys) {
        query.where[key] = {
          [Op.like]: `%${req.query[key]}%`
        }
      }
    }

    const sortField = req.query.sortField
    let sortOrder = 'ASC'
    if (req.query.sortOrder && req.query.sortOrder === '-1') {
      sortOrder = 'DESC'
    }

    if (req.query.pageSize) {
      pageSize = parseInt(req.query.pageSize)
    }

    if (sortField) {
      query.order = [[sortField, sortOrder]]
    }

    if (!isNaN(parseInt(req.query.page))) {
      query.limit = pageSize
      query.offset = pageSize * parseInt(req.query.page)
    }
        const virtualShelf = await VirtualShelf.findAll({ include: Book })  // check syntax here
        const count = await VirtualShelf.count()
        res.status(200).json({virtualShelf, count})
    } catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }
})

app.get('/virtual_shelf/:vid', async (req, res) => {
    try {
        const virtualShelf = await VirtualShelf.findByPk(req.params.vid)   // check syntax
        if (virtualShelf) {
            res.status(200).json(virtualShelf)
        } else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }
})

// app.post('/virtual_shelf', async (req, res) => {
//     try {
//         if (req.query.bulk && req.query.bulk === 'on'){
//             await VirtualShelf.bulkCreate(req.body)
//             res.status(201).json({ message: 'created' })
//         } else {
//             await VirtualShelf.create(req.body)
//             res.status(201).json({ message: 'created' })
//         }
//     } catch (e){
//         console.warn(e)
//         res.status(500).json({ message: 'server error'})
//     }
// })

app.post('/virtual_shelf', async (req, res) => {
    try {
        if (req.body.description.length > 3) {                   // TODO add check date
            await VirtualShelf.create(req.body)
            res.status(201).json({ message: 'created' })
        } else {
            res.status(418).json({ message: 'wrong description length' })
        }
    } catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }
})

app.put('/virtual_shelf/:vid', async (req, res) => {
    try {
        const virtualShelf = await VirtualShelf.findByPk(req.params.vid)
        if (virtualShelf) {
            if (req.body.description.length > 3) {
                await virtualShelf.update(req.body, { fields: ['description', 'date'] })
                res.status(202).json({ message: 'accepted' })
            } else {
                res.status(418).json({ message: 'wrong description length' })
            }
        } else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }
})

app.delete('/virtual_shelf/:vid', async (req, res) => {
    try {
        const virtualShelf = await VirtualShelf.findByPk(req.params.vid)
        if (virtualShelf) {
            await virtualShelf.destroy()
            res.status(202).json({ message: 'accepted' })
        } else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }
})

// Book API
app.get('/virtual_shelf/:vid/books', async (req, res) => {
    try {
        const virtualShelf = await VirtualShelf.findByPk(req.params.vid)
        if (virtualShelf) {
            const books = await virtualShelf.getBooks() // getter // check if it works
            res.status(200).json(books)
        } else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }
})

app.get('/virtual_shelf/:vid/books/:bid', async (req, res) => {
    try {
        const virtualShelf = await VirtualShelf.findByPk(req.params.vid)
        const book = await Book.findByPk(req.params.bid)
        if (virtualShelf !== null && book !== null) {
            if (virtualShelf.id === book.vshelfId) {       // check syntax 
                res.status(200).json(book)
            } else {
                res.status(401).json({ message: 'book in other shelf' })
            }
        } else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }
})

app.post('/virtual_shelf/:vid/books', async (req, res) => {
    try {
        const virtualShelf = await VirtualShelf.findByPk(req.params.vid)
        if (virtualShelf) {
            if (req.body.title.length > 5) {
                if (validateUrl(req.body.url)) {
                    let genre = req.body.literary_genre
                    genre = genre.toUpperCase()
                    //req.body.literary_genre.toUpperCase()
                    if (bookGenres.includes(genre)) {
                        const book = req.body
                        book.literary_genre = genre
                        book.vshelfId = virtualShelf.id
                        console.warn(book)      // check it out
                        await Book.create(book)
                        res.status(200).json({ message: 'created' })
                    } else {
                        res.status(418).json({ message: 'book genre not available' })
                    }
                } else {
                    res.status(418).json({ message: 'wrong book url' })
                }
            } else {
                res.status(418).json({ message: 'wrong book title length' })
            }
        } else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }
})

app.put('/virtual_shelf/:vid/books/:bid', async (req, res) => {
    try {
        const virtualShelf = await VirtualShelf.findByPk(req.params.vid)
        const book = await Book.findByPk(req.params.bid)
        if (virtualShelf !== null && book !== null) {
            if (virtualShelf.id === book.vshelfId) {  // check if vself id is ok
                if (req.body.title.length > 5) {
                    if (validateUrl(req.body.url)) {
                        let genre = req.body.literary_genre
                        genre = genre.toUpperCase()
                        //req.body.literary_genre.toUpperCase()
                        if (bookGenres.includes(genre)) {
                            book.title = req.body.title
                            book.literary_genre = genre
                            book.url = req.body.url
                            book.save()
                            res.status(202).json({ message: 'accepted' })
                        } else {
                            res.status(418).json({ message: 'book genre not available' })
                        }
                    }
                    else {
                        res.status(418).json({ message: 'wrong book url' })
                    }
                }
                else {
                    res.status(418).json({ message: 'wrong book title length' })
                }
            } else {
                res.status(401).json({ message: 'the book is not part of this shelf' })
            }
        } else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }
})

app.delete('/virtual_shelf/:vid/books/:bid', async (req, res) => {
    try {
        const virtualShelf = await VirtualShelf.findByPk(req.params.vid)
        const book = await Book.findByPk(req.params.bid)
        if (virtualShelf !== null && book !== null) {
            if (virtualShelf.id === book.vshelfId) {           // check vself id
                await book.destroy()
                res.status(202).json({ message: 'accepted' })
            } else {
                res.status(401).json({ message: 'book not part of this shelf' })
            }
        } else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }
})

app.listen(8080)