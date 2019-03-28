import React, { Component } from 'react'

export const CELL_VALUES = Object.freeze({
    0: 'EMPTY',
    1: 'WALL',
    2: 'R1',
    3: 'R2',
    4: 'R3',
    5: 'R4',
    6: 'R5',
    7: 'T1',
    8: 'T2',
    9: 'T3',
    10: 'T4',
    11: 'T5',
});

export default class Cell extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: 0
        }
    }

    onClick = () => {
        const {onChange, cell_pos} = this.props;

        this.setState((prevState) => ({
            value: (prevState.value + 1) % 12
        }), () => {
            onChange(cell_pos, CELL_VALUES[this.state.value]);
        });

       
    }

    render() {
        return (
            <div className="cell" onClick={this.onClick}>
                {CELL_VALUES[this.state.value]}
            </div>
        )
    }
}
