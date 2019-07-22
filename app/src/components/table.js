import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';

const DataTable = ({values}) => {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Symbol</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Liquidity Provider</TableCell>
                    <TableCell>Bid Price</TableCell>
                    <TableCell>Bid Quantity</TableCell>
                    <TableCell>Ask Price</TableCell>
                    <TableCell>Ask Quantity</TableCell>
                    <TableCell>Spread (%)</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    values ? values.map(v => {
                        return (
                            <TableRow>
                                <TableCell>{v.sym}</TableCell>
                                <TableCell>{new Date(v.ts).toLocaleTimeString()}</TableCell>
                                <TableCell>{v.lp}</TableCell>
                                <TableCell>{v.bid_price}</TableCell>
                                <TableCell>{v.bid_quantity}</TableCell>
                                <TableCell>{v.ask_price}</TableCell>
                                <TableCell>{v.ask_quantity}</TableCell>
                                <TableCell>{v.spread} ({ ((v.spread / v.ask_price) * 100).toFixed(2) }%)</TableCell>
                            </TableRow>
                        );
                    }) : 'Loading...'
                }
            </TableBody>
        </Table>
    )
}

DataTable.propTypes = {
    values: PropTypes.array
}

const mapStateToProps = ({ page }) => {
    return {
        values: page ? page.values : []
    };
}

export default connect(
    mapStateToProps
)(DataTable);