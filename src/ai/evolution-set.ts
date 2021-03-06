import AiNode from "./node";
import Entity from "../entity";

export type SpawnCallback = () => AiNode;

export interface EvolutionSetOpts {
    readonly nodesPerGeneration: number;
    readonly evolutionTime: number;
}

const DefaultEvolutionSetOpts: EvolutionSetOpts = {
    evolutionTime: 5000,
    nodesPerGeneration: 50
};

export default class EvolutionSet {
    protected readonly options: EvolutionSetOpts;
    protected readonly nodes: AiNode[];

    protected generation!: number;
    protected interval?: number;

    public constructor(options?: Partial<EvolutionSetOpts>) {
        this.options = {
            ...DefaultEvolutionSetOpts,
            ...options
        };

        this.nodes = [];

        // Apply default property values.
        this.reset();
    }

    public reset(): this {
        this.nodes.length = 0;
        this.generation = 0;

        return this;
    }

    public getGeneration(): number {
        return this.generation;
    }

    public registerNodes(...nodes: AiNode[]): this {
        for (const node of nodes) {
            if (!this.nodes.includes(node)) {
                this.nodes.push(node);
            }
        }

        return this;
    }

    public begin(spawnCallback: SpawnCallback): this {
        // Stop running evolution if applicable.
        this.stop();

        this.interval = setInterval(() => {
            this.nextGeneration(spawnCallback);
        }, this.options.evolutionTime);

        return this;
    }

    public stop(): this {
        if (this.interval !== undefined) {
            clearInterval(this.interval);
        }

        return this;
    }

    protected nextGeneration(spawnCallback: SpawnCallback): this {
        if (this.nodes.length === 0 && this.generation != 0) {
            throw new Error("The evolution set contains no nodes");
        }

        let bestNode: AiNode = null as any;

        for (const node of this.nodes) {
            // Replace existing best node if applicable.
            if (bestNode === null || node.fitness > bestNode.fitness) {
                bestNode = node;
            }

            // Destroy the node.
            node.destroy();
        }

        // TODO: Debugging.
        console.log("Best node:", bestNode);

        // Spawn new wave.
        for (let i: number = 0; i < this.options.nodesPerGeneration; i++) {
            const child: AiNode = spawnCallback();

            if (bestNode != null) {
                child.brain.setInsts(bestNode.brain.getInsts());

                // Mutate child.
                child.brain.mutate();
            }

            this.registerNodes(child);
        }

        return this;
    }
}
