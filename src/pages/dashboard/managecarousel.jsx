import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Card,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Alert,
} from "@material-tailwind/react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import axios from "@/utils/axiosInstance";

export function ManageCarousel() {
  const [carousels, setCarousels] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentCarousel, setCurrentCarousel] = useState(null);
  const [formData, setFormData] = useState({ images: [] });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });

  useEffect(() => {
    fetchCarousels();
  }, []);

  const fetchCarousels = async () => {
    try {
      const response = await axios.get("/carousel");
      setCarousels(response.data);
    } catch (error) {
      console.error("Error fetching carousels:", error);
      setAlert({ message: "Error fetching carousels", type: "red" });
    }
  };

  const handleOpenDialog = (carousel = null) => {
    setCurrentCarousel(carousel);
    setFormData(carousel ? { images: carousel.images } : { images: [] });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentCarousel(null);
    setAlert({ message: "", type: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formDataToSend = new FormData();

    // Append images to FormData
    formData.images.forEach((image) => {
      formDataToSend.append("images", image);
    });

    try {
      if (currentCarousel) {
        await axios.put(`/carousel/${currentCarousel._id}`, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setAlert({ message: "Carousel updated successfully!", type: "green" });
      } else {
        await axios.post("/carousel", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setAlert({ message: "Carousel added successfully!", type: "green" });
      }
      fetchCarousels();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving carousel:", error);
      setAlert({ message: "Error saving carousel", type: "red" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/carousel/${id}`);
      setAlert({ message: "Carousel deleted successfully!", type: "green" });
      fetchCarousels();
    } catch (error) {
      console.error("Error deleting carousel:", error);
      setAlert({ message: "Error deleting carousel", type: "red" });
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
          Add Carousel
        </Button>
      </div>

      <Card className="h-[calc(100vh-150px)] overflow-y-auto rounded-xl p-4 shadow-lg">
        <div className="space-y-6">
          {carousels.map((carousel) => (
            <Card key={carousel._id} className="group p-4 shadow-md">
              <div className="flex flex-col gap-4">
                <Typography variant="h5" color="blue-gray">
                  Carousel {carousel._id}
                </Typography>
                <div className="flex gap-2">
                  {carousel.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Carousel Image ${index + 1}`}
                      className="h-32 w-32 rounded-md object-cover"
                    />
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    variant="text"
                    color="green"
                    onClick={() => handleOpenDialog(carousel)}
                    className="p-2"
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="text"
                    color="red"
                    onClick={() => handleDelete(carousel._id)}
                    className="p-2"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <Dialog open={openDialog} handler={handleCloseDialog} size="md">
        <DialogHeader className="flex items-center justify-between">
          {currentCarousel ? "Edit Carousel" : "Add Carousel"}
          {alert.message && (
            <Alert
              color={alert.type}
              onClose={() => setAlert({ message: "", type: "" })}
              className="mb-4 max-w-xl md:max-w-4xl"
            >
              {alert.message}
            </Alert>
          )}
        </DialogHeader>
        <DialogBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                setFormData({ images: Array.from(e.target.files) });
              }}
              required
            />
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
    </div>
  );
}

export default ManageCarousel;
