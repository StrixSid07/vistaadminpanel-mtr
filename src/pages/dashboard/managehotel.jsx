// import React, { useEffect, useState } from "react";
// import {
//   Typography,
//   Button,
//   Card,
//   Input,
//   Dialog,
//   DialogHeader,
//   DialogBody,
//   DialogFooter,
//   Alert,
//   Tooltip,
// } from "@material-tailwind/react";
// import {
//   PencilSquareIcon,
//   TrashIcon,
//   HomeModernIcon,
// } from "@heroicons/react/24/outline";
// import axios from "@/utils/axiosInstance";

// export function ManageHotel() {
//   const [hotels, setHotels] = useState([]);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [currentHotel, setCurrentHotel] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     location: "",
//     locationId: "",
//     about: "",
//     facilities: [],
//     externalBookingLink: "",
//     images: [],
//   });
//   const [loading, setLoading] = useState(false);
//   const [alert, setAlert] = useState({ message: "", type: "" });
//   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
//   const [deleteId, setDeleteId] = useState(null);
//   const [hotelName, setHotelName] = useState("");

//   useEffect(() => {
//     fetchHotels();
//   }, []);

//   const fetchHotels = async () => {
//     try {
//       const response = await axios.get("/hotels");
//       setHotels(response.data);
//     } catch (error) {
//       console.error("Error fetching hotels:", error);
//       setAlert({ message: "Error fetching hotels", type: "red" });
//     }
//   };

//   const handleOpenDialog = (hotel = null) => {
//     setCurrentHotel(hotel);
//     setFormData(
//       hotel
//         ? {
//             name: hotel.name,
//             location: hotel.location,
//             locationId: hotel.locationId,
//             about: hotel.about,
//             facilities: hotel.facilities,
//             externalBookingLink: hotel.externalBookingLink,
//             images: hotel.images,
//           }
//         : {
//             name: "",
//             location: "",
//             locationId: "",
//             about: "",
//             facilities: [],
//             externalBookingLink: "",
//             images: [],
//           },
//     );
//     setOpenDialog(true);
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//     setCurrentHotel(null);
//     setAlert({ message: "", type: "" });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       if (currentHotel) {
//         await axios.put(`/hotels/${currentHotel._id}`, formData);
//         setAlert({ message: "Hotel updated successfully!", type: "green" });
//       } else {
//         await axios.post("/hotels", formData);
//         setAlert({ message: "Hotel added successfully!", type: "green" });
//       }
//       fetchHotels();
//       handleCloseDialog();
//     } catch (error) {
//       console.error("Error saving hotel:", error);
//       setAlert({ message: "Error saving hotel", type: "red" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const confirmDelete = (id, name) => {
//     setDeleteId(id);
//     setHotelName(name);
//     setOpenDeleteDialog(true);
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`/hotels/${id}`);
//       setAlert({ message: "Hotel deleted successfully!", type: "green" });
//       fetchHotels();
//     } catch (error) {
//       console.error("Error deleting hotel:", error);
//       setAlert({ message: "Error deleting hotel", type: "red" });
//     } finally {
//       setOpenDeleteDialog(false);
//       setDeleteId(null);
//     }
//   };

//   return (
//     <div className="h-screen w-full overflow-hidden px-4 py-6">
//       {alert.message && (
//         <Alert
//           color={alert.type}
//           onClose={() => setAlert({ message: "", type: "" })}
//           className="mb-4"
//         >
//           {alert.message}
//         </Alert>
//       )}

//       <div className="mb-4 flex justify-end">
//         <Button onClick={() => handleOpenDialog()} color="blue">
//           Add Hotel
//         </Button>
//       </div>

//       <Card className="scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200 h-[calc(100vh-150px)] overflow-y-auto rounded-xl p-4 shadow-lg">
//         <div className="space-y-6">
//           {hotels.map((hotel) => (
//             <Card
//               key={hotel._id}
//               className="group p-4 shadow-md transition-colors duration-300 ease-in-out hover:bg-blue-50"
//             >
//               <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//                 <div className="flex-1">
//                   <Typography
//                     variant="h5"
//                     color="deep-orange"
//                     className="flex items-center justify-start gap-2"
//                   >
//                     <HomeModernIcon strokeWidth={2} className="h-5 w-5" />
//                     {hotel.name}
//                   </Typography>
//                   <Typography className="mt-1 font-medium text-blue-500">
//                     {hotel.location}
//                   </Typography>
//                 </div>

//                 <div className="flex items-center gap-4">
//                   <Tooltip
//                     content="Edit"
//                     placement="top"
//                     className="font-medium text-green-600"
//                     animate={{
//                       mount: { scale: 1, y: 0 },
//                       unmount: { scale: 0, y: 25 },
//                     }}
//                   >
//                     <Button
//                       variant="text"
//                       color="green"
//                       onClick={() => handleOpenDialog(hotel)}
//                       className="p-2"
//                     >
//                       <PencilSquareIcon className="h-5 w-5" />
//                     </Button>
//                   </Tooltip>
//                   <Tooltip
//                     content="Delete"
//                     placement="top"
//                     className="font-medium text-red-500"
//                     color="red"
//                     animate={{
//                       mount: { scale: 1, y: 0 },
//                       unmount: { scale: 0, y: 25 },
//                     }}
//                   >
//                     <Button
//                       variant="text"
//                       color="red"
//                       onClick={() => confirmDelete(hotel._id, hotel.name)}
//                       className="p-2"
//                     >
//                       <TrashIcon className="h-5 w-5" />
//                     </Button>
//                   </Tooltip>
//                 </div>
//               </div>
//             </Card>
//           ))}
//         </div>
//       </Card>

//       <Dialog open={openDialog} handler={handleCloseDialog} size="md">
//         <DialogHeader>{currentHotel ? "Edit Hotel" : "Add Hotel"}</DialogHeader>
//         <DialogBody>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <Input
//               label="Hotel Name"
//               value={formData.name}
//               onChange={(e) =>
//                 setFormData({ ...formData, name: e.target.value })
//               }
//               required
//             />
//             <Input
//               label="Location"
//               value={formData.location}
//               onChange={(e) =>
//                 setFormData({ ...formData, location: e.target.value })
//               }
//               required
//             />
//             <Input
//               label="Location ID"
//               value={formData.locationId}
//               onChange={(e) =>
//                 setFormData({ ...formData, locationId: e.target.value })
//               }
//               required
//             />
//             <Input
//               label="About"
//               value={formData.about}
//               onChange={(e) =>
//                 setFormData({ ...formData, about: e.target.value })
//               }
//             />
//             <Input
//               label="Facilities (comma separated)"
//               value={formData.facilities.join(", ")}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   facilities: e.target.value
//                     .split(",")
//                     .map((facility) => facility.trim()),
//                 })
//               }
//             />
//             <Input
//               label="External Booking Link"
//               value={formData.externalBookingLink}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   externalBookingLink: e.target.value,
//                 })
//               }
//             />
//             <Input
//               label="Images (comma separated URLs)"
//               value={formData.images.join(", ")}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   images: e.target.value
//                     .split(",")
//                     .map((image) => image.trim()),
//                 })
//               }
//             />
//           </form>
//         </DialogBody>
//         <DialogFooter>
//           <Button onClick={handleCloseDialog} color="red" variant="text">
//             Cancel
//           </Button>
//           <Button onClick={handleSubmit} color="green" disabled={loading}>
//             {loading ? "Saving..." : "Save"}
//           </Button>
//         </DialogFooter>
//       </Dialog>
//       <Dialog open={openDeleteDialog} handler={setOpenDeleteDialog}>
//         <DialogHeader>Confirm Delete</DialogHeader>
//         <DialogBody>
//           Are you sure you want to delete{" "}
//           <span className="font-semibold text-red-600">{hotelName}</span>?
//         </DialogBody>
//         <DialogFooter>
//           <Button
//             variant="text"
//             color="gray"
//             onClick={() => setOpenDeleteDialog(false)}
//             className="mr-1"
//           >
//             Cancel
//           </Button>
//           <Button
//             variant="gradient"
//             color="red"
//             onClick={() => handleDelete(deleteId)}
//           >
//             Delete
//           </Button>
//         </DialogFooter>
//       </Dialog>
//     </div>
//   );
// }

// export default ManageHotel;

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
  PencilSquareIcon,
  TrashIcon,
  HomeModernIcon,
  XMarkIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import axios from "@/utils/axiosInstance";

export function ManageHotel() {
  const [hotels, setHotels] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [imageUrls, setImageUrls] = useState([""]);
  const [openViewDialog, setOpenViewDialog] = useState(false); // State for view dialog
  const [currentHotel, setCurrentHotel] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    locationId: "",
    about: "",
    facilities: [],
    externalBookingLink: "",
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [hotelName, setHotelName] = useState("");

  const handleAddImageUrl = () => {
    if (imageUrls.length < 6) {
      // Check if the current length is less than 6
      setImageUrls([...imageUrls, ""]); // Add a new empty string to the array
    }
  };

  const handleImageUrlChange = (index, value) => {
    const updatedUrls = [...imageUrls];
    updatedUrls[index] = value; // Update the specific index with the new value
    setImageUrls(updatedUrls);
  };

  const handleRemoveImageUrl = (index) => {
    const updatedUrls = imageUrls.filter((_, i) => i !== index); // Remove the URL at the specified index
    setImageUrls(updatedUrls);
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await axios.get("/hotels");
      setHotels(response.data);
    } catch (error) {
      console.error("Error fetching hotels:", error);
      setAlert({ message: "Error fetching hotels", type: "red" });
    }
  };

  const handleOpenDialog = (hotel = null) => {
    setCurrentHotel(hotel);
    setFormData(
      hotel
        ? {
            name: hotel.name,
            location: hotel.location,
            locationId: hotel.locationId,
            about: hotel.about,
            facilities: hotel.facilities,
            externalBookingLink: hotel.externalBookingLink,
            images: hotel.images,
          }
        : {
            name: "",
            location: "",
            locationId: "",
            about: "",
            facilities: [],
            externalBookingLink: "",
            images: [],
          },
    );
    setImageUrls(hotel ? hotel.images : [""]);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentHotel(null);
    setAlert({ message: "", type: "" });
  };

  const handleViewHotel = (hotel) => {
    setCurrentHotel(hotel);
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setCurrentHotel(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSubmit = {
        ...formData,
        images: imageUrls.filter((url) => url.trim() !== ""), // Filter out empty URLs
      };
      if (currentHotel) {
        await axios.put(`/hotels/${currentHotel._id}`, dataToSubmit);
        setAlert({ message: "Hotel updated successfully!", type: "green" });
      } else {
        await axios.post("/hotels", dataToSubmit);
        setAlert({ message: "Hotel added successfully!", type: "green" });
      }
      fetchHotels();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving hotel:", error);
      setAlert({ message: "Error saving hotel", type: "red" });
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id, name) => {
    setDeleteId(id);
    setHotelName(name);
    setOpenDeleteDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/hotels/${id}`);
      setAlert({ message: "Hotel deleted successfully!", type: "green" });
      fetchHotels();
    } catch (error) {
      console.error("Error deleting hotel:", error);
      setAlert({ message: "Error deleting hotel", type: "red" });
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
          Add Hotel
        </Button>
      </div>

      <Card className="scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200 h-[calc(100vh-150px)] overflow-y-auto rounded-xl p-4 shadow-lg">
        <div className="space-y-6">
          {hotels.map((hotel) => (
            <Card
              key={hotel._id}
              className="group p-4 shadow-md transition-colors duration-300 ease-in-out hover:bg-blue-50"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <Typography
                    variant="h5"
                    color="deep-orange"
                    className="flex items-center justify-start gap-2"
                  >
                    <HomeModernIcon strokeWidth={2} className="h-5 w-5" />
                    {hotel.name}
                  </Typography>
                  <Typography className="mt-1 font-medium text-blue-500">
                    {hotel.location}
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
                      onClick={() => handleViewHotel(hotel)}
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
                      onClick={() => handleOpenDialog(hotel)}
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
                      onClick={() => confirmDelete(hotel._id, hotel.name)}
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

      {/* Add/Edit Hotel Dialog */}
      <Dialog open={openDialog} handler={handleCloseDialog} size="md">
        <DialogHeader>{currentHotel ? "Edit Hotel" : "Add Hotel"}</DialogHeader>
        <DialogBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Hotel Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <Input
              label="Location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              required
            />
            <Input
              label="Location ID"
              value={formData.locationId}
              onChange={(e) =>
                setFormData({ ...formData, locationId: e.target.value })
              }
              required
            />
            <Input
              label="About"
              value={formData.about}
              onChange={(e) =>
                setFormData({ ...formData, about: e.target.value })
              }
            />
            <Input
              label="Facilities (comma separated)"
              value={formData.facilities.join(", ")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  facilities: e.target.value
                    .split(",")
                    .map((facility) => facility.trim()),
                })
              }
            />
            <Input
              label="External Booking Link"
              value={formData.externalBookingLink}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  externalBookingLink: e.target.value,
                })
              }
            />
            <div>
              <Typography variant="h6">Images</Typography>
              {imageUrls.map((url, index) => (
                <div
                  key={index}
                  className="mt-2 flex items-center justify-center space-x-2"
                >
                  <Input
                    label={`Image URL ${index + 1}`}
                    value={url}
                    onChange={(e) =>
                      handleImageUrlChange(index, e.target.value)
                    }
                    className="flex-1"
                  />
                  <Button
                    color="red"
                    onClick={() => handleRemoveImageUrl(index)}
                    variant="text"
                    className="p-2"
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                color="blue"
                onClick={handleAddImageUrl}
                className="mt-2"
                disabled={imageUrls.length >= 6}
              >
                Add Another Image URL
              </Button>
            </div>
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

      {/* View Hotel Dialog */}
      <Dialog open={openViewDialog} handler={handleCloseViewDialog} size="md">
        <DialogHeader className="flex items-start justify-between">
          <Typography variant="h5" className="flex items-center gap-2">
            <HomeModernIcon className="h-6 w-6 text-blue-500" />
            {currentHotel ? currentHotel.name : "Hotel Details"}
          </Typography>
          <div className="flex gap-2">
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
                className="p-2"
                color="green"
                onClick={() => {
                  handleOpenDialog(currentHotel);
                  handleCloseViewDialog(); // Close this dialog when edit is clicked
                }}
                title="Edit"
              >
                <PencilSquareIcon className="h-5 w-5" />
              </Button>
            </Tooltip>
            <Tooltip
              content="Delete"
              placement="top"
              className="z-[50000] font-medium text-red-600"
              animate={{
                mount: { scale: 1, y: 0 },
                unmount: { scale: 0, y: 25 },
              }}
            >
              <Button
                variant="text"
                className="p-2"
                color="red"
                onClick={() =>
                  confirmDelete(currentHotel._id, currentHotel.name)
                }
                title="Delete"
              >
                <TrashIcon className="h-5 w-5" />
              </Button>
            </Tooltip>
            <Tooltip
              content="Close"
              placement="right"
              className="z-[50000] font-medium text-purple-600"
              animate={{
                mount: { scale: 1, x: -0 },
                unmount: { scale: 0, x: -25 },
              }}
            >
              <Button
                variant="text"
                className="p-2"
                color="purple"
                onClick={handleCloseViewDialog}
                title="Close"
              >
                <XMarkIcon className="h-5 w-5" />
              </Button>
            </Tooltip>
          </div>
        </DialogHeader>

        <DialogBody>
          {currentHotel && (
            <div className="space-y-4">
              <Typography variant="h6">
                Location: {currentHotel.location}
              </Typography>
              <Typography variant="h6">
                Location ID: {currentHotel.locationId}
              </Typography>
              <Typography variant="h6">About: {currentHotel.about}</Typography>
              <Typography variant="h6">
                Facilities: {currentHotel.facilities.join(", ")}
              </Typography>
              <Typography variant="h6">
                External Booking Link:{" "}
                <a
                  href={currentHotel.externalBookingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  {currentHotel.externalBookingLink}
                </a>
              </Typography>
              <Typography variant="h6">
                Images:
                <div className="mt-2 flex flex-wrap gap-2">
                  {currentHotel.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Hotel Image ${index + 1}`}
                      className="h-20 w-20 rounded object-cover"
                    />
                  ))}
                </div>
              </Typography>
            </div>
          )}
        </DialogBody>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} handler={setOpenDeleteDialog}>
        <DialogHeader>Confirm Delete</DialogHeader>
        <DialogBody>
          Are you sure you want to delete{" "}
          <span className="font-semibold text-red-600">{hotelName}</span>?
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

export default ManageHotel;
