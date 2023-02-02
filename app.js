const express = require("express");
const fs = require("fs");


const app = express();
app.use(express.json());

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, "utf-8"));

const getAllTours = (req, res) => {
    if (!tours) res.send("Файл не найден");
    res.status(200).json({
        status: "success",
        results: tours.length,
        data: {
            tours
        }
    });
};

const getOneTour = (req, res) => {
    const id = req.params.id * 1;

    if (id > tours.length) {
        return res.status(404).json({ message: "Такого тура не существует!" });
    }
    const tour = tours.find(elem => elem.id === id);

    res.status(200).json({
        status: "success",
        data: {
            tour
        }
    });
};

const createTour = (req, res) => {
    const data = req.body;

    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);
    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
        res.status(201).json({
            status: "success",
            data: {
                tour: newTour
            }
        })
    })
};

const updateTour = (req, res) => {
    const id = req.params.id * 1;

    if (id > tours.length) {
        return res.status(404).json({
            status: "fail",
            message: "Invalid id"
        });
    }
    res.status(200).json({
        status: "success",
        data: {
            tour: "<Updated tour here...>"
        }
    });
};

const deleteTour = (req, res) => {
    const id = req.params.id * 1;

    if (id > tours.length) {
        return res.status(404).json({
            status: "fail",
            message: "Invalid id"
        });
    }
    res.status(204).json({
        status: "success",
        data: {
            tour: null
        }
    });
}

// app.get("/api/v1/tours", getAllTours);
// app.get("/api/v1/tours/:id", getOneTour);
// app.post("/api/v1/tours", createTour);
// app.patch("/api/v1/tours/:id", updateTour);
// app.delete("/api/v1/tours/:id", deleteTour);

app
    .route("/api/v1/tours")
    .get(getAllTours)
    .post(createTour);

app
    .route("/api/v1/tours/:id")
    .get(getOneTour)
    .patch(updateTour)
    .delete(deleteTour)

const port = 3000;
app.listen(port, () => {
    console.log(`App running on port: ${port}...`)
})