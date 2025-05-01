import React, { useState } from "react";
import {
  Card,
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Alert,
} from "@material-tailwind/react";
import { PlayIcon } from "@heroicons/react/24/solid";

const tutorials = [
  {
    id: 1,
    title: "How to Manage Destinations",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // Replace with actual URLs
    notes: "This tutorial covers how to add, edit, and delete destinations.",
    checklist: [
      "Open the Manage Destination panel",
      "Fill the form correctly",
      "Handle image upload and deletion",
    ],
  },
  {
    id: 2,
    title: "Managing Deals and Offers",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    notes: "Learn how to manage deals, prices, and categories in this section.",
    checklist: [
      "Go to Manage Deals",
      "Use filters to find deals",
      "Edit deals or add new ones",
    ],
  },
];

export function AdminVideoTutorials() {
  const [selectedTutorial, setSelectedTutorial] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = (tutorial) => {
    setSelectedTutorial(tutorial);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTutorial(null);
  };

  return (
    <div className="h-screen w-full overflow-hidden px-4 py-6">
      <Typography variant="h4" className="mb-6 text-blue-700">
        Admin Video Tutorials
      </Typography>

      <Card className="h-[calc(100vh-150px)] overflow-y-auto rounded-xl p-4 shadow-lg scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-blue-500">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {tutorials.map((tutorial) => (
            <Card
              key={tutorial.id}
              className="flex flex-col justify-between rounded-lg p-4 shadow-md transition hover:bg-blue-50 hover:shadow-lg"
            >
              <div>
                <Typography
                  variant="h6"
                  className="mb-3 text-lg font-semibold text-deep-orange-500"
                >
                  {tutorial.title}
                </Typography>

                <div className="relative w-full overflow-hidden rounded-lg">
                  <video
                    src={tutorial.videoUrl}
                    controls
                    className="h-40 w-full rounded-md object-cover shadow"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end">
                <Button
                  color="blue"
                  variant="gradient"
                  className="flex items-center gap-2"
                  onClick={() => handleOpenDialog(tutorial)}
                >
                  <PlayIcon className="h-5 w-5" />
                  View
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Dialog */}
      <Dialog open={openDialog} handler={handleCloseDialog} size="xl">
        <DialogHeader className="flex justify-between">
          <Typography variant="h5" className="text-blue-700">
            {selectedTutorial?.title}
          </Typography>
        </DialogHeader>
        <DialogBody className="h-[500px] space-y-6 overflow-y-auto scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-blue-500">
          <video
            src={selectedTutorial?.videoUrl}
            controls
            className="h-96 w-full rounded-lg object-contain"
          />
          <div>
            <Typography variant="h6" className="mb-2 text-gray-800">
              Notes:
            </Typography>
            <Typography className="text-sm text-gray-700">
              {selectedTutorial?.notes}
            </Typography>
          </div>
          <div>
            <Typography variant="h6" className="mb-2 text-gray-800">
              Checklist:
            </Typography>
            <ul className="list-disc pl-6 text-sm text-gray-700">
              {selectedTutorial?.checklist.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={handleCloseDialog}>
            Close
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default AdminVideoTutorials;
