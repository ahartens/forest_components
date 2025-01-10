export class DraggableCircle {
    constructor({
        svg,
        initialX = 0,
        initialY = 0,
        radius = 10,
        fill = "steelblue",
        activeColor = "red",
        minX = 0,
        maxX = 100,
        onDragStart = null,
        onDrag = null,
        onDragEnd = null,
        onClick = null
    } = {}) {
        this.svg = svg;
        this.x = initialX;
        this.y = initialY;
        this.radius = radius;
        this.fill = fill;
        this.activeColor = activeColor;
        this.bounds = { minX, maxX };
        
        // Callbacks
        this.onDragStart = onDragStart;
        this.onDrag = onDrag;
        this.onDragEnd = onDragEnd;
        this.onClick = onClick;

        this.isDragging = false;
        
        this.init();
    }

    init() {
        // Create drag behavior
        this.dragBehavior = d3.drag()
            .on('start', (event) => this.handleDragStart(event))
            .on('drag', (event) => this.handleDrag(event))
            .on('end', (event) => this.handleDragEnd(event));

        // Create and configure the circle
        this.circle = this.svg.append('circle')
            .attr('cx', this.x)
            .attr('cy', this.y)
            .attr('r', this.radius)
            .attr('fill', this.fill)
            .style('cursor', 'pointer')
            .call(this.dragBehavior)
            .on('click', (event) => this.handleClick(event))
            .on('mouseover', () => this.circle.attr('fill', this.activeColor))
            .on('mouseout', () => {
                if (!this.isDragging) {
                    this.circle.attr('fill', this.fill);
                }
            });
    }

    handleDragStart(event) {
        this.isDragging = true;
        this.circle.attr('fill', this.activeColor);
        if (this.onDragStart) {
            this.onDragStart(this.x, this.y);
        }
    }

    handleDrag(event) {
        if (!this.isDragging) return;

        // Calculate new position within bounds
        const newX = Math.max(
            this.bounds.minX,
            Math.min(this.bounds.maxX, event.x)
        );

        this.x = newX;
        this.y = this.y; // Keep Y position constant

        // Update circle position
        this.circle
            .attr('cx', this.x)
            .attr('cy', this.y);

        if (this.onDrag) {
            this.onDrag(this.x, this.y);
        }
    }

    handleDragEnd(event) {
        this.isDragging = false;
        this.circle.attr('fill', this.fill);
        if (this.onDragEnd) {
            this.onDragEnd(this.x, this.y);
        }
    }

    handleClick(event) {
        // Only trigger click if it wasn't a drag
        if (!this.isDragging && this.onClick) {
            this.onClick(this.x, this.y);
        }
    }

    // Public methods to update circle properties
    setPosition(x, y) {
        this.x = Math.max(this.bounds.minX, Math.min(this.bounds.maxX, x));
        this.y = y;
        this.circle
            .attr('cx', this.x)
            .attr('cy', this.y);
    }

    setFill(color) {
        this.fill = color;
        this.circle.attr('fill', color);
    }

    // Method to remove the circle
    destroy() {
        this.circle.remove();
    }
}