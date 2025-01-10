export class TableModel {

  constructor(controller) {
    this.controller = controller;

    // Add sorting state
    this.currentSortColumn = null;
    this.sortAscending = true;

    this.items = [];
    this.allitems = [];
    this.allcolumns = [];
    this.columns = [];
    this.sectionHeaderTitle = 'my Songs';

  }

  set_data_and_columns(data, columns, columnClickHandlers) {
    this.items = data;
    this.columns = columns;
    this.columnClickHandlers = columnClickHandlers;

    this.allitems = data;
    this.allcolumns = columns;
    this.allColumnClickHandlers = columnClickHandlers;
  }

  sort_by(column) {
    // Toggle direction if clicking same column
    if (this.currentSortColumn === column.name) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.currentSortColumn = column.name;
      this.sortAscending = true;
    }

    return this._sort(column, this.sortAscending);
  }

  _sort(column, ascending){
    console.log("SORT", column, ascending)
    this.items.sort((a, b) => {
      let valueA = a[column.name];
      let valueB = b[column.name];
      
      // Handle array values (for saved_keys and labels)
      if (Array.isArray(valueA)) {
        valueA = valueA.join(',');
      }
      if (Array.isArray(valueB)) {
        valueB = valueB.join(',');
      }
      
      // Compare values
      if (valueA < valueB) {
        return ascending ? -1 : 1;
      }
      if (valueA > valueB) {
        return ascending ? 1 : -1;
      }
      return 0;
    });
  }

  setSectionHeaderTitle(title) {
    this.sectionHeaderTitle = title;
  }

  applySnapshot(snapshot){
    // create a new array which is a copy of allitems
    this.items = [...this.allitems];
    console.log(this.items, this.allitems)
    console.log(snapshot)
    for (const filter of snapshot.filters){
      // check that item[filter.column] is in array filter.selections
      const column = this.allcolumns.find(column => column.name === filter.column);
      if (column.type == 'multi_select'){
        // if we have a multi_select column, we need to check that each value in the filter.selections is in the item[filter.column] array
        this.items = this.items.filter(item => filter.selections.every(value => item[filter.column].includes(value)));
      } else {
        // else just get items where the single value is in array filter.selections
        this.items = this.items.filter(item => filter.selections.includes(item[filter.column]));
      }
    }
    console.log("APPLY SNAPSHOT", this.items)
    // this.columns = this.allcolumns;

    // go backwards through the sorts
    for (let i = snapshot.sorts.length - 1; i >= 0; i--){
      const sort = snapshot.sorts[i];
      console.log("APPLYING TEH SORT", sort)
      this._sort({'name': sort.column}, sort.ascending);
    }
  }
}
