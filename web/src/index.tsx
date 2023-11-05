import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import "./index.css";
import CourseDisplay from "./pages/course/CourseDisplay";
import HomeSecond from "./pages/home/HomeSecond";
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
  {
    path: "/homepagesearch",
    element: <HomeSecond />,
  },
]);

createRoot(document.getElementById("root") as HTMLElement).render(
  <div>
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
    <RouterProvider router={router} />
    {window.location.pathname !== "/course" && <Footer />}
  </div>
);
