"use client";

import { useState, useEffect } from "react";
import {
  Database,
  Search,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Trash2,
  Save,
  X,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

interface TableInfo {
  name: string;
  model: string;
  count: number;
}

interface DatabaseStats {
  tables: TableInfo[];
}

interface QueryResult {
  records: any[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const tableLabels: Record<string, string> = {
  User: "Users",
  Patient: "Patients",
  Doctor: "Doctors",
  Service: "Services",
  Location: "Locations",
  Appointment: "Appointments",
  TreatmentRecord: "Treatment Records",
  Invoice: "Invoices",
  Message: "Messages",
  ContactMessage: "Contact Messages",
  SiteSetting: "Site Settings",
  Testimonial: "Testimonials",
  TeamMember: "Team Members",
  PageImage: "Page Images",
};

const tableIcons: Record<string, string> = {
  User: "",
  Patient: "",
  Doctor: "",
  Service: "",
  Location: "",
  Appointment: "",
  TreatmentRecord: "",
  Invoice: "",
  Message: "",
  ContactMessage: "",
  SiteSetting: "",
  Testimonial: "",
  TeamMember: "",
  PageImage: "",
};

export default function DatabaseManager() {
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [result, setResult] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Fetch table list
  const fetchTables = async () => {
    try {
      const res = await fetch("/api/admin/database");
      const data = await res.json();
      setTables(data.tables);
    } catch (e) {
      setError("Failed to load tables");
    }
  };

  // Fetch records for a table
  const fetchRecords = async (table: string, page = 1, searchTerm = "") => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ table, page: String(page) });
      if (searchTerm) params.set("search", searchTerm);
      const res = await fetch(`/api/admin/database?${params}`);
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError("Failed to load records");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTables();
  }, []);

  useEffect(() => {
    if (selectedTable) {
      setLoading(true);
      fetchRecords(selectedTable, 1, "");
    }
  }, [selectedTable]);

  // Handle search
  const handleSearch = () => {
    if (selectedTable) {
      fetchRecords(selectedTable, 1, search);
    }
  };

  // Handle page change
  const handlePage = (page: number) => {
    if (selectedTable) {
      fetchRecords(selectedTable, page, search);
    }
  };

  // Start editing a record
  const startEdit = (record: any) => {
    setEditingId(record.id);
    setEditData({ ...record });
  };

  // Save edited record
  const saveEdit = async () => {
    if (!editingId || !selectedTable) return;
    try {
      const res = await fetch(`/api/admin/database/${selectedTable}/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      if (res.ok) {
        setEditingId(null);
        setEditData({});
        fetchRecords(selectedTable, result?.page || 1, search);
        fetchTables();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save");
      }
    } catch (e) {
      setError("Failed to save record");
    }
  };

  // Delete a record
  const deleteRecord = async (id: string) => {
    if (!selectedTable) return;
    try {
      const res = await fetch(`/api/admin/database/${selectedTable}/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeleteConfirm(null);
        fetchRecords(selectedTable, result?.page || 1, search);
        fetchTables();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to delete");
      }
    } catch (e) {
      setError("Failed to delete record");
    }
  };

  // Format cell value for display
  const formatValue = (key: string, value: any): string => {
    if (value === null || value === undefined) return "—";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (key === "password") return "••••••••";
    if (key === "createdAt" || key === "updatedAt") {
      return new Date(value).toLocaleString();
    }
    if (typeof value === "object") {
      try {
        return JSON.stringify(value).substring(0, 50) + "...";
      } catch {
        return "[Object]";
      }
    }
    const str = String(value);
    return str.length > 60 ? str.substring(0, 60) + "..." : str;
  };

  // Get column names to display
  const getDisplayColumns = (table: string): string[] => {
    const columnMap: Record<string, string[]> = {
      User: ["name", "email", "role", "phone", "profile", "createdAt"],
      Patient: ["userName", "userEmail", "dateOfBirth", "insurance", "appointments"],
      Doctor: ["userName", "userEmail", "specialty", "rating", "active"],
      Service: ["name", "category", "duration", "image", "active"],
      Location: ["name", "city", "state", "phone", "active"],
      Appointment: ["patientName", "doctorName", "service", "date", "time", "status"],
      TreatmentRecord: ["patientName", "doctorName", "date", "description"],
      Invoice: ["patientName", "amount", "status", "description"],
      Message: ["senderName", "threadId", "content", "read", "timestamp"],
      ContactMessage: ["name", "email", "phone", "status", "createdAt"],
      SiteSetting: ["key", "value"],
      Testimonial: ["name", "text", "rating", "active"],
      TeamMember: ["name", "title", "email", "specialty", "active"],
      PageImage: ["pageKey", "heroTitle", "heroSubtitle"],
    };
    return columnMap[table] || ["id"];
  };

  // Get display value for a column (handles relations)
  const getColumnValue = (table: string, record: any, col: string): any => {
    // Handle computed/relation columns
    if (col === "userName") return record.user?.name || "—";
    if (col === "userEmail") return record.user?.email || "—";
    if (col === "patientName") return record.patient?.user?.name || "—";
    if (col === "doctorName") return record.doctor?.user?.name || "—";
    if (col === "senderName") return record.sender?.user?.name || "—";
    if (col === "service") return record.service?.name || "—";
    if (col === "profile") {
      if (record.patient) return "Patient";
      if (record.doctor) return "Doctor";
      return "—";
    }
    if (col === "appointments") return record.appointments?.length || 0;
    if (col === "image") return record.image ? "Yes" : "—";
    return record[col];
  };

  // Get editable fields (exclude id, relations, timestamps)
  const getEditableFields = (table: string, record: any): string[] => {
    return Object.keys(record).filter(
      (k) =>
        !k.includes("Id") &&
        k !== "id" &&
        k !== "createdAt" &&
        k !== "updatedAt" &&
        typeof record[k] !== "object"
    );
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      {/* Left Panel — Table List */}
      <div className="w-72 bg-white rounded-xl shadow-sm border border-slate-200 overflow-y-auto flex-shrink-0">
        <div className="p-4 border-b border-slate-200 bg-slate-50 rounded-t-xl">
          <div className="flex items-center gap-2 text-lg font-bold text-slate-800">
            <Database className="w-5 h-5 text-teal-600" />
            Database Tables
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Click a table to view its records
          </p>
        </div>
        <div className="p-2">
          {tables.map((t) => (
            <button
              key={t.name}
              onClick={() => {
                setSelectedTable(t.name);
                setSearch("");
                setEditingId(null);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg mb-1 flex items-center justify-between transition-colors ${
                selectedTable === t.name
                  ? "bg-teal-50 text-teal-700 border border-teal-200"
                  : "hover:bg-slate-50 text-slate-700"
              }`}
            >              <span className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {tableLabels[t.name] || t.name}
                </span>
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  selectedTable === t.name
                    ? "bg-teal-100 text-teal-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-slate-200">
          <button
            onClick={fetchTables}
            className="w-full flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-teal-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Counts
          </button>
        </div>
      </div>

      {/* Right Panel — Records */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        {!selectedTable ? (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            <div className="text-center">
              <Database className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Select a table to explore</p>
              <p className="text-sm mt-1">
                Click any table on the left to view and manage its records
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold text-slate-800">
                  {tableLabels[selectedTable] || selectedTable}
                  <span className="text-sm font-normal text-slate-500 ml-2">
                    ({result?.total || 0} records)
                  </span>
                </h2>
                <button
                  onClick={() => fetchRecords(selectedTable, result?.page || 1, search)}
                  className="flex items-center gap-1 text-sm text-slate-500 hover:text-teal-600"
                >
                  <RefreshCw className="w-4 h-4" /> Refresh
                </button>
              </div>

              {/* Search Bar */}
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Search records..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mx-4 mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
                <span className="text-sm text-red-700">{error}</span>
                <button onClick={() => setError("")}>
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </div>
            )}

            {/* Table */}
            <div className="flex-1 overflow-auto">
              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full" />
                </div>
              ) : !result?.records?.length ? (
                <div className="flex items-center justify-center h-40 text-slate-400">
                  No records found
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
                      <tr>
                        <th className="text-left px-4 py-3 font-semibold text-slate-600 w-12">
                          #
                        </th>
                        {getDisplayColumns(selectedTable).map((col) => (
                          <th
                            key={col}
                            className="text-left px-4 py-3 font-semibold text-slate-600"
                          >
                            {col.replace(/([A-Z])/g, " $1").trim()}
                          </th>
                        ))}
                        <th className="text-right px-4 py-3 font-semibold text-slate-600 w-28">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {result.records.map((record, idx) => (
                        <tr
                          key={record.id}
                          className={`hover:bg-slate-50 transition-colors ${
                            editingId === record.id ? "bg-teal-50" : ""
                          }`}
                        >
                          <td className="px-4 py-3 text-slate-400 text-xs">
                            {(result.page - 1) * result.pageSize + idx + 1}
                          </td>
                          {getDisplayColumns(selectedTable).map((col) => {
                            const cellValue = getColumnValue(selectedTable, record, col);
                            const isComputed = ["userName","userEmail","patientName","doctorName","senderName","service","profile","appointments","image"].includes(col);
                            return (
                            <td key={col} className="px-4 py-3 text-slate-700 max-w-[200px] truncate">
                              {editingId === record.id &&
                              !isComputed &&
                              getEditableFields(selectedTable, record).includes(col) ? (
                                <input
                                  type="text"
                                  value={editData[col] ?? ""}
                                  onChange={(e) =>
                                    setEditData({ ...editData, [col]: e.target.value })
                                  }
                                  className="w-full px-2 py-1 border border-teal-300 rounded text-sm bg-white"
                                />
                              ) : (
                                <span title={String(cellValue ?? "")}>
                                  {formatValue(col, cellValue)}
                                </span>
                              )}
                            </td>
                            );
                          })}
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {editingId === record.id ? (
                                <>
                                  <button
                                    onClick={saveEdit}
                                    className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                                    title="Save"
                                  >
                                    <Save className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setEditingId(null);
                                      setEditData({});
                                    }}
                                    className="p-1.5 text-slate-400 hover:bg-slate-100 rounded"
                                    title="Cancel"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </>
                              ) : deleteConfirm === record.id ? (
                                <>
                                  <button
                                    onClick={() => deleteRecord(record.id)}
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded text-xs font-medium"
                                    title="Confirm Delete"
                                  >
                                    <AlertTriangle className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="p-1.5 text-slate-400 hover:bg-slate-100 rounded"
                                    title="Cancel"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => startEdit(record)}
                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                    title="Edit Record"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirm(record.id)}
                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                                    title="Delete Record"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Pagination */}
            {result && result.totalPages > 1 && (
              <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
                <span className="text-sm text-slate-500">
                  Page {result.page} of {result.totalPages} ({result.total}{" "}
                  records)
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePage(result.page - 1)}
                    disabled={result.page <= 1}
                    className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from(
                    { length: Math.min(5, result.totalPages) },
                    (_, i) => {
                      const start = Math.max(
                        1,
                        result.page - 2
                      );
                      const p = start + i;
                      if (p > result.totalPages) return null;
                      return (
                        <button
                          key={p}
                          onClick={() => handlePage(p)}
                          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                            p === result.page
                              ? "bg-teal-600 text-white"
                              : "border border-slate-200 hover:bg-white"
                          }`}
                        >
                          {p}
                        </button>
                      );
                    }
                  )}
                  <button
                    onClick={() => handlePage(result.page + 1)}
                    disabled={result.page >= result.totalPages}
                    className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-white transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
