"use client";
// Widget generator component for project page - generates embed code for customers
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button, Select, TextArea } from "@/components/ui";

export default function WidgetGenerator({ project, hasPublishedNotes }) {
  const [config, setConfig] = useState({
    position: "bottom-right",
    theme: "light",
    showCount: true,
    days: 30,
  });
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Generate embed code
  const generateEmbedCode = () => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://shipnotes.dev";

    return `<!-- ShipNotes.dev Widget -->
<script
  src="${baseUrl}/widget.js"
  data-shipnotes-project="${project.projectSlug}"
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
      "bottom-right": "bottom: 20px; right: 20px;",
      "bottom-left": "bottom: 20px; left: 20px;",
      "top-right": "top: 20px; right: 20px;",
      "top-left": "top: 20px; left: 20px;",
    };

    const themes = {
      light: {
        bg: "#ffffff",
        text: "#374151",
        border: "#e5e7eb",
        accent: "#3b82f6",
      },
      dark: {
        bg: "#1f2937",
        text: "#f9fafb",
        border: "#374151",
        accent: "#60a5fa",
      },
    };

    const themeColors = themes[config.theme];
    const countText = config.showCount ? "2 new updates" : "New updates";

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
      const textArea = document.createElement("textarea");
      textArea.value = generateEmbedCode();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!hasPublishedNotes) {
    return (
      <div>
        <h2 className="font-raleway font-bold text-xl tracking-tighter lowercase mb-4">
          widget integration
        </h2>
        <div className="bg-base-200 rounded-sm p-4 border border-neutral">
          <div className="text-center py-8">
            <div className="text-6xl opacity-50 mb-4">📱</div>
            <h3 className="font-raleway font-bold tracking-tighter text-lg lowercase opacity-70 mb-2">
              no published notes yet
            </h3>
            <p className="font-lora tracking-wide opacity-80 text-neutral lowercase mb-3">
              publish your first release note to generate widget code for your
              website.
            </p>
            <p className="font-space tracking-normal text-sm opacity-60 text-neutral lowercase">
              the widget will automatically show new updates to your customers.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-raleway font-bold text-xl tracking-tighter lowercase">
          widget integration
        </h2>
        <Button
          onClick={() => setShowPreview(!showPreview)}
          variant="outline"
          size="sm"
        >
          {showPreview ? "hide preview" : "show preview"}
        </Button>
      </div>

      <div className="space-y-4">
        {/* Configuration Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Position */}
          <div>
            <label className="font-raleway font-bold tracking-tighter text-sm opacity-80 mb-2 block lowercase">
              position
            </label>
            <Select
              value={config.position}
              onChange={(e) =>
                setConfig({ ...config, position: e.target.value })
              }
            >
              <option value="bottom-right">bottom right</option>
              <option value="bottom-left">bottom left</option>
              <option value="top-right">top right</option>
              <option value="top-left">top left</option>
            </Select>
          </div>

          {/* Theme */}
          <div>
            <label className="font-raleway font-bold tracking-tighter text-sm opacity-80 mb-2 block lowercase">
              theme
            </label>
            <Select
              value={config.theme}
              onChange={(e) => setConfig({ ...config, theme: e.target.value })}
            >
              <option value="light">light</option>
              <option value="dark">dark</option>
            </Select>
          </div>

          {/* Show Count */}
          <div>
            <label className="font-raleway font-bold tracking-tighter text-sm opacity-80 mb-2 block lowercase">
              display
            </label>
            <div className="form-control">
              <label className="label cursor-pointer justify-start space-x-2">
                <input
                  type="checkbox"
                  checked={config.showCount}
                  onChange={(e) =>
                    setConfig({ ...config, showCount: e.target.checked })
                  }
                  className="checkbox checkbox-primary"
                />
                <span className="font-lora tracking-wide opacity-80 text-neutral text-sm lowercase">
                  show update count
                </span>
              </label>
            </div>
          </div>

          {/* Days */}
          <div>
            <label className="font-raleway font-bold tracking-tighter text-sm opacity-80 mb-2 block lowercase">
              show updates from last
            </label>
            <Select
              value={config.days}
              onChange={(e) =>
                setConfig({ ...config, days: parseInt(e.target.value) })
              }
            >
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={30}>30 days</option>
              <option value={60}>60 days</option>
              <option value={90}>90 days</option>
            </Select>
          </div>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="bg-base-200 rounded-sm p-6 border border-neutral relative min-h-32">
            <h3 className="font-raleway font-bold tracking-tighter mb-4 lowercase">
              preview
            </h3>
            <div
              className="relative"
              dangerouslySetInnerHTML={{ __html: generatePreview() }}
            />
            <p className="font-space tracking-normal text-sm opacity-60 text-neutral lowercase mt-4">
              this shows how the widget will appear on your website
            </p>
          </div>
        )}

        {/* Embed Code */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="font-raleway font-bold tracking-tighter text-sm opacity-80 lowercase">
              embed code
            </label>
            <Button
              onClick={copyToClipboard}
              variant={copied ? "success" : "primary"}
              size="sm"
            >
              {copied ? "copied!" : "copy code"}
            </Button>
          </div>
          <TextArea
            value={generateEmbedCode()}
            readOnly
            rows={8}
            className="font-space text-sm"
          />
        </div>

        {/* Implementation Instructions */}
        <div className="bg-base-50 rounded-sm p-4 border border-neutral">
          <h3 className="font-raleway font-bold tracking-tighter mb-3 lowercase">
            implementation steps
          </h3>
          <ol className="space-y-2 font-lora tracking-wide opacity-80 text-neutral text-sm lowercase">
            <li>1. copy the embed code above</li>
            <li>
              2. paste it before the closing &lt;/body&gt; tag in your website
            </li>
            <li>
              3. the widget will automatically show when you publish new release
              notes
            </li>
            <li>
              4. customers can click the widget to view your full changelog
            </li>
          </ol>
          <div className="mt-4 p-3 bg-primary/10 rounded border border-primary/20">
            <p className="font-space tracking-normal text-sm text-primary lowercase">
              💡 tip: the widget only appears when you have recent updates,
              keeping your site clean.
            </p>
          </div>
        </div>

        {/* Testing */}
        <div className="bg-base-50 rounded-sm p-4 border border-neutral">
          <h3 className="font-raleway font-bold tracking-tighter mb-3 lowercase">
            testing your widget
          </h3>
          <div className="space-y-2 font-lora tracking-wide opacity-80 text-neutral text-sm lowercase">
            <p>
              • widget api:{" "}
              <code className="font-space bg-base-200 px-1 rounded border-1 border-neutral">
                GET /api/widget/{project.projectSlug}
              </code>
            </p>
            <p>
              • public changelog:{" "}
              <Link
                href={`/${project.projectSlug}`}
                target="_blank"
                className="link link-primary"
              >
                shipnotes.dev/{project.projectSlug}
              </Link>
            </p>
            <p>
              • the widget will appear on your site within 5 minutes of
              publishing updates
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
