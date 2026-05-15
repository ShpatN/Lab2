import { useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { downloadExport, type ExportDataset, type ExportFormat, type ExportScope } from "@/lib/api";

type Props = {
  dataset: ExportDataset;
  defaultScope: ExportScope;
  label: string;
  className?: string;
};

const ExportActions = ({ dataset, defaultScope, label, className = "" }: Props) => {
  const [format, setFormat] = useState<ExportFormat>("csv");
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      await downloadExport(dataset, format, defaultScope);
      toast.success(`${label} exported successfully.`);
    } catch (err) {
      console.error("Export action failed", {
        dataset,
        format,
        scope: defaultScope,
        error: err,
      });
      toast.error(err instanceof Error ? err.message : `Failed to export ${label}.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`.trim()}>
      <select
        value={format}
        onChange={(e) => setFormat(e.target.value as ExportFormat)}
        className="px-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm"
      >
        <option value="csv">CSV</option>
        <option value="json">JSON</option>
      </select>
      <button
        type="button"
        onClick={handleDownload}
        disabled={isLoading}
        className="px-3 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 text-sm font-medium inline-flex items-center gap-2 disabled:opacity-60"
      >
        <Download className="w-4 h-4" />
        {isLoading ? "Exporting..." : `Export ${label}`}
      </button>
    </div>
  );
};

export default ExportActions;
