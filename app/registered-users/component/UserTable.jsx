"use client";
import { auth, db } from "@/lib/firebase/firebaseInit";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import RegesterdUserTable from "./RegesterdUserTable";
import RegesterdFLHAtable from "./RegesterdFLHAtable";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { useAuth } from "../../../components/providers/AuthProvider";
import { exportToExcel, exportToPDF } from "./exportToExcel";

function UserTable() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [items, setItems] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [currentCompanyName, setCurrentCompanyName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [buttonName, setButtonName] = useState("UserTable");
  const [flhaData, setFlhaData] = useState([]);
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [report, setReport] = useState("userReport");
  const [importType, setImportType] = useState("excel");
  const [startDate, setStartDate] = useState(new Date());

  const testFlhaData = [
    {
      company_name: "Tech Builders Ltd.",
      user_name: "Jane Doe",
      user_email: "jane.doe@techbuilders.com",
      data: {
        ppe_inspected: true,
        to_do_work: "Electrical wiring installation",
        site_location: "Site 45A, North Industrial Area",
        flhf: [
          "True", // Work area clean
          "True", // Material storage identified
          "False", // Dust/Mist/Fumes
          "True", // Noise in area
          "False", // Extreme temperatures
          "False", // Spill potential
          "True", // Waste Properly Managed
          "False", // Excavation Permit Required
          "True", // Other Workers In Area
          "Clear", // Weather Conditions
          "True", // MSDS Reviewed
        ],
        ergonomics: [
          "False", // Awkward body Position
          "False", // Over extension
          "False", // Prolonged twisting/bending motion
          "True", // Working in tight area
          "True", // Lift too heavy / awkward to lift
          "False", // Hands not in line of sight
          "False", // Working above your head
        ],
        aeHazards: [
          "True", // Site Access/ road conditions
          "True", // Scaffold (Inspected & Tagged)
          "True", // Ladders (tied off)
          "False", // Slips / Trips
          "False", // Hoisting (tools, equipment etc)
          "True", // Excavation (alarms, routes, ph#)
          "False", // Confined space entry permit required
        ],
        ouHazards: [
          "True", // Barricades & signs in place
          "False", // Hole coverings identified
          "True", // Trenching/underground structures
          "False", // Rig guidelines
          "True", // Powerlines
          "False", // Falling Items
          "True", // Hoisting or moving loads overhead
        ],
        evtHazards: [
          "True", // Proper tools for the job
          "True", // Equipment / tools inspected
          "False", // Tank plumbing
          "True", // Hoses inspected
          "True", // High pressure
          "False", // High temperature fluids
        ],
        plHazards: [
          "False", // Procedure not available for task
          "False", // Confusing instructions
          "False", // No training for task or tools to be used
          "True", // First time performing the task
          "False", // Working alone
          "True", // PPE inspected / used properly
        ],
        signature: "https://fakeimg.pl/300x100/", // Replace with your image URL
      },
      submitted_at: {
        seconds: 1680204000, // Example timestamp
        nanoseconds: 0,
      },
    },
    // Add more objects here to simulate multiple rows in the table.
    {
      company_name: "BuildRight Inc.",
      user_name: "John Smith",
      user_email: "john.smith@buildright.com",
      data: {
        ppe_inspected: false,
        to_do_work: "Concrete foundation laying",
        site_location: "Site 23B, East End",
        flhf: [
          "False",
          "True",
          "True",
          "False",
          "True",
          "True",
          "True",
          "False",
          "False",
          "Rainy",
          "False",
        ],
        ergonomics: ["True", "True", "False", "False", "False", "True", "True"],
        aeHazards: ["False", "True", "True", "True", "True", "False", "False"],
        ouHazards: ["False", "True", "False", "True", "False", "True", "False"],
        evtHazards: ["True", "True", "True", "False", "False", "True"],
        plHazards: ["True", "True", "True", "False", "True", "True"],
        signature: "https://fakeimg.pl/300x100/", // Replace with your image URL
      },
      submitted_at: {
        seconds: 1680280400, // Example timestamp
        nanoseconds: 0,
      },
    },
  ];

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const users = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
        }));
        setItems(users);

        const currentUserData = users.find(
          (user) => user.email === currentUser.email
        );
        setCurrentCompanyName(currentUserData.companyName);
        if (currentUserData) {
          if (currentUserData.role === "admin") {
            setSelectedData(users);
            setIsAdmin(true);
          } else {
            const filteredData = users.filter(
              (user) => user.companyName === currentUserData.companyName
            );
            setSelectedData(filteredData);
          }
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    fetchItems();
  }, [currentUser.email]);

  useEffect(() => {
    const flhaItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "FLHA"));
        const flhaData = querySnapshot.docs.map((doc) => {
          return {
            ...doc.data(),
          };
        });
        if (isAdmin) {
          setFlhaData(flhaData);
        } else {
          const filteredData = flhaData.filter(
            (item) => item.company_name === currentCompanyName
          );
          setFlhaData(filteredData);
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    flhaItems();
  }, [currentCompanyName, currentUser.email, isAdmin]);

  const logOut = () => {
    signOut(auth)
      .then(() => {
        router.push("/");
      })
      .catch((e) => {
        console.log("Logout Catch ", e.message);
      });
  };

  const handleExport = async () => {
    try {
      if (importType === "pdf") {
        exportToPDF(
          buttonName === "UserTable" ? selectedData : testFlhaData,
          buttonName === "UserTable" ? "UserData" : "FLHAData",
          buttonName === "FLHATable" ? "flha" : "users"
        );
      } else {
        exportToExcel(
          buttonName === "UserTable" ? selectedData : flhaData,
          buttonName === "UserTable" ? "UserData" : "FLHAData",
          buttonName === "FLHATable" ? "flha" : "users"
        );
      }
      console.log("Export successful");
    } catch (error) {
      console.error("Export failed", error);
    }
  };

  const sortData = (data) => {
    const sortedData = [...data];
    sortedData.sort((a, b) => {
      if (sortBy === "name") {
        return sortDirection === "asc"
          ? a.fullName.localeCompare(b.fullName)
          : b.fullName.localeCompare(a.fullName);
      } else if (sortBy === "date") {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });
    return sortedData;
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 sm:py-6 bg-zinc-400 w-full max-h-full">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Users
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the users in your account including their name, title,
            email and role.
          </p>
        </div>
        <div className="flex justify-end gap-2 mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <select
            onChange={(event) => setSortDirection(event.target.value)}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <option value="asc">asc</option>
            <option value="desc">desc</option>
          </select>
          <select
            onChange={(event) => setSortBy(event.target.value)}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <option value="name">Sort by name</option>
            <option value="date">Sort by date</option>
          </select>
          <select
            onChange={(event) => setReport(event.target.value)}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <option value="userReport">User report</option>
            <option value="UserCertificateReport">
              User certificate report
            </option>
            <option value="flhaReport">FLHA report</option>
          </select>
          {report === "flhaReport" && (
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              maxDate={new Date()}
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            />
          )}
          <select
            onChange={(event) => setImportType(event.target.value)}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <option value="excel">Excel</option>
            <option value="pdf">PDF</option>
          </select>
          <button
            type="button"
            onClick={handleExport}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            ExportButton-users
          </button>
          <button
            type="button"
            onClick={() => setButtonName("UserTable")}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            User Information Table
          </button>

          <button
            type="button"
            onClick={() => setButtonName("FLHATable")}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            User FLHA Information
          </button>

          <button
            type="button"
            onClick={() => logOut()}
            className="block rounded-md border-indigo-600 bg-white px-3 py-2 text-center text-sm font-semibold hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            SignOut
          </button>
        </div>
      </div>

      {buttonName === "UserTable" ? (
        <RegesterdUserTable users={sortData(selectedData)} />
      ) : (
        <>
          <RegesterdFLHAtable
            currentCompanyName={currentCompanyName}
            admin={isAdmin}
            sortBy={sortBy}
            sortDirection={sortDirection}
          />
        </>
      )}

      {/* <Regesterdcertificates certificates={items} /> */}
    </div>
  );
}

export default UserTable;
