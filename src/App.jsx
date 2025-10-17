import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Card, CardContent,
} from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Progress } from "./components/ui/progress";
import {
  CheckCircle, Package, Truck, CreditCard, FileText,
  Loader2, XCircle, Activity, Code2, ShoppingBag,
  AlertTriangle, Box, Filter, Search, Cloud, Database, Monitor
} from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
} from "recharts";

export default function SAPGCPDemoDashboard() {
  // ---------------- COMMON ----------------
  const [view, setView] = useState("integration");

  // ---------------- INTEGRATION ----------------
  const [stage, setStage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle");
  const [log, setLog] = useState([]);
  const [apiResponse, setApiResponse] = useState(null);
  const logRef = useRef(null);

  const stages = [
    { id: 1, name: "Login SAP", desc: "Authenticate with SAP B1 Cloud via Cloud Function", icon: <CheckCircle className="text-blue-500 w-8 h-8" /> },
    { id: 2, name: "Create Order", desc: "Sales order created through SAP API", icon: <Package className="text-orange-500 w-8 h-8" /> },
    { id: 3, name: "Update Shipping", desc: "Shipping carrier assigned, tracking details updated", icon: <Truck className="text-green-500 w-8 h-8" /> },
    { id: 4, name: "Create Payment", desc: "Incoming payment posted via GCP Function", icon: <CreditCard className="text-yellow-500 w-8 h-8" /> },
    { id: 5, name: "Create Delivery + Invoice", desc: "Delivery Note and AR Invoice created successfully", icon: <FileText className="text-purple-500 w-8 h-8" /> },
  ];

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  const simulateApiCall = () => {
    setLoading(true);
    setStatus("idle");
    const current = stages[stage];
    setLog(p => [...p, { time: new Date().toLocaleTimeString(), message: `Initiating ${current.name}...` }]);
    setTimeout(() => {
      const success = Math.random() > 0.1;
      if (success) {
        const mock = {
          timestamp: new Date().toISOString(),
          endpoint: `/api/${current.name.replace(/ /g, "").toLowerCase()}`,
          status: "200 OK",
          payload: {
            message: `${current.name} completed successfully`,
            docEntry: Math.floor(Math.random() * 100000),
            durationMs: Math.floor(Math.random() * 1500) + 500,
          },
        };
        setApiResponse(mock);
        setStatus("success");
        setLog(p => [...p, { time: new Date().toLocaleTimeString(), message: `${current.name} completed successfully ✅` }]);
        setTimeout(() => {
          setStage(s => Math.min(s + 1, stages.length));
          setLoading(false);
          setStatus("idle");
        }, 900);
      } else {
        setApiResponse({ error: `${current.name} failed at backend`, status: "500 ERROR" });
        setStatus("error");
        setLog(p => [...p, { time: new Date().toLocaleTimeString(), message: `${current.name} failed ❌` }]);
        setLoading(false);
      }
    }, 2000);
  };

  // ---------------- INVENTORY MOCK ----------------
  const baseInventory = [
    { sku: "SAP-1001", name: "Surgical Mask Box", vendor: "MedLife", stock: 120, status: "Available" },
    { sku: "SAP-1002", name: "Gloves Pack", vendor: "CarePlus", stock: 0, status: "Not Purchased" },
    { sku: "SAP-1003", name: "Sanitizer Bottle", vendor: "CleanPro", stock: 45, status: "Available" },
    { sku: "SAP-1004", name: "Thermal Scanner", vendor: "TechMed", stock: 0, status: "Not Purchased" },
    { sku: "SAP-1005", name: "Face Shield", vendor: "CarePlus", stock: 80, status: "Available" },
  ];
  const [search, setSearch] = useState("");
  const [vendor, setVendor] = useState("All");
  const [statusF, setStatusF] = useState("All");

  const vendors = ["All", ...new Set(baseInventory.map(i => i.vendor))];
  const filtered = baseInventory.filter(i => {
    const s = search.toLowerCase();
    const matchSearch = i.name.toLowerCase().includes(s) || i.sku.toLowerCase().includes(s);
    const matchVendor = vendor === "All" || i.vendor === vendor;
    const matchStatus = statusF === "All" || i.status === statusF;
    return matchSearch && matchVendor && matchStatus;
  });

  const total = filtered.length;
  const avail = filtered.filter(i => i.status === "Available").length;
  const notPur = filtered.filter(i => i.status === "Not Purchased").length;
  const vendorData = vendors
    .filter(v => v !== "All")
    .map(v => ({
      name: v,
      count: filtered.filter(i => i.vendor === v).length,
    }));

  const COLORS = ["#34d399", "#60a5fa", "#fbbf24", "#f87171"];

  // ------------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-purple-50 p-10">
      <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}
        className="text-4xl font-bold text-gray-800 text-center mb-10">
        SAP on GCP – Integration & Inventory Dashboard
      </motion.h1>

      <div className="flex justify-center mb-8 space-x-4">
        <Button variant={view === "integration" ? "default" : "outline"} onClick={() => setView("integration")}>Integration</Button>
        <Button variant={view === "inventory" ? "default" : "outline"} onClick={() => setView("inventory")}>Inventory</Button>
      </div>

      {/* ---------- INTEGRATION VIEW ---------- */}
      {view === "integration" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Flow Diagram */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .8 }} className="lg:col-span-3 mb-6">
            <Card className="p-6 bg-white/70 backdrop-blur shadow-xl">
              <CardContent className="flex flex-col items-center space-y-4">
                <h2 className="text-xl font-semibold text-gray-700">Integration Flow</h2>
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-10">
                  <motion.div whileHover={{ scale: 1.1 }} className="flex flex-col items-center">
                    <Database className="w-10 h-10 text-blue-600" />
                    <p className="text-sm text-gray-600 mt-1">SAP HANA</p>
                  </motion.div>
                  <motion.div animate={{ x: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-gray-400">➡️</motion.div>
                  <motion.div whileHover={{ scale: 1.1 }} className="flex flex-col items-center">
                    <Cloud className="w-10 h-10 text-purple-600" />
                    <p className="text-sm text-gray-600 mt-1">GCP Functions / PubSub</p>
                  </motion.div>
                  <motion.div animate={{ x: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-gray-400">➡️</motion.div>
                  <motion.div whileHover={{ scale: 1.1 }} className="flex flex-col items-center">
                    <Monitor className="w-10 h-10 text-green-600" />
                    <p className="text-sm text-gray-600 mt-1">Dashboard UI</p>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Left – Stages */}
          <motion.div initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .8 }} className="lg:col-span-2">
            <Card className="shadow-2xl p-6 rounded-2xl backdrop-blur bg-white/70">
              <CardContent>
                {/* Stage Timeline */}
                <div className="space-y-8">
                  <div className="flex justify-between items-center relative">
                    {stages.map((s, i) => (
                      <div key={s.id} className={`flex flex-col items-center text-center w-1/5 ${i < stage ? "text-green-600" : "text-gray-400"}`}>
                        <motion.div animate={{ scale: i === stage - 1 ? 1.2 : 1 }} transition={{ type: "spring", stiffness: 200 }} className="mb-2">{s.icon}</motion.div>
                        <p className="font-semibold">{s.name}</p>
                      </div>
                    ))}
                    <motion.div className="absolute top-4 left-0 h-1 bg-green-500 rounded-full"
                      initial={{ width: 0 }} animate={{ width: `${(stage / stages.length) * 100}%` }} transition={{ duration: .6 }}
                      style={{ zIndex: -1, right: 0 }} />
                  </div>

                  <Progress value={(stage / stages.length) * 100} className="h-3" />

                  <motion.div key={stage} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }} className="text-center">
                    <h2 className="text-2xl font-bold text-gray-700 mb-2">
                      {stages[stage - 1]?.name || "Initializing..."}
                    </h2>
                    <p className="text-gray-600 mb-6">{stages[stage - 1]?.desc || "Starting integration workflow..."}</p>

                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="animate-spin text-blue-500 w-6 h-6" />
                        <p className="text-blue-600">Executing API call...</p>
                      </div>
                    ) : status === "error" ? (
                      <div className="flex flex-col items-center space-y-2">
                        <XCircle className="text-red-500 w-8 h-8" />
                        <p className="text-red-500 font-medium">API failed! Retry?</p>
                        <Button onClick={simulateApiCall} variant="outline">Retry</Button>
                      </div>
                    ) : status === "success" ? (
                      <div className="flex flex-col items-center space-y-2 text-green-600">
                        <CheckCircle className="w-8 h-8" />
                        <p>Step completed successfully!</p>
                      </div>
                    ) : (
                      <Button onClick={simulateApiCall} disabled={stage === stages.length}>
                        {stage < stages.length ? "Run Next Step" : "Demo Complete 🎉"}
                      </Button>
                    )}
                  </motion.div>

                  {/* API Response */}
                  {apiResponse && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .4 }}
                      className="bg-gray-900 text-gray-100 p-4 rounded-xl mt-6 text-left shadow-lg">
                      <div className="flex items-center mb-3 space-x-2">
                        <Code2 className="w-5 h-5 text-green-400" />
                        <h3 className="font-semibold text-lg">Mock Cloud Function Response</h3>
                      </div>
                      <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                        {JSON.stringify(apiResponse, null, 2)}
                      </pre>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right – Activity Log */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .8 }}>
            <Card className="shadow-xl p-4 bg-white/80 rounded-2xl">
              <CardContent>
                <div className="flex items-center mb-4 space-x-2">
                  <Activity className="text-indigo-500 w-5 h-5" />
                  <h2 className="text-lg font-semibold text-gray-700">Activity Log</h2>
                </div>
                <div ref={logRef} className="h-96 overflow-y-auto border-t border-gray-200 pt-2 space-y-2 text-sm scroll-smooth">
                  {log.length === 0 ? (
                    <p className="text-gray-400 italic">No activity yet...</p>
                  ) : (
                    log.map((e, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                        className="p-2 bg-gray-50 rounded-lg border border-gray-100">
                        <p className="text-gray-800">{e.message}</p>
                        <span className="text-xs text-gray-500">{e.time}</span>
                      </motion.div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* ---------- INVENTORY VIEW ---------- */}
      {view === "inventory" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }}>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
            <Card className="bg-white/80 shadow-lg rounded-2xl">
              <CardContent className="flex items-center justify-between p-6">
                <div><p className="text-gray-500 text-sm">Total Products</p>
                  <h2 className="text-2xl font-bold text-gray-800">{total}</h2></div>
                <Box className="w-10 h-10 text-blue-500" />
              </CardContent>
            </Card>
            <Card className="bg-white/80 shadow-lg rounded-2xl">
              <CardContent className="flex items-center justify-between p-6">
                <div><p className="text-gray-500 text-sm">Available</p>
                  <h2 className="text-2xl font-bold text-green-600">{avail}</h2></div>
                <ShoppingBag className="w-10 h-10 text-green-500" />
              </CardContent>
            </Card>
            <Card className="bg-white/80 shadow-lg rounded-2xl">
              <CardContent className="flex items-center justify-between p-6">
                <div><p className="text-gray-500 text-sm">Not Purchased</p>
                  <h2 className="text-2xl font-bold text-red-600">{notPur}</h2></div>
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="max-w-6xl mx-auto mb-6 bg-white/80 backdrop-blur shadow-md">
            <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4 p-4">
              <div className="flex items-center w-full md:w-1/3 relative">
                <Search className="absolute left-3 text-gray-400 w-4 h-4" />
                <input type="text" placeholder="Search by SKU or Product"
                  value={search} onChange={e => setSearch(e.target.value)}
                  className="pl-9 pr-3 py-2 w-full border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              <div className="flex items-center space-x-3">
                <Filter className="text-gray-400 w-5 h-5" />
                <select value={vendor} onChange={e => setVendor(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-400 focus:outline-none">
                                    {vendors.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>

                <select
                  value={statusF}
                  onChange={(e) => setStatusF(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-400 focus:outline-none"
                >
                  <option>All</option>
                  <option>Available</option>
                  <option>Not Purchased</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Table */}
          <Card className="shadow-2xl p-6 rounded-2xl backdrop-blur bg-white/70 max-w-6xl mx-auto">
            <CardContent>
              <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
                SAP HANA Inventory Overview
              </h2>

              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-gray-600 font-medium">SKU</th>
                      <th className="px-4 py-3 text-left text-gray-600 font-medium">Product Name</th>
                      <th className="px-4 py-3 text-left text-gray-600 font-medium">Vendor</th>
                      <th className="px-4 py-3 text-left text-gray-600 font-medium">Stock</th>
                      <th className="px-4 py-3 text-left text-gray-600 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((item, i) => (
                      <motion.tr
                        key={item.sku}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="border-t"
                      >
                        <td className="px-4 py-2 font-medium">{item.sku}</td>
                        <td className="px-4 py-2">{item.name}</td>
                        <td className="px-4 py-2">{item.vendor}</td>
                        <td className="px-4 py-2">{item.stock}</td>
                        <td className="px-4 py-2">
                          {item.status === "Available" ? (
                            <span className="flex items-center text-green-600 font-medium">
                              <Package className="w-4 h-4 mr-1" /> In Stock
                            </span>
                          ) : (
                            <span className="flex items-center text-red-500 font-medium">
                              <XCircle className="w-4 h-4 mr-1" /> Not Purchased
                            </span>
                          )}
                        </td>
                      </motion.tr>
                    ))}

                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center py-6 text-gray-400 italic">
                          No matching products found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Vendor Summary Chart */}
          <Card className="shadow-2xl p-6 rounded-2xl backdrop-blur bg-white/70 max-w-3xl mx-auto mt-8">
            <CardContent>
              <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
                Vendor Summary
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={vendorData}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {vendorData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

