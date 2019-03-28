import React, { Component } from 'react'
import Cell, { CELL_VALUES } from './Cell'

export default class Board extends Component {

    constructor(props) {
        super(props);

        let arr = new Array(256).fill("EMPTY", 0, 256);
        this.state = {
            cell_values: arr
        }
    }

    onChange = (cell_pos, new_val) => {

        let new_cell_values = [...this.state.cell_values];
        
        new_cell_values[cell_pos] = new_val;
        this.setState({cell_values: new_cell_values});  
        
    }

    createCells = () => {
        let cells = [];
        for (let i = 0; i < 256; i++) {
            cells.push(<Cell key={i} cell_pos={i} onChange={this.onChange}/>)
        }
        return cells;
    }

    exportLevel = () => {
        let walls = new Array(256).fill(0, 0, 256);
        let robots = new Array(5).fill(-1, 0, 5);
        let targets = new Array(5).fill(-1, 0, 5);

        this.state.cell_values.forEach((cell, i) => {
            if(cell === 'WALL') {
                walls[i] = 1
            }

            if(cell.startsWith("R")) { //Robots
                robots[cell.substr(1,1) - 1] = i;
            }

            if(cell.startsWith("T")) { //Targets
                targets[cell.substr(1,1) - 1] = i;
            }
        });



        console.log('====================================');
        console.log('WALLS');
        console.log("{" + walls.join(", ") + "}");
        console.log('====================================');
        console.log('====================================');
        console.log('ROBOTS');
        console.log("{" + robots.join(", ") + "}");
        console.log('====================================');
        console.log('====================================');
        console.log('TARGETS');
        console.log("{" + targets.join(", ") + "}");
        console.log('====================================');
    }

    render() {
        return (
            <React.Fragment>
                <div className="board">
                    {this.createCells()}
                </div>
                <button onClick={this.exportLevel}>Export</button>
            </React.Fragment>
        )
  }
}
