import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { jsPDF } from "jspdf";
import {
  LuCalendarDays,
  LuChevronLeft,
  LuChevronRight,
  LuDownload,
  LuPrinter,
  LuReceiptText,
  LuX,
} from "react-icons/lu";
import { TbReportAnalytics } from "react-icons/tb";
import { getSales } from "../../services/sales";
import "../Sales/Sales.scss";
import "./Reports.scss";

const formatMoney = (amount) => `PKR ${amount.toLocaleString()}`;

function getTodayValue() {
  const today = new Date();
  return [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
}

function getDateKey(dateValue) {
  const date = new Date(dateValue);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDateLabel(dateValue) {
  if (!dateValue) return "Select date";
  return new Date(`${dateValue}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getMonthDays(monthDate) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
}

function DatePicker({ label, value, min, max, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [monthDate, setMonthDate] = useState(() =>
    value ? new Date(`${value}T00:00:00`) : new Date(),
  );
  const pickerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleOutsideClick = (event) => {
      if (!pickerRef.current?.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  const days = getMonthDays(monthDate);
  const monthLabel = monthDate.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  const selectDay = (day) => {
    if (!day) return;
    const selected = new Date(
      monthDate.getFullYear(),
      monthDate.getMonth(),
      day,
    );
    const dateValue = [
      selected.getFullYear(),
      String(selected.getMonth() + 1).padStart(2, "0"),
      String(selected.getDate()).padStart(2, "0"),
    ].join("-");
    if ((!min || dateValue >= min) && (!max || dateValue <= max)) {
      onChange(dateValue);
      setMonthDate(selected);
      setIsOpen(false);
    }
  };

  return (
    <div className="sales-date-picker" ref={pickerRef}>
      <span className="sr-only">Filter invoices from or to date</span>
      <button
        type="button"
        className="sales-date-picker__trigger"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <LuCalendarDays aria-hidden="true" />
        <span>{label}</span>
        <strong>{formatDateLabel(value)}</strong>
      </button>
      {isOpen && (
        <div className="sales-date-picker__menu">
          <div className="sales-date-picker__header">
            <strong>{monthLabel}</strong>
            <div>
              <button
                type="button"
                onClick={() =>
                  setMonthDate(
                    new Date(
                      monthDate.getFullYear(),
                      monthDate.getMonth() - 1,
                      1,
                    ),
                  )
                }
                aria-label="Previous month"
              >
                <LuChevronLeft aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setMonthDate(
                    new Date(
                      monthDate.getFullYear(),
                      monthDate.getMonth() + 1,
                      1,
                    ),
                  )
                }
                aria-label="Next month"
              >
                <LuChevronRight aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="sales-date-picker__weekdays">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="sales-date-picker__days">
            {days.map((day, index) => {
              const selected =
                day &&
                `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const disabled =
                !day || (min && selected < min) || (max && selected > max);
              return (
                <button
                  type="button"
                  key={`${monthLabel}-${index}`}
                  className={
                    selected === value ? "sales-date-picker__day--selected" : ""
                  }
                  disabled={disabled}
                  onClick={() => selectDay(day)}
                >
                  {day}
                </button>
              );
            })}
          </div>
          <div className="sales-date-picker__actions">
            <button
              type="button"
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
            >
              Clear
            </button>
            <button
              type="button"
              disabled={
                (min && getTodayValue() < min) || (max && getTodayValue() > max)
              }
              onClick={() => {
                const today = getTodayValue();
                if ((!min || today >= min) && (!max || today <= max)) {
                  onChange(today);
                  setMonthDate(new Date());
                  setIsOpen(false);
                }
              }}
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function mergeInvoiceItems(invoices) {
  const merged = new Map();

  invoices.forEach((invoice) => {
    invoice.items.forEach((item) => {
      const key = `${item.name}-${item.unitPrice}`;
      const existing = merged.get(key);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        merged.set(key, { ...item, quantity: item.quantity });
      }
    });
  });

  return [...merged.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function buildReportMarkup(report) {
  const rows = report.items
    .map(
      (item) =>
        `<tr><td><strong>${item.name}</strong><small>${formatMoney(item.unitPrice)}</small></td><td>${item.quantity}</td></tr>`,
    )
    .join("");

  return `<!doctype html><html><head><meta charset="utf-8"><title>Report ${report.startDate} to ${report.endDate}</title><style>body{font-family:Arial,sans-serif;color:#374151;max-width:430px;margin:32px auto;padding:24px}h1{text-align:center}header{text-align:center;border-bottom:1px dashed #d1d5db;padding-bottom:16px}table{width:100%;border-collapse:collapse;margin:20px 0}th,td{text-align:left;padding:9px 0;border-bottom:1px solid #e5e7eb}th:last-child,td:last-child{text-align:right}small{display:block;color:#6b7280;margin-top:4px}.meta{display:flex;justify-content:space-between;gap:12px;margin:12px 0;color:#475569;font-size:12px}.total{display:flex;justify-content:space-between;font-size:18px;font-weight:bold;border-top:1px solid #d1d5db;padding-top:16px}</style></head><body><header><h1>Report</h1><div>${formatDateLabel(report.startDate)} to ${formatDateLabel(report.endDate)}</div><div>${report.includeRefunded ? "Including refunded invoices" : "Excluding refunded invoices"}</div></header><div class="meta"><span>Invoices: <strong>${report.invoices.length}</strong></span><span>Items: <strong>${report.items.reduce((sum, item) => sum + item.quantity, 0)}</strong></span></div><table><thead><tr><th>Items</th><th>Qty</th></tr></thead><tbody>${rows}</tbody></table><div class="total"><span>Total</span><span>${formatMoney(report.total)}</span></div></body></html>`;
}

function printReport(report) {
  const printWindow = window.open("", "_blank", "width=520,height=720");
  if (!printWindow) return;
  printWindow.document.write(buildReportMarkup(report));
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

function downloadReport(report) {
  const pdf = new jsPDF({ unit: "mm", format: [80, 180] });
  const pageWidth = 80;
  const margin = 8;
  let y = 12;

  pdf.setTextColor(55, 65, 81);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  pdf.text("Report", pageWidth / 2, y, { align: "center" });
  y += 7;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.text(
    `${formatDateLabel(report.startDate)} to ${formatDateLabel(report.endDate)}`,
    pageWidth / 2,
    y,
    { align: "center" },
  );
  y += 8;
  pdf.text(
    report.includeRefunded ? "Including refunded" : "Excluding refunded",
    pageWidth / 2,
    y,
    { align: "center" },
  );
  y += 12;

  pdf.setFont("helvetica", "bold");
  pdf.text("Items", margin, y);
  pdf.text("Qty", pageWidth - margin, y, { align: "right" });
  y += 5;
  pdf.setFont("helvetica", "normal");

  report.items.forEach((item) => {
    const itemLines = pdf.splitTextToSize(item.name, 48);
    pdf.text(itemLines, margin, y);
    pdf.text(String(item.quantity), pageWidth - margin, y, { align: "right" });
    y += itemLines.length * 4;
    pdf.setFontSize(7);
    pdf.setTextColor(107, 114, 128);
    pdf.text(formatMoney(item.unitPrice), margin, y);
    pdf.setFontSize(8);
    pdf.setTextColor(55, 65, 81);
    y += 7;
  });

  pdf.setDrawColor(209, 213, 219);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 8;
  pdf.setFont("helvetica", "bold");
  pdf.text("Total", margin, y);
  pdf.setTextColor(20, 184, 166);
  pdf.text(formatMoney(report.total), pageWidth - margin, y, {
    align: "right",
  });
  pdf.save(`report-${report.startDate}-to-${report.endDate}.pdf`);
}

function Reports({ invoices = [], onNotify }) {
  const [storedInvoices, setStoredInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    getSales()
      .then(setStoredInvoices)
      .catch((error) => {
        onNotify?.(error.message, {
          textColor: "#64748b",
          iconColor: "#dc2626",
          progressColor: "#dc2626",
        });
      })
      .finally(() => setIsLoading(false));
  }, [onNotify]);

  const allInvoices = useMemo(
    () =>
      [...storedInvoices, ...invoices]
        .filter(
          (invoice, index, all) =>
            all.findIndex((item) => item.number === invoice.number) === index,
        )
        .map((invoice) => ({
          ...invoice,
          total: invoice.netTotal ?? invoice.total,
          items: invoice.items
            .map((item) => ({
              ...item,
              quantity:
                item.remainingQuantity ??
                Math.max(0, item.quantity - (item.refundedQuantity ?? 0)),
            }))
            .filter((item) => item.quantity > 0),
        })),
    [invoices, storedInvoices],
  );

  const filteredInvoices = useMemo(() => {
    const normalizedStart = startDate || "2000-01-01";
    const normalizedEnd = endDate || "2100-12-31";

    return allInvoices.filter((invoice) => {
      const invoiceDate = getDateKey(invoice.createdAt);
      return invoiceDate >= normalizedStart && invoiceDate <= normalizedEnd;
    });
  }, [allInvoices, endDate, startDate]);

  const handleGenerateReport = () => {
    if (!startDate || !endDate) {
      onNotify?.("Please choose both start and end dates.", {
        textColor: "#64748b",
        iconColor: "#f59e0b",
        progressColor: "#f59e0b",
        icon: (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 8v5" />
            <path d="M12 16h.01" />
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
          </svg>
        ),
      });
      return;
    }

    if (startDate > endDate) {
      onNotify?.("Start date cannot be later than end date.", {
        textColor: "#64748b",
        iconColor: "#f59e0b",
        progressColor: "#f59e0b",
        icon: (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 8v5" />
            <path d="M12 16h.01" />
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
          </svg>
        ),
      });
      return;
    }

    setIsGenerating(true);
    window.setTimeout(() => {
      if (filteredInvoices.length === 0) {
        onNotify?.("No invoices match the selected filters.", {
          textColor: "#64748b",
          iconColor: "#dc2626",
          progressColor: "#dc2626",
          icon: (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
            </svg>
          ),
        });
        setReport(null);
        setIsGenerating(false);
        return;
      }

      const nextReport = {
        startDate,
        endDate,
        includeRefunded: true,
        invoices: filteredInvoices,
        items: mergeInvoiceItems(filteredInvoices),
        total: filteredInvoices.reduce(
          (sum, invoice) => sum + invoice.total,
          0,
        ),
      };
      setReport(nextReport);
      setIsGenerating(false);
    }, 300);
  };

  return (
    <div className="reports-screen">
      <div className="reports-panel__header">
        <h2>Select the date range and generate your report</h2>
      </div>

      <div className="reports-controls">
        <div className="reports-field">
          <span className="reports-field__label">Start date</span>
          <DatePicker
            label="From"
            value={startDate}
            max={endDate || undefined}
            onChange={setStartDate}
          />
        </div>

        <div className="reports-field">
          <span className="reports-field__label">End date</span>
          <DatePicker
            label="To"
            value={endDate}
            min={startDate || undefined}
            onChange={setEndDate}
          />
        </div>

        <button
          type="button"
          className="reports-generate"
          onClick={handleGenerateReport}
          disabled={isGenerating}
        >
          <TbReportAnalytics aria-hidden="true" />
          {isGenerating ? "Generating..." : "Generate"}
        </button>
      </div>

      <div className="reports-panel reports-panel--compact">
        <AnimatePresence mode="wait">
          {isLoading || isGenerating ? (
            <motion.div
              key="loading"
              className="reports-empty"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <LuReceiptText aria-hidden="true" />
              <strong>
                {isLoading ? "Loading sales" : "Generating report"}
              </strong>
              <span>
                {isLoading
                  ? "Loading persisted sales data."
                  : "Compiling the selected date range."}
              </span>
            </motion.div>
          ) : report ? (
            <motion.div
              key="report"
              className="reports-preview-card"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              onClick={() => setShowReportModal(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setShowReportModal(true);
                }
              }}
            >
              <div className="reports-preview-card__content">
                <div className="reports-preview-card__meta">
                  <div className="reports-preview-card__icon-wrap">
                    <LuReceiptText className="reports-preview-card__icon" />
                  </div>
                  <strong>Report</strong>
                </div>
                <div className="reports-preview-card__details">
                  <div className="reports-preview-card__divider" />
                  <div className="reports-preview-card__date-row">
                    <LuCalendarDays className="reports-preview-card__date-icon" />
                    <div className="reports-preview-card__date-text">
                      <span className="reports-preview-card__date-label">
                        From
                      </span>
                      <span>{formatDateLabel(report.startDate)}</span>
                    </div>
                  </div>
                  <div className="reports-preview-card__date-row">
                    <LuCalendarDays className="reports-preview-card__date-icon" />
                    <div className="reports-preview-card__date-text">
                      <span className="reports-preview-card__date-label">
                        To
                      </span>
                      <span>{formatDateLabel(report.endDate)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              className="reports-empty"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <LuReceiptText aria-hidden="true" />
              <strong>No report yet</strong>
              <span>Select the filters and generate the summary.</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showReportModal && report ? (
            <motion.div
              className="sales-modal"
              role="presentation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onMouseDown={(event) => {
                if (event.target === event.currentTarget)
                  setShowReportModal(false);
              }}
            >
              <motion.section
                className="sales-invoice-paper"
                role="dialog"
                aria-modal="true"
                aria-labelledby="reports-title"
                initial={{ opacity: 0, y: 18, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.97 }}
                transition={{ type: "spring", stiffness: 360, damping: 28 }}
              >
                <button
                  type="button"
                  className="sales-invoice-paper__close"
                  onClick={() => setShowReportModal(false)}
                  aria-label="Close report"
                >
                  <LuX aria-hidden="true" />
                </button>

                <div className="sales-invoice-paper__actions">
                  <button
                    type="button"
                    onClick={() => printReport(report)}
                    aria-label="Print report"
                    title="Print report"
                  >
                    <LuPrinter aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadReport(report)}
                    aria-label="Download report"
                    title="Download report"
                  >
                    <LuDownload aria-hidden="true" />
                  </button>
                </div>

                <div className="sales-invoice-paper__header">
                  <span>Report</span>
                  <h2 id="reports-title">
                    {formatDateLabel(report.startDate)} To{" "}
                    {formatDateLabel(report.endDate)}
                  </h2>
                </div>

                <div className="sales-invoice-paper__items">
                  <div className="sales-invoice-paper__items-heading">
                    <div className="sales-invoice-paper__items-heading-left">
                      <span>Items</span>
                      <span className="sales-invoice-paper__items-total">
                        {report.items.reduce(
                          (sum, item) => sum + item.quantity,
                          0,
                        )}
                      </span>
                    </div>
                    <span>Qty</span>
                  </div>
                  {report.items.length > 0 ? (
                    report.items.map((item) => (
                      <div
                        className="sales-invoice-paper__item"
                        key={item.id || item.name}
                      >
                        <div>
                          <strong>{item.name}</strong>
                          <span>{formatMoney(item.unitPrice)}</span>
                        </div>
                        <strong>{item.quantity}</strong>
                      </div>
                    ))
                  ) : (
                    <div className="reports-empty-state">
                      No items matched this filter.
                    </div>
                  )}
                </div>

                <div className="sales-invoice-paper__total">
                  <span>Total revenue</span>
                  <strong>{formatMoney(report.total)}</strong>
                </div>
              </motion.section>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Reports;
