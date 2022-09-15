const { request } = require('express')
const express = require('express')
const mongoose = require('mongoose')
const Blog = require('./models/blog')

//connec to db
const dbURI = 'mongodb+srv://Benson:Ben2262@nodeblog.oyp5q2m.mongodb.net/node-blog?retryWrites=true&w=majority'
mongoose.connect(dbURI)
.then((result) =>app.listen(8000))
.catch((err) => console.log(err))

//express app
const app = express()

//register view engine
app.set('view engine', 'ejs')


//middleware & static css
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))


//routes
app.get('/', (req, res) => {    
    res.redirect('/blogs')
})

app.get('/about', (req, res) => {
    res.render('about', {title: 'About'})
})

//blog routes
app.get('/blogs', (req, res) => {
    Blog.find().sort({createdAt: -1})
        .then((result) => {
            res.render('index', {title: 'All Blogs', blogs:result})
        })
        .catch((err) => {console.log(err)})
})

app.post('/blogs', (req, res) => {
    const blog = new Blog(req.body)

    blog.save()
        .then((result) =>{
            res.redirect('/blogs');
        })
        .catch((err) => {console.log(err)})
})

app.get('/blogs/create', (req, res) =>{
    res.render('create', {title: 'New Blog'});    
})

app.get('/blogs/:id', (req, res) =>{
    const id = req.params.id
    Blog.findById(id)
        .then(result =>{
            res.render('details', {blog: result, title: 'Blog Details'});
        })
        .catch(err => console.log(err));
})

app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id
    Blog.findByIdAndDelete(id)
        .then(result => {
            res.json({redirect: '/blogs'})
        })
        .catch(err => {
            console.log(err)
        })
})

app.use((req, res) => {
    res.status(404).render('404', {title: 'Error 404'})
})