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
  EyeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import axios from "@/utils/axiosInstance";

export function ManageTerms() {
  const [terms, setTerms] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTerm, setCurrentTerm] = useState(null);
  const [formData, setFormData] = useState({
    mainTitle: "",
    data: [],
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [termTitle, setTermTitle] = useState("");
  const [openViewDialog, setOpenViewDialog] = useState(false); // State for view dialog

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    try {
      const response = await axios.get("/terms");
      setTerms(response.data);
    } catch (error) {
      console.error("Error fetching terms:", error);
      setAlert({ message: "Error fetching terms", type: "red" });
    }
  };

  const handleOpenDialog = (term = null) => {
    setCurrentTerm(term);
    setFormData(
      term
        ? {
            mainTitle: term.mainTitle,
            data: term.data,
          }
        : {
            mainTitle: "",
            data: [],
          },
    );
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentTerm(null);
    setAlert({ message: "", type: "" });
  };

  const handleViewTerm = (term) => {
    setCurrentTerm(term);
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setCurrentTerm(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (currentTerm) {
        await axios.put(`/terms/${currentTerm._id}`, formData);
        setAlert({ message: "Term updated successfully!", type: "green" });
      } else {
        await axios.post("/terms", formData);
        setAlert({ message: "Term added successfully!", type: "green" });
      }
      fetchTerms();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving term:", error);
      setAlert({ message: "Error saving term", type: "red" });
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id, title) => {
    setDeleteId(id);
    setTermTitle(title);
    setOpenDeleteDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/terms/${id}`);
      setAlert({ message: "Term deleted successfully!", type: "green" });
      fetchTerms();
    } catch (error) {
      console.error("Error deleting term:", error);
      setAlert({ message: "Error deleting term", type: "red" });
    } finally {
      setOpenDeleteDialog(false);
      setDeleteId(null);
    }
  };

  // Functions for managing data entries
  const handleDataChange = (index, value) => {
    const updatedData = [...formData.data];
    updatedData[index] = { ...updatedData[index], ...value };
    setFormData({ ...formData, data: updatedData });
  };

  const handleAddData = () => {
    setFormData({
      ...formData,
      data: [...formData.data, { title: "", content: [] }],
    });
  };

  const handleRemoveData = (index) => {
    const updatedData = formData.data.filter((_, i) => i !== index);
    setFormData({ ...formData, data: updatedData });
  };

  // Functions for managing content
  const handleContentChange = (dataIndex, contentIndex, value) => {
    const updatedData = [...formData.data];
    const updatedContent = [...updatedData[dataIndex].content];
    updatedContent[contentIndex] = {
      ...updatedContent[contentIndex],
      ...value,
    };
    updatedData[dataIndex].content = updatedContent;
    setFormData({ ...formData, data: updatedData });
  };

  const handleAddContent = (dataIndex) => {
    const updatedData = [...formData.data];
    updatedData[dataIndex].content.push({
      paragraph: "",
      linkTitle: "",
      links: [],
      contactNumber: "",
      lists: [],
      sublists: [],
    });
    setFormData({ ...formData, data: updatedData });
  };

  const handleRemoveContent = (dataIndex, contentIndex) => {
    const updatedData = [...formData.data];
    updatedData[dataIndex].content = updatedData[dataIndex].content.filter(
      (_, i) => i !== contentIndex,
    );
    setFormData({ ...formData, data: updatedData });
  };

  // Functions for managing lists, link titles, and links
  const handleListChange = (dataIndex, contentIndex, index, value) => {
    const updatedData = [...formData.data];
    const updatedContent = [...updatedData[dataIndex].content];
    const updatedLists = [...updatedContent[contentIndex].lists];
    updatedLists[index] = value;
    updatedContent[contentIndex].lists = updatedLists;
    updatedData[dataIndex].content = updatedContent;
    setFormData({ ...formData, data: updatedData });
  };

  const handleRemoveList = (dataIndex, contentIndex, index) => {
    const updatedData = [...formData.data];
    const updatedContent = [...updatedData[dataIndex].content];
    const updatedLists = updatedContent[contentIndex].lists.filter(
      (_, i) => i !== index,
    );
    updatedContent[contentIndex].lists = updatedLists;
    updatedData[dataIndex].content = updatedContent;
    setFormData({ ...formData, data: updatedData });
  };

  const handleAddList = (dataIndex, contentIndex) => {
    const updatedData = [...formData.data];
    const updatedContent = [...updatedData[dataIndex].content];
    updatedContent[contentIndex].lists.push("");
    updatedData[dataIndex].content = updatedContent;
    setFormData({ ...formData, data: updatedData });
  };

  const handleLinkChange = (dataIndex, contentIndex, index, value) => {
    const updatedData = [...formData.data];
    const updatedContent = [...updatedData[dataIndex].content];
    const updatedLinks = [...updatedContent[contentIndex].links];
    updatedLinks[index] = value;
    updatedContent[contentIndex].links = updatedLinks;
    updatedData[dataIndex].content = updatedContent;
    setFormData({ ...formData, data: updatedData });
  };

  const handleRemoveLink = (dataIndex, contentIndex, index) => {
    const updatedData = [...formData.data];
    const updatedContent = [...updatedData[dataIndex].content];
    const updatedLinks = updatedContent[contentIndex].links.filter(
      (_, i) => i !== index,
    );
    updatedContent[contentIndex].links = updatedLinks;
    updatedData[dataIndex].content = updatedContent;
    setFormData({ ...formData, data: updatedData });
  };

  const handleAddLink = (dataIndex, contentIndex) => {
    const updatedData = [...formData.data];
    const updatedContent = [...updatedData[dataIndex].content];
    updatedContent[contentIndex].links.push("");
    updatedData[dataIndex].content = updatedContent;
    setFormData({ ...formData, data: updatedData });
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
          Add Term
        </Button>
      </div>

      <Card className="h-[calc(100vh-150px)] overflow-y-auto rounded-xl p-4 shadow-lg scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-blue-500">
        <div className="space-y-6">
          {terms.map((term) => (
            <Card
              key={term._id}
              className="group p-4 shadow-md transition-colors duration-300 ease-in-out hover:bg-blue-50"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <Typography
                    variant="h5"
                    color="deep-orange"
                    className="flex items-center justify-start gap-2"
                  >
                    {term.mainTitle}
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
                      onClick={() => handleViewTerm(term)}
                      className="p-2"
                    >
                      <EyeIcon className="h-5 w-5" />
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
                      onClick={() => handleOpenDialog(term)}
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
                      onClick={() => confirmDelete(term._id, term.mainTitle)}
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

      {/* Add/Edit Term Dialog */}
      <Dialog open={openDialog} handler={handleCloseDialog} size="md">
        <DialogHeader className="flex items-center justify-between">
          {currentTerm ? "Edit Term" : "Add Term"}{" "}
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
        <DialogBody className="h-[400px] overflow-y-auto scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-deep-orange-500">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Main Title"
              value={formData.mainTitle}
              onChange={(e) =>
                setFormData({ ...formData, mainTitle: e.target.value })
              }
              required
            />
            {formData.data.map((dataEntry, dataIndex) => (
              <div key={dataIndex} className="mt-4">
                <Input
                  label={`Data Title ${dataIndex + 1}`}
                  value={dataEntry.title}
                  onChange={(e) =>
                    handleDataChange(dataIndex, { title: e.target.value })
                  }
                  required
                />
                {dataEntry.content.map((contentEntry, contentIndex) => (
                  <div key={contentIndex} className="mt-2">
                    <Input
                      label={`Content Paragraph ${contentIndex + 1}`}
                      value={contentEntry.paragraph}
                      onChange={(e) =>
                        handleContentChange(dataIndex, contentIndex, {
                          paragraph: e.target.value,
                        })
                      }
                      required
                    />
                    <Button
                      color="red"
                      onClick={() =>
                        handleRemoveContent(dataIndex, contentIndex)
                      }
                      variant="text"
                      className="ml-2"
                    >
                      Remove Content
                    </Button>
                    <Button
                      color="blue"
                      onClick={() => handleAddContent(dataIndex)}
                      className="ml-2"
                    >
                      Add Content
                    </Button>
                    {/* Lists Section */}
                    {contentEntry.lists.length > 0 && (
                      <div>
                        <Typography variant="h6">Lists</Typography>
                        {contentEntry.lists.map((list, index) => (
                          <div key={index} className="mt-2 flex items-center">
                            <Input
                              label={`List ${index + 1}`}
                              value={list}
                              onChange={(e) =>
                                handleListChange(
                                  dataIndex,
                                  contentIndex,
                                  index,
                                  e.target.value,
                                )
                              }
                              className="flex-1"
                            />
                            <Button
                              color="red"
                              onClick={() =>
                                handleRemoveList(dataIndex, contentIndex, index)
                              }
                              variant="text"
                              className="ml-2"
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                        <Button
                          color="blue"
                          onClick={() => handleAddList(dataIndex, contentIndex)}
                          className="mt-2"
                        >
                          Add Another List
                        </Button>
                      </div>
                    )}
                    {/* Links Section */}
                    {contentEntry.links.length > 0 && (
                      <div>
                        <Typography variant="h6">Links</Typography>
                        {contentEntry.links.map((link, index) => (
                          <div key={index} className="mt-2 flex items-center">
                            <Input
                              label={`Link ${index + 1}`}
                              value={link}
                              onChange={(e) =>
                                handleLinkChange(
                                  dataIndex,
                                  contentIndex,
                                  index,
                                  e.target.value,
                                )
                              }
                              className="flex-1"
                            />
                            <Button
                              color="red"
                              onClick={() =>
                                handleRemoveLink(dataIndex, contentIndex, index)
                              }
                              variant="text"
                              className="ml-2"
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                        <Button
                          color="blue"
                          onClick={() => handleAddLink(dataIndex, contentIndex)}
                          className="mt-2"
                        >
                          Add Another Link
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
                <Button
                  color="blue"
                  onClick={() => handleAddContent(dataIndex)}
                  className="mt-2"
                >
                  Add Content
                </Button>
                <Button
                  color="red"
                  onClick={() => handleRemoveData(dataIndex)}
                  variant="text"
                  className="ml-2"
                >
                  Remove Data
                </Button>
              </div>
            ))}
            <Button color="blue" onClick={handleAddData} className="mt-2">
              Add Data
            </Button>
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

      {/* View Term Dialog */}
      <Dialog open={openViewDialog} handler={handleCloseViewDialog} size="md">
        <DialogHeader className="flex items-start justify-between">
          <Typography variant="h5" className="flex items-center gap-2">
            {currentTerm ? currentTerm.mainTitle : "Term Details"}
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
                  handleOpenDialog(currentTerm);
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
                  confirmDelete(currentTerm._id, currentTerm.mainTitle)
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

        <DialogBody className="h-[400px] overflow-y-auto scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-deep-orange-500">
          {currentTerm && (
            <div className="space-y-4">
              {currentTerm.data.map((dataEntry, dataIndex) => (
                <div key={dataIndex} className="mt-4">
                  <Typography variant="h6">
                    Data Title: {dataEntry.title}
                  </Typography>
                  {dataEntry.content.map((contentEntry, contentIndex) => (
                    <div key={contentIndex} className="mt-2">
                      <Typography variant="h6">
                        Content Paragraph: {contentEntry.paragraph}
                      </Typography>
                      {contentEntry.lists.length > 0 && (
                        <Typography variant="h6">
                          Lists:
                          <ul>
                            {contentEntry.lists.map((list, index) => (
                              <li key={index}>{list}</li>
                            ))}
                          </ul>
                        </Typography>
                      )}
                      {contentEntry.links.length > 0 && (
                        <Typography variant="h6">
                          Links:
                          <ul>
                            {contentEntry.links.map((link, index) => (
                              <li key={index}>{link}</li>
                            ))}
                          </ul>
                        </Typography>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </DialogBody>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} handler={setOpenDeleteDialog}>
        <DialogHeader>Confirm Delete</DialogHeader>
        <DialogBody>
          Are you sure you want to delete{" "}
          <span className="font-semibold text-red-600">{termTitle}</span>?
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

export default ManageTerms;
