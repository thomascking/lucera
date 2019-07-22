import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';
import { bindActionCreators } from 'redux';
import { fetchPage } from '../store';

const Pagination = ({ page, symbols, pageSize, liquidityProviders, startTime, endTime, fetchPage }) => {
    return (
        <div>
            <Button disabled={!page.prev} onClick={() => fetchPage(page.prev, pageSize, symbols, liquidityProviders, startTime, endTime)}>Previous</Button>
            <span>Page: {page.page} of {page.pages}</span>
            <Button disabled={page.next > page.pages} onClick={() => fetchPage(page.next, pageSize, symbols, liquidityProviders, startTime, endTime)}>Next</Button>
        </div>
    )
}

Pagination.propTypes = {
    page: PropTypes.object
}

const mapStateToProps = ({ page, symbols, pageSize, liquidityProviders, startTime, endTime }) => {
    return {
        page,
        symbols,
        pageSize,
        liquidityProviders,
        startTime,
        endTime
    };
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        fetchPage
    }, dispatch)
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Pagination);