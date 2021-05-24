const Joi = require('joi');
//capital becuase it is a class
const express = require('express');
var bodyParser = require("body-parser");
const { valid, date } = require('joi');
const app = express();

app.use(express.json());
//^added piece of middleware
//when we call this method, it return middleware, then app.use uses that middleware
//Here we are configuring express to use body-parser as middle-ware.
app.use(express.urlencoded({ extended: true }));

const books = [
    {id: 1, name: 'Count of Monte Cristo', author: "John S.", checkedout: false, borrower: "None", checkout_date: "", due_date: ""},
    {id: 2, name: 'Time Machine', author: "James T.", checkedout: false, borrower: "None",checkout_date: "", due_date: ""},
    {id: 3, name: 'Moby Dick', author: "Jane S.", checkedout: false, borrower: "None", checkout_date: "", due_date: ""},
]

const users = [

]

let DueDateDays = 7
let some_date = new Date()
checkedout_date = new Date()
some_date.setDate(some_date.getDate() + DueDateDays); 

var dd = some_date.getDate();
var mm = some_date.getMonth() + 1;
var y = some_date.getFullYear();

var d = checkedout_date.getDate();
var m = checkedout_date.getMonth() + 1;
var yr = checkedout_date.getFullYear();

var due_date = mm + '/'+ dd + '/'+ y;
var checkedout_date = m + '/' + d + yr;


//under. the callback function contains a request and 
//response if the endpoint is reached
//the callback function is called the route handler
app.get('/', (req, res) => {
    // res.send('Welcome to Book Club. Click the button below for books');
    res.sendFile(__dirname + '/index.html');
});

app.get('/api/books', (req, res) => {
    res.send(books);
});

app.get('/api/users', (req, res) => {
    res.send(users)
})
 
app.get('/api/checkedout_books/:id', (req, res) => {
    const user = users.find(user => user.id === parseInt(req.params.id))

    var checkedout_books_arr = []
    for(var i = 0; i < books.length; i++){
        if(books[i].borrower === user.username){
            checkedout_books_arr.push({name: books[i].name, 
                id: books[i].id, 
                checkout_date: books[i].checkout_date,
                due_date: books[i].due_date,
                author: books[i].author
            })
        }
    }
    res.send(checkedout_books_arr)
})

//name: req.body.name is reading the body fro the body opf the request
//we are assuming that it has a name property
//we need to enable parsing of JSON objects in the body of the request 
//that's why we added ^ app.use(express.json()); at the top
app.post('/api/add_book', (req, res) => {
    console.log(req.body.name)
    //Might be better to have this already created and added to when someone add/removed a book
    let id_arr = [];
    for(var i = 0; i < books.length; i++){
        id_arr.push(books[i].id)
    }
    var max = id_arr.reduce(function(a, b) {
        return Math.max(a, b);
    });
    const book = {
        id: max + 1,
        name: req.body.name,
        author: req.body.author,
        checkedout: false,
        borrower: "None"
    };
    books.push(book)
    console.log(books)
    res.status(200).send('This book was added succesfully')
})

app.post('/api/add_user', (req, res) => {
    console.log(req.body.username)
    for(var i = 0; i < users.length; i++){
        if(users[i].username === req.body.username){
            return res.status(400).send('This user already exists in our system')
        }
    }
    let id_arr = [];
    for(var i = 0; i < users.length; i++){
        id_arr.push(users[i].id)
    }
    var max = 0;

    if(id_arr.length > 0){
    console.log(id_arr)
    max = id_arr.reduce(function(a, b) {
        return Math.max(a, b);
    })
    }
    const user = {
        id: max + 1,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        checkedout_books: req.body.checkedout_books,
        overdue_books: req.body.overdue_books
    }
    users.push(user)
    res.status(200).send('This user was added succesfully')
})

app.put('/api/checkout_book/:id', (req, res) => {
    console.log("Borrower: " + req.body.borrower)
    var count = 0;
    console.log("count: " + count);
    for(var i = 0; i < users.length; i++){
        if(req.body.borrower === users[i].username){
            console.log("test")
            users[i].checkedout_books++; 
            count = count+1;
            const book = books.find(book => book.id === parseInt(req.params.id))
            // if(!book){
            //     return res.status(404).send('The book with the given id was not found')
            // }
            book.borrower = req.body.borrower
            book.checkedout = req.body.checkedout
            book.due_date = due_date
            book.checkout_date = checkedout_date
            console.log(`This book is checked out by ${req.body.borrower}`)
            res.status(200).send(`This book is checked out by ${req.body.borrower}`)
            }
          }
        if(count === 0){
            console.log("No users match the given borrower's name")
            res.status(400).send("No users match the given borrower's name")
        }

})

app.put('/api/turn_in_book/:id', (req, res) => {

    const book = books.find(book => book.id === parseInt(req.params.id))
    if(!book){
        res.status(404).send('The book with the given id was not found')
    }

    for(var j = 0; j < books.length; j++){
        if(books[j].id === book.id){
            var borrower = book.borrower
        }
    }
    for(var i = 0; i < users.length; i++){
        if(borrower === users[i].username){
            users[i].checkedout_books = users[i].checkedout_books - 1; 
        }
    }

    book.borrower = "None"
    book.checkedout = req.body.checkedout
    book.due_date = ""
    book.checkout_date = ""
    console.log("This book is no longer checked out")
    res.status(200).send("This book is no longer checked out")
})

app.delete('/api/delete_book/:id', (req, res) => {
    const book = books.find(book => book.id === parseInt(req.params.id))
    if(!book){
        res.status(404).send('The book with the given id was not found')
    }
    else{
        let index = books.findIndex(x => x.id === book.id)
        books.splice(index, 1)
        console.log("deleted")
    }
    res.status(200).send('The book was deleted')
});

app.delete('/api/delete_user/:id', (req, res) => {
    const user = users.find(user => user.id === parseInt(req.params.id))
    console.log(user.id)
    if(!user){
        res.status(404).send('The user with the given id was not found')
    }
    else{
        let index = users.findIndex(x => x.id === user.id)
        console.log("index: " + index)
        users.splice(index, 1)
        console.log("deleted")
    }
    res.status(200).send('The user was deleted')
});

//we added parameter 'id' 
//res.send() sends to the client
app.get('/api/books/:id', (req, res) => {
    const book = books.find(book => book.id === parseInt(req.params.id))
    if(!book){
        res.status(404).send('The book with the given id was not found')
    }
    else{
        res.send(book)
    }
});

app.put('/api/edit_book/:id', (req, res) => {
    //look up book
    //if not existing, return 404
    console.log("found it")
    const book = books.find(book => book.id === parseInt(req.params.id))
    if(!book){
        console.log("Not found")
    }

    book.name = req.body.title
    book.author = req.body.author

    res.status(200).send('Changes have succesfully been made')

}); 
        
    function validateBook(book) {
        const schema = {
            name: Joi.string().min(1).required()
        };
    
        return Joi.validate(book, schema);
    }

    function validateBorrower(borrower){
        const schema = {
            borrower: Joi.string().min(1).required()
        };
        return Joi.validate(borrower, schema)
    }

//listen on a given port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`))

//I can use nodemon index.js in the terminal so that I dont
//have to constantly refresh the terminal

