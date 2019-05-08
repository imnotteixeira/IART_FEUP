import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Board from './Board'

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            walls: [],
            robots: [],
            targets: []
        }
    }

    render() {
        return (
            <div className="App">
                <Board />
            </div>
        );
    }
}

export default App;
