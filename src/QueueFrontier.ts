export class QueueFrontier {
    private frontier: any[];

    public static of(arr:any[]) {
        return new QueueFrontier(arr);
    }

    public add (elem: any) {
        return this.frontier.unshift(elem);
    }

    public remove () {
        return this.frontier.pop();
    }

    public inFrontier(key:string, value:any) {
        if (this.size() > 0) {
            for (const el of this.frontier) {
                if (Object.keys(el as Object).includes(key) && Object.values(el).includes(value)) {
                    return true;
                }
            }
            return false;
        }
    }

    public size() {
        return this.frontier.length;
    }
    constructor(...args: any[]) {
        this.frontier = [...args];
    }

}
