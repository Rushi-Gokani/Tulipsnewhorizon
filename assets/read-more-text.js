class ReadMoreText extends HTMLElement {
  constructor() {
    super();
    this.limit = parseInt(this.dataset.limit) || 25;
    this.content = this.querySelector('.read-more-content');
    if (!this.content) return;

    this.expanded = false;
    
    // Create truncated version without an extra wrapping div
    this.truncatedContent = this.truncateNode(this.content, this.limit);
    this.truncatedContent.classList.add('read-more-truncated');

    // Create inline toggles
    this.toggleMore = document.createElement('a');
    this.toggleMore.className = 'read-more-toggle inline-toggle';
    this.toggleMore.textContent = 'read more';
    this.toggleMore.href = '#';
    this.toggleMore.addEventListener('click', this.toggle.bind(this));

    this.toggleLess = document.createElement('a');
    this.toggleLess.className = 'read-more-toggle inline-toggle';
    this.toggleLess.textContent = 'read less';
    this.toggleLess.href = '#';
    this.toggleLess.addEventListener('click', this.toggle.bind(this));

    // Append toggles
    this.appendToLastElement(this.truncatedContent, this.toggleMore);
    this.appendToLastElement(this.content, this.toggleLess);

    // Hide full content initially
    this.content.style.display = 'none';
    
    // Insert truncated content
    this.insertBefore(this.truncatedContent, this.content);
  }

  appendToLastElement(container, el) {
    const all = container.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, li');
    let target = container;
    for (let i = all.length - 1; i >= 0; i--) {
       if (all[i].textContent.trim().length > 0) {
          target = all[i];
          break;
       }
    }
    target.appendChild(document.createTextNode('\u00A0...'));
    target.appendChild(el);
  }

  toggle(e) {
    if (e) e.preventDefault();
    this.expanded = !this.expanded;
    if (this.expanded) {
      this.truncatedContent.style.display = 'none';
      this.content.style.display = 'block';
    } else {
      this.truncatedContent.style.display = 'block';
      this.content.style.display = 'none';
    }
  }

  truncateNode(node, maxWords) {
    let wordsCount = 0;
    const clone = node.cloneNode(true);
    
    function walk(n) {
      if (wordsCount >= maxWords) {
        if (n.nodeType === 3) {
          n.textContent = '';
        } else if (n.nodeType === 1) {
          n.innerHTML = '';
        }
        return;
      }
      
      if (n.nodeType === 3) { // Text node
        const text = n.textContent;
        // Split by whitespace properly, accounting for spaces
        const matches = text.match(/\S+|\s+/g);
        if (!matches) return;
        
        let newText = '';
        for (const token of matches) {
          if (/\S/.test(token)) { // it's a word
            if (wordsCount < maxWords) {
              newText += token;
              wordsCount++;
              if (wordsCount === maxWords) {
                newText += '...';
                break;
              }
            }
          } else { // it's whitespace
             if (wordsCount < maxWords) {
                newText += token;
             }
          }
        }
        n.textContent = newText;
      } else if (n.nodeType === 1) { // Element node
        const children = Array.from(n.childNodes);
        for (const child of children) {
           if (wordsCount >= maxWords) {
              child.remove();
           } else {
              walk(child);
           }
        }
      }
    }
    
    walk(clone);
    return clone;
  }
}

if (!customElements.get('read-more-text')) {
  customElements.define('read-more-text', ReadMoreText);
}
