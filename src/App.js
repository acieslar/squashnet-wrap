import React, { Component } from 'react';
import { Table } from 'reactstrap';
import './App.css';

class App extends Component {
   constructor(props) {
      super(props);
      this.state = { tournaments: [] };
   }
   componentDidMount() {
      const getTournaments = async () => {
         const response = await fetch("/tournaments");
         const json = await response.json();
         this.setState({
            tournaments: json
         });
      }
      getTournaments();
   }
   render() {
      return (
         <div className="App">
            <Table>
               <thead>
                  <tr>
                     <th>#</th>
                     <th>Date</th>
                     <th>Name</th>
                  </tr>
               </thead>
               <tbody>
                  {
                     this.state.tournaments.map((tment, idx) =>
                        <tr>
                           <th scope="row">{tment.id}</th>
                           <td>{tment.date}</td>
                           <td>{tment.title}</td>
                        </tr>
                     )
                  }
               </tbody>
            </Table>
         </div>
      );
   }
}

export default App;
