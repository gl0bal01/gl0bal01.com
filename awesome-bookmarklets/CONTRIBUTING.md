# 🤝 Contributing to Awesome Bookmarklets

Thank you for your interest in contributing! This guide will help you get started with contributing to our bookmarklets collection.

## 🎯 Ways to Contribute

- 🐛 **Report Bugs**: Found a bookmarklet that doesn't work? Let us know!
- 💡 **Suggest Ideas**: Have an idea for a useful bookmarklet? Share it!
- 🔧 **Submit Code**: Create new bookmarklets or improve existing ones
- 📖 **Improve Docs**: Help make our documentation clearer
- 🎨 **Add Assets**: Create icons, screenshots, or demo GIFs

## 📋 Submission Guidelines

### 🔧 Creating a New Bookmarklet

1. **Choose the Right Category**
   - `development/` - Developer tools, debugging, code analysis
   - `productivity/` - Time-saving tools, workflow enhancement
   - `security/` - Security analysis, privacy tools
   - `accessibility/` - Accessibility testing and improvement
   - `social-media/` - Social platform enhancements
   - `fun/` - Entertainment, visual effects, games

2. **Follow the File Template**
   ```javascript
   /*!
    * Bookmarklet: [Descriptive Name]
    * Description: [Clear, concise description]
    * Version: 1.0.0
    * Author: [Your Name]
    * Category: [category-name]
    * Tags: [comma, separated, tags]
    * Compatibility: all-browsers | chrome-only | firefox-only
    * Last Updated: [YYYY-MM-DD]
    */

   /**
    * [DETAILED DESCRIPTION]
    * 
    * Features:
    * - [Feature 1]
    * - [Feature 2]
    * 
    * Usage:
    * [How to use the bookmarklet]
    */

   (function() {
       'use strict';
       
       // Configuration
       const CONFIG = {
           version: '1.0.0',
           name: '[Bookmarklet Name]'
       };
       
       // Check if already running
       if (window.[uniqueGlobalVariable]) {
           alert('[Name] is already running!');
           return;
       }
       
       // Your code here
       
   })();

   /* 
   BOOKMARKLET CODE (copy this entire line for bookmark URL):
   javascript:[minified-code-here]
   */
   ```

3. **Code Quality Standards**
   - Use strict mode (`'use strict';`)
   - Wrap in IIFE to avoid global pollution
   - Include error handling with try/catch
   - Add version checking to prevent double-loading
   - Use descriptive variable names
   - Include comprehensive comments
   - Test across multiple browsers
   - Ensure mobile compatibility when possible

4. **Required Elements**
   - Header comment with metadata
   - Detailed description and features list
   - Well-structured, readable source code
   - Minified bookmarklet code at the bottom
   - Error handling for edge cases
   - User-friendly feedback (alerts, notifications)

### 📐 Technical Requirements

**Browser Compatibility:**
- Must work in Chrome, Firefox, Safari, Edge
- Graceful degradation for unsupported features
- No external dependencies (unless absolutely necessary)

**Performance:**
- Minimize DOM manipulation
- Use efficient selectors
- Debounce/throttle expensive operations
- Clean up resources on exit

**User Experience:**
- Clear visual feedback
- Intuitive controls
- Escape key should exit tool
- Non-destructive to original page
- Provide undo/reset functionality when appropriate

**Security:**
- No external script loading (except from trusted CDNs)
- Sanitize user input
- No localStorage of sensitive data
- Respect Content Security Policy when possible

### 🎨 Visual Guidelines

**UI Design:**
- Use consistent color scheme across tools
- Ensure sufficient contrast for accessibility
- Responsive design for different screen sizes
- Clean, minimal interface
- Clear typography and spacing

**Icons and Images:**
- SVG format preferred for icons
- Consistent style and color palette
- 64x64px for standard icons
- Optimize file sizes
- Include alt text for accessibility

## 📝 Submission Process

### 1. Fork and Clone
```bash
git clone https://github.com/your-username/awesome-bookmarklets.git
cd awesome-bookmarklets
```

### 2. Create Feature Branch
```bash
git checkout -b feature/new-bookmarklet-name
```

### 3. Develop and Test
- Write your bookmarklet following the guidelines
- Test on multiple browsers and websites
- Create screenshots/demos if applicable
- Update relevant documentation

### 4. Commit Changes
```bash
git add .
git commit -m "Add [bookmarklet-name]: [brief description]"
```

### 5. Push and Create PR
```bash
git push origin feature/new-bookmarklet-name
```
Then create a Pull Request with:
- Clear title and description
- List of changes made
- Screenshots/GIFs of functionality
- Testing notes

## ✅ Pull Request Checklist

Before submitting, ensure:

**Code Quality:**
- [ ] Follows the file template structure
- [ ] Includes comprehensive comments
- [ ] Has proper error handling
- [ ] Uses consistent naming conventions
- [ ] Includes minified bookmarklet code

**Testing:**
- [ ] Tested in Chrome, Firefox, Safari
- [ ] Works on different websites
- [ ] Handles edge cases gracefully
- [ ] No console errors
- [ ] Performance is acceptable

**Documentation:**
- [ ] Updated category README if needed
- [ ] Added clear description and features
- [ ] Included usage instructions
- [ ] Added screenshots/demos (if applicable)

**Assets:**
- [ ] Created appropriate icons
- [ ] Added demo screenshots/GIFs
- [ ] Optimized image file sizes
- [ ] Followed naming conventions

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Bookmarklet name and version**
2. **Browser and version**
3. **Operating system**
4. **Website where issue occurred**
5. **Steps to reproduce**
6. **Expected vs actual behavior**
7. **Console errors (if any)**
8. **Screenshots (if helpful)**

## 💡 Feature Requests

For feature requests:

1. **Check existing issues** first
2. **Describe the problem** you're trying to solve
3. **Propose a solution** or desired functionality
4. **Explain the use case** and target audience
5. **Consider implementation complexity**

## 📞 Getting Help

- **Documentation**: Check the [docs/](docs/) folder
- **Discussions**: Use GitHub Discussions for questions
- **Issues**: Open an issue for bugs or feature requests
- **Email**: [your-email@example.com] for private matters

## 🎖️ Recognition

Contributors will be:
- Added to the main README contributors list
- Credited in their bookmarklet's header
- Mentioned in release notes
- Given appropriate GitHub repository permissions

## 📜 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Keep discussions focused and productive
- Report inappropriate behavior

Thank you for contributing to make the web a more powerful place! 🚀