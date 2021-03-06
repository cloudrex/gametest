import Entity from "./entity";

export default class Drawer {
    protected readonly $: CanvasRenderingContext2D;

    protected entity: Entity;

    public constructor(context: CanvasRenderingContext2D, entity: Entity) {
        this.$ = context;
        this.entity = entity;
    }

    public rect(): this {
        this.$.fillStyle = this.entity.color;
        this.$.fillRect(this.entity.pos.x, this.entity.pos.y, this.entity.size.x, this.entity.size.y);

        return this;
    }

    /**
     * Draw a circle based off the source entity. The radius is determined by the entity's width.
     */
    public circle(): this {
        this.$.fillStyle = this.entity.color;
        this.$.beginPath();
        this.$.arc(this.entity.pos.x, this.entity.pos.y, this.entity.size.x, 0, Math.PI * 2);
        this.$.fill();

        return this;
    }
}
