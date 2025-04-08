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
  EyeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import axios from "@/utils/axiosInstance";

export const ManageDeals = () => {
  const [deals, setDeals] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [currentDeal, setCurrentDeal] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    availableCountries: [],
    destination: "",
    price: {
      // Single price object
      country: "",
      airport: "",
      hotel: "",
      startdate: "",
      enddate: "",
      price: 0,
      flightDetails: {
        outbound: {
          departureTime: "",
          arrivalTime: "",
          airline: "",
          flightNumber: "",
        },
        returnFlight: {
          departureTime: "",
          arrivalTime: "",
          airline: "",
          flightNumber: "",
        },
      },
    },
    hotels: [],
    boardBasis: "",
    isTopDeal: false,
    distanceToCenter: "",
    distanceToBeach: "",
    days: 0,
    rooms: 0,
    guests: 0,
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [dealName, setDealName] = useState("");

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const response = await axios.get("/deals");
      setDeals(response.data);
    } catch (error) {
      console.error("Error fetching deals:", error);
      setAlert({ message: "Error fetching deals", type: "red" });
    }
  };

  const handleOpenDialog = (deal = null) => {
    setCurrentDeal(deal);
    setFormData(
      deal
        ? {
            title: deal.title,
            description: deal.description,
            availableCountries: deal.availableCountries || [],
            destination: deal.destination || "",
            price: deal.price || {
              // Ensure price is initialized
              country: "",
              airport: "",
              hotel: "",
              startdate: "",
              enddate: "",
              price: 0,
              flightDetails: {
                outbound: {
                  departureTime: "",
                  arrivalTime: "",
                  airline: "",
                  flightNumber: "",
                },
                returnFlight: {
                  departureTime: "",
                  arrivalTime: "",
                  airline: "",
                  flightNumber: "",
                },
              },
            },
            hotels: deal.hotels || [],
            boardBasis: deal.boardBasis || "",
            isTopDeal: deal.isTopDeal || false,
            distanceToCenter: deal.distanceToCenter || "",
            distanceToBeach: deal.distanceToBeach || "",
            days: deal.days || 0,
            rooms: deal.rooms || 0,
            guests: deal.guests || 0,
            images: [],
          }
        : {
            title: "",
            description: "",
            availableCountries: [],
            destination: "",
            price: {
              // Default price object
              country: "",
              airport: "",
              hotel: "",
              startdate: "",
              enddate: "",
              price: 0,
              flightDetails: {
                outbound: {
                  departureTime: "",
                  arrivalTime: "",
                  airline: "",
                  flightNumber: "",
                },
                returnFlight: {
                  departureTime: "",
                  arrivalTime: "",
                  airline: "",
                  flightNumber: "",
                },
              },
            },
            hotels: [],
            boardBasis: "",
            isTopDeal: false,
            distanceToCenter: "",
            distanceToBeach: "",
            days: 0,
            rooms: 0,
            guests: 0,
            images: [],
          },
    );
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentDeal(null);
    setAlert({ message: "", type: "" });
  };

  const handleOpenViewDialog = (deal) => {
    setCurrentDeal(deal);
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setCurrentDeal(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("data", JSON.stringify(formData));
    for (let i = 0; i < formData.images.length; i++) {
      formDataToSubmit.append("images", formData.images[i]);
    }

    try {
      if (currentDeal) {
        await axios.put(`/deals/${currentDeal._id}`, formDataToSubmit, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setAlert({ message: "Deal updated successfully!", type: "green" });
      } else {
        await axios.post("/deals", formDataToSubmit, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setAlert({ message: "Deal added successfully!", type: "green" });
      }
      fetchDeals();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving deal:", error);
      setAlert({ message: "Error saving deal", type: "red" });
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id, name) => {
    setDeleteId(id);
    setDealName(name);
    setOpenDeleteDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/deals/${id}`);
      setAlert({ message: "Deal deleted successfully!", type: "green" });
      fetchDeals();
    } catch (error) {
      console.error("Error deleting deal:", error);
      setAlert({ message: "Error deleting deal", type: "red" });
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
          Add Deal
        </Button>
      </div>

      <Card className="h-[calc(100vh-150px)] overflow-y-auto rounded-xl p-4 shadow-lg scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-blue-500">
        <div className="space-y-6">
          {deals.map((deal) => (
            <Card
              key={deal._id}
              className="group p-4 shadow-md transition-colors duration-300 ease-in-out hover:bg-blue-50"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <Typography
                    variant="h5"
                    color="deep-orange"
                    className="flex items-center justify-start gap-2"
                  >
                    {deal.title}
                  </Typography>
                  <Typography className="mt-1 font-medium text-blue-500">
                    {deal.description}
                  </Typography>
                </div>

                <div className="flex items-center gap-4">
                  <Tooltip
                    content="View"
                    placement="top"
                    className="font-medium text-blue-600"
                    animate={{
                      mount: { scale: 1, y: 0 },
                      unmount: { scale: 0, y: 25 },
                    }}
                  >
                    <Button
                      variant="text"
                      color="blue"
                      onClick={() => handleOpenViewDialog(deal)}
                      className="p-2"
                    >
                      <EyeIcon strokeWidth={2} className="h-5 w-5" />
                    </Button>
                  </Tooltip>
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
                      onClick={() => handleOpenDialog(deal)}
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
                      onClick={() => confirmDelete(deal._id, deal.title)}
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

      {/* Add/Edit Deal Dialog */}
      <Dialog open={openDialog} handler={handleCloseDialog} size="md">
        <DialogHeader>{currentDeal ? "Edit Deal" : "Add Deal"}</DialogHeader>
        <DialogBody className="h-[480px] overflow-y-auto scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-blue-500">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Deal Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
            <Input
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
            <Input
              label="Available Countries (comma separated)"
              value={formData.availableCountries.join(", ")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  availableCountries: e.target.value
                    .split(",")
                    .map((country) => country.trim()),
                })
              }
              required
            />
            <Input
              label="Destination ID"
              value={formData.destination}
              onChange={(e) =>
                setFormData({ ...formData, destination: e.target.value })
              }
            />

            {/* Price Fields */}
            <Typography variant="h6">Price Details</Typography>
            <Input
              label="Country"
              value={formData.price.country}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: { ...formData.price, country: e.target.value },
                })
              }
              required
            />
            <Input
              label="Airport"
              value={formData.price.airport}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: { ...formData.price, airport: e.target.value },
                })
              }
              required
            />
            <Input
              label="Hotel ID"
              value={formData.price.hotel}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: { ...formData.price, hotel: e.target.value },
                })
              }
              required
            />
            <Input
              label="Start Date"
              type="date"
              value={formData.price.startdate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: { ...formData.price, startdate: e.target.value },
                })
              }
              required
            />
            <Input
              label="End Date"
              type="date"
              value={formData.price.enddate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: { ...formData.price, enddate: e.target.value },
                })
              }
              required
            />
            <Input
              label="Price"
              type="number"
              value={formData.price.price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: { ...formData.price, price: Number(e.target.value) },
                })
              }
              required
            />

            {/* Flight Details */}
            <Typography variant="h6">Flight Details</Typography>
            <Input
              label="Outbound Departure Time"
              value={formData.price.flightDetails.outbound.departureTime}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: {
                    ...formData.price,
                    flightDetails: {
                      ...formData.price.flightDetails,
                      outbound: {
                        ...formData.price.flightDetails.outbound,
                        departureTime: e.target.value,
                      },
                    },
                  },
                })
              }
            />
            <Input
              label="Outbound Arrival Time"
              value={formData.price.flightDetails.outbound.arrivalTime}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: {
                    ...formData.price,
                    flightDetails: {
                      ...formData.price.flightDetails,
                      outbound: {
                        ...formData.price.flightDetails.outbound,
                        arrivalTime: e.target.value,
                      },
                    },
                  },
                })
              }
            />
            <Input
              label="Outbound Airline"
              value={formData.price.flightDetails.outbound.airline}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: {
                    ...formData.price,
                    flightDetails: {
                      ...formData.price.flightDetails,
                      outbound: {
                        ...formData.price.flightDetails.outbound,
                        airline: e.target.value,
                      },
                    },
                  },
                })
              }
            />
            <Input
              label="Outbound Flight Number"
              value={formData.price.flightDetails.outbound.flightNumber}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: {
                    ...formData.price,
                    flightDetails: {
                      ...formData.price.flightDetails,
                      outbound: {
                        ...formData.price.flightDetails.outbound,
                        flightNumber: e.target.value,
                      },
                    },
                  },
                })
              }
            />

            {/* Return Flight Details */}
            <Typography variant="h6">Return Flight Details</Typography>
            <Input
              label="Return Departure Time"
              value={formData.price.flightDetails.returnFlight.departureTime}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: {
                    ...formData.price,
                    flightDetails: {
                      ...formData.price.flightDetails,
                      returnFlight: {
                        ...formData.price.flightDetails.returnFlight,
                        departureTime: e.target.value,
                      },
                    },
                  },
                })
              }
            />
            <Input
              label="Return Arrival Time"
              value={formData.price.flightDetails.returnFlight.arrivalTime}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: {
                    ...formData.price,
                    flightDetails: {
                      ...formData.price.flightDetails,
                      returnFlight: {
                        ...formData.price.flightDetails.returnFlight,
                        arrivalTime: e.target.value,
                      },
                    },
                  },
                })
              }
            />
            <Input
              label="Return Airline"
              value={formData.price.flightDetails.returnFlight.airline}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: {
                    ...formData.price,
                    flightDetails: {
                      ...formData.price.flightDetails,
                      returnFlight: {
                        ...formData.price.flightDetails.returnFlight,
                        airline: e.target.value,
                      },
                    },
                  },
                })
              }
            />
            <Input
              label="Return Flight Number"
              value={formData.price.flightDetails.returnFlight.flightNumber}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: {
                    ...formData.price,
                    flightDetails: {
                      ...formData.price.flightDetails,
                      returnFlight: {
                        ...formData.price.flightDetails.returnFlight,
                        flightNumber: e.target.value,
                      },
                    },
                  },
                })
              }
            />

            {/* Checkboxes for Deal Features */}
            <div className="flex items-center">
              <Checkbox
                color="blue"
                checked={formData.isTopDeal}
                onChange={() =>
                  setFormData({ ...formData, isTopDeal: !formData.isTopDeal })
                }
              />
              <Typography>Top Deal</Typography>
            </div>
            <div className="flex items-center">
              <Checkbox
                color="blue"
                checked={formData.isHotDeal}
                onChange={() =>
                  setFormData({ ...formData, isHotDeal: !formData.isHotDeal })
                }
              />
              <Typography>Hot Deal</Typography>
            </div>
            <div className="flex items-center">
              <Checkbox
                color="blue"
                checked={formData.isFeatured}
                onChange={() =>
                  setFormData({ ...formData, isFeatured: !formData.isFeatured })
                }
              />
              <Typography>Featured Deal</Typography>
            </div>

            {/* Distance Fields */}
            <Input
              label="Distance to Center"
              value={formData.distanceToCenter}
              onChange={(e) =>
                setFormData({ ...formData, distanceToCenter: e.target.value })
              }
            />
            <Input
              label="Distance to Beach"
              value={formData.distanceToBeach}
              onChange={(e) =>
                setFormData({ ...formData, distanceToBeach: e.target.value })
              }
            />
            <Input
              label="Number of Days"
              type="number"
              value={formData.days}
              onChange={(e) =>
                setFormData({ ...formData, days: Number(e.target.value) })
              }
              required
            />
            <Input
              label="Number of Rooms"
              type="number"
              value={formData.rooms}
              onChange={(e) =>
                setFormData({ ...formData, rooms: Number(e.target.value) })
              }
              required
            />
            <Input
              label="Number of Guests"
              type="number"
              value={formData.guests}
              onChange={(e) =>
                setFormData({ ...formData, guests: Number(e.target.value) })
              }
              required
            />
            {/* Image Upload */}
            <Input
              type="file"
              multiple
              onChange={(e) => {
                setFormData({
                  ...formData,
                  images: Array.from(e.target.files),
                });
              }}
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

      {/* View Deal Dialog */}
      <Dialog open={openViewDialog} handler={handleCloseViewDialog} size="md">
        <DialogHeader className="flex items-start justify-between">
          <Typography variant="h5" className="flex items-center gap-2">
            {currentDeal ? currentDeal.title : "Deal Details"}
          </Typography>
          <Button
            variant="text"
            color="red"
            onClick={handleCloseViewDialog}
            className="p-2"
          >
            <XMarkIcon className="h-5 w-5" />
          </Button>
        </DialogHeader>

        <DialogBody className="h-[480px] overflow-y-auto scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-blue-500">
          {currentDeal ? (
            <div className="space-y-4">
              <Typography variant="h6">
                Description: {currentDeal.description || "N/A"}
              </Typography>
              <Typography variant="h6">
                Available Countries:{" "}
                {Array.isArray(currentDeal.availableCountries)
                  ? currentDeal.availableCountries.join(", ")
                  : "N/A"}
              </Typography>
              <Typography variant="h6">
                Destination ID:{" "}
                {currentDeal.destination ? currentDeal.destination._id : "N/A"}
              </Typography>
              <Typography variant="h6">
                Board Basis: {currentDeal.boardBasis || "N/A"}
              </Typography>
              <Typography variant="h6">
                Distance to Center: {currentDeal.distanceToCenter || "N/A"}
              </Typography>
              <Typography variant="h6">
                Distance to Beach: {currentDeal.distanceToBeach || "N/A"}
              </Typography>
              <Typography variant="h6">
                Days: {currentDeal.days || "N/A"}
              </Typography>
              <Typography variant="h6">
                Rooms: {currentDeal.rooms || "N/A"}
              </Typography>
              <Typography variant="h6">
                Guests: {currentDeal.guests || "N/A"}
              </Typography>
              <Typography variant="h6">Price Details:</Typography>
              {currentDeal.price ? ( // Check if price is defined
                <ul className="list-disc pl-5">
                  <li>Country: {currentDeal.price.country || "N/A"}</li>
                  <li>Airport: {currentDeal.price.airport || "N/A"}</li>
                  <li>Hotel: {currentDeal.price.hotel || "N/A"}</li>
                  <li>Start Date: {currentDeal.price.startdate || "N/A"}</li>
                  <li>End Date: {currentDeal.price.enddate || "N/A"}</li>
                  <li>Price: {currentDeal.price.price || "N/A"}</li>
                </ul>
              ) : (
                <Typography>No price details available.</Typography>
              )}
              {/* Flight Details */}
              {currentDeal.price && (
                <div>
                  <Typography variant="h6">Flight Details:</Typography>
                  <ul className="list-disc pl-5">
                    <li>
                      Outbound Departure:{" "}
                      {currentDeal.price.flightDetails.outbound.departureTime ||
                        "N/A"}
                    </li>
                    <li>
                      Outbound Arrival:{" "}
                      {currentDeal.price.flightDetails.outbound.arrivalTime ||
                        "N/A"}
                    </li>
                    <li>
                      Outbound Airline:{" "}
                      {currentDeal.price.flightDetails.outbound.airline ||
                        "N/A"}
                    </li>
                    <li>
                      Outbound Flight Number:{" "}
                      {currentDeal.price.flightDetails.outbound.flightNumber ||
                        "N/A"}
                    </li>
                    <li>
                      Return Departure:{" "}
                      {currentDeal.price.flightDetails.returnFlight
                        .departureTime || "N/A"}
                    </li>
                    <li>
                      Return Arrival:{" "}
                      {currentDeal.price.flightDetails.returnFlight
                        .arrivalTime || "N/A"}
                    </li>
                    <li>
                      Return Airline:{" "}
                      {currentDeal.price.flightDetails.returnFlight.airline ||
                        "N/A"}
                    </li>
                    <li>
                      Return Flight Number:{" "}
                      {currentDeal.price.flightDetails.returnFlight
                        .flightNumber || "N/A"}
                    </li>
                  </ul>
                </div>
              )}
              <Typography variant="h6">Images:</Typography>
              <div className="mt-2 flex flex-wrap gap-2">
                {Array.isArray(currentDeal.images) &&
                currentDeal.images.length > 0 ? (
                  currentDeal.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Deal Image ${index + 1}`}
                      className="h-20 w-20 rounded object-cover"
                    />
                  ))
                ) : (
                  <Typography>No images available.</Typography>
                )}
              </div>
            </div>
          ) : (
            <Typography variant="h6">No deal details available.</Typography>
          )}
        </DialogBody>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} handler={setOpenDeleteDialog}>
        <DialogHeader>Confirm Delete</DialogHeader>
        <DialogBody>
          Are you sure you want to delete{" "}
          <span className="font-semibold text-red-600">{dealName}</span>?
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
};

export default ManageDeals;
