export class TabDataModel<T> {

    constructor() { }

    selected: T | undefined = undefined;

    select(tab: T | undefined) {
        this.selected = tab;
    }

}
