const express = require('express');
const { query } = require('../helpers/db.js'); // Note the double dots to go up a folder

const todoRouter = express.Router();

// GET all tasks
todoRouter.get("/", async (req, res) => {
    try {
        const result = await query('select * from task');
        const rows = result.rows ? result.rows : [];
        res.status(200).json(rows);
    } catch (error) {
        console.log(error);
        console.log(error.message);
        res.statusMessage = error;
        res.status(500).json({error: error});
    };
});

// POST new task
todoRouter.post("/new", async (req, res) => {
    try {
        const result = await query('insert into task (description) values ($1) returning *', 
        [req.body.description])
        res.status(200).json({id: result.rows[0].id});
    } catch (error) {
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
    };
});

// DELETE task
todoRouter.delete("/delete/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        await query('delete from task where id = $1', [id]);
        res.status(200).json({id: id});
    } catch (error) {
        res.statusMessage = error
        res.status(500).json({error: error})
    };
});

// CRITICAL: Export the router
module.exports = { todoRouter };
