export class Property {
    /** Name */
    label: string;
    /** Primary Key */
    primaryKey: boolean;

    /** Derived */
    isDerived: boolean;

    get borderStyle(): string {
        return this.isDerived ? "dashed" : "solid";
    }

    get color(): string {
        return this.primaryKey ? "red" : "yellow";
    }
}

export class Propertied {
}

export class BasicProperty extends Property {
    /** Name */
    label: string;
    /** Primary Key */
    primaryKey: boolean;
    /** Data Type */
    dataType: "INTEGER" | "REAL" | "DATE";
    get color(): string {
        return this.primaryKey ? "red" : "yellow";
    }

    /** Derived */
    isDerived: boolean;

    get borderStyle(): string {
        return this.isDerived ? "dashed" : "solid";
    }
}

export class VarCharProp extends Property {
    /** Name */
    label: string;
    /** Primary Key */
    primaryKey: boolean;
    maxLength: number;
    get color(): string {
        return this.primaryKey ? "red" : "yellow";
    }

    /** Derived */
    isDerived: boolean;

    get borderStyle(): string {
        return this.isDerived ? "dashed" : "solid";
    }
}

export class Entity extends Propertied {
    /** Name */
    label: string;

    get shape() {
        return "rectangle";
    }
}

export class Relation extends Propertied {
    /** Name */
    label: string;

    get shape() {
        return "image";
    }

    get image() {
        return "diamond.svg";
    }
}

export class ISANode {
    covering: boolean;

    get label() {
        return "ISA";
    }

    get shape() {
        return "image";
    }

    get image() {
        return "triangle.svg";
    }
}

export class ISASuper {
    source: Entity;
    destination: ISANode;

    get showDestinationArrow() {
        return false;
    }
}

export class ISAChild {
    source: ISANode;
    destination: Entity;

    get showDestinationArrow() {
        return false;
    }
}

export type Nodes = BasicProperty | VarCharProp | Entity | Relation | ISANode;

export class RelationEdge {
    source: Entity;
    destination: Relation;

    /** Many allowed */
    isMany: boolean = true;

    /** Total participation */
    required: boolean = false;

    get showDestinationArrow() {
        return !this.isMany;
    }

    get lineStyle(): string {
        return this.required ? "thick" : "thin";
    }
}

export class PropertyEdge {
    source: Entity | Relation;
    destination: Property;

    get showDestinationArrow() {
        return false;
    }
}

export type Edges = RelationEdge | PropertyEdge | ISASuper | ISAChild;

export class Graph {
    nodes: Nodes[];
}

export class State {
}

export function start(input: Graph, other: boolean): State | boolean {
    return true;
}

export function step(state: State): State | boolean {
    return true;
}

type EdgePred = (src?: Nodes, dst?: Nodes, like?: Edges) => boolean;

function rejectPred(src?: Nodes, dst?: Nodes, like?: Edges): boolean {
    return false;
}

class GraphType {
    private predicate: EdgePred;

    constructor() {
        this.predicate = (src, dst, like) => true;
    }

    private compose(pred: EdgePred) {
        const old = this.predicate;
        this.predicate = (src, dst, like) => old(src, dst, like) && pred(src, dst, like);
    }

    addEdge(edge: any, source: any, dest: any) {
        this.compose((src, dst, like) => {
            if (like instanceof edge) {
                return src instanceof source && dst instanceof dest;
            } else {
                return true;
            }
        });
    }

    run(src?: Nodes, dst?: Nodes, like?: Edges) {
        return this.predicate(src, dst, like);
    }
}


const checker = new GraphType();
checker.addEdge(ISASuper, Entity, ISANode);
checker.addEdge(ISAChild, ISANode, Entity);
checker.addEdge(RelationEdge, Entity, Relation);
checker.addEdge(PropertyEdge, Propertied, Property);

/*
export function validateEdge(src?: Nodes, dst?: Nodes, like?: Edges) {
    console.log(like);
    return checker.run(src, dst, like);
}
*/