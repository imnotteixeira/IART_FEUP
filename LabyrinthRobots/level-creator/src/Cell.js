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

    onMouseDown = (e) => {

        let right_click = e.button === 2;

        const {onChange, cell_pos} = this.props;

        this.setState((prevState) => ({
            value: right_click ? (12 + prevState.value - 1) % 12 : (12 + prevState.value + 1) % 12
        }), () => {
            onChange(cell_pos, CELL_VALUES[this.state.value]);
        });

        e.stopPropagation();
       
    }

    render() {
        return (
            <div className={"cell cell-" + this.state.value} onMouseDown={this.onMouseDown} onContextMenu={(e) => {e.preventDefault(); return false}}>
                {CELL_VALUES[this.state.value]}
            </div>
        )
    }
}
