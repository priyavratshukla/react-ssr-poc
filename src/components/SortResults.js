import React, { Component } from "react";

// const SortResults = (props) => (
//     <div className="col-xs-12 col-sm-6">
//       <select className="col-xs-12 col-sm-3" id="myList">
//         <option value="asc">Ascending</option>
//         <option value="desc">Descending</option>
//       </select>
//     </div>
// );

class SortResults extends Component {
  render() {
    return (
    	 <div className="col-xs-12 col-sm-6">
	      <select className="col-xs-12 col-sm-3" id="myList">
	        <option value="asc">Ascending</option>
	        <option value="desc">Descending</option>
	      </select>
	    </div>
    )
  }
}

export default SortResults;