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

        let walls_str = "{\n";
        walls.forEach((cell, i) => {
            walls_str += cell + ", ";
            if((i + 1) % 16 === 0) {
                walls_str += "\n"
            }
            
        });
        walls_str += "\n}"

        this.setState({
            walls: walls_str,
            robots: robots.join(", "),
            targets:targets.join(", ")
        })
    }

    render() {
        return (
            <React.Fragment>
                <div className="board">
                    {this.createCells()}
                </div>
                <button onClick={this.exportLevel}>Export</button>
                <div>
                    Walls:
                    <textarea cols={60} value={this.state.walls}/>
                    <br/>
                    Robots:
                    <textarea cols={60} value={this.state.robots}/>
                    <br/>
                    Targets:
                    <textarea cols={60} value={this.state.targets}/>
                </div>
            </React.Fragment>
        )
  }
}
