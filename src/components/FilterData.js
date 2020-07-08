/**
 * 5000
 * Pre: 1336ms
 * Post : 144ms
 **/
const DATA_ENTRIES = 5000;
const ENTRIES_PER_PAGE = 100;

const { createStore, combineReducers } = Redux;
const { Provider, connect } = ReactRedux;

const entryAttr = {
  name: [
    "Han Solo",
    "Darth Vader",
    "Luke Skywalker",
    "Princess Leia",
    "Chewie",
    "Lando Calrissian",
    "Boba Fett",
    "Yoda",
    "R2D2",
    "Kylo Ren",
    "Rey",
    "Fin",
    "Poe Dameron",
    "Obi-Wan Kenobi"
  ],
  powers: ["Push", "Pull", "Mind Tricks", "Lighning", "Choke", "Drain"],
  color: [
    "Red",
    "Blue",
    "Green",
    "Purple",
    "Yellow",
    "Orange",
    "White",
    "Black"
  ],
  fortune: [100, 200, 300, 400, 500, 600],
  home: [
    "Crait",
    "Tatooine",
    "Hoth",
    "Endor",
    "Jakku",
    "Death Star",
    "Cloud City"
  ],
  transportation: [
    "A-Wing",
    "X-Wing",
    "Y-Wing",
    "Tie Fighter",
    "Star Destroyer",
    "Millenium Falcon"
  ]
};

/**
 * Actions
 **/
const addFilter = (name, value) => {
  return {
    type: "ADD_FILTER",
    name,
    value
  };
};

const removeFilter = (name, value) => {
  return {
    type: "REMOVE_FILTER",
    name,
    value
  };
};

const clearFilters = () => {
  return {
    type: "CLEAR_FILTERS"
  };
};

const setPage = page => {
  return {
    type: "SET_PAGE",
    page
  };
};

const setContent = entries => {
  return {
    type: "SET_CONTENT",
    entries
  };
};

/**
 * Reducers
 **/
const filters = (state = { filters: {} }, action) => {
  switch (action.type) {
    case "ADD_FILTER":
      let currentAddFilter =
        state.filters[action.name] && state.filters[action.name].length
          ? state.filters[action.name]
          : [];
      currentAddFilter.push(action.value);
      const newAddState = Object.assign({}, state.filters, {
        [action.name]: currentAddFilter
      });
      return Object.assign({}, state, { filters: newAddState });
    case "REMOVE_FILTER":
      let currentRemoveFilter =
        state.filters[action.name] && state.filters[action.name].length
          ? state.filters[action.name]
          : [];
      currentRemoveFilter = _.pull(currentRemoveFilter, action.value);

      const newRemoveState = Object.assign({}, state.filters, {
        [action.name]: currentRemoveFilter
      });
      return Object.assign({}, state, { filters: newRemoveState });
    case "CLEAR_FILTERS":
      return Object.assign({}, state, { filters: {} });
    default:
      return state;
  }
};

const pagination = (state = { page: 1 }, action) => {
  switch (action.type) {
    case "SET_PAGE":
      return Object.assign({}, state, { page: action.page });
    default:
      return state;
  }
};

const content = (state = { entries: [] }, action) => {
  switch (action.type) {
    case "SET_CONTENT":
      return Object.assign({}, state, { entries: action.entries });
    default:
      return state;
  }
};

const reducers = combineReducers({
  filters,
  pagination,
  content
});

/**
 * Components - Filters
 **/
const Filters = class Filters extends React.Component {
  updateFilter(name, e) {
    if (e.target.checked) {
      this.props.addFilter(name, e.target.value);
    } else {
      this.props.removeFilter(name, e.target.value);
    }
    
    this.props.resetPage();
  }

  render() {
    return (
      <div className="filters">
        <header className="filters__header">
          <h2 className="filters__header__title">Filters</h2>
        </header>
        <div className="filters__inner">
          {Object.keys(entryAttr)
            .filter(attr => attr !== "name")
            .map((attr, i) => {
              return (
                <div key={`filter-${i}`} className="filters__filter">
                  <h3 className="filters__filter__title">{attr}</h3>
                  <ul>
                    {entryAttr[attr].map((attrValue, attrValueKey) => {
                      const inputId = _.snakeCase(attr + attrValue);
                      const checked = this.props.filters[attr]
                        ? this.props.filters[attr].includes(attrValue.toString())
                        : false;
                      return (
                        <li key={`${attrValue}-${attrValueKey}`}>
                          <input
                            type="checkbox"
                            id={inputId}
                            value={attrValue}
                            name={attrValue}
                            checked={checked}
                            onChange={e => {
                              this.updateFilter(attr, e);
                            }}
                          />
                          <label htmlFor={inputId}>{attrValue}</label>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
        </div>
      </div>
    );
  }
};

const FiltersMapStateToProps = state => {
  return {
    filters: state.filters.filters
  };
};

const FiltersMapDispatchToProps = dispatch => {
  return {
    addFilter: (name, value) => {
      dispatch(addFilter(name, value));
    },
    removeFilter: (name, value) => {
      dispatch(removeFilter(name, value));
    },
    resetPage: () => {
      dispatch(setPage(1));
    }
  };
};

const FiltersContainer = connect(
  FiltersMapStateToProps,
  FiltersMapDispatchToProps
)(Filters);

/**
 * Components - Filter Bubbles
 **/
const FilterBubbles = class FilterBubbles extends React.Component {
  render() {
    const allFilters = Object.keys(
      this.props.filters
    ).reduce((filters, filterKey) => {
      if (this.props.filters[filterKey]) {
        this.props.filters[filterKey].forEach(filter => {
          filters.push({
            name: filterKey,
            value: filter
          });
        });
      }
      return filters;
    }, []);
    return (
      <ul className="filter-bubbles">
        {allFilters.map(filter => {
          const filterId = _.snakeCase(`filter-${filter.name}-${filter.value}`);
          return (
            <li key={filterId}>
              <span>{filter.name}: </span>
              {filter.value}
              <button
                type="button"
                onClick={e => {
                  this.props.removeFilter(filter.name, filter.value);
                }}
              >
                +
              </button>
            </li>
          );
        })}
        {!!allFilters.length && (
          <li className="filters-bubbles__clear-all">
            <button type="button" onClick={this.props.clearFilters}>
              Clear All
            </button>
          </li>
        )}
      </ul>
    );
  }
};

const FilterBubbleMapStateToProps = state => {
  return {
    filters: state.filters.filters
  };
};

const FilterBubbleMapDispatchToProps = dispatch => {
  return {
    removeFilter: (name, value) => {
      dispatch(setPage(1));
      dispatch(removeFilter(name, value));
    },
    clearFilters: () => {
      dispatch(setPage(1));
      dispatch(clearFilters());
    }
  };
};

const FilterBubblesContainer = connect(
  FilterBubbleMapStateToProps,
  FilterBubbleMapDispatchToProps
)(FilterBubbles);

/**
 * Components - Pagination
 **/
const Pagination = class Pagination extends React.Component {
  render() {
    if (this.props.entries.length <= ENTRIES_PER_PAGE) {
      return (null);
    }
    
    const pages = this.props.entries.length / ENTRIES_PER_PAGE + 1;
    const displayPages = pages > 10 ? 10 : pages;
    const displayMin = pages > 10
      ? this.props.page - 5 < 1
        ? 1
        : this.props.page - 5
      : 1;
    const displayMax = pages > 10
      ? this.props.page + 5 > pages
        ? pages
        : this.props.page + 5 < displayMin + 10
          ? displayMin + 10
          : this.props.page + 5
      : displayPages;

    return (
      <ul className="pagination">
        <li>
          <button
            type="button"
            className='--prev'
            onClick={e => {
              this.props.setPage(this.props.page - 1);
            }}
            disabled={this.props.page - 1 <= 0}
            >
            Prev
          </button>
        </li>
        {_.range(
          displayMin,
          displayMax
        ).map((page, i) => {
          return (
            <li>
              <button
                type="button"
                className={`${page === this.props.page ? "--active" : ""}`}
                onClick={e => {
                  this.props.setPage(page);
                }}
              >
                {page}
              </button>
            </li>
          );
        })}
        <li>
          <button
            type="button"
            className='--next'
            onClick={e => {
              this.props.setPage(this.props.page + 1);
            }}
            disabled={this.props.page + 1 >= this.props.entries.length / ENTRIES_PER_PAGE}
            >
            Next
          </button>
        </li>
      </ul>
    );
  }
};

const PaginationMapStateToProps = state => {
  return {
    page: state.pagination.page
  };
};

const PaginationMapDispatchToProps = dispatch => {
  return {
    setPage: page => {
      dispatch(setPage(page));
    }
  };
};

const PaginationContainer = connect(
  PaginationMapStateToProps,
  PaginationMapDispatchToProps
)(Pagination);

/**
 * Components - Body
 **/
const Body = class Body extends React.Component {
  filterEntries() {
    if (_.isEmpty(this.props.filters)) {
      return this.props.entries;
    }

    return this.props.entries.filter(entry => {
      let matchFilters = true;
      Object.keys(this.props.filters).forEach(filterKey => {
        if (this.props.filters[filterKey].length) {
          matchFilters = this.props.filters[filterKey].includes(
            entry[filterKey].toString()
          )
            ? matchFilters
            : false;
        }
      });
      return matchFilters;
    });
  }

  render() {
    const paginationOffset = (this.props.page - 1) * ENTRIES_PER_PAGE;
    const entries = this.filterEntries();
    const paginatedEntries = entries.slice(
      paginationOffset,
      paginationOffset + ENTRIES_PER_PAGE
    );

    return (
      <section className="body">
        <header className="body__header">
          <h2 className="body__header__title">Entries ({paginationOffset + 1}-{paginationOffset + paginatedEntries.length} of {entries.length})</h2>
        </header>
        <FilterBubblesContainer />
        <table>
          <thead>
            <tr>
              {Object.keys(entryAttr).map((attr, i) => (
                <th key={`heading-${i}`}>{attr}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedEntries.map(entry => {
              return (
                <tr key={`row-${entry.id}`}>
                  {Object.keys(entryAttr).map((attr, k) => (
                    <td key={`col-${entry.id}-${k}`}>{entry[attr]}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
        <PaginationContainer entries={entries} />
      </section>
    );
  }
};

const BodyMapStateToProp = state => {
  return {
    filters: state.filters.filters,
    page: state.pagination.page,
    entries: state.content.entries
  };
};

const BodyContainer = connect(BodyMapStateToProp)(Body);

/**
 * Components - App
 **/
const App = class App extends React.Component {
  componentWillMount() {
    this.props.setContent(this.getEntries());
  }

  getEntries() {
    const entries = [];
    for (let i = 0; i < DATA_ENTRIES; i++) {
      const entry = { id: i };

      Object.keys(entryAttr).forEach(attr => {
        entry[attr] =
          entryAttr[attr][Math.floor(Math.random() * entryAttr[attr].length)];
      });

      entries.push(entry);
    }
    return entries;
  }

  render() {
    return (
      <main className="app">
        <FiltersContainer />
        <BodyContainer />
      </main>
    );
  }
};

const AppMapStateToProps = state => {
  return {
    entries: state.content.entries
  };
};

const AppMapDispatchToProps = dispatch => {
  return {
    setContent: entries => {
      dispatch(setContent(entries));
    }
  };
};

const AppContainer = connect(AppMapStateToProps, AppMapDispatchToProps)(App);

const store = createStore(reducers);

ReactDOM.render(
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  document.getElementById("app")
);
