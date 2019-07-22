import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { AppBar, Tabs, Tab, TextField, Button } from '@material-ui/core';
import ChipInput from 'material-ui-chip-input';

import { addSymbol, removeSymbol, updatePageSize, addProvider, removeProvider, fetchPage } from './store';

import Table from './components/table';
import Pagination from './components/pagination';

import './App.css';

const App = ({ symbols, pageSize, liquidityProviders, startTime, endTime, addSymbol, removeSymbol, updatePageSize, addProvider, removeProvider, fetchPage }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => setValue(newValue);

  return (
    <div className="App">
      <ChipInput className="form-control" label="Symbols" value={symbols} onAdd={addSymbol}  onDelete={removeSymbol} />
      <ChipInput className="form-control" label="Liquidity Providers" value={liquidityProviders} onAdd={addProvider}  onDelete={removeProvider} />
      <TextField className="form-control" label="Page Size" value={pageSize} onChange={(event) => updatePageSize(parseInt(event.target.value))} type="number" />
      <Button onClick={() => fetchPage(1, pageSize, symbols, liquidityProviders, startTime, endTime)}>Load Data</Button>
      <Pagination />
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Table" />
          <Tab label="Graph" />
        </Tabs>
      </AppBar>
      <div>
        {
          value === 0 ? <Table /> : 'Graph'
        }
      </div>
    </div>
  );
}

const mapStateToProps = ({ symbols, pageSize, liquidityProviders, startTime, endTime }) => {
  return {
    symbols,
    pageSize,
    liquidityProviders,
    startTime,
    endTime
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    addSymbol,
    removeSymbol,
    updatePageSize,
    addProvider,
    removeProvider,
    fetchPage
  }, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
