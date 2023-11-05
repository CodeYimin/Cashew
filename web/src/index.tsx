import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import CourseDisplay from "./pages/course/CourseDisplay";
import Homepage from "./pages/home/Homepage";
import TimetablePage from "./pages/timetable/TimetablePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
  },
  {
    path: "/course",
    element: <CourseDisplay />,
  },
  {
    path: "/timetable",
    element: <TimetablePage />,
  },
]);

createRoot(document.getElementById("root") as HTMLElement).render(
  <div>
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
    <RouterProvider router={router} />
  </div>
);
