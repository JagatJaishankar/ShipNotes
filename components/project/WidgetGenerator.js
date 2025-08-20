"use client";
// Widget generator component for project page - generates embed code for customers
import { useState, useEffect } from "react";

export default function WidgetGenerator({ project, hasPublishedNotes }) {
  const [config, setConfig] = useState({
    position: 'bottom-right',
    theme: 'light',
    showCount: true,
    days: 30,
  });
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Generate embed code
  const generateEmbedCode = () => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://patchnote.dev';
    
    return `<!-- PatchNote.dev Widget -->
<script 
  src="${baseUrl}/widget.js"
  data-patchnote-project="${project.projectSlug}"
  data-position="${config.position}"
  data-theme="${config.theme}"
  data-show-count="${config.showCount}"
  data-days="${config.days}"
  async
></script>`;
  };

  // Generate HTML preview
  const generatePreview = () => {
    const positions = {
      'bottom-right': 'bottom: 20px; right: 20px;',
      'bottom-left': 'bottom: 20px; left: 20px;',
      'top-right': 'top: 20px; right: 20px;',
      'top-left': 'top: 20px; left: 20px;'
    };

    const themes = {
      light: { bg: '#ffffff', text: '#374151', border: '#e5e7eb', accent: '#3b82f6' },
      dark: { bg: '#1f2937', text: '#f9fafb', border: '#374151', accent: '#60a5fa' }
    };

    const themeColors = themes[config.theme];
    const countText = config.showCount ? '2 new updates' : 'New updates';

    return `
      <div style="
        position: fixed;
        ${positions[config.position]}
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        cursor: pointer;
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
            ">in ${project.projectName}</div>
          </div>
        </div>
      </div>
    `;
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateEmbedCode());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = generateEmbedCode();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!hasPublishedNotes) {
    return (
      <div className="border border-neutral rounded-sm p-6">
        <h2 className="font-raleway font-bold text-xl tracking-tighter mb-4">
          widget integration
        </h2>
        <div className="bg-base-200 rounded-sm p-4 border border-neutral">
          <p className="font-lora tracking-tighter opacity-80 text-neutral mb-3">
            publish your first release note to generate widget code for your website.
          </p>
          <p className="font-space tracking-tighter text-sm opacity-60 text-neutral">
            the widget will automatically show new updates to your customers.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-neutral rounded-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-raleway font-bold text-xl tracking-tighter">
          widget integration
        </h2>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="btn btn-outline btn-sm font-raleway font-bold tracking-tighter"
        >
          {showPreview ? 'hide preview' : 'show preview'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Configuration Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Position */}
          <div>
            <label className="font-raleway font-bold tracking-tighter text-sm opacity-80 mb-2 block">
              position
            </label>
            <select
              value={config.position}
              onChange={(e) => setConfig({ ...config, position: e.target.value })}
              className="select select-bordered w-full font-raleway"
            >
              <option value="bottom-right">bottom right</option>
              <option value="bottom-left">bottom left</option>
              <option value="top-right">top right</option>
              <option value="top-left">top left</option>
            </select>
          </div>

          {/* Theme */}
          <div>
            <label className="font-raleway font-bold tracking-tighter text-sm opacity-80 mb-2 block">
              theme
            </label>
            <select
              value={config.theme}
              onChange={(e) => setConfig({ ...config, theme: e.target.value })}
              className="select select-bordered w-full font-raleway"
            >
              <option value="light">light</option>
              <option value="dark">dark</option>
            </select>
          </div>

          {/* Show Count */}
          <div>
            <label className="font-raleway font-bold tracking-tighter text-sm opacity-80 mb-2 block">
              display
            </label>
            <div className="form-control">
              <label className="label cursor-pointer justify-start space-x-2">
                <input
                  type="checkbox"
                  checked={config.showCount}
                  onChange={(e) => setConfig({ ...config, showCount: e.target.checked })}
                  className="checkbox checkbox-primary"
                />
                <span className="font-lora tracking-tighter opacity-80 text-neutral text-sm">
                  show update count
                </span>
              </label>
            </div>
          </div>

          {/* Days */}
          <div>
            <label className="font-raleway font-bold tracking-tighter text-sm opacity-80 mb-2 block">
              show updates from last
            </label>
            <select
              value={config.days}
              onChange={(e) => setConfig({ ...config, days: parseInt(e.target.value) })}
              className="select select-bordered w-full font-raleway"
            >
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={30}>30 days</option>
              <option value={60}>60 days</option>
              <option value={90}>90 days</option>
            </select>
          </div>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="bg-base-200 rounded-sm p-6 border border-neutral relative min-h-32">
            <h3 className="font-raleway font-bold tracking-tighter mb-4">preview</h3>
            <div 
              className="relative"
              dangerouslySetInnerHTML={{ __html: generatePreview() }}
            />
            <p className="font-space tracking-tighter text-sm opacity-60 text-neutral mt-4">
              this shows how the widget will appear on your website
            </p>
          </div>
        )}

        {/* Embed Code */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="font-raleway font-bold tracking-tighter text-sm opacity-80">
              embed code
            </label>
            <button
              onClick={copyToClipboard}
              className={`btn btn-sm font-raleway font-bold tracking-tighter ${
                copied ? 'btn-success' : 'btn-primary'
              }`}
            >
              {copied ? 'copied!' : 'copy code'}
            </button>
          </div>
          <textarea
            value={generateEmbedCode()}
            readOnly
            className="textarea textarea-bordered w-full h-32 font-space text-sm"
          />
        </div>

        {/* Implementation Instructions */}
        <div className="bg-base-50 rounded-sm p-4 border border-neutral">
          <h3 className="font-raleway font-bold tracking-tighter mb-3">
            implementation steps
          </h3>
          <ol className="space-y-2 font-lora tracking-tighter opacity-80 text-neutral text-sm">
            <li>1. copy the embed code above</li>
            <li>2. paste it before the closing &lt;/body&gt; tag in your website</li>
            <li>3. the widget will automatically show when you publish new release notes</li>
            <li>4. customers can click the widget to view your full changelog</li>
          </ol>
          <div className="mt-4 p-3 bg-primary/10 rounded border border-primary/20">
            <p className="font-space tracking-tighter text-sm text-primary">
              💡 tip: the widget only appears when you have recent updates, keeping your site clean.
            </p>
          </div>
        </div>

        {/* Testing */}
        <div className="bg-base-50 rounded-sm p-4 border border-neutral">
          <h3 className="font-raleway font-bold tracking-tighter mb-3">
            testing your widget
          </h3>
          <div className="space-y-2 font-lora tracking-tighter opacity-80 text-neutral text-sm">
            <p>• widget api: <code className="font-space bg-base-200 px-1 rounded">GET /api/widget/{project.projectSlug}</code></p>
            <p>• public changelog: <a href={`/${project.projectSlug}`} target="_blank" className="link link-primary">patchnote.dev/{project.projectSlug}</a></p>
            <p>• the widget will appear on your site within 5 minutes of publishing updates</p>
          </div>
        </div>
      </div>
    </div>
  );
}