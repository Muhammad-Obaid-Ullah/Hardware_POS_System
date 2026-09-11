import { useEffect, useMemo, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import { AnimatePresence, motion } from "motion/react";
import {
  LuCalendarDays,
  LuChevronLeft,
  LuChevronRight,
  LuDownload,
  LuMinus,
  LuPencil,
  LuPrinter,
  LuReceiptText,
  LuRotateCcw,
  LuSearch,
  LuTrash2,
  LuUndo2,
  LuUndoDot,
  LuSave,
  LuX,
} from "react-icons/lu";
import "./Sales.scss";

const formatMoney = (amount) => `PKR ${amount.toLocaleString()}`;

function getInvoiceMarkup(invoice) {
  const items = invoice.items
    .map(
      (item) =>
        `<tr><td><strong>${item.name}</strong><small>${formatMoney(item.unitPrice)}</small></td><td>${item.quantity}</td></tr>`,
    )
    .join("");
  return `<!doctype html><html><head><meta charset="utf-8"><title>INV-${invoice.number}</title><style>body{font-family:Arial,sans-serif;color:#374151;max-width:430px;margin:32px auto;padding:24px}h1{text-align:center}header{text-align:center;border-bottom:1px dashed #d1d5db;padding-bottom:16px}table{width:100%;border-collapse:collapse;margin:20px 0}th,td{text-align:left;padding:9px 0;border-bottom:1px solid #e5e7eb}th:last-child,td:last-child{text-align:right}small{display:block;color:#6b7280;margin-top:4px}.total{display:flex;justify-content:space-between;font-size:18px;font-weight:bold;border-top:1px solid #d1d5db;padding-top:16px}</style></head><body><header><h1>Invoice</h1><div>INV-${invoice.number}</div><div>${invoice.date} at ${invoice.time}</div></header><table><thead><tr><th>Items</th><th>Qty</th></tr></thead><tbody>${items}</tbody></table><div class="total"><span>Total price</span><span>${formatMoney(invoice.total)}</span></div><p>Payment method: <strong>${invoice.paymentMethod === "online" ? "Online" : "Cash"}</strong></p>${invoice.transactionNumber ? `<p>Transaction #${invoice.transactionNumber}</p>` : ""}</body></html>`;
}

function downloadInvoice(invoice) {
  const pdf = new jsPDF({ unit: "mm", format: [80, 180] });
  const pageWidth = 80;
  const margin = 8;
  let y = 12;

  pdf.setTextColor(55, 65, 81);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  pdf.text("Invoice", pageWidth / 2, y, { align: "center" });
  y += 7;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.text(`INV-${invoice.number}`, pageWidth / 2, y, { align: "center" });
  y += 5;
  pdf.text(`${invoice.date} at ${invoice.time}`, pageWidth / 2, y, {
    align: "center",
  });
  y += 7;
  pdf.setDrawColor(209, 213, 219);
  pdf.setLineDashPattern([1, 1], 0);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 7;

  pdf.setFont("helvetica", "bold");
  pdf.text("Items", margin, y);
  pdf.text("Qty", pageWidth - margin, y, { align: "right" });
  y += 5;
  pdf.setFont("helvetica", "normal");

  invoice.items.forEach((item) => {
    const itemLines = pdf.splitTextToSize(item.name, 48);
    pdf.text(itemLines, margin, y);
    pdf.text(String(item.quantity), pageWidth - margin, y, { align: "right" });
    y += itemLines.length * 4;
    pdf.setFontSize(8);
    pdf.setTextColor(107, 114, 128);
    pdf.text(formatMoney(item.unitPrice), margin, y);
    pdf.setFontSize(9);
    pdf.setTextColor(55, 65, 81);
    y += 7;
  });

  pdf.setDrawColor(209, 213, 219);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 7;
  pdf.setFont("helvetica", "bold");
  pdf.text("Total price", margin, y);
  pdf.setTextColor(20, 184, 166);
  pdf.text(formatMoney(invoice.total), pageWidth - margin, y, {
    align: "right",
  });
  y += 8;
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(55, 65, 81);
  pdf.text(
    `Payment method: ${invoice.paymentMethod === "online" ? "Online" : "Cash"}`,
    margin,
    y,
  );
  if (invoice.paymentMethod === "online" && invoice.transactionNumber) {
    y += 5;
    pdf.setFontSize(8);
    pdf.text(`Transaction #${invoice.transactionNumber}`, margin, y);
  }

  pdf.save(`INV-${invoice.number}.pdf`);
}

function printInvoice(invoice) {
  const printWindow = window.open("", "_blank", "width=520,height=720");
  if (!printWindow) return;
  printWindow.document.write(getInvoiceMarkup(invoice));
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

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

function getTodayValue() {
  const today = new Date();
  return [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
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
            {weekDays.map((day) => (
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

function makeDummyInvoice(
  number,
  daysAgo,
  items,
  paymentMethod,
  transactionNumber = "",
) {
  const createdAt = new Date();
  createdAt.setDate(createdAt.getDate() - daysAgo);
  createdAt.setHours(9 + (number.slice(-1) % 8), 25, 0, 0);
  return {
    number,
    createdAt: createdAt.toISOString(),
    date: createdAt.toLocaleDateString(),
    time: createdAt.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
    items,
    total: items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    paymentMethod,
    transactionNumber,
  };
}

const dummyInvoices = [
  makeDummyInvoice(
    "840271",
    0,
    [
      { id: 1, name: "USB Barcode Scanner", quantity: 2, unitPrice: 4500 },
      { id: 2, name: "Thermal Paper Roll", quantity: 4, unitPrice: 350 },
    ],
    "cash",
  ),
  makeDummyInvoice(
    "840270",
    0,
    [{ id: 6, name: "Receipt Printer", quantity: 1, unitPrice: 18500 }],
    "online",
    "TRX-20260827-01",
  ),
  makeDummyInvoice(
    "840269",
    1,
    [
      { id: 43, name: "Interior Paint Can", quantity: 2, unitPrice: 6800 },
      { id: 23, name: "HDMI Adapter", quantity: 1, unitPrice: 950 },
    ],
    "cash",
  ),
  makeDummyInvoice(
    "840268",
    7,
    [
      { id: 21, name: "POS Touch Monitor", quantity: 1, unitPrice: 32500 },
      { id: 14, name: "Wireless Mouse", quantity: 2, unitPrice: 1500 },
    ],
    "online",
    "TRX-20260820-04",
  ),
];

function getDateKey(dateValue) {
  const date = new Date(dateValue);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function InvoiceReceipt({ invoice, onClose, onRefund, onPartiallyRefund }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftItems, setDraftItems] = useState(invoice.items);

  const decreaseItem = (itemId) => {
    setDraftItems((items) =>
      items
        .map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };
  const removeItem = (itemId) => {
    setDraftItems((items) => items.filter((item) => item.id !== itemId));
  };
  const savePartialRefund = () => {
    const hasQuantityChanges =
      draftItems.length !== invoice.items.length ||
      draftItems.some(
        (draftItem) =>
          draftItem.quantity !==
          invoice.items.find((item) => item.id === draftItem.id)?.quantity,
      );

    if (!hasQuantityChanges) {
      setIsEditing(false);
      return;
    }

    if (draftItems.length === 0) {
      onPartiallyRefund(invoice.number, invoice.items, invoice.total, true);
      setIsEditing(false);
      return;
    }

    const total = draftItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );
    onPartiallyRefund(invoice.number, draftItems, total, false);
    setIsEditing(false);
  };

  return (
    <motion.div
      className="sales-modal"
      role="presentation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.section
        className="sales-invoice-paper"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sales-invoice-title"
        initial={{ opacity: 0, y: 18, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 360, damping: 28 }}
      >
        <button
          type="button"
          className="sales-invoice-paper__close"
          onClick={onClose}
          aria-label="Close invoice"
        >
          <LuX aria-hidden="true" />
        </button>
        <div className="sales-invoice-paper__actions">
          <button
            type="button"
            onClick={() => downloadInvoice(invoice)}
            aria-label="Download invoice"
            title="Download invoice"
          >
            <LuDownload aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => printInvoice(invoice)}
            aria-label="Print invoice"
            title="Print invoice"
          >
            <LuPrinter aria-hidden="true" />
          </button>
          {!invoice.refunded && !isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              aria-label="Edit invoice"
              title="Edit invoice"
            >
              <LuPencil aria-hidden="true" />
            </button>
          )}
          {isEditing && (
            <button
              type="button"
              onClick={savePartialRefund}
              aria-label="Save invoice changes"
              title="Save invoice changes"
            >
              <LuSave aria-hidden="true" />
            </button>
          )}
          {!invoice.refunded && !isEditing && (
            <button
              type="button"
              className="sales-invoice-paper__refund"
              onClick={() => onRefund(invoice.number)}
              aria-label="Refund invoice"
              title="Refund invoice"
            >
              <LuUndo2 aria-hidden="true" />
            </button>
          )}
        </div>
        <div className="sales-invoice-paper__header">
          <span>Payment receipt</span>
          <h2 id="sales-invoice-title">Invoice</h2>
          <strong>INV-{invoice.number}</strong>
        </div>
        <div className="sales-invoice-paper__meta">
          <span>
            Date<strong>{invoice.date}</strong>
          </span>
          <span>
            Time<strong>{invoice.time}</strong>
          </span>
        </div>
        <div className="sales-invoice-paper__items">
          <div className="sales-invoice-paper__items-heading">
            <span>Items</span>
            <span>Qty</span>
          </div>
          <AnimatePresence initial={false} mode="popLayout">
            {draftItems.map((item) => (
              <motion.div
                className="sales-invoice-paper__item"
                key={item.id}
                layout
                initial={{ opacity: 0, height: 0, y: -8 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div>
                  <strong>{item.name}</strong>
                  <span>{formatMoney(item.unitPrice)}</span>
                </div>
                {isEditing ? (
                  <span className="sales-invoice-paper__edit-controls">
                    <button
                      type="button"
                      onClick={() => decreaseItem(item.id)}
                      aria-label={`Decrease ${item.name} quantity`}
                    >
                      <LuMinus aria-hidden="true" />
                    </button>
                    <strong>{item.quantity}</strong>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.name} from invoice`}
                    >
                      <LuTrash2 aria-hidden="true" />
                    </button>
                  </span>
                ) : (
                  <strong>{item.quantity}</strong>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="sales-invoice-paper__total">
          <span>Total price</span>
          <strong>{formatMoney(invoice.total)}</strong>
        </div>
        <div className="sales-invoice-paper__payment">
          <span>Payment method</span>
          <strong>
            {invoice.paymentMethod === "online" ? "Online" : "Cash"}
          </strong>
          {invoice.paymentMethod === "online" && invoice.transactionNumber && (
            <small>Transaction #{invoice.transactionNumber}</small>
          )}
        </div>
        <AnimatePresence initial={false}>
          {(invoice.refunded || invoice.partiallyRefunded) && (
            <motion.div
              className="sales-invoice-paper__status-flags"
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.96 }}
            >
              {invoice.refunded && (
                <motion.span layout className="sales-refunded-badge">
                  Refunded
                </motion.span>
              )}
              {invoice.partiallyRefunded && (
                <motion.span layout className="sales-partial-refunded-badge">
                  Partially-refunded
                </motion.span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>
    </motion.div>
  );
}

function Sales({
  invoices = [],
  onInvoiceRefunded,
  onInvoicePartiallyRefunded,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [refundedInvoiceNumbers, setRefundedInvoiceNumbers] = useState([]);
  const [partialRefunds, setPartialRefunds] = useState({});
  const allInvoices = useMemo(
    () =>
      [...invoices, ...dummyInvoices].map((invoice) => ({
        ...invoice,
        ...(partialRefunds[invoice.number] ?? {}),
        refunded:
          invoice.refunded || refundedInvoiceNumbers.includes(invoice.number),
        partiallyRefunded:
          !(
            invoice.refunded || refundedInvoiceNumbers.includes(invoice.number)
          ) &&
          (partialRefunds[invoice.number]?.partiallyRefunded ??
            invoice.partiallyRefunded ??
            false),
      })),
    [invoices, partialRefunds, refundedInvoiceNumbers],
  );
  const refundInvoice = (invoiceNumber) => {
    setRefundedInvoiceNumbers((numbers) =>
      numbers.includes(invoiceNumber) ? numbers : [...numbers, invoiceNumber],
    );
    setPartialRefunds((current) => ({
      ...current,
      [invoiceNumber]: {
        ...current[invoiceNumber],
        refunded: true,
        partiallyRefunded: false,
      },
    }));
    onInvoiceRefunded?.(invoiceNumber);
    setSelectedInvoice((invoice) =>
      invoice?.number === invoiceNumber
        ? { ...invoice, refunded: true, partiallyRefunded: false }
        : invoice,
    );
  };
  const partiallyRefundInvoice = (
    invoiceNumber,
    items,
    total,
    isFullyRefunded = false,
  ) => {
    const update = {
      items,
      total,
      refunded: isFullyRefunded,
      partiallyRefunded: !isFullyRefunded,
    };
    setPartialRefunds((current) => ({ ...current, [invoiceNumber]: update }));
    if (isFullyRefunded) {
      setRefundedInvoiceNumbers((numbers) =>
        numbers.includes(invoiceNumber) ? numbers : [...numbers, invoiceNumber],
      );
    }
    onInvoicePartiallyRefunded?.(invoiceNumber, items, total, isFullyRefunded);
    setSelectedInvoice((invoice) =>
      invoice?.number === invoiceNumber ? { ...invoice, ...update } : invoice,
    );
  };
  const visibleInvoices = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return allInvoices.filter((invoice) => {
      const matchesNumber = `inv-${invoice.number}`.includes(query);
      const invoiceDate = getDateKey(invoice.createdAt);
      const matchesFromDate = !fromDate || invoiceDate >= fromDate;
      const matchesToDate = !toDate || invoiceDate <= toDate;
      return matchesNumber && matchesFromDate && matchesToDate;
    });
  }, [allInvoices, fromDate, searchTerm, toDate]);

  return (
    <div className="sales-screen">
      <div className="sales-toolbar pos-product-filters">
        <label className="pos-product-filters__search">
          <LuSearch aria-hidden="true" />
          <span className="sr-only">Search invoices by invoice number</span>
          <input
            type="search"
            placeholder="Search invoice number"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </label>
        <DatePicker
          label="From"
          value={fromDate}
          max={toDate}
          onChange={setFromDate}
        />
        <DatePicker
          label="To"
          value={toDate}
          min={fromDate}
          onChange={setToDate}
        />
      </div>
      <div className="sales-results-header">
        <div>
          <span className="sales-eyebrow">Transaction history</span>
          <h2>All invoices</h2>
        </div>
        <span className="sales-count">{visibleInvoices.length} invoices</span>
      </div>
      <div className="sales-invoice-list">
        {visibleInvoices.length === 0 ? (
          <div className="sales-empty">
            <LuReceiptText aria-hidden="true" />
            <strong>No invoices found</strong>
            <span>Completed checkouts will appear here.</span>
          </div>
        ) : (
          visibleInvoices.map((invoice) => (
            <motion.div
              role="button"
              tabIndex="0"
              className="sales-invoice-row"
              key={invoice.number}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22 }}
              onClick={() => setSelectedInvoice(invoice)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setSelectedInvoice(invoice);
                }
              }}
            >
              <div className="sales-invoice-row__header">
                <span className="sales-invoice-row__icon">
                  <LuReceiptText aria-hidden="true" />
                </span>
                <motion.span className="sales-invoice-row__main" layout>
                  <span className="sales-invoice-row__number">
                    <strong>INV-{invoice.number}</strong>
                  </span>
                  <span className="sales-invoice-row__date">
                    {invoice.date} at {invoice.time}
                  </span>
                </motion.span>
                <motion.div className="sales-invoice-row__actions" layout>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      downloadInvoice(invoice);
                    }}
                    aria-label={`Download invoice ${invoice.number}`}
                    title="Download invoice"
                  >
                    <LuDownload aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      printInvoice(invoice);
                    }}
                    aria-label={`Print invoice ${invoice.number}`}
                    title="Print invoice"
                  >
                    <LuPrinter aria-hidden="true" />
                  </button>
                  {!invoice.refunded && (
                    <button
                      type="button"
                      className="sales-invoice-row__refund"
                      onClick={(event) => {
                        event.stopPropagation();
                        refundInvoice(invoice.number);
                      }}
                      aria-label={`Refund invoice ${invoice.number}`}
                      title="Refund invoice"
                    >
                      <LuUndo2 aria-hidden="true" />
                    </button>
                  )}
                </motion.div>
              </div>
              <div className="sales-invoice-row__tags">
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.span className="sales-invoice-row__status" layout>
                    {invoice.refunded && (
                      <motion.span
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="sales-refunded-badge"
                      >
                        <LuRotateCcw aria-hidden="true" />
                        Refunded
                      </motion.span>
                    )}
                    {invoice.partiallyRefunded && (
                      <motion.span
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="sales-partial-refunded-badge"
                      >
                        <LuUndoDot aria-hidden="true" />
                        Partially-refunded
                      </motion.span>
                    )}
                  </motion.span>
                </AnimatePresence>
              </div>
              <div className="sales-invoice-row__footer">
                <span className="sales-invoice-row__total">
                  {formatMoney(invoice.total)}
                </span>
                <LuChevronRight
                  className="sales-invoice-row__arrow"
                  aria-hidden="true"
                />
              </div>
            </motion.div>
          ))
        )}
      </div>
      <AnimatePresence>
        {selectedInvoice && (
          <InvoiceReceipt
            key={`${selectedInvoice.number}-${selectedInvoice.total}-${selectedInvoice.refunded}-${selectedInvoice.partiallyRefunded}-${selectedInvoice.items.map((item) => `${item.id}:${item.quantity}`).join(",")}`}
            invoice={selectedInvoice}
            onClose={() => setSelectedInvoice(null)}
            onRefund={refundInvoice}
            onPartiallyRefund={partiallyRefundInvoice}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Sales;
