import { useEffect } from "react";

export default function SectionEditor({
  section,
  sIndex,
  pageTemplate,
  handleSectionChange,
  templateTypeVariants,
}) {
  useEffect(() => {
    const variants = templateTypeVariants[pageTemplate]?.[section.type] || [];

    // Si la variant actuelle n'existe pas dans la liste, on corrige
    if (variants.length && !variants.includes(section.variant)) {
      handleSectionChange(sIndex, "variant", variants[0]);
    }
  }, [
    section.type,
    section.variant,
    pageTemplate,
    sIndex,
    handleSectionChange,
    templateTypeVariants,
  ]);

  return (
    <div className="mb-4 border p-3 rounded">
      <div className="d-flex gap-3 align-items-end">
        {/* Type */}
        <div className="flex-grow-1">
          <label className="form-label">Type</label>
          <select
            className="form-select"
            value={section.type}
            onChange={(e) =>
              handleSectionChange(sIndex, "type", e.target.value)
            }
          >
            {Object.keys(templateTypeVariants[pageTemplate] || {}).map(
              (type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              )
            )}
          </select>
        </div>

        {/* Variant */}
        {templateTypeVariants[pageTemplate]?.[section.type]?.length > 0 && (
          <div className="flex-grow-1">
            <label className="form-label">Variant</label>
            <select
              className="form-select"
              value={section.variant}
              onChange={(e) =>
                handleSectionChange(sIndex, "variant", e.target.value)
              }
            >
              {(templateTypeVariants[pageTemplate]?.[section.type] || []).map(
                (variant) => (
                  <option key={variant} value={variant}>
                    {variant}
                  </option>
                )
              )}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
