import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Card,
  Checkbox,
  Input,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Alert,
  Tooltip,
} from "@material-tailwind/react";
import {
  PencilSquareIcon,
  TrashIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import axios from "@/utils/axiosInstance";

export function ManageDestination() {
  const [destinations, setDestinations] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentDestination, setCurrentDestination] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [destinationName, setDestinationName] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    isPopular: false,
    imageUrls: "",
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const response = await axios.get("/destinations/destinations");
      setDestinations(response.data);
    } catch (error) {
      console.error("Error fetching destinations:", error);
      setAlert({ message: "Error fetching destinations", type: "red" });
    }
  };

  const handleImageClick = (imageUrl) => {
    setPreviewImage(imageUrl);
    setOpenImageDialog(true);
  };

  const handleCloseImageDialog = () => {
    setPreviewImage(null);
    setOpenImageDialog(false);
  };

  const handleOpenDialog = (destination = null) => {
    setCurrentDestination(destination);
    setFormData(
      destination
        ? {
            name: destination.name,
            isPopular: destination.isPopular,
            imageUrls: destination.image,
          }
        : { name: "", isPopular: false, imageUrls: "" },
    );
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentDestination(null);
    setAlert({ message: "", type: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (currentDestination) {
        await axios.put(`/destinations/${currentDestination._id}`, formData);
        setAlert({
          message: "Destination updated successfully!",
          type: "green",
        });
      } else {
        await axios.post("/destinations", formData);
        setAlert({ message: "Destination added successfully!", type: "green" });
      }
      fetchDestinations();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving destination:", error);
      setAlert({ message: "Error saving destination", type: "red" });
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id, name) => {
    setDeleteId(id);
    setDestinationName(name);
    setOpenDeleteDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/destinations/${id}`);
      setAlert({
        message: "Destination deleted successfully!",
        type: "green",
      });
      fetchDestinations();
    } catch (error) {
      console.error("Error deleting destination:", error);
      setAlert({ message: "Error deleting destination", type: "red" });
    } finally {
      setOpenDeleteDialog(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="h-screen w-full overflow-hidden px-4 py-6">
      {alert.message && (
        <Alert
          color={alert.type}
          onClose={() => setAlert({ message: "", type: "" })}
          className="mb-4"
        >
          {alert.message}
        </Alert>
      )}

      <div className="mb-4 flex justify-end">
        <Button onClick={() => handleOpenDialog()} color="blue">
          Add Destination
        </Button>
      </div>

      <Card className="scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200 h-[calc(100vh-150px)] overflow-y-auto rounded-xl p-4 shadow-lg">
        <div className="space-y-6">
          {destinations.map((destination) => (
            <Card
              key={destination._id}
              className="group p-4 shadow-md transition-colors duration-300 ease-in-out hover:bg-blue-50"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <Typography
                    variant="h5"
                    color="deep-orange"
                    className="flex items-center gap-2"
                  >
                    <MapPinIcon
                      strokeWidth={3}
                      className="h-5 w-5 text-deep-orange-600"
                    />
                    {destination.name}
                  </Typography>
                  <Typography
                    className={`mt-1 font-medium ${
                      destination.isPopular ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    {destination.isPopular
                      ? "Popular Destination"
                      : "Regular Destination"}
                  </Typography>
                </div>

                <div className="w-full sm:w-48">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    onClick={() => handleImageClick(destination.image)}
                    className="h-32 w-full cursor-pointer rounded-md object-cover shadow-sm transition-all duration-500 ease-in-out group-hover:scale-105"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <Tooltip
                    content="Edit"
                    placement="top"
                    className="font-medium text-green-600"
                    animate={{
                      mount: { scale: 1, y: 0 },
                      unmount: { scale: 0, y: 25 },
                    }}
                  >
                    <Button
                      variant="text"
                      color="green"
                      onClick={() => handleOpenDialog(destination)}
                      className="p-2"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </Button>
                  </Tooltip>
                  <Tooltip
                    content="Delete"
                    placement="top"
                    className="font-medium text-red-500"
                    color="red"
                    animate={{
                      mount: { scale: 1, y: 0 },
                      unmount: { scale: 0, y: 25 },
                    }}
                  >
                    <Button
                      variant="text"
                      color="red"
                      onClick={() =>
                        confirmDelete(destination._id, destination.name)
                      }
                      className="p-2"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </Button>
                  </Tooltip>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <Dialog open={openDialog} handler={handleCloseDialog} size="md">
        <DialogHeader>
          {currentDestination ? "Edit Destination" : "Add Destination"}
        </DialogHeader>
        <DialogBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Destination Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <Input
              label="Image URL"
              value={formData.imageUrls}
              onChange={(e) =>
                setFormData({ ...formData, imageUrls: e.target.value })
              }
              required
            />
            <label className="flex items-center gap-2 pt-2 text-sm text-gray-700">
              <Checkbox
                checked={formData.isPopular}
                onChange={(e) =>
                  setFormData({ ...formData, isPopular: e.target.checked })
                }
                color="blue"
              />
              Is Popular Destination
            </label>
          </form>
        </DialogBody>
        <DialogFooter>
          <Button onClick={handleCloseDialog} color="red" variant="text">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="green" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </Dialog>
      <Dialog open={openImageDialog} handler={handleCloseImageDialog} size="xl">
        <DialogBody className="p-0">
          <img
            src={previewImage}
            alt="Preview"
            className="h-auto max-h-[800px] w-full rounded object-contain"
          />
        </DialogBody>
        <DialogFooter className="justify-end">
          <Button onClick={handleCloseImageDialog} color="red" variant="text">
            Close
          </Button>
        </DialogFooter>
      </Dialog>
      <Dialog open={openDeleteDialog} handler={setOpenDeleteDialog}>
        <DialogHeader>Confirm Delete</DialogHeader>
        <DialogBody>
          Are you sure you want to delete{" "}
          <span className="font-semibold text-red-600">{destinationName}</span>?
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="gray"
            onClick={() => setOpenDeleteDialog(false)}
            className="mr-1"
          >
            Cancel
          </Button>
          <Button
            variant="gradient"
            color="red"
            onClick={() => handleDelete(deleteId)}
          >
            Delete
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default ManageDestination;
