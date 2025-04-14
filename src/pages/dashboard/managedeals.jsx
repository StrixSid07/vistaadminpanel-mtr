import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Card,
  Checkbox,
  CardHeader,
  CardBody,
  Input,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Alert,
  Tooltip,
  Select,
  Option,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import {
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import axios from "@/utils/axiosInstance";

export const ManageDeals = () => {
  const [deals, setDeals] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [airports, setAirports] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [currentDeal, setCurrentDeal] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    availableCountries: [],
    destination: "",
    days: 0,
    rooms: 0,
    guests: 0,
    distanceToCenter: "",
    distanceToBeach: "",
    isTopDeal: false,
    isHotdeal: false,
    isFeatured: false,
    boardBasis: "",
    hotels: [],
    itinerary: [{ title: "", description: "" }],
    whatsIncluded: [""],
    exclusiveAdditions: [""],
    termsAndConditions: [""],
    tag: "",
    LowDeposite: "",
    images: [],
    prices: [
      {
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
    ],
  });
  const [loading, setLoading] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [dealName, setDealName] = useState("");

  useEffect(() => {
    fetchDeals();
    fetchDestinations();
    fetchAirports();
    fetchHotels();
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

  const fetchDestinations = async () => {
    try {
      const response = await axios.get("/destinations/dropdown-destionation");
      setDestinations(response.data);
    } catch (error) {
      console.error("Error fetching destinatinos:", error);
      setAlert({ message: "Error fetching destinatinos", type: "red" });
    }
  };

  const fetchAirports = async () => {
    try {
      const response = await axios.get("/airport");
      setAirports(response.data);
    } catch (error) {
      console.error("Error fetching airports:", error);
      setAlert({ message: "Error fetching airports", type: "red" });
    }
  };

  const fetchHotels = async () => {
    try {
      const response = await axios.get("/hotels");
      setHotels(response.data);
    } catch (error) {
      console.error("Error fetching hotels:", error);
      setAlert({ message: "Error fetching hotels", type: "red" });
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
            destination: deal.destination ? deal.destination._id : "" || "",
            days: deal.days || 0,
            rooms: deal.rooms || 0,
            guests: deal.guests || 0,
            distanceToCenter: deal.distanceToCenter || "",
            distanceToBeach: deal.distanceToBeach || "",
            isTopDeal: deal.isTopDeal || false,
            isHotdeal: deal.isHotdeal || false,
            isFeatured: deal.isFeatured || false,
            boardBasis: deal.boardBasis || "",
            hotels: deal.hotels || [],
            itinerary:
              deal.itinerary &&
              Array.isArray(deal.itinerary) &&
              deal.itinerary.length > 0
                ? deal.itinerary.map((item) => ({
                    title: item.title || "",
                    description: item.description || "",
                  }))
                : [{ title: "", description: "" }],
            whatsIncluded:
              deal.whatsIncluded && typeof deal.whatsIncluded === "string"
                ? deal.whatsIncluded.split(",")
                : Array.isArray(deal.whatsIncluded)
                ? deal.whatsIncluded
                : [""],
            exclusiveAdditions:
              deal.exclusiveAdditions &&
              typeof deal.exclusiveAdditions === "string"
                ? deal.exclusiveAdditions.split(",")
                : Array.isArray(deal.exclusiveAdditions)
                ? deal.exclusiveAdditions
                : [""],
            termsAndConditions:
              deal.termsAndConditions &&
              typeof deal.termsAndConditions === "string"
                ? deal.termsAndConditions.split(",")
                : Array.isArray(deal.termsAndConditions)
                ? deal.termsAndConditions
                : [""],
            images: [],
            tag: deal.tag,
            LowDeposite: deal.LowDeposite,
            prices:
              deal.prices.length > 0
                ? deal.prices.map((price) => ({
                    ...price,
                    startdate: price.startdate.split("T")[0], // Convert to YYYY-MM-DD
                    enddate: price.enddate.split("T")[0], // Convert to YYYY-MM-DD
                    hotel:
                      price.hotel && typeof price.hotel === "object"
                        ? price.hotel._id
                        : price.hotel,
                  }))
                : [
                    {
                      country: "",
                      airport: "",
                      hotel: "",
                      startdate: "", // Ensure this is initialized as an empty string
                      enddate: "", // Ensure this is initialized as an empty string
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
                  ],
          }
        : {
            title: "",
            description: "",
            availableCountries: [],
            destination: "",
            days: 0,
            rooms: 0,
            guests: 0,
            distanceToCenter: "",
            distanceToBeach: "",
            isTopDeal: false,
            isHotdeal: false,
            isFeatured: false,
            boardBasis: "",
            hotels: [],
            images: [],
            itinerary: [{ title: "", description: "" }],
            whatsIncluded: [""],
            exclusiveAdditions: [""],
            termsAndConditions: [""],
            tag: "",
            LowDeposite: "",
            prices: [
              {
                country: "",
                airport: "",
                hotel: "",
                startdate: "", // Ensure this is initialized as an empty string
                enddate: "", // Ensure this is initialized as an empty string
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
            ],
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
    if (formData.availableCountries.length === 0) {
      setAlert({
        message: "Please select at least one available country.",
        type: "red",
      });
      return;
    }

    setLoading(true);
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("data", JSON.stringify(formData));
    if (formData.images && formData.images.length > 0) {
      for (let i = 0; i < formData.images.length; i++) {
        formDataToSubmit.append("images", formData.images[i]);
      }
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

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
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
      <Dialog open={openDialog} handler={handleCloseDialog} size="lg">
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
              label="Deal Tag"
              value={formData.tag}
              onChange={(e) =>
                setFormData({ ...formData, tag: e.target.value })
              }
              required
            />
            <Input
              label="Low Deposite"
              value={formData.LowDeposite}
              onChange={(e) =>
                setFormData({ ...formData, LowDeposite: e.target.value })
              }
              required
            />
            <Typography variant="h6">Available Countries</Typography>
            <div className="flex flex-wrap gap-1">
              {["UK", "USA", "Canada"].map((country) => (
                <label key={country} className="flex items-center">
                  <Checkbox
                    color="blue"
                    checked={formData.availableCountries.includes(country)}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setFormData((prev) => ({
                        ...prev,
                        availableCountries: isChecked
                          ? [...prev.availableCountries, country]
                          : prev.availableCountries.filter(
                              (c) => c !== country,
                            ),
                      }));
                    }}
                  />
                  <span>{country}</span>
                </label>
              ))}
            </div>

            <Select
              label="Destination"
              value={formData.destination}
              onChange={(value) =>
                setFormData({ ...formData, destination: value })
              }
              required
            >
              {destinations.map((destination) => (
                <Option key={destination._id} value={destination._id}>
                  {destination.name}
                </Option>
              ))}
            </Select>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <Input
                label="Number of Days"
                type="number"
                value={formData.days}
                onChange={(e) =>
                  setFormData({ ...formData, days: Number(e.target.value) })
                }
                required
              />

              <Select
                label="Board Basis"
                value={formData.boardBasis}
                onChange={(value) =>
                  setFormData({ ...formData, boardBasis: value })
                }
                required
              >
                {["Half Board", "Full Board", "All Inclusive"].map((option) => (
                  <Option key={option} value={option}>
                    {option}
                  </Option>
                ))}
              </Select>
            </div>

            <Typography variant="h6">Select Hotels</Typography>
            <Menu placement="bottom-start">
              <MenuHandler>
                <Button variant="outlined" className="w-full text-left">
                  {formData.hotels.length > 0
                    ? `${formData.hotels.length} hotel(s) selected`
                    : "Select Hotels"}
                </Button>
              </MenuHandler>
              <MenuList className="z-[100000] max-h-64 overflow-auto">
                {hotels.map((hotel) => (
                  <MenuItem
                    key={hotel._id}
                    className="flex items-center gap-2"
                    onClick={(e) => e.preventDefault()} // Prevent dropdown from closing
                  >
                    <Checkbox
                      color="blue"
                      checked={formData.hotels.includes(hotel._id)}
                      onChange={(e) => {
                        e.stopPropagation(); // Prevent bubbling to MenuItem
                        const isChecked = e.target.checked;
                        const updatedHotels = isChecked
                          ? [...formData.hotels, hotel._id]
                          : formData.hotels.filter((id) => id !== hotel._id);
                        setFormData({ ...formData, hotels: updatedHotels });
                      }}
                    />
                    <span>{hotel.name}</span>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>

            {/* Price Fields */}
            <Typography variant="h6">Price Details</Typography>
            {formData.prices.map((price, index) => (
              <div key={index} className="mb-4 space-y-2 rounded border p-3">
                <div className="grid grid-cols-1 gap-2 p-2 md:grid-cols-3">
                  <Select
                    label="Country"
                    value={price.country}
                    onChange={(value) => {
                      const updatedPrices = [...formData.prices];
                      updatedPrices[index].country = value;
                      setFormData({ ...formData, prices: updatedPrices });
                    }}
                    required
                  >
                    {["UK", "USA", "Canada"].map((country) => (
                      <Option key={country} value={country}>
                        {country}
                      </Option>
                    ))}
                  </Select>

                  <Select
                    label="Airport"
                    value={price.airport}
                    onChange={(value) => {
                      const updatedPrices = [...formData.prices];
                      updatedPrices[index].airport = value;
                      setFormData({ ...formData, prices: updatedPrices });
                    }}
                    required
                  >
                    {airports.map((airport) => (
                      <Option key={airport.code} value={airport.code}>
                        {airport.name}
                      </Option>
                    ))}
                  </Select>

                  <Select
                    label="Hotel"
                    value={
                      price.hotel && typeof price.hotel === "object"
                        ? price.hotel._id
                        : price.hotel
                    }
                    onChange={(value) => {
                      const updatedPrices = [...formData.prices];
                      updatedPrices[index].hotel = value;
                      setFormData({ ...formData, prices: updatedPrices });
                    }}
                    required
                  >
                    {hotels.map((hotel) => (
                      <Option key={hotel._id} value={hotel._id}>
                        {hotel.name}
                      </Option>
                    ))}
                  </Select>
                </div>

                <div className="grid grid-cols-1 gap-2 p-2 md:grid-cols-3">
                  <Input
                    label="Start Date"
                    type="date"
                    value={price.startdate}
                    onChange={(e) => {
                      const updatedPrices = [...formData.prices];
                      updatedPrices[index].startdate = e.target.value;
                      setFormData({ ...formData, prices: updatedPrices });
                    }}
                    required
                  />
                  <Input
                    label="End Date"
                    type="date"
                    value={price.enddate}
                    onChange={(e) => {
                      const updatedPrices = [...formData.prices];
                      updatedPrices[index].enddate = e.target.value;
                      setFormData({ ...formData, prices: updatedPrices });
                    }}
                    required
                  />
                  <Input
                    label="Price"
                    type="number"
                    value={price.price}
                    onChange={(e) => {
                      const updatedPrices = [...formData.prices];
                      updatedPrices[index].price = Number(e.target.value);
                      setFormData({ ...formData, prices: updatedPrices });
                    }}
                    required
                  />
                </div>

                {/* Flight Details */}
                <Typography variant="small" color="blue-gray">
                  Outbound Flight
                </Typography>
                <div className="grid grid-cols-1 gap-2 p-2 md:grid-cols-2">
                  <Input
                    label="Departure Time"
                    type="time"
                    value={price.flightDetails.outbound.departureTime}
                    onChange={(e) => {
                      const updatedPrices = [...formData.prices];
                      updatedPrices[
                        index
                      ].flightDetails.outbound.departureTime = e.target.value;
                      setFormData({ ...formData, prices: updatedPrices });
                    }}
                  />
                  <Input
                    label="Arrival Time"
                    type="time"
                    value={price.flightDetails.outbound.arrivalTime}
                    onChange={(e) => {
                      const updatedPrices = [...formData.prices];
                      updatedPrices[index].flightDetails.outbound.arrivalTime =
                        e.target.value;
                      setFormData({ ...formData, prices: updatedPrices });
                    }}
                  />
                  <Input
                    label="Airline"
                    value={price.flightDetails.outbound.airline}
                    onChange={(e) => {
                      const updatedPrices = [...formData.prices];
                      updatedPrices[index].flightDetails.outbound.airline =
                        e.target.value;
                      setFormData({ ...formData, prices: updatedPrices });
                    }}
                  />
                  <Input
                    label="Flight Number"
                    value={price.flightDetails.outbound.flightNumber}
                    onChange={(e) => {
                      const updatedPrices = [...formData.prices];
                      updatedPrices[index].flightDetails.outbound.flightNumber =
                        e.target.value;
                      setFormData({ ...formData, prices: updatedPrices });
                    }}
                  />
                </div>

                <Typography variant="small" color="blue-gray">
                  Return Flight
                </Typography>
                <div className="grid grid-cols-1 gap-2 p-2 md:grid-cols-2">
                  <Input
                    label="Departure Time"
                    type="time"
                    value={price.flightDetails.returnFlight.departureTime}
                    onChange={(e) => {
                      const updatedPrices = [...formData.prices];
                      updatedPrices[
                        index
                      ].flightDetails.returnFlight.departureTime =
                        e.target.value;
                      setFormData({ ...formData, prices: updatedPrices });
                    }}
                  />
                  <Input
                    label="Arrival Time"
                    type="time"
                    value={price.flightDetails.returnFlight.arrivalTime}
                    onChange={(e) => {
                      const updatedPrices = [...formData.prices];
                      updatedPrices[
                        index
                      ].flightDetails.returnFlight.arrivalTime = e.target.value;
                      setFormData({ ...formData, prices: updatedPrices });
                    }}
                  />
                  <Input
                    label="Airline"
                    value={price.flightDetails.returnFlight.airline}
                    onChange={(e) => {
                      const updatedPrices = [...formData.prices];
                      updatedPrices[index].flightDetails.returnFlight.airline =
                        e.target.value;
                      setFormData({ ...formData, prices: updatedPrices });
                    }}
                  />
                  <Input
                    label="Flight Number"
                    value={price.flightDetails.returnFlight.flightNumber}
                    onChange={(e) => {
                      const updatedPrices = [...formData.prices];
                      updatedPrices[
                        index
                      ].flightDetails.returnFlight.flightNumber =
                        e.target.value;
                      setFormData({ ...formData, prices: updatedPrices });
                    }}
                  />
                </div>
                <div className="flex w-full items-end justify-end">
                  {formData.prices.length > 1 && (
                    <Button
                      size="sm"
                      color="red"
                      variant="text"
                      onClick={() => {
                        const updatedPrices = formData.prices.filter(
                          (_, i) => i !== index,
                        );
                        setFormData({ ...formData, prices: updatedPrices });
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            ))}

            <Button
              variant="gradient"
              color="blue"
              onClick={() =>
                setFormData({
                  ...formData,
                  prices: [
                    ...formData.prices,
                    {
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
                  ],
                })
              }
            >
              + Add Another Price
            </Button>
            {/* Checkboxes for Deal Features */}
            <div className="grid grid-cols-3">
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
                  checked={formData.isHotdeal}
                  onChange={() =>
                    setFormData({ ...formData, isHotdeal: !formData.isHotdeal })
                  }
                />
                <Typography>Hot Deal</Typography>
              </div>
              <div className="flex items-center">
                <Checkbox
                  color="blue"
                  checked={formData.isFeatured}
                  onChange={() =>
                    setFormData({
                      ...formData,
                      isFeatured: !formData.isFeatured,
                    })
                  }
                />
                <Typography>Featured Deal</Typography>
              </div>
            </div>

            <Typography variant="h6">itinerary</Typography>
            {formData.itinerary.map((item, index) => (
              <div key={index} className="mb-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    label={`Day ${index + 1} Title`}
                    value={item.title}
                    onChange={(e) => {
                      const updated = [...formData.itinerary];
                      updated[index] = {
                        ...updated[index],
                        title: e.target.value,
                      };
                      setFormData({ ...formData, itinerary: updated });
                    }}
                    className="flex-1"
                  />
                  {formData.itinerary.length > 1 && (
                    <Button
                      size="sm"
                      color="red"
                      onClick={() => {
                        const updated = formData.itinerary.filter(
                          (_, i) => i !== index,
                        );
                        setFormData({ ...formData, itinerary: updated });
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </div>

                <Input
                  label={`Day ${index + 1} Description`}
                  value={item.description}
                  onChange={(e) => {
                    const updated = [...formData.itinerary];
                    updated[index] = {
                      ...updated[index],
                      description: e.target.value,
                    };
                    setFormData({ ...formData, itinerary: updated });
                  }}
                  textarea
                />
              </div>
            ))}

            <Button
              size="sm"
              color="blue"
              onClick={() =>
                setFormData({
                  ...formData,
                  itinerary: [
                    ...formData.itinerary,
                    { title: "", description: "" }, // ← new object
                  ],
                })
              }
            >
              + Add Day
            </Button>

            <Typography variant="h6">What's Included</Typography>
            {formData.whatsIncluded.map((item, index) => (
              <div key={index} className="mb-2 flex items-center gap-2">
                <Input
                  label={`Item ${index + 1}`}
                  value={item}
                  onChange={(e) => {
                    const updated = [...formData.whatsIncluded];
                    updated[index] = e.target.value;
                    setFormData({ ...formData, whatsIncluded: updated });
                  }}
                  className="flex-1"
                />
                {formData.whatsIncluded.length > 1 && (
                  <Button
                    size="sm"
                    color="red"
                    onClick={() => {
                      const updated = formData.whatsIncluded.filter(
                        (_, i) => i !== index,
                      );
                      setFormData({ ...formData, whatsIncluded: updated });
                    }}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button
              size="sm"
              color="blue"
              onClick={() =>
                setFormData({
                  ...formData,
                  whatsIncluded: [...formData.whatsIncluded, ""],
                })
              }
            >
              + Add Item
            </Button>

            <Typography variant="h6">Exclusive Additions</Typography>
            {formData.exclusiveAdditions.map((item, index) => (
              <div key={index} className="mb-2 flex items-center gap-2">
                <Input
                  label={`Addition ${index + 1}`}
                  value={item}
                  onChange={(e) => {
                    const updated = [...formData.exclusiveAdditions];
                    updated[index] = e.target.value;
                    setFormData({ ...formData, exclusiveAdditions: updated });
                  }}
                  className="flex-1"
                />
                {formData.exclusiveAdditions.length > 1 && (
                  <Button
                    size="sm"
                    color="red"
                    onClick={() => {
                      const updated = formData.exclusiveAdditions.filter(
                        (_, i) => i !== index,
                      );
                      setFormData({ ...formData, exclusiveAdditions: updated });
                    }}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button
              size="sm"
              color="blue"
              onClick={() =>
                setFormData({
                  ...formData,
                  exclusiveAdditions: [...formData.exclusiveAdditions, ""],
                })
              }
            >
              + Add Addition
            </Button>

            <Typography variant="h6">Terms and Conditions</Typography>
            {formData.termsAndConditions.map((item, index) => (
              <div key={index} className="mb-2 flex items-center gap-2">
                <Input
                  label={`Clause ${index + 1}`}
                  value={item}
                  onChange={(e) => {
                    const updated = [...formData.termsAndConditions];
                    updated[index] = e.target.value;
                    setFormData({ ...formData, termsAndConditions: updated });
                  }}
                  className="flex-1"
                />
                {formData.termsAndConditions.length > 1 && (
                  <Button
                    size="sm"
                    color="red"
                    onClick={() => {
                      const updated = formData.termsAndConditions.filter(
                        (_, i) => i !== index,
                      );
                      setFormData({ ...formData, termsAndConditions: updated });
                    }}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button
              size="sm"
              color="blue"
              onClick={() =>
                setFormData({
                  ...formData,
                  termsAndConditions: [...formData.termsAndConditions, ""],
                })
              }
            >
              + Add Clause
            </Button>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
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
              <Input
                label="Distance to Center (km)"
                value={formData.distanceToCenter}
                onChange={(e) =>
                  setFormData({ ...formData, distanceToCenter: e.target.value })
                }
                required
              />
              <Input
                label="Distance to Beach (km)"
                value={formData.distanceToBeach}
                onChange={(e) =>
                  setFormData({ ...formData, distanceToBeach: e.target.value })
                }
                required
              />
            </div>
            {/* Image Upload */}
            <Input
              type="file"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files);

                if (files.length > 5) {
                  alert("You can only upload up to 5 images.");
                  e.target.value = ""; // reset the input
                  return;
                }

                setFormData({
                  ...formData,
                  images: files,
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

      {/*View Deal Dialog */}
      <Dialog open={openViewDialog} handler={handleCloseViewDialog} size="lg">
        <DialogHeader className="flex items-start justify-between bg-white p-4">
          <Typography
            variant="h5"
            className="flex items-center gap-2 text-deep-orange-400"
          >
            {currentDeal ? currentDeal.title : "Deal Details"}
          </Typography>
          <Typography
            variant="h6"
            className="flex items-center gap-2 text-deep-orange-400"
          >
            Tag: {currentDeal ? currentDeal.tag : "Deal Tag"}
          </Typography>
          <div className="flex items-center justify-center gap-2">
            <Tooltip
              content="Edit"
              placement="left"
              className="z-[50000] font-medium text-green-600"
              animate={{
                mount: { scale: 1, x: 0 },
                unmount: { scale: 0, x: 25 },
              }}
            >
              <Button
                variant="text"
                color="green"
                onClick={() => {
                  handleOpenDialog(currentDeal);
                  handleCloseViewDialog();
                }}
                className="p-2"
              >
                <PencilSquareIcon className="h-5 w-5" />
              </Button>
            </Tooltip>
            <Tooltip
              content="Delete"
              placement="top"
              className="z-[50000] font-medium text-red-500"
              color="red"
              animate={{
                mount: { scale: 1, y: 0 },
                unmount: { scale: 0, y: 25 },
              }}
            >
              <Button
                variant="text"
                color="red"
                onClick={() => {
                  confirmDelete(currentDeal._id, currentDeal.title);
                  handleCloseViewDialog();
                }}
                className="p-2"
              >
                <TrashIcon className="h-5 w-5" />
              </Button>
            </Tooltip>
            <Tooltip
              content="close"
              placement="right"
              className="z-[50000] font-medium text-purple-500"
              color="purple"
              animate={{
                mount: { scale: 1, x: -0 },
                unmount: { scale: 0, x: -25 },
              }}
            >
              <Button
                variant="text"
                color="purple"
                onClick={handleCloseViewDialog}
                className="p-2"
              >
                <XMarkIcon className="h-5 w-5" />
              </Button>
            </Tooltip>
          </div>
        </DialogHeader>

        <DialogBody className="h-[480px] overflow-y-auto bg-gray-50 p-4 scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-blue-500">
          {currentDeal ? (
            <div className="space-y-12">
              {/* Basic Details Card */}
              <Card className="mt-6 border border-blue-500 shadow-md">
                <CardHeader color="blue" className="p-4">
                  <Typography variant="h6" className="text-white">
                    Basic Details
                  </Typography>
                </CardHeader>
                <CardBody className="p-4">
                  <Typography variant="paragraph" className="text-black">
                    <span className="font-bold text-deep-orange-500">
                      Title:
                    </span>{" "}
                    {currentDeal.title || "N/A"}
                  </Typography>
                  <Typography variant="paragraph" className="text-black">
                    <span className="font-bold text-deep-orange-500">
                      Description:
                    </span>{" "}
                    {currentDeal.description || "N/A"}
                  </Typography>
                  <Typography variant="paragraph" className="text-black">
                    <span className="font-bold text-deep-orange-500">
                      Low Deposite:
                    </span>{" "}
                    {currentDeal.LowDeposite || "N/A"}
                  </Typography>
                  <Typography variant="paragraph" className="text-black">
                    <span className="font-bold text-deep-orange-500">
                      Available Countries:
                    </span>{" "}
                    {Array.isArray(currentDeal.availableCountries)
                      ? currentDeal.availableCountries.join(", ")
                      : "N/A"}
                  </Typography>
                  <Typography variant="paragraph" className="text-black">
                    <span className="font-bold text-deep-orange-500">
                      Destination:
                    </span>{" "}
                    {currentDeal.destination
                      ? currentDeal.destination.name
                      : "N/A"}
                  </Typography>
                  <Typography variant="paragraph" className="text-black">
                    <span className="font-bold text-deep-orange-500">
                      Board Basis:
                    </span>{" "}
                    {currentDeal.boardBasis || "N/A"}
                  </Typography>
                  <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
                    <Typography variant="paragraph" className="text-black">
                      <span className="font-bold text-deep-orange-500">
                        Distance to Center:
                      </span>{" "}
                      {currentDeal.distanceToCenter || "N/A"}
                    </Typography>
                    <Typography variant="paragraph" className="text-black">
                      <span className="font-bold text-deep-orange-500">
                        Distance to Beach:
                      </span>{" "}
                      {currentDeal.distanceToBeach || "N/A"}
                    </Typography>
                  </div>
                  <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-3">
                    <Typography variant="paragraph" className="text-black">
                      <span className="font-bold text-deep-orange-500">
                        Days:
                      </span>{" "}
                      {currentDeal.days || "N/A"}
                    </Typography>
                    <Typography variant="paragraph" className="text-black">
                      <span className="font-bold text-deep-orange-500">
                        Rooms:
                      </span>{" "}
                      {currentDeal.rooms || "N/A"}
                    </Typography>
                    <Typography variant="paragraph" className="text-black">
                      <span className="font-bold text-deep-orange-500">
                        Guests:
                      </span>{" "}
                      {currentDeal.guests || "N/A"}
                    </Typography>
                  </div>
                </CardBody>
              </Card>

              {/* Itinerary Card */}
              <Card className="border border-blue-500 font-medium shadow-md">
                <CardHeader color="blue" className="p-4">
                  <Typography variant="h6" className="text-white">
                    Itinerary
                  </Typography>
                </CardHeader>
                <CardBody className="p-4">
                  {currentDeal.itinerary && currentDeal.itinerary.length > 0 ? (
                    <ol className="list-decimal space-y-2 pl-5 text-black">
                      {currentDeal.itinerary.map((item, index) => (
                        <li key={index}>
                          <strong>{item.title}</strong>
                          <p>{item.description}</p>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <Typography variant="paragraph" className="text-black">
                      No itinerary provided.
                    </Typography>
                  )}
                </CardBody>
              </Card>

              {/* Price Details Card */}
              <Card className="border border-blue-500 font-medium shadow-md">
                <CardHeader color="blue" className="p-4">
                  <Typography variant="h6" className="text-white">
                    Price Details
                  </Typography>
                </CardHeader>
                <CardBody className="space-y-4 p-4">
                  {currentDeal.prices && currentDeal.prices.length > 0 ? (
                    currentDeal.prices.map((price, pIndex) => (
                      <div
                        key={pIndex}
                        className="rounded border border-gray-300 p-3"
                      >
                        <Typography
                          variant="subtitle1"
                          className="text-deep-orange-500"
                        >
                          Price Entry {pIndex + 1}
                        </Typography>
                        <ul className="list-disc pl-5 text-black">
                          <li>
                            <strong>Country:</strong> {price.country || "N/A"}
                          </li>
                          <li>
                            <strong>Airport:</strong> {price.airport || "N/A"}
                          </li>
                          <li>
                            <strong>Hotel:</strong>{" "}
                            {(price.hotel && price.hotel.name) || "N/A"}
                          </li>
                          <li>
                            <strong>Start Date:</strong>{" "}
                            {price.startdate
                              ? new Date(price.startdate).toLocaleDateString()
                              : "N/A"}
                          </li>
                          <li>
                            <strong>End Date:</strong>{" "}
                            {price.enddate
                              ? new Date(price.enddate).toLocaleDateString()
                              : "N/A"}
                          </li>
                          <li>
                            <strong>Price:</strong> {price.price || "N/A"}
                          </li>
                        </ul>
                        {price.flightDetails && (
                          <>
                            <Typography
                              variant="subtitle2"
                              className="mt-2 text-deep-orange-500"
                            >
                              Flight Details:
                            </Typography>
                            <ul className="list-disc pl-5 text-black">
                              <li>
                                <strong>Outbound Departure:</strong>{" "}
                                {price.flightDetails.outbound.departureTime ||
                                  "N/A"}
                              </li>
                              <li>
                                <strong>Outbound Arrival:</strong>{" "}
                                {price.flightDetails.outbound.arrivalTime ||
                                  "N/A"}
                              </li>
                              <li>
                                <strong>Outbound Airline:</strong>{" "}
                                {price.flightDetails.outbound.airline || "N/A"}
                              </li>
                              <li>
                                <strong>Outbound Flight Number:</strong>{" "}
                                {price.flightDetails.outbound.flightNumber ||
                                  "N/A"}
                              </li>
                              <li>
                                <strong>Return Departure:</strong>{" "}
                                {price.flightDetails.returnFlight
                                  .departureTime || "N/A"}
                              </li>
                              <li>
                                <strong>Return Arrival:</strong>{" "}
                                {price.flightDetails.returnFlight.arrivalTime ||
                                  "N/A"}
                              </li>
                              <li>
                                <strong>Return Airline:</strong>{" "}
                                {price.flightDetails.returnFlight.airline ||
                                  "N/A"}
                              </li>
                              <li>
                                <strong>Return Flight Number:</strong>{" "}
                                {price.flightDetails.returnFlight
                                  .flightNumber || "N/A"}
                              </li>
                            </ul>
                          </>
                        )}
                      </div>
                    ))
                  ) : (
                    <Typography variant="paragraph" className="text-black">
                      No price details available.
                    </Typography>
                  )}
                </CardBody>
              </Card>

              {/* Images Card */}
              <Card className="border border-blue-500 shadow-md">
                <CardHeader color="blue" className="p-4">
                  <Typography variant="h6" className="text-white">
                    Images
                  </Typography>
                </CardHeader>
                <CardBody className="p-4">
                  <div className="flex flex-wrap gap-2">
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
                      <Typography variant="paragraph" className="text-black">
                        No images available.
                      </Typography>
                    )}
                  </div>
                </CardBody>
              </Card>

              <Card className="border border-blue-500 shadow-md">
                <CardHeader color="blue" className="p-4">
                  <Typography variant="h6" className="text-white">
                    Additional Details
                  </Typography>
                </CardHeader>
                <CardBody className="space-y-4 p-4 text-black">
                  {/* whatsIncluded */}
                  <div>
                    <div className="flex items-center justify-between">
                      <Typography className="font-bold text-deep-orange-500">
                        What's Included
                      </Typography>
                      <Button
                        size="sm"
                        color="blue"
                        varient="gradient"
                        onClick={() => toggleSection("whatsIncluded")}
                      >
                        {expandedSection === "whatsIncluded"
                          ? "View Less"
                          : `View More`}
                      </Button>
                    </div>
                    {expandedSection === "whatsIncluded" && (
                      <ul className="mt-2 list-disc pl-5">
                        {currentDeal.whatsIncluded &&
                        currentDeal.whatsIncluded.length > 0 ? (
                          currentDeal.whatsIncluded.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))
                        ) : (
                          <li>No details available.</li>
                        )}
                      </ul>
                    )}
                  </div>

                  {/* exclusiveAdditions */}
                  <div>
                    <div className="flex items-center justify-between">
                      <Typography className="font-bold text-deep-orange-500">
                        Exclusive Additions
                      </Typography>
                      <Button
                        size="sm"
                        varient="gradient"
                        color="blue"
                        onClick={() => toggleSection("exclusiveAdditions")}
                      >
                        {expandedSection === "exclusiveAdditions"
                          ? "View Less"
                          : "View More"}
                      </Button>
                    </div>
                    {expandedSection === "exclusiveAdditions" && (
                      <ul className="mt-2 list-disc pl-5">
                        {currentDeal.exclusiveAdditions &&
                        currentDeal.exclusiveAdditions.length > 0 ? (
                          currentDeal.exclusiveAdditions.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))
                        ) : (
                          <li>No details available.</li>
                        )}
                      </ul>
                    )}
                  </div>

                  {/* termsAndConditions */}
                  <div>
                    <div className="flex items-center justify-between">
                      <Typography className="font-bold text-deep-orange-500">
                        Terms & Conditions
                      </Typography>
                      <Button
                        size="sm"
                        color="blue"
                        varient="gradient"
                        onClick={() => toggleSection("termsAndConditions")}
                      >
                        {expandedSection === "termsAndConditions"
                          ? "View Less"
                          : "View More"}
                      </Button>
                    </div>
                    {expandedSection === "termsAndConditions" && (
                      <ul className="mt-2 list-disc pl-5">
                        {currentDeal.termsAndConditions &&
                        currentDeal.termsAndConditions.length > 0 ? (
                          currentDeal.termsAndConditions.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))
                        ) : (
                          <li>No details available.</li>
                        )}
                      </ul>
                    )}
                  </div>
                </CardBody>
              </Card>
            </div>
          ) : (
            <Typography variant="h6" className="text-black">
              No deal details available.
            </Typography>
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
