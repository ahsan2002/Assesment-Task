import express from 'express';
import path from 'path';
import cors from 'cors';
import moment from 'moment';

const app = express()
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

let employees = []; // TODO: connect with mongodb instead


app.post('/addemployee', (req, res) => {

    const body = req.body;

    if ( // validation
        !body.firstName
        || !body.lastName
        || !body.email
        || !body.salary
    ) {
        res.status(400).send({
            message: "required parameters missing",
        });
        return;
    }

    console.log(body.firstName)
    console.log(body.lastName)
    console.log(body.email)
    console.log(body.salary)

    employees.push({
        id: `${new Date().getTime()}`,
        date: moment(new Date()).format('YYYY-MM-DD'),
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        salary: body.salary
    });

    res.send({
        message: "employee added successfully"
    });
})

console.log(employees)

app.get('/employees', (req, res) => {
    res.send({
        message: "got all employees successfully",
        data: employees
    })
})


app.delete('/employee/:id', (req, res) => {
    const id = req.params.id;

    let isFound = false;
    for (let i = 0; i < employees.length; i++) {
        if (employees[i].id === id) {
            employees.splice(i, 1);
            res.send({
                message: "employee deleted successfully"
            });
            isFound = true
            break;
        }
    }
    if (isFound === false) {
        res.status(404)
        res.send({
            message: "delete fail: employee not found"
        });
    }
})


app.put('/employee/:id', (req, res) => {

    const body = req.body;
    const id = req.params.id;

    if ( // validation
        !body.firstName
        || !body.lastName
        || !body.email
        || !body.salary
    ) {
        res.status(400).send({
            message: "required parameters missing",
        });
        return;
    }

    console.log(body.firstName)
    console.log(body.lastName)
    console.log(body.email)
    console.log(body.salary)

    let isFound = false;
    for (let i = 0; i < employees.length; i++) {
        if (employees[i].id === id) {

            employees[i].name = body.firstName;
            employees[i].price = body.lastName;
            employees[i].email = body.email;
            employees[i].salary = body.salary;

            res.send({
                message: "employee modified successfully"
            });
            isFound = true
            break;
        }
    }
    if (!isFound) {
        res.status(404)
        res.send({
            message: "edit fail: employee not found"
        });
    }
    res.send({
        message: "employee added successfully"
    });
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})