# Developer Tools - Bug Exchange Marketplace

This document describes the developer tools features implemented in the Bug Exchange Marketplace to enhance the bug reporting and code review experience.

## 🚀 Features Implemented

### 1. Code Syntax Highlighting ✅

- **Automatic language detection** for code submissions
- **Syntax highlighting** using react-syntax-highlighter
- **Copy-to-clipboard** functionality
- **Language selection** in submission forms
- **Real-time preview** while typing code

### 2. Code Diff Viewer ✅

- **Line-by-line comparison** between original bug code and solutions
- **Visual indicators** for additions, deletions, and unchanged lines
- **Line numbers** for easy reference
- **Collapsible interface** to save space
- **Color-coded changes** (green for additions, red for deletions)

### 3. IDE Extensions ✅

- **Browser extension** for GitHub/GitLab integration
- **API endpoints** for extension communication
- **Direct bug reporting** from code repositories
- **Context-aware** bug data collection

---

## 📖 Usage Guide

### Code Syntax Highlighting

#### For Users Submitting Solutions

1. **Select Language**: Choose the programming language from the dropdown
2. **Write Code**: Type your solution in the textarea
3. **Preview**: See syntax highlighting in real-time
4. **Submit**: Your code will be displayed with proper highlighting

#### For Bug Authors

1. **View Submissions**: All solutions are automatically syntax highlighted
2. **Language Detection**: If no language is specified, auto-detection is used
3. **Copy Code**: Click the copy button to copy code to clipboard

### Code Diff Viewer

#### Viewing Changes

1. **Click "View Changes"**: Button appears below each submission
2. **Compare Code**: See line-by-line differences
3. **Understand Changes**: Green lines show additions, red lines show deletions
4. **Line Numbers**: Reference specific lines in discussions

#### Diff Legend

- 🟢 **Green**: New code added
- 🔴 **Red**: Code removed
- ⚪ **Gray**: Unchanged code

### IDE Extensions

#### Browser Extension Installation

1. **Download**: Get the extension from the extensions folder
2. **Install**: Load unpacked extension in Chrome/Firefox
3. **Configure**: Set your Bug Exchange API endpoint
4. **Use**: Navigate to GitHub/GitLab repositories

#### Using the Extension

1. **File View**: Click "Report Bug in File" button
2. **Code Blocks**: Click "Report Bug" on specific code blocks
3. **Line Level**: Click 🐛 icon on individual lines
4. **Auto-fill**: Extension automatically collects context

---

## 🛠️ Technical Implementation

### Dependencies Added

```bash
npm install react-syntax-highlighter @types/react-syntax-highlighter
```

### New Components Created

- `CodeBlock.tsx` - Syntax highlighted code display
- `DiffViewer.tsx` - Code diff visualization
- `LanguageSelector.tsx` - Programming language picker

### Database Changes

```prisma
model Submission {
  // ... existing fields
  language    String?          // Programming language for syntax highlighting
  // ... other fields
}
```

### API Endpoints Added

- `POST /api/extensions/report-bug` - Direct bug reporting
- `POST /api/extensions/register` - Extension registration

---

## 🔧 Configuration

### Environment Variables

```env
NEXTAUTH_URL=https://your-domain.com
```

### Extension Configuration

Update the API endpoint in `extensions/browser-extension/content.js`:

```javascript
const BUG_EXCHANGE_API = "https://your-domain.com/api";
```

---

## 📱 Browser Extension Features

### Supported Platforms

- **GitHub**: Full integration with file views, issues, and pull requests
- **GitLab**: Complete support for repositories and merge requests
- **Other**: Extensible for additional platforms

### Button Types

1. **File Header**: Report bugs in entire files
2. **Code Block**: Report bugs in specific code sections
3. **Line Level**: Report bugs on individual lines

### Auto-collected Data

- Repository name and URL
- File path and branch
- Selected code or line content
- Platform context (GitHub/GitLab)
- File extension and language detection

---

## 🎯 Future Enhancements

### Planned Features

- **VS Code Extension**: Direct integration with VS Code
- **JetBrains Plugin**: Support for IntelliJ, WebStorm, etc.
- **Advanced Diff**: More sophisticated diff algorithms
- **Code Analysis**: Automated bug detection suggestions
- **Git Integration**: Direct commit and branch information

### Extension Marketplace

- **Chrome Web Store**: Official browser extension
- **VS Code Marketplace**: Official VS Code extension
- **GitHub Apps**: Native GitHub integration
- **GitLab Apps**: Native GitLab integration

---

## 🐛 Troubleshooting

### Common Issues

#### Syntax Highlighting Not Working

- Check if language is selected
- Verify code contains valid syntax
- Check browser console for errors

#### Diff Viewer Not Showing

- Ensure original bug has code snippet
- Check if submission has solution
- Verify browser supports required features

#### Extension Not Working

- Check if extension is enabled
- Verify API endpoint configuration
- Check browser permissions
- Ensure you're on supported platforms

### Debug Mode

Enable debug logging in the extension:

```javascript
// Add to content.js
const DEBUG = true;
if (DEBUG) console.log("Bug Exchange Extension:", data);
```

---

## 📞 Support

### Getting Help

- **Documentation**: Check this README first
- **Issues**: Report bugs on GitHub
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact support@bugexchange.com

### Contributing

1. **Fork** the repository
2. **Create** a feature branch
3. **Implement** your changes
4. **Test** thoroughly
5. **Submit** a pull request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **react-syntax-highlighter** for syntax highlighting
- **GitHub** and **GitLab** for platform integration
- **Next.js** team for the excellent framework
- **Prisma** for database management
- **Tailwind CSS** for styling

---

_Last updated: September 2024_

