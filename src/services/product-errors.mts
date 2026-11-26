export class ProductNotFoundError extends Error {
    constructor() {
        super("Product not found");
        this.name = "ProductNotFoundError";
    }
}

export class ProductNameConflictError extends Error {
    constructor() {
        super("A product with this name already exists");
        this.name = "ProductNameConflictError";
    }
}

export class ProductChangedError extends Error {
    constructor() {
        super("Product changed during update; fetch it again before retrying");
        this.name = "ProductChangedError";
    }
}
