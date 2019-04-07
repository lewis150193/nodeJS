
const express = require('express');
const Joi = require('joi');
const data = require('./data');

const app = express();

//Allows you to pass body data url encoded forms.
app.use(express.json());

const { courses } = data;
console.log(courses);
app.get('/', (req,res) => {
    res.send('Hello World');

});
app.get('/courses', (req,res) => {
    res.send(courses)
});
app.post('/add/course', (req,res) => {

    const { error } = validateCourse(req.body);
    if(error) {
        res.status(404).send(error.details[0].message);
        return;
    }

    const course = {
        id:courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});
app.delete('/delete/course/:id', (req,res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) res.status(404).send('Course not found');

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
});
app.put('/put/course/:id', (req,res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) res.status(404).send('The course ID was not found');
    const schema = {
        name: Joi.string().min(3).max(10).required()
    };

    const {error} =  Joi.validate(req.body, schema);
    // const result =  Joi.validate(req.body, schema);
    if(error){
        console.log(error.details[0].message);
        res.status(404).send(error.details[0].message);
        return;
    }
    course.name = req.body.name;
    res.send(course)
});
app.get('/course/:id', (req,res) => {
   const course = courses.find(c => c.id === parseInt(req.params.id));
   if(!course){
       res.status(404);
       res.send('Course not found');
   } else {
       res.send(course)
   }
});
app.get('/:num1/:num2', (req,res) => {
    const num1 = req.params.num1;
    const num2 = req.params.num2;

    const schema = {
        num1: Joi.string().min(1).max(3).required()
    };

    //results validates the req.params.num1 against the schema and returns a error
    //JSON if it doesn't pass the validations.
    const results = Joi.validate(req.params.num1,schema);
    if(results) {
        console.log(results.error);
        res.send(results.error);
        return;
    }


    const answer = parseInt(num1) + parseInt(num2);
    res.send(answer.toString());
})


const validateCourse = course => {
    const schema = {
        name: Joi.string().min(3).max(10).required()
    };

    return Joi.validate(course, schema);

};
app.listen(9999);