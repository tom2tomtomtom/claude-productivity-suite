/**
 * Component Library
 * Provides UI components and patterns for the frontend specialist
 */

class ComponentLibrary {
  constructor() {
    this.components = new Map();
    this.initializeComponents();
  }

  initializeComponents() {
    // Basic UI components
    this.components.set('button', {
      name: 'Button',
      description: 'Interactive button component',
      variants: ['primary', 'secondary', 'outline'],
      code: '<button class="btn btn-primary">Click me</button>'
    });

    this.components.set('form', {
      name: 'Form',
      description: 'Form input component',
      variants: ['text', 'email', 'password'],
      code: '<form><input type="text" placeholder="Enter text"></form>'
    });

    this.components.set('card', {
      name: 'Card',
      description: 'Content card component',
      variants: ['basic', 'elevated', 'outlined'],
      code: '<div class="card"><div class="card-content">Content here</div></div>'
    });

    this.components.set('navigation', {
      name: 'Navigation',
      description: 'Navigation menu component',
      variants: ['horizontal', 'vertical', 'sidebar'],
      code: '<nav><ul><li><a href="#">Home</a></li></ul></nav>'
    });
  }

  getComponent(name) {
    return this.components.get(name);
  }

  getAllComponents() {
    return Array.from(this.components.values());
  }

  findByCategory(category) {
    return this.getAllComponents().filter(comp => 
      comp.description.toLowerCase().includes(category.toLowerCase())
    );
  }
}

module.exports = { ComponentLibrary };