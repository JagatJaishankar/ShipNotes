// PatchNote.dev Widget - Customer embeddable script
(function() {
  'use strict';

  // Widget configuration
  const WIDGET_CONFIG = {
    apiBase: 'https://patchnote.dev/api/widget',
    position: 'bottom-right', // bottom-right, bottom-left, top-right, top-left
    theme: 'light', // light, dark, auto
    showCount: true,
    days: 30,
    zIndex: 9999
  };

  // Get project slug from script tag
  function getProjectSlug() {
    const script = document.currentScript || document.querySelector('script[data-patchnote-project]');
    return script ? script.getAttribute('data-patchnote-project') : null;
  }

  // Merge user config with defaults
  function getConfig() {
    const script = document.currentScript || document.querySelector('script[data-patchnote-project]');
    if (!script) return WIDGET_CONFIG;

    return {
      ...WIDGET_CONFIG,
      position: script.getAttribute('data-position') || WIDGET_CONFIG.position,
      theme: script.getAttribute('data-theme') || WIDGET_CONFIG.theme,
      showCount: script.getAttribute('data-show-count') !== 'false',
      days: parseInt(script.getAttribute('data-days')) || WIDGET_CONFIG.days,
    };
  }

  // Create widget HTML
  function createWidget(data, config) {
    const { totalUpdates, hasNewUpdates } = data.stats;
    const { name } = data.project;
    
    if (!hasNewUpdates) return null;

    // Position styles
    const positions = {
      'bottom-right': 'bottom: 20px; right: 20px;',
      'bottom-left': 'bottom: 20px; left: 20px;',
      'top-right': 'top: 20px; right: 20px;',
      'top-left': 'top: 20px; left: 20px;'
    };

    // Theme styles
    const themes = {
      light: {
        bg: '#ffffff',
        text: '#374151',
        border: '#e5e7eb',
        accent: '#3b82f6'
      },
      dark: {
        bg: '#1f2937',
        text: '#f9fafb',
        border: '#374151',
        accent: '#60a5fa'
      }
    };

    const themeColors = themes[config.theme] || themes.light;
    const countText = config.showCount ? `${totalUpdates} new update${totalUpdates !== 1 ? 's' : ''}` : 'New updates';

    return `
      <div id="patchnote-widget" style="
        position: fixed;
        ${positions[config.position]}
        z-index: ${config.zIndex};
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        cursor: pointer;
        transition: all 0.2s ease;
      ">
        <div style="
          background: ${themeColors.bg};
          border: 1px solid ${themeColors.border};
          border-radius: 8px;
          padding: 12px 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          gap: 8px;
          max-width: 280px;
        ">
          <div style="
            width: 8px;
            height: 8px;
            background: ${themeColors.accent};
            border-radius: 50%;
            animation: patchnote-pulse 2s infinite;
          "></div>
          <div>
            <div style="
              font-size: 13px;
              font-weight: 600;
              color: ${themeColors.text};
              line-height: 1.2;
              margin-bottom: 2px;
            ">${countText}</div>
            <div style="
              font-size: 11px;
              color: ${themeColors.text};
              opacity: 0.7;
              line-height: 1.2;
            ">in ${name}</div>
          </div>
        </div>
      </div>
      <style>
        @keyframes patchnote-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        #patchnote-widget:hover {
          transform: translateY(-2px);
        }
      </style>
    `;
  }

  // Fetch widget data and render
  async function initWidget() {
    const projectSlug = getProjectSlug();
    if (!projectSlug) {
      console.warn('PatchNote.dev: No project slug provided');
      return;
    }

    const config = getConfig();

    try {
      const response = await fetch(`${config.apiBase}/${projectSlug}?days=${config.days}`);
      if (!response.ok) throw new Error('Failed to fetch widget data');
      
      const data = await response.json();
      
      if (!data.stats.hasNewUpdates) {
        console.log('PatchNote.dev: No recent updates to show');
        return;
      }

      // Create and insert widget
      const widgetHTML = createWidget(data, config);
      if (widgetHTML) {
        const div = document.createElement('div');
        div.innerHTML = widgetHTML;
        document.body.appendChild(div.firstElementChild);

        // Add click handler
        const widget = document.getElementById('patchnote-widget');
        if (widget) {
          widget.addEventListener('click', () => {
            window.open(data.links.changelog, '_blank', 'noopener,noreferrer');
          });
        }
      }

    } catch (error) {
      console.error('PatchNote.dev widget error:', error);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }

})();