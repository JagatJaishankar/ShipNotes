"use client";
// Component for selecting commits to include in release notes
import { useState } from "react";
import Image from "next/image";
import {
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeader,
  Badge,
} from "@/components/ui";

export default function CommitSelector({
  commits,
  selectedCommits,
  onCommitToggle,
  isLoading,
  onRefresh,
  publishedCommits = [], // Array of commit SHAs that are published
  draftCommits = [], // Array of commit SHAs that are in drafts
}) {
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    if (selectAll || selectedCommits.length === commits.length) {
      // Deselect all
      selectedCommits.forEach((commit) => onCommitToggle(commit));
      setSelectAll(false);
    } else {
      // Select all unselected commits
      commits.forEach((commit) => {
        const isSelected = selectedCommits.some((c) => c.sha === commit.sha);
        if (!isSelected) {
          onCommitToggle(commit);
        }
      });
      setSelectAll(true);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isCommitSelected = (commit) => {
    return selectedCommits.some((c) => c.sha === commit.sha);
  };

  const getCommitStatus = (commit) => {
    if (publishedCommits.includes(commit.sha)) {
      return (
        <Badge variant="primary" size="sm">
          published
        </Badge>
      );
    }
    if (draftCommits.includes(commit.sha)) {
      return (
        <Badge variant="secondary" size="sm">
          draft
        </Badge>
      );
    }
    return (
      <Badge variant="default" size="sm">
        unused
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <span className="loading loading-spinner loading-lg text-neutral"></span>
      </div>
    );
  }

  if (commits.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl opacity-50 mb-4">📝</div>
        <h3 className="font-raleway font-bold tracking-tighter text-xl lowercase opacity-70 mb-2">
          no commits found
        </h3>
        <p className="font-lora tracking-wide opacity-80 text-neutral lowercase mb-4 max-w-md mx-auto">
          no commits found in the selected time range. try expanding your date
          range or check if there are recent commits.
        </p>
        <Button onClick={onRefresh} variant="outline" size="sm">
          refresh commits
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Commits Table */}
      <div>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>
                <input
                  type="checkbox"
                  checked={selectedCommits.length === commits.length}
                  onChange={handleSelectAll}
                  className="checkbox checkbox-primary"
                />
              </TableHeader>
              <TableHeader>commit message</TableHeader>
              <TableHeader>author</TableHeader>
              <TableHeader>date</TableHeader>
              <TableHeader>sha</TableHeader>
              <TableHeader>status</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {commits.map((commit) => (
              <TableRow
                key={commit.sha}
                clickable
                onClick={() => onCommitToggle(commit)}
                className={
                  isCommitSelected(commit) ? "bg-primary bg-opacity-10" : ""
                }
              >
                <TableCell>
                  <input
                    type="checkbox"
                    checked={isCommitSelected(commit)}
                    onChange={() => onCommitToggle(commit)}
                    className="checkbox checkbox-primary"
                    onClick={(e) => e.stopPropagation()}
                  />
                </TableCell>
                <TableCell>
                  <div className="max-w-sm">
                    <p className="font-lora tracking-wide text-neutral font-medium mb-1">
                      {commit.message.split("\n")[0]}{" "}
                      {/* First line only - keep original case */}
                    </p>
                    {/* Full commit message if multi-line */}
                    {commit.message.split("\n").length > 1 && (
                      <details className="mt-1">
                        <summary className="font-space tracking-normal text-xs opacity-60 cursor-pointer lowercase">
                          show full message
                        </summary>
                        <pre className="font-space tracking-normal text-sm opacity-80 mt-2 whitespace-pre-wrap">
                          {commit.message} {/* Keep original case */}
                        </pre>
                      </details>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {commit.author.avatarUrl ? (
                      <Image
                        src={commit.author.avatarUrl}
                        alt={`${commit.author.name} avatar`}
                        width={24}
                        height={24}
                        className="w-6 h-6 rounded-sm border-1 border-neutral object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : (
                      <div className="bg-neutral text-neutral-content rounded-sm w-6 h-6 text-xs border-1 border-neutral flex items-center justify-center">
                        <span>
                          {commit.author.name
                            .split(" ")[0]
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="font-space tracking-normal opacity-80 text-sm">
                      {commit.author.name.split(" ")[0]}{" "}
                      {/* Show only first name */}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-space tracking-normal opacity-60 text-sm">
                    {formatDate(commit.author.date)}
                  </span>
                </TableCell>
                <TableCell>
                  <a
                    href={commit.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-space tracking-normal opacity-60 hover:opacity-100 underline text-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {commit.sha.substring(0, 7)}
                  </a>
                </TableCell>
                <TableCell>{getCommitStatus(commit)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-neutral">
        <p className="font-space tracking-normal text-sm opacity-60 text-center lowercase">
          {selectedCommits.length} of {commits.length} commits selected
        </p>
      </div>
    </div>
  );
}
