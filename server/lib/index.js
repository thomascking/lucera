"use strict";

var _express = _interopRequireDefault(require("express"));

var _csvParser = _interopRequireDefault(require("csv-parser"));

var _fs = _interopRequireDefault(require("fs"));

var _v = _interopRequireDefault(require("uuid/v4"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
var data = [];
console.log(process.argv[2]);

_fs["default"].createReadStream(process.argv[2]).pipe((0, _csvParser["default"])()).on('data', function (row) {
  row.bid_price = parseFloat(row.bid_price);
  row.ask_price = parseFloat(row.ask_price);
  row.bid_quantity = parseFloat(row.bid_quantity);
  row.ask_quantity = parseFloat(row.ask_quantity);
  row.spread = row.ask_price - row.bid_price;
  row.id = (0, _v["default"])();
  row.ts = new Date(row.ts);
  data.push(row);
}).on('end', function () {
  console.log('Finished loading data: ', data.length);
});

app.get('/api/data', function (req, res) {
  console.log('received api request');
  var page = parseInt(req.query.page || '1');
  var pageSize = parseInt(req.query.pageSize || '10');
  var start = (page - 1) * pageSize;
  var prev = page - 1;
  var next = page + 1;
  var values = data;

  if (req.query.startTime) {
    console.log('filtering by startTime');
    values = values.filter(function (d) {
      return d.ts >= new Date(req.query.startTime);
    });
  }

  if (req.query.endTime) {
    console.log('filtering by endTime');
    values = values.filter(function (d) {
      return d.ts <= new Date(req.query.endTime);
    });
  }

  if (req.query.sym) {
    console.log('filtering by symbols');
    var syms = req.query.sym.split(',');
    values = values.filter(function (d) {
      return syms.includes(d.sym);
    });
  }

  if (req.query.lp) {
    console.log('filtering by liquidity providers');
    var lps = req.query.lp.split(',');
    values = values.filter(function (d) {
      return lps.includes(d.lp);
    });
  }

  var total = values.length;
  console.log('found results: ', total);
  var pages = Math.ceil(total / pageSize);
  values = values.slice(start, start + pageSize);
  return res.send({
    page: page,
    pageSize: pageSize,
    prev: prev,
    next: next,
    pages: pages,
    total: total,
    values: values
  });
});
app.use('/', _express["default"]["static"]('../app/build'));
app.listen(3000, function () {
  console.log('Started server');
});