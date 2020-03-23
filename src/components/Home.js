import React, { Component }  from "react";
import { connect } from "react-redux";
import { fetchData, content, filters } from "../store";

class Home extends Component {
  constructor(props) {
      super(props);
      this.state = {
        search : "",
        sortType : 'asc'
      }
      this.handleInputChange = this.handleInputChange.bind(this);
      this.renderApiData = this.renderApiData.bind(this);
      this.onSort = this.onSort.bind(this);
      this.onFilter = this.onFilter.bind(this);
      this.getFilteredArr = this.getFilteredArr.bind(this);
      this.filterResults = this.filterResults.bind(this);
    }

    componentDidMount( ) {
        if ( this.props.apiData.length <= 0 ) {
          this.props.fetchData( );
        }
    }

    onFilter(event) {
      this.setState({
        [event.target.name] : event.target.checked
      });
      // var filterLabel = [];
      // var filterSpan, fiterWrapper, parentDiv,labelData;
      // labelData = event.target.name + '  X';
      //
      // fiterWrapper = document.getElementById('result-wrapper');
      // parentDiv = fiterWrapper.parentNode;
      // if(event.target.checked === true){
      //    filterSpan = document.createElement("span");
      //    filterSpan.innerHTML = labelData;
      //    filterSpan.classList.add("filterSpan");
      //    filterLabel.push(filterSpan);
      //    parentDiv.insertBefore(filterSpan, fiterWrapper);
      // }
      // if(event.target.checked === false){
      //   if(filterLabel.indexOf(event.target.name) !== -1){
      //     filterLabel.splice(this, 1);
      //     filterSpan.fiterWrapper.removeChild(filterSpan);
      //   }
      // }


      let filterTypes = document.querySelectorAll(".filter-box input[type='checkbox']");
      let filters = {
        filterParam: this.getFilteredArr(filterTypes)
      };
      this.filterResults(filters);
    }

    getFilteredArr(checkboxes) {
      let elemArr = [];
      if (checkboxes && checkboxes.length > 0) {
        for (let i = 0; i < checkboxes.length; i++) {
          let checkBoxArr = checkboxes[i];
          if (checkBoxArr.checked) {
            elemArr.push(checkBoxArr.getAttribute("id"));
          }
        }
      }
      return elemArr;
    }

    filterResults(filters) {
      let resArr = document.querySelectorAll(".services li");
      let hiddenArr = [];
      if (!resArr || resArr.length <= 0) {
        return;
      }
      for (let i = 0; i < resArr.length; i++) {
        let el = resArr[i];
        if (filters.filterParam.length > 0) {
          let isHidden = true;
          for (let j = 0; j < filters.filterParam.length; j++) {
            let filter = filters.filterParam[j];
            if (el.children[0].textContent.toLocaleLowerCase().match(filter)) {
              isHidden = false;
              break;
            }
          }
          if (isHidden) {
            hiddenArr.push(el);
          }
        }
      }
      for (let i = 0; i < resArr.length; i++) {
        resArr[i].style.display = "inline-block";
      }
      if (hiddenArr.length <= 0) {
        return;
      }
      for (let i = 0; i < hiddenArr.length; i++) {
        hiddenArr[i].style.display = "none";
      }
    }

    renderApiData(tile) {
      return(
          <li className="col-sm-3 col-xs-12 btmspace-3" key={ tile.id }>
            <article className="bgded overlay">
              <img src={tile.image}/>
              <div className="tile-heading">
                <h2>{tile.name}</h2>
                <p>
                  <span>id :{tile.id} - created {tile.created} ago</span>
                </p>
              </div>
              <div className="tile-info">
                <p>
                  <span>Status</span>
                  <span>{tile.status}</span>
                </p>
                <p>
                  <span>Species</span>
                  <span>{tile.species}</span>
                </p>
                <p>
                  <span>Gender</span>
                  <span>{tile.gender}</span>
                </p>
                <p>
                  <span>Origin</span>
                  <span>Post-Apocalyptic {tile.origin.name}</span>
                </p>
                <p>
                  <span>Last Location</span>
                  <span>Post-Apocalyptic {tile.origin.name}</span>
                </p>
              </div>
            </article>
          </li>
      )
    }

    handleInputChange(event) {
      this.setState({search: event.target.value});
    }

    onSort(sortType){
      this.setState({sortType});
    }

    render( ) {
        const { apiData } = this.props;
        const { search, sortType, species, gender, origin } = this.state;

        const searchResults = apiData.filter( item => {
            return item.name.toLowerCase().indexOf(search.toLowerCase()) !== -1;
        });

        const sortedResults = apiData.sort((a,b) => {
          const isReversed = (sortType === 'asc') ? 1 : -1;
          return isReversed * a.name.localeCompare(b.name);
        });

        return (
          <div className="container-fluid">
             <div className="row">
                <div className="col-sm-2 col-xs-12">
                  <h2>Filters</h2>
                  <div className="filter-box">
                    <h5>Species</h5>
                    <input type="checkbox" id="human" name="human" value="human" checked={this.state.human || ""} onChange={this.onFilter}/>
                    <label htmlFor="human"> Human</label><br/>
                    <input type="checkbox" id="alien" name="alien" value="alien" checked={this.state.alien || ""} onChange={this.onFilter}/>
                    <label htmlFor="mytholog"> Alien</label><br/>
                  </div>
                  <div className="filter-box">
                    <h5>Gender</h5>
                    <input type="checkbox" id="male" name="male" value="Male" checked={this.state.male || ""} onChange={this.onFilter}/>
                    <label htmlFor="male"> Male</label><br/>
                    <input type="checkbox" id="female" name="female" value="Female" checked={this.state.female || ""} onChange={this.onFilter}/>
                    <label htmlFor="female"> Female</label><br/>
                  </div>
                  <div className="filter-box">
                    <h5>Origin</h5>
                    <input type="checkbox" id="unknown" name="unknown" value="Unknown" checked={this.state.unknown || ""} onChange={this.onFilter} />
                    <label htmlFor="unknown"> Unknown</label><br/>
                    <input type="checkbox" id="postapocalyptic" name="postapocalyptic" value="Post-Apocalyptic Earth" checked={this.state.postapocalyptic || ""}  onChange={this.onFilter}/>
                    <label htmlFor="postapocalyptic"> Post-Apocalyptic Earth</label><br/>
                  </div>
                </div>
                <div className="col-sm-10 col-xs-12" id="main-warrper">
                  <div className="wrapper" id="result-wrapper">
                      <div className="row">
                            <form className="search-form col-xs-12 col-sm-6">
                              <label htmlFor="search">Search by name:</label><br/>
                              <input label="Search" onChange={this.handleInputChange}/>
                            </form>
                            <div className="col-xs-12 col-sm-6">
                              <select className="col-xs-12 col-sm-3" id="myList" onChange={(e) => this.onSort(e.target.value)}>
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                              </select>
                            </div>
                      </div>
                      <ul className="nospace group services row">
                        {
                          (search !== '') ?
                            searchResults.map(tile => {
                              return this.renderApiData(tile);
                            }) :
                            sortedResults.map(tile => {
                              return this.renderApiData(tile);
                            })
                        }
                      </ul>
                  </div>
                </div>
             </div>
          </div>
        );
    }
}
Home.serverFetch = fetchData;

const mapStateToProps = ( state ) => ( {
    apiData: state.data
} );

const mapDispatchToProps = {
  fetchData
};

export default connect( mapStateToProps, mapDispatchToProps )( Home );
