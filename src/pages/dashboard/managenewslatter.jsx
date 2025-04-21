import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Card,
  Input,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Alert,
  Tooltip,
} from "@material-tailwind/react";
import {
  TrashIcon,
  EnvelopeIcon,
  UserPlusIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import axios from "@/utils/axiosInstance";

export default function ManageNewsletter() {
  const [subscribers, setSubscribers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => {
        setAlert({ message: "", type: "" });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const fetchSubscribers = async () => {
    try {
      const res = await axios.get("/home/newsletter");
      setSubscribers(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      setAlert({ message: "Failed to load subscribers", type: "red" });
    }
  };

  const handleAdd = async () => {
    setLoading(true);
    try {
      await axios.post("/home/subscribe-newsletter", { email });
      setAlert({ message: "Subscriber added successfully!", type: "green" });
      fetchSubscribers();
      setOpenDialog(false);
      setEmail("");
    } catch (err) {
      setAlert({
        message: err?.response?.data?.message || "Error adding subscriber",
        type: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/home/newsletter/${deleteId}`);
      setAlert({ message: "Subscriber removed successfully!", type: "green" });
      fetchSubscribers();
      setOpenDeleteDialog(false);
    } catch (err) {
      setAlert({
        message: err?.response?.data?.message || "Failed to delete",
        type: "red",
      });
    }
  };

  return (
    <div className="h-screen w-full px-4 py-6">
      {alert.message && (
        <Alert
          color={alert.type}
          className="mb-4 transition-opacity duration-300 ease-in"
        >
          {alert.message}
        </Alert>
      )}

      <div className="mb-4 flex justify-end gap-2">
        <Button onClick={() => setOpenDialog(true)} color="blue">
          Add Subscriber
        </Button>
        <Button
          variant="outlined"
          color="green"
          onClick={async () => {
            try {
              const res = await axios.get("/newslatter/newsletter/export", {
                responseType: "blob",
              });
              const url = window.URL.createObjectURL(new Blob([res.data]));
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", "subscribers.xlsx");
              document.body.appendChild(link);
              link.click();
              link.remove();
            } catch (err) {
              setAlert({
                message: "Failed to download subscriber list",
                type: "red",
              });
            }
          }}
        >
          Download Excel
        </Button>
      </div>

      <Card className="h-[calc(100vh-150px)] overflow-y-auto rounded-xl p-4 shadow-lg scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-blue-500">
        <div className="space-y-4">
          {subscribers.map((subscriber) => (
            <Card
              key={subscriber._id}
              className="flex items-center justify-between p-4 transition hover:bg-blue-50"
            >
              <div className="flex w-full items-center gap-2">
                <EnvelopeIcon className="h-5 w-5 shrink-0 text-blue-500" />
                <Tooltip content={subscriber.email}>
                  <Typography
                    as="div"
                    className="w-full truncate text-sm font-medium text-gray-800"
                  >
                    {subscriber.email}
                  </Typography>
                </Tooltip>
                <Tooltip content="Copy Email">
                  <Button
                    variant="text"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(subscriber.email);
                      setAlert({
                        message: "Email copied to clipboard!",
                        type: "green",
                      });
                    }}
                  >
                    <DocumentDuplicateIcon className="h-4 w-4 text-gray-600" />
                  </Button>
                </Tooltip>
              </div>
              <Tooltip content="Delete Subscriber" placement="top">
                <Button
                  variant="text"
                  color="red"
                  onClick={() => {
                    setDeleteId(subscriber._id);
                    setOpenDeleteDialog(true);
                  }}
                >
                  <TrashIcon className="h-5 w-5" />
                </Button>
              </Tooltip>
            </Card>
          ))}
        </div>
      </Card>

      {/* Add Dialog */}
      <Dialog open={openDialog} handler={() => setOpenDialog(false)} size="sm">
        <DialogHeader>Add Subscriber</DialogHeader>
        <DialogBody>
          <Input
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<UserPlusIcon className="h-5 w-5 text-blue-500" />}
          />
        </DialogBody>
        <DialogFooter>
          <Button variant="text" onClick={() => setOpenDialog(false)}>
            Cancel
          </Button>
          <Button color="green" onClick={handleAdd} disabled={loading}>
            {loading ? "Adding..." : "Add"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        handler={() => setOpenDeleteDialog(false)}
      >
        <DialogHeader>Confirm Delete</DialogHeader>
        <DialogBody>
          Are you sure you want to remove this subscriber?
        </DialogBody>
        <DialogFooter>
          <Button variant="text" onClick={() => setOpenDeleteDialog(false)}>
            Cancel
          </Button>
          <Button color="red" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
