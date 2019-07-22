import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as d3 from "d3";

const Graph = ({ values }) => {
    const ref = useRef(null);

    useEffect(() => {
        const svg = d3.select(ref.current);
        if (!svg) return;
        svg.selectAll("*").remove();
        const margin = {top: 10, right: 10, bottom: 50, left: 100};
        const width = ref.current.clientWidth - margin.left - margin.right;
        const height = ref.current.clientHeight - margin.top - margin.bottom;
        const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

        //TODO: Get min and max for ts and ask_price

        const xScale = d3.scaleTime().domain([values[0].ts, values[values.length - 1].ts]).range([0, width]);
        const yScale = d3.scaleLinear().domain([
            values.reduce((min, p) => p.ask_price < min ? p.ask_price : min, values[0].ask_price),
            values.reduce((max, p) => p.ask_price > max ? p.ask_price : max, values[0].ask_price)
        ]).range([0, height]);

        const line = d3.line().x(d => xScale(d.ts)).y(d => yScale(d.ask_price));

        g.append('g').attr('class', 'x axis').attr('transform', `translate(0,${height})`).call(d3.axisBottom(xScale));
        g.append('g').attr('class', 'y axis').call(d3.axisLeft(yScale));

        g.append('path').datum(values).attr('class', 'line').attr('d', line);
    }, [values]);

    return (
        <svg width={800} height={600} ref={ref}>
        </svg>
    )
}

Graph.propTypes = {
    values: PropTypes.array
}

const mapStateToProps = ({ page }) => {
    return {
        values: page ? page.values : []
    };
}

export default connect(
    mapStateToProps
)(Graph);