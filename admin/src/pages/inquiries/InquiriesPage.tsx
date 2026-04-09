import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { createColumnHelper } from "@tanstack/react-table";
import { Eye, MessageSquare, Wrench, Send } from "lucide-react";
import type { Inquiry, ServiceRequest } from "@/types";
import { MOCK_INQUIRIES, MOCK_SERVICE_REQUESTS } from "@/lib/mock-data";
import { formatDate, formatDateTime, cn } from "@/lib/utils";
import DataTable from "@/components/common/DataTable";
import Badge from "@/components/common/Badge";
import StatusBadge from "@/components/common/StatusBadge";
import SearchInput from "@/components/common/SearchInput";
import Breadcrumb from "@/components/common/Breadcrumb";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";

/* ------------------------------------------------------------------ */
/*  Animation variants                                                */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

/* ------------------------------------------------------------------ */
/*  Inquiry columns                                                   */
/* ------------------------------------------------------------------ */

const inquiryHelper = createColumnHelper<Inquiry>();

const inquiryColumns = (onView: (inquiry: Inquiry) => void) => [
  inquiryHelper.accessor("name", {
    header: "Customer",
    cell: (info) => (
      <div>
        <div className="font-medium text-gray-900">
          {info.row.original.name}
        </div>
        <div className="text-xs text-gray-500">{info.row.original.email}</div>
      </div>
    ),
  }),
  inquiryHelper.accessor("inquiryType", {
    header: "Type",
    cell: (info) => (
      <Badge variant="teal">
        {info
          .getValue()
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase())}
      </Badge>
    ),
  }),
  inquiryHelper.accessor("message", {
    header: "Message",
    cell: (info) => (
      <span className="max-w-[200px] truncate block" title={info.getValue()}>
        {info.getValue().length > 50
          ? info.getValue().slice(0, 50) + "…"
          : info.getValue()}
      </span>
    ),
  }),
  inquiryHelper.accessor("status", {
    header: "Status",
    cell: (info) => <StatusBadge status={info.getValue()} type="inquiry" />,
  }),
  inquiryHelper.accessor("createdAt", {
    header: "Date",
    cell: (info) => formatDate(info.getValue()),
  }),
  inquiryHelper.display({
    id: "actions",
    header: "",
    cell: (info) => (
      <button
        onClick={() => onView(info.row.original)}
        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-teal hover:bg-gray-100 transition"
      >
        <Eye size={16} />
      </button>
    ),
  }),
];

/* ------------------------------------------------------------------ */
/*  Service Request columns                                           */
/* ------------------------------------------------------------------ */

const serviceHelper = createColumnHelper<ServiceRequest>();

const serviceColumns = (onView: (sr: ServiceRequest) => void) => [
  serviceHelper.accessor("name", {
    header: "Customer",
    cell: (info) => (
      <div>
        <div className="font-medium text-gray-900">
          {info.row.original.name}
        </div>
        <div className="text-xs text-gray-500">
          {info.row.original.email ?? info.row.original.phone}
        </div>
      </div>
    ),
  }),
  serviceHelper.accessor("serviceTypeName", {
    header: "Service",
    cell: (info) => (
      <div className="flex items-center gap-2">
        <span>{info.getValue()}</span>
        <Badge variant="teal">{info.row.original.urgency}</Badge>
      </div>
    ),
  }),
  serviceHelper.accessor("installationAddress", {
    header: "Address",
    cell: (info) => (
      <span className="max-w-[180px] truncate block">
        {info.getValue() || "Not specified"}
      </span>
    ),
  }),
  serviceHelper.accessor("status", {
    header: "Status",
    cell: (info) => (
      <StatusBadge status={info.getValue()} type="serviceRequest" />
    ),
  }),
  serviceHelper.accessor("createdAt", {
    header: "Date",
    cell: (info) => formatDate(info.getValue()),
  }),
  serviceHelper.display({
    id: "actions",
    header: "",
    cell: (info) => (
      <button
        onClick={() => onView(info.row.original)}
        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-teal hover:bg-gray-100 transition"
      >
        <Eye size={16} />
      </button>
    ),
  }),
];

/* ------------------------------------------------------------------ */
/*  Tabs definition                                                   */
/* ------------------------------------------------------------------ */

type Tab = "inquiries" | "service-requests";

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  {
    key: "inquiries",
    label: "General Inquiries",
    icon: <MessageSquare size={16} />,
  },
  {
    key: "service-requests",
    label: "Service Requests",
    icon: <Wrench size={16} />,
  },
];

/* ------------------------------------------------------------------ */
/*  Page component                                                    */
/* ------------------------------------------------------------------ */

export default function InquiriesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("inquiries");
  const [searchTerm, setSearchTerm] = useState("");
  const [newNote, setNewNote] = useState("");

  // Inquiry detail modal
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  // Service-request detail modal
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(
    null,
  );

  /* ---------- filtered data ---------- */

  const filteredInquiries = useMemo(() => {
    if (!searchTerm.trim()) return MOCK_INQUIRIES;
    const term = searchTerm.toLowerCase();
    return MOCK_INQUIRIES.filter(
      (i) =>
        i.name.toLowerCase().includes(term) ||
        i.email.toLowerCase().includes(term) ||
        i.message.toLowerCase().includes(term),
    );
  }, [searchTerm]);

  const filteredRequests = useMemo(() => {
    if (!searchTerm.trim()) return MOCK_SERVICE_REQUESTS;
    const term = searchTerm.toLowerCase();
    return MOCK_SERVICE_REQUESTS.filter(
      (r) =>
        r.name.toLowerCase().includes(term) ||
        r.serviceTypeName.toLowerCase().includes(term) ||
        (r.email ?? "").toLowerCase().includes(term),
    );
  }, [searchTerm]);

  /* ---------- render ---------- */

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {/* Breadcrumb */}
      <motion.div variants={itemVariants}>
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/" },
            { label: "Inquiries & Requests" },
          ]}
        />
      </motion.div>

      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex justify-between items-center mb-6 mt-4"
      >
        <h1 className="text-2xl font-bold text-navy">
          Inquiries &amp; Requests
        </h1>
      </motion.div>

      {/* Tabs */}
      <motion.div
        variants={itemVariants}
        className="border-b border-gray-200 mb-6"
      >
        <div className="flex gap-0">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setSearchTerm("");
              }}
              className={cn(
                "flex items-center gap-2 border-b-2 pb-2 px-4 text-sm font-medium transition",
                activeTab === tab.key
                  ? "border-teal text-teal"
                  : "border-transparent text-gray-500 hover:text-gray-700",
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Search */}
      <motion.div variants={itemVariants} className="mb-6">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder={
            activeTab === "inquiries"
              ? "Search inquiries…"
              : "Search service requests…"
          }
        />
      </motion.div>

      {/* Table */}
      <motion.div variants={itemVariants}>
        {activeTab === "inquiries" ? (
          <DataTable
            columns={inquiryColumns(setSelectedInquiry)}
            data={filteredInquiries}
            emptyMessage="No inquiries found"
          />
        ) : (
          <DataTable
            columns={serviceColumns(setSelectedRequest)}
            data={filteredRequests}
            emptyMessage="No service requests found"
          />
        )}
      </motion.div>

      {/* ============================================================ */}
      {/*  Inquiry Detail Modal                                        */}
      {/* ============================================================ */}
      <Modal
        isOpen={!!selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
        title="Inquiry Details"
        size="lg"
      >
        {selectedInquiry && (
          <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
            {/* Customer info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Customer</span>
                <p className="font-medium text-gray-900">
                  {selectedInquiry.name}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Email</span>
                <p className="font-medium text-gray-900">
                  {selectedInquiry.email}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Phone</span>
                <p className="font-medium text-gray-900">
                  {selectedInquiry.phone}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Type</span>
                <div className="mt-0.5">
                  <Badge variant="teal">
                    {selectedInquiry.inquiryType
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </Badge>
                </div>
              </div>
              <div>
                <span className="text-gray-500">Status</span>
                <div className="mt-0.5">
                  <StatusBadge status={selectedInquiry.status} type="inquiry" />
                </div>
              </div>
              <div>
                <span className="text-gray-500">Date</span>
                <p className="font-medium text-gray-900">
                  {formatDateTime(selectedInquiry.createdAt)}
                </p>
              </div>
            </div>

            {/* Message */}
            <div>
              <span className="text-sm text-gray-500">Message</span>
              <p className="mt-1 text-sm text-gray-800 bg-gray-50 rounded-lg p-3 whitespace-pre-wrap">
                {selectedInquiry.message}
              </p>
            </div>

            {/* Notes timeline */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Notes
              </h4>
              {selectedInquiry.notes.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No notes yet.</p>
              ) : (
                <div className="space-y-3">
                  {selectedInquiry.notes.map((note) => (
                    <div
                      key={note.id}
                      className="relative pl-4 border-l-2 border-teal/30"
                    >
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="font-medium text-gray-700">
                          {note.createdBy}
                        </span>
                        <span>·</span>
                        <span>{formatDateTime(note.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-800 mt-0.5">
                        {note.note}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add note */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Add Note
              </h4>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-300 text-sm px-3 py-2 focus:ring-2 focus:ring-teal focus:border-teal outline-none transition resize-none"
                placeholder="Write a note…"
              />
              <div className="flex justify-end mt-2">
                <Button
                  size="sm"
                  leftIcon={<Send size={14} />}
                  disabled={!newNote.trim()}
                >
                  Add Note
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* ============================================================ */}
      {/*  Service Request Detail Modal                                */}
      {/* ============================================================ */}
      <Modal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        title="Service Request Details"
        size="lg"
      >
        {selectedRequest && (
          <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
            {/* Customer info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Customer</span>
                <p className="font-medium text-gray-900">
                  {selectedRequest.name}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Phone</span>
                <p className="font-medium text-gray-900">
                  {selectedRequest.phone}
                </p>
              </div>
              {selectedRequest.email && (
                <div>
                  <span className="text-gray-500">Email</span>
                  <p className="font-medium text-gray-900">
                    {selectedRequest.email}
                  </p>
                </div>
              )}
              <div>
                <span className="text-gray-500">Service</span>
                <p className="font-medium text-gray-900">
                  {selectedRequest.serviceTypeName}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Urgency</span>
                <div className="mt-0.5">
                  <Badge
                    variant={
                      selectedRequest.urgency === "emergency"
                        ? "error"
                        : selectedRequest.urgency === "urgent"
                          ? "warning"
                          : "default"
                    }
                  >
                    {selectedRequest.urgency.charAt(0).toUpperCase() +
                      selectedRequest.urgency.slice(1)}
                  </Badge>
                </div>
              </div>
              {selectedRequest.unitBrand && (
                <div>
                  <span className="text-gray-500">Unit Brand</span>
                  <p className="font-medium text-gray-900">
                    {selectedRequest.unitBrand}
                  </p>
                </div>
              )}
              <div>
                <span className="text-gray-500">Status</span>
                <div className="mt-0.5">
                  <StatusBadge
                    status={selectedRequest.status}
                    type="serviceRequest"
                  />
                </div>
              </div>
              <div>
                <span className="text-gray-500">Date</span>
                <p className="font-medium text-gray-900">
                  {formatDateTime(selectedRequest.createdAt)}
                </p>
              </div>
            </div>

            {/* Installation address */}
            {selectedRequest.installationAddress && (
              <div>
                <span className="text-sm text-gray-500">
                  Installation Address
                </span>
                <p className="mt-1 text-sm text-gray-800 bg-gray-50 rounded-lg p-3">
                  {selectedRequest.installationAddress}
                </p>
              </div>
            )}

            {/* Message */}
            {selectedRequest.message && (
              <div>
                <span className="text-sm text-gray-500">Additional Notes</span>
                <p className="mt-1 text-sm text-gray-800 bg-gray-50 rounded-lg p-3 whitespace-pre-wrap">
                  {selectedRequest.message}
                </p>
              </div>
            )}

            {/* Notes timeline */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Notes
              </h4>
              {selectedRequest.notes.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No notes yet.</p>
              ) : (
                <div className="space-y-3">
                  {selectedRequest.notes.map((note) => (
                    <div
                      key={note.id}
                      className="relative pl-4 border-l-2 border-teal/30"
                    >
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="font-medium text-gray-700">
                          {note.createdBy}
                        </span>
                        <span>·</span>
                        <span>{formatDateTime(note.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-800 mt-0.5">
                        {note.note}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
}
