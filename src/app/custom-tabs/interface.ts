export class TabDataModel<T> {
    
    constructor() { }
  
    selected: T[] = [];
  
    select(tab: T) {
        this.selected.unshift(tab);
    }
    
}
