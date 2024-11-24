import type { IObjectScope, IScope, ITimeScope, Property, Statement, StatementType } from "./types";

export abstract class Scope implements IScope {
    
    public constructor(public readonly name: string) { }
}

export class ObjectScope extends Scope implements IObjectScope {
    public properties: Property[] = [];

    public constructor(name: string) {
        super(name);
    }

    public addProperty(key: string, value: string): void {
        this.properties.push({ key, value });
    }
}

export class TimeScope extends Scope implements ITimeScope {
    public statements: Statement[] = [];

    public constructor(name: string) {
        super(name);
    }

    public addStatement(verb: StatementType, args: string[]): void {
        this.statements.push({ verb, args });
    }
}
