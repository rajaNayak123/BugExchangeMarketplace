// Content script for Bug Exchange Reporter extension
(function () {
  "use strict";

  const BUG_EXCHANGE_API = "https://your-domain.com/api"; // Replace with actual domain
  const EXTENSION_ID = "bug-exchange-reporter";

  // GitHub-specific selectors
  const GITHUB_SELECTORS = {
    fileContent: ".blob-code-inner",
    lineNumbers: ".blob-num",
    fileHeader: ".file-header",
    issueButton: ".gh-header-actions",
    codeBlock: "pre code",
    filePath: ".file-info .link-gray-dark",
  };

  // GitLab-specific selectors
  const GITLAB_SELECTORS = {
    fileContent: ".line-content",
    lineNumbers: ".line-numbers",
    fileHeader: ".file-header",
    issueButton: ".issue-actions",
    codeBlock: "pre code",
    filePath: ".file-header-content .file-path",
  };

  class BugExchangeReporter {
    constructor() {
      this.currentPlatform = this.detectPlatform();
      this.selectors =
        this.currentPlatform === "github" ? GITHUB_SELECTORS : GITLAB_SELECTORS;
      this.init();
    }

    detectPlatform() {
      if (window.location.hostname.includes("github.com")) {
        return "github";
      } else if (window.location.hostname.includes("gitlab.com")) {
        return "gitlab";
      }
      return "unknown";
    }

    init() {
      if (this.currentPlatform === "unknown") {
        return;
      }

      // Wait for page to load
      this.waitForElements();

      // Listen for navigation changes (SPA)
      this.observeNavigation();
    }

    waitForElements() {
      const checkInterval = setInterval(() => {
        if (this.shouldInjectButtons()) {
          clearInterval(checkInterval);
          this.injectBugReportButtons();
        }
      }, 1000);
    }

    shouldInjectButtons() {
      // Check if we're on a file view page
      return document.querySelector(this.selectors.fileContent) !== null;
    }

    injectBugReportButtons() {
      // Inject button into file header
      this.injectFileHeaderButton();

      // Inject buttons for individual code blocks
      this.injectCodeBlockButtons();

      // Inject line-specific buttons
      this.injectLineButtons();
    }

    injectFileHeaderButton() {
      const header = document.querySelector(this.selectors.fileHeader);
      if (!header || header.querySelector(`.${EXTENSION_ID}-button`)) {
        return;
      }

      const button = this.createBugReportButton("Report Bug in File", "file");
      header.appendChild(button);
    }

    injectCodeBlockButtons() {
      const codeBlocks = document.querySelectorAll(this.selectors.codeBlock);
      codeBlocks.forEach((block, index) => {
        if (block.parentNode.querySelector(`.${EXTENSION_ID}-button`)) {
          return;
        }

        const button = this.createBugReportButton("Report Bug", "code-block", {
          code: block.textContent,
          blockIndex: index,
        });

        // Insert button after the code block
        const wrapper = document.createElement("div");
        wrapper.className = `${EXTENSION_ID}-wrapper`;
        wrapper.appendChild(button);
        block.parentNode.parentNode.appendChild(wrapper);
      });
    }

    injectLineButtons() {
      const lines = document.querySelectorAll(this.selectors.fileContent);
      lines.forEach((line, index) => {
        if (line.parentNode.querySelector(`.${EXTENSION_ID}-button`)) {
          return;
        }

        const button = this.createBugReportButton("🐛", "line", {
          lineNumber: index + 1,
          code: line.textContent,
        });

        button.className += " line-button";
        line.parentNode.appendChild(button);
      });
    }

    createBugReportButton(text, type, data = {}) {
      const button = document.createElement("button");
      button.className = `${EXTENSION_ID}-button ${EXTENSION_ID}-${type}`;
      button.textContent = text;
      button.title = "Report bug to Bug Exchange Marketplace";

      button.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.handleBugReport(type, data);
      });

      return button;
    }

    handleBugReport(type, data) {
      // Get current page context
      const context = this.getPageContext();

      // Prepare bug data
      const bugData = {
        title: `Bug in ${context.fileName}`,
        description: this.generateBugDescription(type, data, context),
        repoSnippet: data.code || this.getSelectedCode(),
        tags: this.generateTags(context),
        category: "FUNCTIONALITY",
        priority: "MEDIUM",
        severity: "MODERATE",
        bountyAmount: 100, // Default bounty
        source: {
          platform: this.currentPlatform,
          url: window.location.href,
          type: type,
          data: data,
        },
      };

      // Open bug report form
      this.openBugReportForm(bugData);
    }

    getPageContext() {
      const context = {
        fileName: this.getFileName(),
        repoName: this.getRepoName(),
        branch: this.getBranch(),
        url: window.location.href,
      };

      return context;
    }

    getFileName() {
      const pathElement = document.querySelector(this.selectors.filePath);
      return pathElement ? pathElement.textContent.trim() : "Unknown file";
    }

    getRepoName() {
      const pathParts = window.location.pathname.split("/");
      if (this.currentPlatform === "github") {
        return `${pathParts[1]}/${pathParts[2]}`;
      } else if (this.currentPlatform === "gitlab") {
        return pathParts.slice(1, 3).join("/");
      }
      return "Unknown repository";
    }

    getBranch() {
      const pathParts = window.location.pathname.split("/");
      if (this.currentPlatform === "github") {
        return pathParts[4] || "main";
      } else if (this.currentPlatform === "gitlab") {
        return pathParts[3] || "main";
      }
      return "main";
    }

    getSelectedCode() {
      const selection = window.getSelection();
      if (selection.toString().length > 0) {
        return selection.toString();
      }
      return "";
    }

    generateBugDescription(type, data, context) {
      let description = `Bug detected in ${context.fileName} at ${context.repoName}`;

      if (type === "line") {
        description += `\n\nLine ${data.lineNumber}: ${data.code}`;
      } else if (type === "code-block") {
        description += `\n\nCode block ${data.blockIndex + 1}: ${data.code}`;
      } else if (type === "file") {
        description += "\n\nIssue detected in the entire file.";
      }

      description += `\n\nRepository: ${context.repoName}`;
      description += `\nBranch: ${context.branch}`;
      description += `\nFile: ${context.fileName}`;
      description += `\nURL: ${context.url}`;

      return description;
    }

    generateTags(context) {
      const tags = [this.currentPlatform, "bug-report"];

      // Add file extension as tag
      const fileExt = context.fileName.split(".").pop();
      if (fileExt) {
        tags.push(fileExt.toLowerCase());
      }

      // Add common programming language tags
      const languageMap = {
        js: "javascript",
        ts: "typescript",
        py: "python",
        java: "java",
        cpp: "cpp",
        cs: "csharp",
        php: "php",
        rb: "ruby",
        go: "go",
        rs: "rust",
        swift: "swift",
        kt: "kotlin",
      };

      if (languageMap[fileExt]) {
        tags.push(languageMap[fileExt]);
      }

      return tags;
    }

    openBugReportForm(bugData) {
      // Open popup with bug report form
      const popup = window.open(
        `${BUG_EXCHANGE_API}/extensions/report-bug`,
        "bug-exchange-report",
        "width=600,height=800,scrollbars=yes,resizable=yes"
      );

      // Send data to popup
      if (popup) {
        popup.bugData = bugData;
      }
    }

    observeNavigation() {
      // GitHub and GitLab use client-side routing
      let currentUrl = window.location.href;

      setInterval(() => {
        if (window.location.href !== currentUrl) {
          currentUrl = window.location.href;
          setTimeout(() => {
            this.init();
          }, 1000);
        }
      }, 1000);
    }
  }

  // Initialize the extension
  new BugExchangeReporter();
})();

