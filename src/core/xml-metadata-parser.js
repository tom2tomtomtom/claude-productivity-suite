/**
 * XML Metadata Parser for .md Command Files
 * Extracts XML metadata from markdown command files for intelligent processing
 */

const fs = require('fs').promises;
const path = require('path');

class XMLMetadataParser {
  constructor() {
    this.xmlTagRegex = /<(\w+)([^>]*)>([\s\S]*?)<\/\1>/g;
    this.attributeRegex = /(\w+)=["']([^"']*)["']/g;
  }

  /**
   * Parse XML metadata from markdown content
   * @param {string} content - Markdown content with XML blocks
   * @returns {Object} Parsed metadata structure
   */
  parseXMLMetadata(content) {
    const metadata = {
      command_meta: null,
      workflow_steps: [],
      error_scenarios: [],
      validation_gates: [],
      ai_meta: null
    };

    // Find all XML blocks in the content
    let match;
    while ((match = this.xmlTagRegex.exec(content)) !== null) {
      const [fullMatch, tagName, attributes, innerContent] = match;
      
      try {
        const parsedContent = this.parseXMLContent(tagName, innerContent, attributes);
        
        switch (tagName) {
          case 'command_meta':
            metadata.command_meta = parsedContent;
            break;
          case 'workflow_steps':
            metadata.workflow_steps = this.parseWorkflowSteps(innerContent);
            break;
          case 'error_scenarios':
            metadata.error_scenarios = this.parseErrorScenarios(innerContent);
            break;
          case 'validation_gates':
            metadata.validation_gates = this.parseValidationGates(innerContent);
            break;
          case 'ai_meta':
            metadata.ai_meta = parsedContent;
            break;
        }
      } catch (error) {
        console.warn(`Failed to parse XML block <${tagName}>:`, error.message);
      }
    }

    // Reset regex state
    this.xmlTagRegex.lastIndex = 0;
    
    return metadata;
  }

  /**
   * Parse XML content with nested structure
   * @param {string} tagName - XML tag name
   * @param {string} content - Inner XML content
   * @param {string} attributes - Tag attributes
   * @returns {Object} Parsed content
   */
  parseXMLContent(tagName, content, attributes) {
    const result = {};
    
    // Parse attributes
    if (attributes) {
      result.attributes = this.parseAttributes(attributes);
    }

    // Parse nested XML tags
    const nestedTags = this.extractNestedTags(content);
    if (nestedTags.length > 0) {
      nestedTags.forEach(({ tag, content: tagContent, attributes: tagAttrs }) => {
        if (!result[tag]) {
          result[tag] = [];
        }
        result[tag].push({
          content: tagContent.trim(),
          attributes: this.parseAttributes(tagAttrs || '')
        });
      });
    }

    // If no nested tags, store content directly
    if (Object.keys(result).length === 1 && result.attributes) {
      result.content = content.trim();
    } else if (Object.keys(result).length === 0) {
      return content.trim();
    }

    return result;
  }

  /**
   * Parse workflow steps from XML content
   * @param {string} content - Workflow steps XML content
   * @returns {Array} Array of workflow step objects
   */
  parseWorkflowSteps(content) {
    const steps = [];
    const stepRegex = /<step([^>]*)>([\s\S]*?)<\/step>/g;
    
    let match;
    while ((match = stepRegex.exec(content)) !== null) {
      const [, attributes, stepContent] = match;
      const stepAttrs = this.parseAttributes(attributes);
      
      const step = {
        number: stepAttrs.number ? parseInt(stepAttrs.number) : null,
        name: stepAttrs.name || null,
        ...stepAttrs
      };

      // Parse nested elements in step
      const nestedElements = this.extractNestedTags(stepContent);
      nestedElements.forEach(({ tag, content: elemContent }) => {
        step[tag] = elemContent.trim();
      });

      steps.push(step);
    }

    stepRegex.lastIndex = 0;
    return steps.sort((a, b) => (a.number || 0) - (b.number || 0));
  }

  /**
   * Parse error scenarios from XML content
   * @param {string} content - Error scenarios XML content
   * @returns {Array} Array of error scenario objects
   */
  parseErrorScenarios(content) {
    const scenarios = [];
    const scenarioRegex = /<scenario([^>]*)>([\s\S]*?)<\/scenario>/g;
    
    let match;
    while ((match = scenarioRegex.exec(content)) !== null) {
      const [, attributes, scenarioContent] = match;
      const scenarioAttrs = this.parseAttributes(attributes);
      
      const scenario = {
        name: scenarioAttrs.name || null,
        ...scenarioAttrs
      };

      // Parse nested elements
      const nestedElements = this.extractNestedTags(scenarioContent);
      nestedElements.forEach(({ tag, content: elemContent }) => {
        if (tag === 'action') {
          // Parse action as numbered list
          scenario.action = this.parseActionList(elemContent);
        } else {
          scenario[tag] = elemContent.trim();
        }
      });

      scenarios.push(scenario);
    }

    scenarioRegex.lastIndex = 0;
    return scenarios;
  }

  /**
   * Parse validation gates from XML content
   * @param {string} content - Validation gates XML content
   * @returns {Array} Array of validation gate objects
   */
  parseValidationGates(content) {
    const gates = [];
    const gateRegex = /<gate([^>]*)>([\s\S]*?)<\/gate>/g;
    
    let match;
    while ((match = gateRegex.exec(content)) !== null) {
      const [, attributes, gateContent] = match;
      const gateAttrs = this.parseAttributes(attributes);
      
      const gate = {
        name: gateAttrs.name || null,
        ...gateAttrs
      };

      // Parse checks within gate
      const checksRegex = /<checks>([\s\S]*?)<\/checks>/;
      const checksMatch = checksRegex.exec(gateContent);
      if (checksMatch) {
        gate.checks = this.parseChecksList(checksMatch[1]);
      }

      gates.push(gate);
    }

    gateRegex.lastIndex = 0;
    return gates;
  }

  /**
   * Extract nested XML tags from content
   * @param {string} content - Content to parse
   * @returns {Array} Array of nested tag objects
   */
  extractNestedTags(content) {
    const tags = [];
    const tagRegex = /<(\w+)([^>]*?)>([\s\S]*?)<\/\1>/g;
    
    let match;
    while ((match = tagRegex.exec(content)) !== null) {
      const [, tagName, attributes, tagContent] = match;
      tags.push({
        tag: tagName,
        content: tagContent,
        attributes
      });
    }

    tagRegex.lastIndex = 0;
    return tags;
  }

  /**
   * Parse XML attributes string
   * @param {string} attributesStr - Attributes string
   * @returns {Object} Parsed attributes
   */
  parseAttributes(attributesStr) {
    const attributes = {};
    let match;
    
    while ((match = this.attributeRegex.exec(attributesStr)) !== null) {
      const [, name, value] = match;
      attributes[name] = value;
    }

    this.attributeRegex.lastIndex = 0;
    return attributes;
  }

  /**
   * Parse action list from text content
   * @param {string} content - Action content
   * @returns {Array} Array of action items
   */
  parseActionList(content) {
    const lines = content.split('\n').map(line => line.trim()).filter(line => line);
    const actions = [];
    
    lines.forEach(line => {
      // Match numbered list items (1. 2. etc.)
      const numberMatch = line.match(/^\d+\.\s*(.+)$/);
      if (numberMatch) {
        actions.push(numberMatch[1].trim());
      } else if (line.length > 0) {
        actions.push(line);
      }
    });

    return actions;
  }

  /**
   * Parse checks list from content
   * @param {string} content - Checks content
   * @returns {Array} Array of check items
   */
  parseChecksList(content) {
    const lines = content.split('\n').map(line => line.trim()).filter(line => line);
    const checks = [];
    
    lines.forEach(line => {
      // Match checkbox items (- [ ] or - [x])
      const checkMatch = line.match(/^-\s*\[\s*([x ]?)\s*\]\s*(.+)$/);
      if (checkMatch) {
        checks.push({
          checked: checkMatch[1].toLowerCase() === 'x',
          text: checkMatch[2].trim()
        });
      } else if (line.startsWith('- ')) {
        checks.push({
          checked: false,
          text: line.substring(2).trim()
        });
      }
    });

    return checks;
  }

  /**
   * Validate XML metadata structure
   * @param {Object} metadata - Parsed metadata
   * @returns {Object} Validation result
   */
  validateMetadata(metadata) {
    const validation = {
      isValid: true,
      errors: [],
      warnings: []
    };

    // Check for required command_meta
    if (!metadata.command_meta) {
      validation.warnings.push('No command_meta found - using defaults');
    }

    // Validate workflow steps
    if (metadata.workflow_steps && metadata.workflow_steps.length > 0) {
      metadata.workflow_steps.forEach((step, index) => {
        if (!step.name) {
          validation.warnings.push(`Workflow step ${index + 1} missing name`);
        }
        if (!step.command) {
          validation.errors.push(`Workflow step ${index + 1} missing command`);
          validation.isValid = false;
        }
      });
    }

    return validation;
  }
}

module.exports = { XMLMetadataParser };