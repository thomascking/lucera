import express from 'express';
import csv from 'csv-parser';
import fs from 'fs';
import uuid from 'uuid/v4';

const app = express()

const data = [];

console.log(process.argv[2]);

fs.createReadStream(process.argv[2])
    .pipe(csv())
    .on('data', (row) => {
        row.bid_price = parseFloat(row.bid_price);
        row.ask_price = parseFloat(row.ask_price);
        row.bid_quantity = parseFloat(row.bid_quantity);
        row.ask_quantity = parseFloat(row.ask_quantity);

        row.spread = row.ask_price - row.bid_price;
        row.id = uuid();
        row.ts = new Date(row.ts);
        data.push(row);
    })
    .on('end', () => {
        console.log('Finished loading data: ', data.length);
    });

app.get('/api/data', (req, res) => {
    console.log('received api request');
    const page = parseInt(req.query.page || '1');
    const pageSize = parseInt(req.query.pageSize || '10');
    const start = (page - 1) * pageSize;
    const prev = page - 1;
    const next = page + 1;

    let values = data;

    if (req.query.startTime) {
        console.log('filtering by startTime');
        values = values.filter((d) => d.ts >= new Date(req.query.startTime));
    }
    if (req.query.endTime) {
        console.log('filtering by endTime');
        values = values.filter((d) => d.ts <= new Date(req.query.endTime));
    }
    if (req.query.sym) {
        console.log('filtering by symbols');
        const syms = req.query.sym.split(',');
        values = values.filter((d) => syms.includes(d.sym));
    }
    if (req.query.lp) {
        console.log('filtering by liquidity providers');
        const lps = req.query.lp.split(',');
        values = values.filter((d) => lps.includes(d.lp));
    }

    const total = values.length;
    console.log('found results: ', total);
    const pages = Math.ceil(total / pageSize);
    values = values.slice(start, start + pageSize);
    return res.send({
        page,
        pageSize,
        prev,
        next,
        pages,
        total,
        values
    });
});

app.use('/', express.static('../app/build'));

app.listen(3000, () => {
    console.log('Started server');
});